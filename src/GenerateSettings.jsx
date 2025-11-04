import React from 'react';
import { Form, Row, Col, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import { QuestionCircle } from 'react-bootstrap-icons';

function GenerateSettings({
  isModelLoaded,
  modelDetails,
  temperature,
  setTemperature,
  numPredict,
  setNumPredict,
  topK,
  setTopK,
  topP,
  setTopP,
  repeatLastN,
  setRepeatLastN,
  repeatPenalty,
  setRepeatPenalty,
  numCtx,
  setNumCtx,
  seed,
  setSeed,
  stop,
  setStop,
  tfsZ,
  setTfsZ,
  numGpu,
  setNumGpu,
  mainGpu,
  setMainGpu,
  lowVram,
  setLowVram,
  numThread,
  setNumThread,
  numBatch,
  setNumBatch,
  f16Kv,
  setF16Kv,
  logitsAll,
  setLogitsAll,
  vocabOnly,
  setVocabOnly,
  useMmap,
  setUseMmap,
  useMlock,
  setUseMlock,
  ropeFrequencyBase,
  setRopeFrequencyBase,
  ropeFrequencyScale,
  setRopeFrequencyScale,
  numKeep,
  setNumKeep,
}) {

  const getMaxValue = (key, defaultValue) => {
    if (modelDetails && modelDetails.model_info && modelDetails.model_info[key]) {
      return modelDetails.model_info[key];
    }
    return defaultValue;
  };

  const maxNumCtx = getMaxValue('llama.context_length', 2048);

  const renderPopover = (id, content) => (
    <Popover id={`popover-${id}`}>
      <Popover.Body>{content}</Popover.Body>
    </Popover>
  );

  return (
    <div className="mt-3">
      <h5>Generate Parameters</h5>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="temperature">
          <Form.Label>Temperature</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('temperature', 'The temperature of the model. Increasing the temperature will make the model more creative. (Default: 0.8)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="numPredict">
          <Form.Label>Num Predict</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('numPredict', 'Number of tokens to predict. Set to -1 to predict up to the maximum context length. (Default: 128)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="-1"
            value={numPredict}
            onChange={(e) => setNumPredict(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="topK">
          <Form.Label>Top K</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('topK', 'Reduces the probability of generating nonsense. A higher value (e.g. 100) will give more diverse answers, while a lower value (e.g. 10) will be more focused. (Default: 40)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="topP">
          <Form.Label>Top P</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('topP', 'Works together with Top K. A higher value (e.g. 0.9) will lead to more diverse answers, while a lower value (e.g. 0.1) will be more focused. (Default: 0.9)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={topP}
            onChange={(e) => setTopP(parseFloat(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="repeatLastN">
          <Form.Label>Repeat Last N</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('repeatLastN', 'Sets how far back for the model to look to prevent repetition. (Default: 64)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={repeatLastN}
            onChange={(e) => setRepeatLastN(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="repeatPenalty">
          <Form.Label>Repeat Penalty</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('repeatPenalty', 'Sets how strongly to penalize repetitions. A value of 1 means no penalty, values above 1 increase the penalty. (Default: 1.1)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            value={repeatPenalty}
            onChange={(e) => setRepeatPenalty(parseFloat(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="numCtx">
          <Form.Label>Num Ctx (Max: {maxNumCtx})</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('numCtx', 'Sets the size of the context window used to generate the next token. (Default: 2048)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            max={maxNumCtx}
            value={numCtx}
            onChange={(e) => setNumCtx(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="seed">
          <Form.Label>Seed</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('seed', 'Sets the random seed for reproducibility. (Default: 0)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="stop">
          <Form.Label>Stop Sequences (comma separated)</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('stop', 'Sets the stop sequences to use when generating text. (Default: empty)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="text"
            value={stop.join(', ')}
            onChange={(e) => setStop(e.target.value.split(',').map(s => s.trim()))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="tfsZ">
          <Form.Label>TFS Z</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('tfsZ', 'Tail Free Sampling. (Default: 1)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={tfsZ}
            onChange={(e) => setTfsZ(parseFloat(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="numGpu">
          <Form.Label>Num GPU</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('numGpu', 'The number of layers to send to the GPU. (Default: 0)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={numGpu}
            onChange={(e) => setNumGpu(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="mainGpu">
          <Form.Label>Main GPU</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('mainGpu', 'The GPU to use for the main computation. (Default: 0)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={mainGpu}
            onChange={(e) => setMainGpu(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="lowVram">
          <Form.Check
            type="checkbox"
            label={
              <>
                Low VRAM
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={renderPopover('lowVram', 'Force the model to use less VRAM. (Default: false)')}
                >
                  <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
                </OverlayTrigger>
              </>
            }
            checked={lowVram}
            onChange={(e) => setLowVram(e.target.checked)}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="numThread">
          <Form.Label>Num Thread</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('numThread', 'The number of threads to use for generation. (Default: 0, uses all available)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={numThread}
            onChange={(e) => setNumThread(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="numBatch">
          <Form.Label>Num Batch</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('numBatch', 'The batch size for prompt processing. (Default: 16)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={numBatch}
            onChange={(e) => setNumBatch(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="f16Kv">
          <Form.Check
            type="checkbox"
            label={
              <>
                F16 KV
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={renderPopover('f16Kv', 'Use f16 for KV cache. (Default: true)')}
                >
                  <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
                </OverlayTrigger>
              </>
            }
            checked={f16Kv}
            onChange={(e) => setF16Kv(e.target.checked)}
            disabled={isModelLoaded}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="logitsAll">
          <Form.Check
            type="checkbox"
            label={
              <>
                Logits All
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={renderPopover('logitsAll', 'Return all the logits. (Default: false)')}
                >
                  <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
                </OverlayTrigger>
              </>
            }
            checked={logitsAll}
            onChange={(e) => setLogitsAll(e.target.checked)}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="vocabOnly">
          <Form.Check
            type="checkbox"
            label={
              <>
                Vocab Only
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={renderPopover('vocabOnly', 'Return only the vocabulary. (Default: false)')}
                >
                  <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
                </OverlayTrigger>
              </>
            }
            checked={vocabOnly}
            onChange={(e) => setVocabOnly(e.target.checked)}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="useMmap">
          <Form.Check
            type="checkbox"
            label={
              <>
                Use Mmap
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={renderPopover('useMmap', 'Use memory mapping for the model. (Default: true)')}
                >
                  <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
                </OverlayTrigger>
              </>
            }
            checked={useMmap}
            onChange={(e) => setUseMmap(e.target.checked)}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="useMlock">
          <Form.Check
            type="checkbox"
            label={
              <>
                Use Mlock
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  placement="top"
                  overlay={renderPopover('useMlock', 'Lock the model in memory. (Default: false)')}
                >
                  <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
                </OverlayTrigger>
              </>
            }
            checked={useMlock}
            onChange={(e) => setUseMlock(e.target.checked)}
            disabled={isModelLoaded}
          />
        </Form.Group>
      </Row>

      <Row className="mb-3">
        <Form.Group as={Col} controlId="ropeFrequencyBase">
          <Form.Label>Rope Frequency Base</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('ropeFrequencyBase', 'RoPE frequency base. (Default: 0)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            value={ropeFrequencyBase}
            onChange={(e) => setRopeFrequencyBase(parseFloat(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="ropeFrequencyScale">
          <Form.Label>Rope Frequency Scale</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('ropeFrequencyScale', 'RoPE frequency scale. (Default: 0)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            step="0.1"
            min="0"
            value={ropeFrequencyScale}
            onChange={(e) => setRopeFrequencyScale(parseFloat(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
        <Form.Group as={Col} controlId="numKeep">
          <Form.Label>Num Keep</Form.Label>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="top"
            overlay={renderPopover('numKeep', 'Number of tokens to keep from the original prompt. (Default: 0)')}
          >
            <Button variant="link" className="p-0 ms-1 align-baseline"><QuestionCircle size={14} /></Button>
          </OverlayTrigger>
          <Form.Control
            type="number"
            min="0"
            value={numKeep}
            onChange={(e) => setNumKeep(parseInt(e.target.value))}
            disabled={isModelLoaded}
          />
        </Form.Group>
      </Row>
    </div>
  );
}

export default GenerateSettings;