import * as speech from "@tensorflow-models/speech-commands";

export async function load_model() {
  try {
    const recognizer = speech.create("BROWSER_FFT");
    const labels = recognizer.wordLabels();
    await recognizer.ensureModelLoaded();
    return { model: recognizer, labels };
  } catch (err) {
    console.log(err);
    return { model: null, labels: [] as string[] };
  }
}
