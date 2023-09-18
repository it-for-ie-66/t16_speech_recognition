import * as speech from "@tensorflow-models/speech-commands";

export async function load_model() {
  try {
    const recognizer = speech.create("BROWSER_FFT");
    await recognizer.ensureModelLoaded();
    const labels = recognizer.wordLabels();
    return { model: recognizer, labels };
  } catch (err) {
    console.log(err);
    return { model: null, labels: [] as string[] };
  }
}
