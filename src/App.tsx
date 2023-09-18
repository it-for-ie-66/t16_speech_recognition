import * as speech from "@tensorflow-models/speech-commands";
import { load_model } from "./model";
import { useEffect, useState } from "react";
function App() {
  const [model, setModel] = useState<speech.SpeechCommandRecognizer | null>(
    null
  );

  const [prediction, setPrediction] = useState<string>("");
  const [labels, setLabels] = useState<string[]>([]);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    load_model()
      .then(({ model, labels }) => {
        setModel(model);
        setLabels(labels);
        setReady(true);
      })
      .catch((err) => console.log(err));
  }, []);

  const recognizeCommands = async () => {
    if (!model) return;
    console.log("Listening for commands");
    model.listen(
      async (result) => {
        console.log(result.spectrogram);
        console.log(result.scores);
        const scores = result.scores;
        const prediction = labels[argMax(Object.values(scores))];
        setPrediction(prediction);
      },
      { includeSpectrogram: true, probabilityThreshold: 0.9 }
    );
    setTimeout(() => model.stopListening(), 10e3);
  };

  if (!ready) return <div>...loading</div>;

  return <></>;
}

export default App;

function argMax(arr: number[]) {
  return arr.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
