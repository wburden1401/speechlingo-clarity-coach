import { useState, useRef, useEffect } from 'react';
import { parseFeedback } from '@/utils/parseFeedback';
import { analyzeAudioFromBlob } from "@/utils/analyzeAudio";
import { parseAzureFeedback } from "@/utils/parseAzureFeedback";
import { startWavRecording, stopWavRecording } from '@/utils/simpleWAVRecorder';


interface FeedbackData {
  overallScore: number;
  tone: string;
  fillerWords: string;
  pacing: string;
  scoreExplanation: string;
  nextTip: string;
  wpm?: number;
}

interface AnalysisResponse {
  transcript: string;
  wpm: number;
  azureScores: {
    accuracyScore?: number;
    fluencyScore?: number;
    completenessScore?: number;
    pronunciationScore?: number;
    text?: string;
  };
  feedback: FeedbackData;
}

const prompts = [
  "Introduce yourself in 1 to 2 sentences.",
  "Talk about your favorite hobby in under 30 seconds.",
  "Explain a recent challenge you faced and how you overcame it."
];

export default function RecorderComponent() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [prompt, setPrompt] = useState(prompts[0]); 

  // Handle duration tracking
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (recording) {
      startTimeRef.current = Date.now();
      interval = setInterval(() => {
        const currentDuration = (Date.now() - startTimeRef.current) / 1000;
        setDuration(currentDuration);
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recording]);

  const handleUpload = async (audioBlob: Blob) => {
    try {
      setAnalyzing(true);
      setError(null);
      
      // Create form data
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Send to analysis endpoint
      formData.append('prompt', prompt);
      
      const response = await fetch('http://localhost:3001/api/analyze-speech', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data: AnalysisResponse = await response.json();
      setTranscript(data.transcript);
      setFeedback(data.feedback);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload or processing failed';
      setError(errorMessage);
      console.error('Upload or analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleToggle = async () => {
    setError(null);
    
    try {
      if (!recording) {
        await startWavRecording();
        setRecording(true);
      } else {
        const audioBlob = await stopWavRecording();
        setRecording(false);
        await handleUpload(audioBlob);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Recording operation failed';
      setError(errorMessage);
      console.error('Recording error:', err);
      setRecording(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <p className="text-lg font-medium mb-4">Prompt: {prompt}</p>
      <button
      className="text-blue-600 underline mb-6"
      onClick={() =>
        setPrompt(prompts[Math.floor(Math.random() * prompts.length)])
      }
      disabled={recording || analyzing}
      >
        Next Prompt
      </button>
      <button
        className={`px-8 py-6 text-2xl rounded-2xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition ${
          analyzing ? 'cursor-wait opacity-70' : ''
        }`}
        onClick={handleToggle}
        disabled={analyzing}
      >
        {analyzing
          ? 'Analyzing...'
          : recording
          ? 'Stop & Upload'
          : 'Record'}
      </button>

      {recording && (
        <div className="text-sm text-gray-600 mt-2">
          Recording: {duration.toFixed(1)}s
        </div>
      )}

      {error && (
        <div className="mt-4 w-full max-w-2xl bg-red-100 border border-red-400 text-red-700 p-4 rounded-xl shadow-sm">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {transcript && (
        <div className="mt-4 w-full max-w-2xl bg-[#89cff0] p-4 rounded-xl shadow-sm">
          <p className="font-semibold mb-2 text-black">Transcript:</p>
          <p className="text-black whitespace-pre-wrap leading-relaxed">
            {transcript}
          </p>
        </div>
      )}

      {feedback && (
        <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-2xl shadow-sm w-full max-w-2xl mt-6">
          <p className="font-semibold mb-2">Feedback Summary:</p>
          
          <div className="mt-4 p-4 bg-white border border-gray-200 text-gray-700 rounded-xl shadow-sm whitespace-pre-wrap break-words">
            <p className="mt-2 text-blue-900 font-semibold">
              Overall Score: {feedback.overallScore}/100
            </p>
            
            <p className="mt-4">
              <strong>Tone:</strong> {feedback.tone}
            </p>
            
            <p className="mt-2">
              <strong>Filler Words:</strong> {feedback.fillerWords}
            </p>
            
            <p className="mt-2">
              <strong>Pacing:</strong> {feedback.pacing}
              {feedback.wpm && ` (${feedback.wpm} WPM)`}
            </p>
            
            <p className="mt-2">
              <strong>Score Explanation:</strong> {feedback.scoreExplanation}
            </p>
            <p className="mt-4 italic text-green-700">
              <strong>Next Tip:</strong> "{feedback.nextTip}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
