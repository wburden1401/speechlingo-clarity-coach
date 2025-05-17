
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AudioRecorder, analyzeAudio } from "@/lib/audioRecorder";
import { useAppContext } from "@/contexts/AppContext";
import { Mic, Square, Loader } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";
import { RecordingTimer } from "./RecordingTimer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface RecordingButtonProps {
  maxDuration?: number;
}

export function RecordingButton({ maxDuration }: RecordingButtonProps) {
  const { state, startRecording, stopRecording } = useAppContext();
  const { toast } = useToast();
  const [seconds, setSeconds] = useState(0);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const { isRecordingPermissionGranted } = state;
  const { isRecording } = state.recordingState;

  // Initialize recorder
  useEffect(() => {
    if (isRecordingPermissionGranted) {
      recorderRef.current = new AudioRecorder({
        onTimeUpdate: (time) => setSeconds(time),
        onComplete: (blob, duration) => {
          console.log("Recording completed:", blob, "Duration:", duration);
          handleRecordingComplete(blob, duration);
        },
        onError: (error) => {
          console.error("Recording error:", error);
          toast({
            title: "Recording Error",
            description: "An error occurred while recording. Please try again.",
            variant: "destructive",
          });
        },
        maxDuration,
      });
    }
    
    return () => {
      recorderRef.current?.stop();
    };
  }, [isRecordingPermissionGranted, maxDuration, toast]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      recorderRef.current?.stop();
      stopRecording();
    } else {
      if (!isRecordingPermissionGranted) {
        toast({
          title: "Microphone Required",
          description: "Please grant microphone permissions to record.",
          variant: "destructive",
        });
        return;
      }
      
      setSeconds(0);
      startRecording();
      try {
        await recorderRef.current?.start();
      } catch (error) {
        console.error("Failed to start recording:", error);
        stopRecording();
        toast({
          title: "Recording Error",
          description: "Failed to start recording. Please make sure microphone is connected.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRecordingComplete = async (blob: Blob, duration: number) => {
    // This would normally send the audio to the server for analysis
    // For now, we'll just wait a bit and then trigger the feedback UI
    stopRecording();
    // Analyze audio would happen on server side
    await analyzeAudio(blob);
  };

  return (
    <div className="flex flex-col items-center">
      <AudioWaveform isActive={isRecording} />
      
      <RecordingTimer 
        seconds={seconds}
        totalSeconds={maxDuration}
      />
      
      <Button
        onClick={handleToggleRecording}
        disabled={state.isLoading}
        className={cn(
          "mt-4 rounded-full w-16 h-16 flex items-center justify-center",
          isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90" 
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {state.isLoading ? (
          <Loader className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      
      <p className="mt-2 text-sm text-muted-foreground">
        {state.isLoading
          ? "Analyzing your speech..."
          : isRecording
          ? "Tap to stop recording"
          : "Tap to start recording"}
      </p>
    </div>
  );
}
