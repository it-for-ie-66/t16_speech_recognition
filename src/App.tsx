import * as speech from "@tensorflow-models/speech-commands";
import { load_model } from "./model";
import { useEffect, useState } from "react";
function App() {
  const [model, setModel] = useState<speech.SpeechCommandRecognizer | null>(
    null
  );
  const [labels, setLabels] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [prediction, setPrediction] = useState<string>("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    load_model()
      .then(({ model, labels }) => {
        setModel(model);
        setLabels(labels);
        setReady(true);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleStart() {
    if (!model) return;
    setIsListening(true);
    model.listen(
      async (result) => {
        console.log(result);
        const scores = result.scores; // Get the scores from the model output.
        const scoresValues = Object.values(scores); // Get the scores as an array
        const idxMax = argMax(scoresValues); // Get the index of the highest score
        const prediction = labels[idxMax]; // Get the label of the highest score
        setPrediction(prediction);
      },
      { includeSpectrogram: false, probabilityThreshold: 0.8 } // Can be tuned for different voices.
    );
    setTimeout(() => {
      model.stopListening();
      setIsListening(false);
    }, 60e3); // Stop listening after 60 seconds.
  }

  function handleStop() {
    if (!model) return;
    model.stopListening();
    setIsListening(false);
  }

  if (!ready) return <div>...loading</div>;

  return (
    <>
      <h1>Speech Recognition</h1>
      <div>
        <button onClick={handleStart} disabled={isListening}>
          Start
        </button>
        <button onClick={handleStop} disabled={!isListening}>
          Stop
        </button>
        <div>
          {prediction ? <h3>{prediction}</h3> : <h3>No Voice Detected</h3>}
        </div>
      </div>
    </>
  );
}

export default App;

// Retrieve the array key corresponding to the largest element in the array.
function argMax(array: number[]) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
