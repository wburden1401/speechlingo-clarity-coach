let audioContext: AudioContext;
let mediaStream: MediaStream;
let mediaStreamSource: MediaStreamAudioSourceNode;
let recorder: ScriptProcessorNode;
let recordedBuffers: Float32Array[] = [];

export async function startWavRecording() {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  audioContext = new AudioContextClass({
    sampleRate: 16000,  // Required sample rate for Azure Speech Services
    latencyHint: 'interactive'
  });
  
  mediaStream = await navigator.mediaDevices.getUserMedia({ 
    audio: {
      channelCount: 1,  // Mono audio
      sampleRate: 16000 // Match AudioContext sample rate
    } 
  });
  
  mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);

  recorder = audioContext.createScriptProcessor(4096, 1, 1);
  recorder.onaudioprocess = e => {
    const channelData = e.inputBuffer.getChannelData(0);
    recordedBuffers.push(new Float32Array(channelData));
  };

  mediaStreamSource.connect(recorder);
  recorder.connect(audioContext.destination);
}

export async function stopWavRecording(): Promise<Blob> {
  recorder.disconnect();
  mediaStreamSource.disconnect();
  mediaStream.getTracks().forEach(track => track.stop());
  audioContext.close();

  const bufferLength = recordedBuffers.reduce((acc, cur) => acc + cur.length, 0);
  const result = new Float32Array(bufferLength);
  let offset = 0;
  recordedBuffers.forEach(b => {
    result.set(b, offset);
    offset += b.length;
  });

  const wavBlob = encodeWAV(result, 16000);
  recordedBuffers = [];
  return wavBlob;
}

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], { type: 'audio/wav' });
}
