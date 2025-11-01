import { Button, Form, InputGroup } from 'react-bootstrap';
import { PlusCircle, DashCircle } from 'react-bootstrap-icons';

function SystemMessages({ systemMessages, setSystemMessages }) {

  const addSystemMessage = () => {
    setSystemMessages([...systemMessages, '']);
  };

  const removeSystemMessage = (index) => {
    const newSystemMessages = [...systemMessages];
    newSystemMessages.splice(index, 1);
    setSystemMessages(newSystemMessages);
  };

  const handleSystemMessageChange = (index, value) => {
    const newSystemMessages = [...systemMessages];
    newSystemMessages[index] = value;
    setSystemMessages(newSystemMessages);
  };

  return (
    <div className="mt-4">
      {systemMessages.length === 0 && <p>No system messages.</p>}
      {systemMessages.map((message, index) => (
        <InputGroup className="mb-3" key={index}>
          <Form.Control
            as="textarea"
            rows={2}
            value={message}
            onChange={(e) => handleSystemMessageChange(index, e.target.value)}
            placeholder="Enter system message..."
          />
          <Button variant="outline-danger" onClick={() => removeSystemMessage(index)}>
            <DashCircle />
          </Button>
        </InputGroup>
      ))}
      <Button variant="link" onClick={addSystemMessage}>
        <PlusCircle /> Add System Message
      </Button>
    </div>
  );
}

export default SystemMessages;
