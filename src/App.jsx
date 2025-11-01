import { useState, useEffect } from 'react';
import './App.css';
import ModelSelector from './ModelSelector';
import Pulse from './Pulse';
import SystemMessages from './SystemMessages';
import Chat from './Chat';
import Settings from './Settings';
import { Container, Row, Col, Offcanvas, Button } from 'react-bootstrap';
import { Gear } from 'react-bootstrap-icons';

function App() {
  const [selectedModel, setSelectedModel] = useState(() => {
    const saved = localStorage.getItem('ollama-chat-settings');
    const initialValue = JSON.parse(saved);
    return initialValue?.selectedModel || '';
  });
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

  useEffect(() => {
    const settings = {
      selectedModel,
      systemMessages,
      pulseMessage,
      pulseInterval,
      isPulseActive,
    };
    localStorage.setItem('ollama-chat-settings', JSON.stringify(settings));
  }, [selectedModel, systemMessages, pulseMessage, pulseInterval, isPulseActive]);

  useEffect(() => {
    localStorage.setItem('ollama-chat-messages', JSON.stringify(messages));
  }, [messages]);

  const handleClose = () => setShowSettings(false);
  const handleShow = () => setShowSettings(true);
  const handleSettingsClick = () => setShowSettings(!showSettings)

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
      <Button
        variant="primary"
        onClick={handleSettingsClick}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1050, // Ensure it's above the Offcanvas
        }}
      >
        <Gear />
      </Button>

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
          />
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

      <div style={{ position: 'fixed', top: '5em', right: '5em', bottom: '5em', left: '5em' }}>
        <Chat
          messages={messages}
          setMessages={setMessages}
          selectedModel={selectedModel}
          systemMessages={systemMessages}
          pulseMessage={pulseMessage}
          pulseInterval={pulseInterval}
          isPulseActive={isPulseActive}
        />
      </div>
    </>
  );
}

export default App;
