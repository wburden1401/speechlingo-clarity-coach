
interface AudioRecorderOptions {
  onDataAvailable?: (blob: Blob) => void;
  onTimeUpdate?: (time: number) => void;
  onComplete?: (blob: Blob, duration: number) => void;
  onError?: (error: Error) => void;
  maxDuration?: number; // in seconds
  onVolumeUpdate?: (volume: number) => void; // Add this new option
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private timeElapsed: number = 0;
  private maxDuration: number = 0;
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private audioVolumes: number[] = [];
  private volumeUpdateInterval: ReturnType<typeof setInterval> | null = null;

  // Callback functions
  private onDataAvailable: ((blob: Blob) => void) | undefined;
  private onTimeUpdate: ((time: number) => void) | undefined;
  private onComplete: ((blob: Blob, duration: number) => void) | undefined;
  private onError: ((error: Error) => void) | undefined;
  private onVolumeUpdate: ((volume: number) => void) | undefined;

  constructor(options?: AudioRecorderOptions) {
    this.onDataAvailable = options?.onDataAvailable;
    this.onTimeUpdate = options?.onTimeUpdate;
    this.onComplete = options?.onComplete;
    this.onError = options?.onError;
    this.maxDuration = options?.maxDuration || 0;
    this.onVolumeUpdate = options?.onVolumeUpdate;
  }

  public async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      this.startTime = Date.now();
      this.timeElapsed = 0;
      this.audioVolumes = [];

      // Setup audio analyzer
      this.setupAudioAnalysis();

      this.mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable);
      this.mediaRecorder.addEventListener('stop', this.handleStop);
      
      this.mediaRecorder.start(100); // Collect data every 100ms
      
      // Start timer
      if (this.onTimeUpdate) {
        this.timer = window.setInterval(() => {
          this.timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
          this.onTimeUpdate?.(this.timeElapsed);
          
          // Auto-stop if max duration is reached
          if (this.maxDuration > 0 && this.timeElapsed >= this.maxDuration) {
            this.stop();
          }
        }, 100);
      }
    } catch (error) {
      if (this.onError) {
        this.onError(error as Error);
      }
      console.error('Error starting recording:', error);
    }
  }

  public stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // Clear volume update interval
    if (this.volumeUpdateInterval) {
      clearInterval(this.volumeUpdateInterval);
      this.volumeUpdateInterval = null;
    }
    
    // Stop all tracks in the stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Clean up audio analysis
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyzer = null;
    }
  }

  public isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }

  private handleDataAvailable = (event: BlobEvent): void => {
    if (event.data.size > 0) {
      this.audioChunks.push(event.data);
      
      if (this.onDataAvailable) {
        this.onDataAvailable(event.data);
      }
    }
  };

  private handleStop = (): void => {
    const duration = Math.floor((Date.now() - this.startTime) / 1000);
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    
    if (this.onComplete) {
      this.onComplete(audioBlob, duration);
    }
    
    // Clean up
    this.mediaRecorder?.removeEventListener('dataavailable', this.handleDataAvailable);
    this.mediaRecorder?.removeEventListener('stop', this.handleStop);
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.timeElapsed = 0;
  };

  private setupAudioAnalysis(): void {
    try {
      if (!this.stream) return;

      this.audioContext = new AudioContext();
      this.analyzer = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyzer);
      
      this.analyzer.fftSize = 256;
      const bufferLength = this.analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Sample audio levels at intervals
      const analyzeInterval = setInterval(() => {
        if (!this.analyzer) {
          clearInterval(analyzeInterval);
          return;
        }

        this.analyzer.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        
        // Get average volume (0-100)
        const averageVolume = sum / bufferLength;
        this.audioVolumes.push(averageVolume);
        
        // Call the onVolumeUpdate callback if provided
        if (this.onVolumeUpdate) {
          this.onVolumeUpdate(averageVolume);
        }
      }, 300);
      
      this.volumeUpdateInterval = analyzeInterval;

      // Clear interval when recording stops
      this.mediaRecorder?.addEventListener('stop', () => {
        clearInterval(analyzeInterval);
        this.volumeUpdateInterval = null;
      });
    } catch (error) {
      console.error('Error setting up audio analysis:', error);
    }
  }

  public getAudioLevelsData(): number[] {
    return this.audioVolumes;
  }
}

