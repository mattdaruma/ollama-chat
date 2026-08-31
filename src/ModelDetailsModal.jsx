import React from 'react';
import { Modal, Button, Accordion, Card, ListGroup } from 'react-bootstrap';

function ModelDetailsModal({ show, onHide, modelDetails, selectedModel }) {
  if (!modelDetails) {
    return null;
  }

  const renderDetails = (details) => {
    if (!details) return null;
    return (
      <ListGroup variant="flush">
        {Object.entries(details).map(([key, value]) => (
          <ListGroup.Item key={key}>
            <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong> {value}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  const renderModelInfo = (modelInfo) => {
    if (!modelInfo) return null;

    const groupedInfo = {};
    for (const key in modelInfo) {
      const [prefix] = key.split('.');
      if (!groupedInfo[prefix]) {
        groupedInfo[prefix] = {};
      }
      groupedInfo[prefix][key] = modelInfo[key];
    }

    return (
      <Accordion alwaysOpen>
        {Object.entries(groupedInfo).map(([prefix, info]) => (
          <Accordion.Item eventKey={prefix} key={prefix}>
            <Accordion.Header>{prefix.replace(/\b\w/g, c => c.toUpperCase())} Information</Accordion.Header>
            <Accordion.Body>
              <ListGroup variant="flush">
                {Object.entries(info).map(([key, value]) => (
                  <ListGroup.Item key={key}>
                    <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong> {JSON.stringify(value)}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Model Details: {selectedModel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Summary</h5>
        <ListGroup variant="flush">
          {modelDetails.details && (
            <>
              <ListGroup.Item><strong>Format:</strong> {modelDetails.details.format}</ListGroup.Item>
              <ListGroup.Item><strong>Family:</strong> {modelDetails.details.family}</ListGroup.Item>
              <ListGroup.Item><strong>Parameter Size:</strong> {modelDetails.details.parameter_size}</ListGroup.Item>
              <ListGroup.Item><strong>Quantization Level:</strong> {modelDetails.details.quantization_level}</ListGroup.Item>
            </>
          )}
          {modelDetails.model_info && (
            <>
              <ListGroup.Item><strong>Architecture:</strong> {modelDetails.model_info['general.architecture']}</ListGroup.Item>
              <ListGroup.Item><strong>Parameter Count:</strong> {modelDetails.model_info['general.parameter_count']}</ListGroup.Item>
              <ListGroup.Item><strong>Size Label:</strong> {modelDetails.model_info['general.size_label']}</ListGroup.Item>
              {modelDetails.model_info['general.finetune'] && <ListGroup.Item><strong>Finetune:</strong> {modelDetails.model_info['general.finetune']}</ListGroup.Item>}
            </>
          )}
          {modelDetails.capabilities && modelDetails.capabilities.length > 0 && (
            <ListGroup.Item><strong>Capabilities:</strong> {modelDetails.capabilities.join(', ')}</ListGroup.Item>
          )}
          {modelDetails.modified_at && (
            <ListGroup.Item><strong>Modified At:</strong> {new Date(modelDetails.modified_at).toLocaleString()}</ListGroup.Item>
          )}
        </ListGroup>

        <h5 className="mt-3">Advanced Details</h5>
        <Accordion alwaysOpen>
          {modelDetails.modelfile && (
            <Accordion.Item eventKey="0">
              <Accordion.Header>Modelfile</Accordion.Header>
              <Accordion.Body>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{modelDetails.modelfile}</pre>
              </Accordion.Body>
            </Accordion.Item>
          )}
          {modelDetails.parameters && (
            <Accordion.Item eventKey="1">
              <Accordion.Header>Parameters</Accordion.Header>
              <Accordion.Body>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{modelDetails.parameters}</pre>
              </Accordion.Body>
            </Accordion.Item>
          )}
          {modelDetails.template && (
            <Accordion.Item eventKey="2">
              <Accordion.Header>Template</Accordion.Header>
              <Accordion.Body>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{modelDetails.template}</pre>
              </Accordion.Body>
            </Accordion.Item>
          )}
          {modelDetails.details && (
            <Accordion.Item eventKey="3">
              <Accordion.Header>Raw Details Object</Accordion.Header>
              <Accordion.Body>
                {renderDetails(modelDetails.details)}
              </Accordion.Body>
            </Accordion.Item>
          )}
          {modelDetails.model_info && (
            <Accordion.Item eventKey="4">
              <Accordion.Header>Model Info Object</Accordion.Header>
              <Accordion.Body>
                {renderModelInfo(modelDetails.model_info)}
              </Accordion.Body>
            </Accordion.Item>
          )}
          {modelDetails.tensors && modelDetails.tensors.length > 0 && (
            <Accordion.Item eventKey="5">
              <Accordion.Header>Tensors ({modelDetails.tensors.length})</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  {modelDetails.tensors.map((tensor, index) => (
                    <ListGroup.Item key={index}>
                      <strong>Name:</strong> {tensor.name}<br/>
                      <strong>Type:</strong> {tensor.type}<br/>
                      <strong>Shape:</strong> [{tensor.shape.join(', ')}]
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModelDetailsModal;