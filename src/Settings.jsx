import { Button, ButtonGroup } from 'react-bootstrap';
import { Save, Folder2Open, Trash, XCircle } from 'react-bootstrap-icons';

function Settings({ saveSession, loadSession, clearChatHistory, clearSession }) {
  return (
    <div className="d-flex justify-content-center pb-3">
      <ButtonGroup>
        <Button variant="secondary" onClick={saveSession}><Save /> Save Session</Button>
        <Button variant="secondary" onClick={loadSession}><Folder2Open /> Load Session</Button>
        <Button variant="danger" onClick={clearSession}><Trash /> Clear Session</Button>
        <Button variant="danger" onClick={clearChatHistory}><XCircle /> Clear Chat</Button>
      </ButtonGroup>
    </div>
  );
}

export default Settings;
