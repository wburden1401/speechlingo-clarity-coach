import Recorder from "recorder-js";

export async function initWavRecorder(): Promise<{ recorder: Recorder; audioContext: AudioContext }> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const recorder = new Recorder(audioContext, {
    onAnalysed: data => {
      // optional: add live volume metering
    }
  });

  recorder.init(stream);

  return { recorder, audioContext };
}
