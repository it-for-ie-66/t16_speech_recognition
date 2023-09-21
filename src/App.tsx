import * as speech from "@tensorflow-models/speech-commands";
import { load_model } from "./model";
import { useEffect, useState } from "react";
function App() {
  const [model, setModel] = useState<speech.SpeechCommandRecognizer | null>(
    null
  );
  const [labels, setLabels] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [txtString, setTxtString] = useState("");
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
        setTxtString((prev) => prev + " " + getEmoji(prediction));
      },
      // Options: https://github.com/tensorflow/tfjs-models/blob/master/speech-commands/README.md
      {
        includeSpectrogram: false,
        probabilityThreshold: 0.9,
        overlapFactor: 0.5,
        includeEmbedding: false,
        invokeCallbackOnNoiseAndUnknown: false,
      }
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

  function handleClear() {
    setTxtString("");
  }
  if (!ready) return <div>...loading</div>;

  return (
    <>
      <h1>Speech Recognition</h1>
      <div>
        <button onClick={handleStart} disabled={isListening}>
          {isListening ? "Listening..." : "Start"}
        </button>
        <button onClick={handleStop} disabled={!isListening}>
          Stop
        </button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <h2>Prediction: {prediction}</h2>
      <div>{txtString}</div>
    </>
  );
}

export default App;

// Retrieve the array key corresponding to the largest element in the array.
function argMax(array: number[]) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

function getEmoji(text: string) {
  switch (text) {
    case "one":
      return "1️⃣";
    case "two":
      return "2️⃣";
    case "three":
      return "3️⃣";
    case "four":
      return "4️⃣";
    case "five":
      return "5️⃣";
    case "six":
      return "6️⃣";
    case "seven":
      return "7️⃣";
    case "eight":
      return "8️⃣";
    case "nine":
      return "9️⃣";
    case "zero":
      return "0️⃣";
    case "up":
      return "⬆️";
    case "down":
      return "⬇️";
    case "left":
      return "⬅️";
    case "right":
      return "➡️";
    case "go":
      return "🟢";
    case "stop":
      return "🔴";
    case "yes":
      return "👍";
    case "no":
      return "👎";
    case "_unknown_":
      return "❓";
    case "_background_noise_":
      return "🎙️";
    default:
      return "";
  }
}
