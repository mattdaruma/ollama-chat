import { useState, useEffect } from 'react';
import { Form, Spinner, Alert } from 'react-bootstrap';

function ModelSelector({ onModelChange, selectedModel }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          setModels(data.models);
        } else {
          setError('No models found.');
        }
      } catch (e) {
        setError(`Failed to fetch models: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Form.Group controlId="modelSelector">
      <Form.Select aria-label="Model selector" onChange={(e) => onModelChange(e.target.value)} value={selectedModel}>
        <option value="">Select a model</option>
        {models.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}

export default ModelSelector;
