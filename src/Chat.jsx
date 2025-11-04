import { useState, useEffect, useRef } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { SendFill, XCircleFill } from 'react-bootstrap-icons';

function Chat({
  messages,
  setMessages,
  selectedModel,
  isModelLoaded,
  systemMessages,
  pulseMessage,
  pulseInterval,
  isPulseActive,
  temperature,
  numPredict,
  topK,
  topP,
  repeatLastN,
  repeatPenalty,
  numCtx,
  seed,
  stop,
  tfsZ,
  numGpu,
  mainGpu,
  lowVram,
  numThread,
  numBatch,
  f16Kv,
  logitsAll,
  vocabOnly,
  useMmap,
  useMlock,
  ropeFrequencyBase,
  ropeFrequencyScale,
  numKeep,
}) {
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const pulseTimer = useRef(null);
  const chatPanelRef = useRef(null);
  const inputRef = useRef(null);
  const [activeAbortController, setActiveAbortController] = useState(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [inputValue]);

  useEffect(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current.scrollTop = chatPanelRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageContent) => {
    if (!messageContent.trim() || !selectedModel) return;

    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setIsStreaming(true);
    const controller = new AbortController();
    setActiveAbortController(controller);

    const newMessagesWithUser = [...messages, { role: 'user', content: messageContent }];
    setMessages(newMessagesWithUser);

    const apiMessages = [
      ...systemMessages.map(msg => ({ role: 'system', content: msg })),
      ...newMessagesWithUser
    ];

    const options = {
      temperature,
      num_predict: numPredict,
      top_k: topK,
      top_p: topP,
      repeat_last_n: repeatLastN,
      repeat_penalty: repeatPenalty,
      num_ctx: numCtx,
      seed,
      stop,
      tfs_z: tfsZ,
      num_gpu: numGpu,
      main_gpu: mainGpu,
      low_vram: lowVram,
      num_thread: numThread,
      num_batch: numBatch,
      f16_kv: f16Kv,
      logits_all: logitsAll,
      vocab_only: vocabOnly,
      use_mmap: useMmap,
      use_mlock: useMlock,
      rope_frequency_base: ropeFrequencyBase,
      rope_frequency_scale: ropeFrequencyScale,
      num_keep: numKeep,
    };

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: apiMessages,
          stream: true,
          keep_alive: -1,
          options,
        }),
        signal: controller.signal,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processStream = async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setIsStreaming(false);
            setActiveAbortController(null);
            if (isPulseActive && pulseInterval > 0 && pulseMessage) {
              pulseTimer.current = setTimeout(() => {
                sendMessage(pulseMessage);
              }, pulseInterval * 1000);
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          buffer = lines.pop(); 

          for (const line of lines) {
            if (line.trim() === '') continue;
            try {
              const responseJson = JSON.parse(line);
              if (responseJson.message && responseJson.message.content) {
                const newContent = responseJson.message.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMsg = { ...newMessages[newMessages.length - 1] };
                  lastMsg.content += newContent;
                  newMessages[newMessages.length - 1] = lastMsg;
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Failed to parse JSON line:", line, e);
            }
          }
        }
      };

      processStream();

    } catch (e) {
      if (e.name === 'AbortError') {
        console.log("Fetch aborted");
      } else {
        console.error("Failed to fetch chat response:", e);
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
      }
      setIsStreaming(false);
      setActiveAbortController(null);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleRobotGenerate = async () => {
    if (!selectedModel) return;

    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    setIsGenerating(true);
    setInputValue(''); // Clear the input field
    const controller = new AbortController();
    setActiveAbortController(controller);

    const flippedMessages = messages.map(msg => ({
      ...msg,
      role: msg.role === 'user' ? 'assistant' : 'user'
    }));

    const apiMessages = [
      ...systemMessages.map(msg => ({ role: 'system', content: msg })),
      ...flippedMessages
    ];

    const options = {
      temperature,
      num_predict: numPredict,
      top_k: topK,
      top_p: topP,
      repeat_last_n: repeatLastN,
      repeat_penalty: repeatPenalty,
      num_ctx: numCtx,
      seed,
      stop,
      tfs_z: tfsZ,
      num_gpu: numGpu,
      main_gpu: mainGpu,
      low_vram: lowVram,
      num_thread: numThread,
      num_batch: numBatch,
      f16_kv: f16Kv,
      logits_all: logitsAll,
      vocab_only: vocabOnly,
      use_mmap: useMmap,
      use_mlock: useMlock,
      rope_frequency_base: ropeFrequencyBase,
      rope_frequency_scale: ropeFrequencyScale,
      num_keep: numKeep,
    };

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: apiMessages,
          stream: true,
          keep_alive: -1,
          options,
        }),
        signal: controller.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processStream = async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            setIsGenerating(false);
            setActiveAbortController(null);
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          buffer = lines.pop();

          for (const line of lines) {
            if (line.trim() === '') continue;
            try {
              const responseJson = JSON.parse(line);
              if (responseJson.message && responseJson.message.content) {
                const newContent = responseJson.message.content;
                setInputValue(prev => prev + newContent);
              }
            } catch (e) {
              console.error("Failed to parse JSON line:", line, e);
            }
          }
        }
      };

      processStream();

    } catch (e) {
      if (e.name === 'AbortError') {
        console.log("Fetch aborted");
      } else {
        console.error("Failed to fetch chat response:", e);
        setInputValue(`Error: ${e.message}`);
      }
      setIsGenerating(false);
      setActiveAbortController(null);
    }
  };

  const handleCancel = () => {
    if (activeAbortController) {
      activeAbortController.abort();
      setActiveAbortController(null);
    }
    setIsStreaming(false);
    setIsGenerating(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="d-flex flex-column h-100" style={{ backgroundColor: 'var(--bs-dark)', color: 'var(--bs-light)', borderRadius: '10px', padding: '1em' }}>
      <div ref={chatPanelRef} className="chat-panel" style={{ overflowY: 'auto', flex: '1 1 auto', paddingRight: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
            <strong>{msg.role === 'user' ? 'You' : 'Agent'}: </strong>
            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: '0 0 auto' }}>
        <InputGroup className="mt-3">
          <Form.Control
            ref={inputRef}
            as="textarea"
            rows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedModel ? (isModelLoaded ? "Type your message..." : "Load a model to start chatting") : "Select a model to start chatting"}
            disabled={!selectedModel || !isModelLoaded || isStreaming || isGenerating}
          />
          {(isStreaming || isGenerating) ? (
            <Button onClick={handleCancel} variant="danger">
              <XCircleFill />
            </Button>
          ) : (
            <Button onClick={handleSendMessage} disabled={!selectedModel || !isModelLoaded || !inputValue.trim()}>
              <SendFill />
            </Button>
          )}
          <Button onClick={handleRobotGenerate} disabled={!selectedModel || !isModelLoaded || isStreaming || isGenerating}>
            🤖
          </Button>
        </InputGroup>
      </div>
    </div>
  );
}

export default Chat;
