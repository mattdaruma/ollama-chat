import { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { PlusCircle, DashCircle, Pencil, Save } from 'react-bootstrap-icons';

function SystemMessages({ config, systemMessages, setSystemMessages, model }) {
  const [localMessages, setLocalMessages] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);

  const calculateTokens = async (messageText) => {
    if (!model || !messageText || !config) {
      return 0;
    }
    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.tokenize}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: messageText,
          stream: false,
          options: {
            num_predict: 1,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.prompt_eval_count;
    } catch (error) {
      console.error('Failed to fetch token count:', error);
      return 0;
    }
  };

  useEffect(() => {
    const initializeLocalMessages = async () => {
      if (!config) return;
      const newLocalMessages = await Promise.all(
        systemMessages.map(async (msg) => {
          const tokenCount = await calculateTokens(msg);
          return { text: msg, isEditing: false, isLoading: false, tokenCount };
        })
      );
      setLocalMessages(newLocalMessages);
    };
    initializeLocalMessages();
  }, [systemMessages, model, config]);

  useEffect(() => {
    const sumTokens = localMessages.reduce((sum, msg) => sum + (msg.tokenCount || 0), 0);
    setTotalTokens(sumTokens);
  }, [localMessages]);


  const addSystemMessage = () => {
    setLocalMessages([...localMessages, { text: '', isEditing: true, isLoading: false, tokenCount: 0 }]);
  };

  const removeSystemMessage = (index) => {
    const newLocalMessages = [...localMessages];
    newLocalMessages.splice(index, 1);
    setLocalMessages(newLocalMessages);
    // Only update parent if the message was already saved (i.e., had a tokenCount or was not empty)
    setSystemMessages(newLocalMessages.filter(m => m.text !== '').map(m => m.text));
  };

  const handleMessageChange = (index, value) => {
    const newLocalMessages = [...localMessages];
    newLocalMessages[index].text = value;
    setLocalMessages(newLocalMessages);
  };

  const saveMessage = async (index) => {
    const newLocalMessages = [...localMessages];
    newLocalMessages[index].isLoading = true;
    setLocalMessages([...newLocalMessages]); // Force re-render to show spinner

    const tokenCount = await calculateTokens(newLocalMessages[index].text);
    newLocalMessages[index].tokenCount = tokenCount;
    newLocalMessages[index].isEditing = false;
    newLocalMessages[index].isLoading = false;
    setLocalMessages(newLocalMessages);
    setSystemMessages(newLocalMessages.filter(m => m.text !== '').map(m => m.text));
  };

  const toggleEdit = (index) => {
    const newLocalMessages = [...localMessages];
    // If toggling edit on a new, unsaved message, and it's empty, remove it
    if (newLocalMessages[index].isEditing && newLocalMessages[index].text === '') {
      removeSystemMessage(index);
    } else {
      newLocalMessages[index].isEditing = !newLocalMessages[index].isEditing;
      setLocalMessages(newLocalMessages);
    }
  };


  return (
    <div className="mt-4">
      {localMessages.length === 0 && <p>No system messages.</p>}
      {localMessages.map((message, index) => (
        <div key={index}>
          <InputGroup className="mb-1">
            <Form.Control
              as="textarea"
              rows={2}
              value={message.text}
              onChange={(e) => handleMessageChange(index, e.target.value)}
              placeholder="Enter system message..."
              disabled={!message.isEditing || message.isLoading}
            />
            {message.isEditing ? (
              <Button variant="outline-success" onClick={() => saveMessage(index)} disabled={message.isLoading}>
                {message.isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <Save />}
              </Button>
            ) : (
              <Button variant="outline-primary" onClick={() => toggleEdit(index)} disabled={message.isLoading}>
                {message.isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : <Pencil />}
              </Button>
            )}
            <Button variant="outline-danger" onClick={() => removeSystemMessage(index)} disabled={message.isLoading}>
              <DashCircle />
            </Button>
          </InputGroup>
          {message.tokenCount !== null && (
            <div className="text-muted text-end mb-3" style={{ fontSize: '0.8em' }}>
              Tokens: {message.tokenCount}
            </div>
          )}
        </div>
      ))}
      <Button variant="link" onClick={addSystemMessage}>
        <PlusCircle /> Add System Message ({totalTokens} tokens)
      </Button>
    </div>
  );
}

export default SystemMessages;
