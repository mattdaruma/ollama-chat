import { Form, InputGroup, Row, Col } from 'react-bootstrap';

function Pulse({ pulseMessage, setPulseMessage, pulseInterval, setPulseInterval, isPulseActive, setIsPulseActive }) {
  return (
    <div className="mt-4">
      <InputGroup className="mb-3">
        <Form.Control
          as="textarea"
          rows={1}
          placeholder="Pulse message"
          value={pulseMessage}
          onChange={(e) => setPulseMessage(e.target.value)}
        />
      </InputGroup>
      <Row>
        <Col>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Seconds"
              value={pulseInterval}
              onChange={(e) => setPulseInterval(e.target.value)}
            />
            <InputGroup.Text>seconds</InputGroup.Text>
          </InputGroup>
        </Col>
        <Col>
          <Form.Check
            type="switch"
            id="pulse-switch"
            label="Activate Pulse"
            checked={isPulseActive}
            onChange={(e) => setIsPulseActive(e.target.checked)}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Pulse;
