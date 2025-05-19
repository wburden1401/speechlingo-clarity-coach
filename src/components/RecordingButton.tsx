import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AudioRecorder, analyzeAudio } from "@/lib/audioRecorder";
import { useAppContext } from "@/contexts/AppContext";
import { useNetwork } from "@/contexts/NetworkContext";
import { Mic, Square, Loader, WifiOff, Volume2 } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";
import { RecordingTimer } from "./RecordingTimer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveOfflineRecording } from "@/lib/localStorage";
import { RealtimeFeedback } from "./RecordingFeedback";

interface RecordingButtonProps {
  maxDuration?: number;
}

export function RecordingButton({ maxDuration }: RecordingButtonProps) {
  const { state, startRecording, stopRecording } = useAppContext();
  const { isOnline } = useNetwork();
  const { toast } = useToast();
  const [seconds, setSeconds] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
        onVolumeUpdate: (vol) => setVolume(vol),
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
      setIsAnalyzing(true);
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
      setVolume(0);
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
    // Save recording to state
    stopRecording();
    setIsAnalyzing(true);
    
    if (!isOnline) {
      // Save recording for later sync
      const offlineRecording = {
        id: `recording_${Date.now()}`,
        blob,
        lessonId: state.selectedLesson?.id || null,
        categoryId: state.selectedCategory?.id || null,
        timestamp: new Date().toISOString(),
        duration,
        pendingSync: true
      };
      
      saveOfflineRecording(offlineRecording);
      
      toast({
        title: "Recording Saved Offline",
        description: "Your recording will be analyzed when you're back online.",
      });
    }
    
    // Analyze audio would happen on server side in a real app
    // For now we'll use the mock implementation
    await analyzeAudio(blob);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col items-center">
      <AudioWaveform isActive={isRecording} />
      
      <RecordingTimer 
        seconds={seconds}
        totalSeconds={maxDuration}
      />
      
      {isRecording && (
        <RealtimeFeedback volume={volume} seconds={seconds} />
      )}
      
      {!isOnline && (
        <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs">
          <WifiOff className="h-3 w-3" />
          <span>Offline mode - recording will sync later</span>
        </div>
      )}
      
      <Button
        onClick={handleToggleRecording}
        disabled={state.isLoading || isAnalyzing}
        className={cn(
          "mt-4 rounded-full w-16 h-16 flex items-center justify-center",
          isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90" 
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {state.isLoading || isAnalyzing ? (
          <Loader className="h-6 w-6 animate-spin" />
        ) : isRecording ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      
      <p className="mt-2 text-sm text-muted-foreground">
        {state.isLoading || isAnalyzing
          ? "Analyzing your speech..."
          : isRecording
          ? "Tap to stop recording"
          : "Tap to start recording"}
      </p>
    </div>
  );
}
