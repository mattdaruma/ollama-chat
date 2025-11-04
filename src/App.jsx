import { useState, useEffect } from 'react';
import './App.css';
import ModelSelector from './ModelSelector';
import ModelLoader from './ModelLoader';
import Pulse from './Pulse';
import SystemMessages from './SystemMessages';
import Chat from './Chat';
import Settings from './Settings';
import ModelDetailsModal from './ModelDetailsModal';
import { Offcanvas, Button, Accordion } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';
import GenerateSettings from './GenerateSettings';

function App() {
  const [selectedModel, setSelectedModel] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.selectedModel || '';
  });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [systemMessages, setSystemMessages] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.systemMessages || [];
  });
  const [pulseMessage, setPulseMessage] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.pulseMessage || '';
  });
  const [pulseInterval, setPulseInterval] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.pulseInterval || 10;
  });
  const [isPulseActive, setIsPulseActive] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.isPulseActive || false;
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSettings, setShowSettings] = useState(false);
  const [modelDetails, setModelDetails] = useState(null);
  const [showModelDetailsModal, setShowModelDetailsModal] = useState(false);

  // Generate Parameters
  const [temperature, setTemperature] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.temperature || 0.8;
  });
  const [numPredict, setNumPredict] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.numPredict || 128;
  });
  const [topK, setTopK] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.topK || 40;
  });
  const [topP, setTopP] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.topP || 0.9;
  });
  const [repeatLastN, setRepeatLastN] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.repeatLastN || 64;
  });
  const [repeatPenalty, setRepeatPenalty] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.repeatPenalty || 1.1;
  });
  const [numCtx, setNumCtx] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.numCtx || 2048;
  });
  const [seed, setSeed] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.seed || 0;
  });
  const [stop, setStop] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.stop || [];
  });
  const [tfsZ, setTfsZ] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.tfsZ || 1;
  });
  const [numGpu, setNumGpu] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.numGpu || 0;
  });
  const [mainGpu, setMainGpu] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.mainGpu || 0;
  });
  const [lowVram, setLowVram] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.lowVram || false;
  });
  const [numThread, setNumThread] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.numThread || 0;
  });
  const [numBatch, setNumBatch] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.numBatch || 16;
  });
  const [f16Kv, setF16Kv] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.f16Kv || true;
  });
  const [logitsAll, setLogitsAll] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.logitsAll || false;
  });
  const [vocabOnly, setVocabOnly] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.vocabOnly || false;
  });
  const [useMmap, setUseMmap] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.useMmap || true;
  });
  const [useMlock, setUseMlock] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.useMlock || false;
  });
  const [ropeFrequencyBase, setRopeFrequencyBase] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.ropeFrequencyBase || 0;
  });
  const [ropeFrequencyScale, setRopeFrequencyScale] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.ropeFrequencyScale || 0;
  });
  const [numKeep, setNumKeep] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.numKeep || 0;
  });

  useEffect(() => {
    const fetchModelDetails = async () => {
      if (!selectedModel) {
        setModelDetails(null);
        return;
      }
      try {
        const response = await fetch('http://localhost:11434/api/show', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: selectedModel,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setModelDetails(data);
      } catch (e) {
        console.error("Failed to fetch model details:", e);
        setModelDetails(null);
      }
    };

    fetchModelDetails();
  }, [selectedModel]);

  useEffect(() => {
    // Set default generate parameters based on modelDetails when modelDetails changes
    if (modelDetails) {
      const getModelInfoValue = (key, defaultValue) => {
        return modelDetails.model_info && modelDetails.model_info[key] !== undefined
          ? modelDetails.model_info[key]
          : defaultValue;
      };

      const maxNumCtx = getModelInfoValue('llama.context_length', 2048);
      setNumCtx(prevNumCtx => prevNumCtx === 2048 ? maxNumCtx : prevNumCtx); // Only set if still default

      // Parse parameters from modelfile and set them as defaults if not already set by user
      const parseModelfileParameters = (modelfileContent) => {
        const params = {};
        const lines = modelfileContent.split('\n');
        lines.forEach(line => {
          const parts = line.trim().split(' ');
          if (parts.length >= 2 && parts[0] === 'PARAMETER') {
            let value = parts[2];
            if (!isNaN(value)) {
              value = parseFloat(value);
            }
            params[parts[1]] = value;
          }
        });
        return params;
      };

      if (modelDetails.modelfile) {
        const modelfileParams = parseModelfileParameters(modelDetails.modelfile);
        if (modelfileParams.temperature !== undefined && temperature === 0.8) setTemperature(modelfileParams.temperature);
        if (modelfileParams.num_predict !== undefined && numPredict === 128) setNumPredict(modelfileParams.num_predict);
        if (modelfileParams.top_k !== undefined && topK === 40) setTopK(modelfileParams.top_k);
        if (modelfileParams.top_p !== undefined && topP === 0.9) setTopP(modelfileParams.top_p);
        if (modelfileParams.repeat_last_n !== undefined && repeatLastN === 64) setRepeatLastN(modelfileParams.repeat_last_n);
        if (modelfileParams.repeat_penalty !== undefined && repeatPenalty === 1.1) setRepeatPenalty(modelfileParams.repeat_penalty);
        if (modelfileParams.num_ctx !== undefined && numCtx === 2048) setNumCtx(modelfileParams.num_ctx);
        if (modelfileParams.seed !== undefined && seed === 0) setSeed(modelfileParams.seed);
        if (modelfileParams.stop !== undefined && stop.length === 0) setStop(Array.isArray(modelfileParams.stop) ? modelfileParams.stop : [modelfileParams.stop]);
        if (modelfileParams.tfs_z !== undefined && tfsZ === 1) setTfsZ(modelfileParams.tfs_z);
        if (modelfileParams.num_gpu !== undefined && numGpu === 0) setNumGpu(modelfileParams.num_gpu);
        if (modelfileParams.main_gpu !== undefined && mainGpu === 0) setMainGpu(modelfileParams.main_gpu);
        if (modelfileParams.low_vram !== undefined && lowVram === false) setLowVram(modelfileParams.low_vram);
        if (modelfileParams.num_thread !== undefined && numThread === 0) setNumThread(modelfileParams.num_thread);
        if (modelfileParams.num_batch !== undefined && numBatch === 16) setNumBatch(modelfileParams.num_batch);
        if (modelfileParams.f16_kv !== undefined && f16Kv === true) setF16Kv(modelfileParams.f16_kv);
        if (modelfileParams.logits_all !== undefined && logitsAll === false) setLogitsAll(modelfileParams.logits_all);
        if (modelfileParams.vocab_only !== undefined && vocabOnly === false) setVocabOnly(modelfileParams.vocab_only);
        if (modelfileParams.use_mmap !== undefined && useMmap === true) setUseMmap(modelfileParams.use_mmap);
        if (modelfileParams.use_mlock !== undefined && useMlock === false) setUseMlock(modelfileParams.use_mlock);
        if (modelfileParams.rope_frequency_base !== undefined && ropeFrequencyBase === 0) setRopeFrequencyBase(modelfileParams.rope_frequency_base);
        if (modelfileParams.rope_frequency_scale !== undefined && ropeFrequencyScale === 0) setRopeFrequencyScale(modelfileParams.rope_frequency_scale);
        if (modelfileParams.num_keep !== undefined && numKeep === 0) setNumKeep(modelfileParams.num_keep);
      }
    }
  }, [modelDetails]);

  useEffect(() => {
    const settings = {
      selectedModel,
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
    };
    localStorage.setItem('ollama-chat-settings', JSON.stringify(settings));
  }, [selectedModel, systemMessages, pulseMessage, pulseInterval, isPulseActive, temperature, numPredict, topK, topP, repeatLastN, repeatPenalty, numCtx, seed, stop, tfsZ, numGpu, mainGpu, lowVram, numThread, numBatch, f16Kv, logitsAll, vocabOnly, useMmap, useMlock, ropeFrequencyBase, ropeFrequencyScale, numKeep]);

  useEffect(() => {
    localStorage.setItem('ollama-chat-messages', JSON.stringify(messages));
  }, [messages]);

  const handleClose = () => setShowSettings(false);
  const handleShow = () => setShowSettings(true);
  const handleSettingsClick = () => setShowSettings(!showSettings);

  const handleShowModelDetails = () => setShowModelDetailsModal(true);
  const handleCloseModelDetails = () => setShowModelDetailsModal(false);

  const saveSession = () => {
    const session = {
      selectedModel,
      systemMessages,
      pulseMessage,
      pulseInterval,
      isPulseActive,
      messages,
    };
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ollama-chat-session-${Date.now()}.json`;
    a.click();
  };

  const loadSession = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const session = JSON.parse(e.target.result);
        setSelectedModel(session.selectedModel);
        setSystemMessages(session.systemMessages);
        setPulseMessage(session.pulseMessage);
        setPulseInterval(session.pulseInterval);
        setIsPulseActive(session.isPulseActive);
        setMessages(session.messages);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const clearChatHistory = () => {
    setMessages([]);
    localStorage.removeItem('ollama-chat-messages');
  };

  const clearSession = () => {
    setSelectedModel('');
    setSystemMessages([]);
    setPulseMessage('');
    setPulseInterval(10);
    setIsPulseActive(false);
    localStorage.removeItem('ollama-chat-settings');
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
      }}>
        <ModelLoader
          selectedModel={selectedModel}
          isModelLoaded={isModelLoaded}
          setIsModelLoaded={setIsModelLoaded}
          modelDetails={modelDetails}
        />
        <Button
          variant="primary"
          onClick={handleSettingsClick}
          className="ms-2"
        >
          <Gear />
        </Button>
      </div>

      <Offcanvas show={showSettings} onHide={handleClose} placement="top" className="offcanvas-height">
        <Offcanvas.Body>
          <Settings
            saveSession={saveSession}
            loadSession={loadSession}
            clearChatHistory={clearChatHistory}
            clearSession={clearSession}
          />
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            modelDetails={modelDetails}
            handleShowModelDetails={handleShowModelDetails}
          />
          <Accordion alwaysOpen className="mt-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Advanced Model Configs</Accordion.Header>
              <Accordion.Body>
                <GenerateSettings
                  isModelLoaded={isModelLoaded}
                  modelDetails={modelDetails}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  numPredict={numPredict}
                  setNumPredict={setNumPredict}
                  topK={topK}
                  setTopK={setTopK}
                  topP={topP}
                  setTopP={setTopP}
                  repeatLastN={repeatLastN}
                  setRepeatLastN={setRepeatLastN}
                  repeatPenalty={repeatPenalty}
                  setRepeatPenalty={setRepeatPenalty}
                  numCtx={numCtx}
                  setNumCtx={setNumCtx}
                  seed={seed}
                  setSeed={setSeed}
                  stop={stop}
                  setStop={setStop}
                  tfsZ={tfsZ}
                  setTfsZ={setTfsZ}
                  numGpu={numGpu}
                  setNumGpu={setNumGpu}
                  mainGpu={mainGpu}
                  setMainGpu={setMainGpu}
                  lowVram={lowVram}
                  setLowVram={setLowVram}
                  numThread={numThread}
                  setNumThread={setNumThread}
                  numBatch={numBatch}
                  setNumBatch={setNumBatch}
                  f16Kv={f16Kv}
                  setF16Kv={setF16Kv}
                  logitsAll={logitsAll}
                  setLogitsAll={setLogitsAll}
                  vocabOnly={vocabOnly}
                  setVocabOnly={setVocabOnly}
                  useMmap={useMmap}
                  setUseMmap={setUseMmap}
                  useMlock={useMlock}
                  setUseMlock={setUseMlock}
                  ropeFrequencyBase={ropeFrequencyBase}
                  setRopeFrequencyBase={setRopeFrequencyBase}
                  ropeFrequencyScale={ropeFrequencyScale}
                  setRopeFrequencyScale={setRopeFrequencyScale}
                  numKeep={numKeep}
                  setNumKeep={setNumKeep}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Pulse
            pulseMessage={pulseMessage}
            setPulseMessage={setPulseMessage}
            pulseInterval={pulseInterval}
            setPulseInterval={setPulseInterval}
            isPulseActive={isPulseActive}
            setIsPulseActive={setIsPulseActive}
          />
          <SystemMessages
            systemMessages={systemMessages}
            setSystemMessages={setSystemMessages}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <ModelDetailsModal
        show={showModelDetailsModal}
        onHide={handleCloseModelDetails}
        modelDetails={modelDetails}
        selectedModel={selectedModel}
      />

      <div style={{ position: 'fixed', top: '5em', right: '5em', bottom: '5em', left: '5em' }}>
        <Chat
          messages={messages}
          setMessages={setMessages}
          selectedModel={selectedModel}
          isModelLoaded={isModelLoaded}
          systemMessages={systemMessages}
          pulseMessage={pulseMessage}
          pulseInterval={pulseInterval}
          isPulseActive={isPulseActive}
          temperature={temperature}
          numPredict={numPredict}
          topK={topK}
          topP={topP}
          repeatLastN={repeatLastN}
          repeatPenalty={repeatPenalty}
          numCtx={numCtx}
          seed={seed}
          stop={stop}
          tfsZ={tfsZ}
          numGpu={numGpu}
          mainGpu={mainGpu}
          lowVram={lowVram}
          numThread={numThread}
          numBatch={numBatch}
          f16Kv={f16Kv}
          logitsAll={logitsAll}
          vocabOnly={vocabOnly}
          useMmap={useMmap}
          useMlock={useMlock}
          ropeFrequencyBase={ropeFrequencyBase}
          ropeFrequencyScale={ropeFrequencyScale}
          numKeep={numKeep}
        />
      </div>
    </>
  );
}

export default App;
