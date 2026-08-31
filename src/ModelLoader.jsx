import { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { CloudDownload, CloudSlash } from 'react-bootstrap-icons';

function ModelLoader({ config, selectedModel, isModelLoaded, setIsModelLoaded, modelDetails }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkModelStatus = async () => {
      if (!selectedModel || !config) {
        setIsModelLoaded(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.ps}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const modelIsRunning = data.models?.some(m => m.name.startsWith(selectedModel));
        setIsModelLoaded(modelIsRunning);
      } catch (e) {
        console.error("Failed to check model status:", e);
        setIsModelLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkModelStatus();
  }, [selectedModel, setIsModelLoaded]);

  const parseParameters = (paramsString) => {
    if (!paramsString) return {};
    const params = {};
    const lines = paramsString.split('\n');
    lines.forEach(line => {
      const parts = line.trim().split(' ');
      if (parts.length >= 2 && parts[0] === 'PARAMETER') {
        let value = parts[2];
        // Try to parse as number if possible
        if (!isNaN(value)) {
          value = parseFloat(value);
        }
        params[parts[1]] = value;
      }
    });
    return params;
  };

  const loadModel = async () => {
    if (!selectedModel || !modelDetails || !config) return;
    setIsLoading(true);

    const parsedParameters = parseParameters(modelDetails.parameters);

    try {
      await fetch(`${config.api.baseUrl}${config.api.endpoints.generate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: '',
          keep_alive: -1, // Keep alive indefinitely
          stream: false,
          options: parsedParameters,
        }),
      });
      setIsModelLoaded(true);
    } catch (e) {
      console.error("Failed to load model:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const unloadModel = async () => {
    if (!selectedModel || !config) return;
    setIsLoading(true);
    try {
      await fetch(`${config.api.baseUrl}${config.api.endpoints.generate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: '',
          keep_alive: 0,
          stream: false,
        }),
      });
      setIsModelLoaded(false);
    } catch (e) {
      console.error("Failed to unload model:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Button variant="primary" disabled className="ms-2">
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        </Button>
      ) : isModelLoaded ? (
        <Button onClick={unloadModel} disabled={!selectedModel || isLoading} className="ms-2">
          <CloudSlash />
        </Button>
      ) : (
        <Button onClick={loadModel} disabled={!selectedModel || isLoading} className="ms-2">
          <CloudDownload />
        </Button>
      )}
    </>
  );
}

export default ModelLoader;