// Enhanced audio analysis service
export interface AudioAnalysisResult {
  transcript: string;
  fillerWordCount: number;
  paceWordsPerMinute: number;
  clarity: number; // 0-100
  confidence: number; // 0-100
  sentimentScore: number; // -1 to 1
  volumeVariation: number; // 0-100
  pauseCount: number;
  speakingTime: number; // seconds
  improvement: {
    clarity: string;
    pace: string;
    fillers: string;
    volume: string;
    general: string;
  };
}

// List of common filler words to detect
const fillerWords = [
  'um', 'uh', 'like', 'so', 'well', 'you know', 'right', 
  'actually', 'basically', 'literally', 'honestly', 'anyway',
  'i mean', 'kind of', 'sort of', 'like i said'
];

// Enhanced audio analysis function
export const analyzeAudio = async (audioBlob: Blob): Promise<AudioAnalysisResult> => {
  // This would actually send the audio to a server for analysis
  // For now, we're returning enhanced mock data
  
  // Simulate variable results based on the audio blob size (just as a way to vary results)
  const blobSize = audioBlob.size;
  const randomFactor = (blobSize % 1000) / 1000; // 0-1 random factor
  
  // Generate some speech analytics
  const fillerCount = Math.floor(randomFactor * 12); // 0-12 filler words
  const wordsPerMinute = Math.floor(100 + randomFactor * 80); // 100-180 wpm
  const clarity = Math.floor(65 + randomFactor * 35); // 65-100 clarity score
  const confidence = Math.floor(70 + randomFactor * 30); // 70-100 confidence
  const volumeVar = Math.floor(40 + randomFactor * 60); // 40-100 volume variation
  const pauseCount = Math.floor(randomFactor * 15); // 0-15 pauses
  
  // Generate fake transcript with some filler words included
  const sentences = [
    "Today I want to talk about the importance of clear communication.",
    "Public speaking is a skill that can be developed over time.",
    "Practicing regularly helps build confidence and improve delivery.",
    "It's important to vary your tone and pace to keep listeners engaged.",
    "Using pauses effectively can emphasize key points in your speech.",
    "Body language and eye contact are just as important as your words.",
    "Thank you for listening to my presentation on effective communication."
  ];
  
  // Add some filler words to the mock transcript
  let transcript = "";
  for (const sentence of sentences) {
    if (Math.random() > 0.7 && fillerCount > 0) {
      const randomFiller = fillerWords[Math.floor(Math.random() * fillerWords.length)];
      transcript += randomFiller + " " + sentence + " ";
    } else {
      transcript += sentence + " ";
    }
  }
  
  // Generate improvement feedback based on metrics
  const clarityFeedback = clarity < 80 
    ? "Try to enunciate more clearly and speak at a moderate pace."
    : "Your speech clarity is good. Keep practicing consistent articulation.";
    
  const paceFeedback = wordsPerMinute > 160 
    ? "You're speaking a bit too quickly. Try to slow down for better comprehension."
    : wordsPerMinute < 120 
    ? "Your pace is slightly slow. Try to maintain a moderate speaking rate."
    : "Your speaking pace is good, within the ideal range.";
    
  const fillerFeedback = fillerCount > 5 
    ? `You used filler words (like 'um', 'uh', 'like') approximately ${fillerCount} times. Try replacing these with pauses.`
    : fillerCount > 0 
    ? `You occasionally used filler words, about ${fillerCount} times. Being aware of them is the first step to reducing them.`
    : "You did well avoiding filler words. Keep up the good work!";

  const volumeFeedback = volumeVar < 60
    ? "Try to add more vocal variety. Your volume was fairly consistent throughout."
    : "Good job varying your volume to emphasize important points.";

  return {
    transcript,
    fillerWordCount: fillerCount,
    paceWordsPerMinute: wordsPerMinute,
    clarity,
    confidence,
    sentimentScore: (randomFactor * 2) - 1, // -1 to 1
    volumeVariation: volumeVar,
    pauseCount,
    speakingTime: Math.floor(5 + randomFactor * 25), // 5-30 seconds
    improvement: {
      clarity: clarityFeedback,
      pace: paceFeedback,
      fillers: fillerFeedback,
      volume: volumeFeedback,
      general: "Practice using deliberate pauses instead of filler words, and work on varying your tone to keep listeners engaged."
    }
  };
};
