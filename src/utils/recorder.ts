import MicRecorder from 'mic-recorder-to-mp3';

const recorder = new MicRecorder({ bitRate: 128 });

export async function startMicRecording() {
  await recorder.start();
}

export async function stopMicRecording(): Promise<Blob> {
  const [buffer, blob] = await recorder.stop().getMp3();
  return blob;
}
