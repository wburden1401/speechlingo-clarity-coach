
import { useEffect, useState } from "react";
import { Mic, Volume2, Volume1, VolumeX, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealtimeFeedbackProps {
  volume: number;
  seconds: number;
}

export function RealtimeFeedback({ volume, seconds }: RealtimeFeedbackProps) {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"info" | "warning" | "success">("info");
  
  // Volume thresholds
  const LOW_VOLUME = 20;
  const HIGH_VOLUME = 80;
  
  // Time-based feedback
  useEffect(() => {
    if (seconds === 3) {
      setFeedbackMessage("Good start! Keep going...");
      setFeedbackType("success");
    } else if (seconds === 10) {
      setFeedbackMessage("Try to vary your tone for emphasis");
      setFeedbackType("info");
    } else if (seconds === 20) {
      setFeedbackMessage("You're doing great!");
      setFeedbackType("success");
    }
  }, [seconds]);
  
  // Volume-based feedback
  useEffect(() => {
    if (volume < LOW_VOLUME) {
      setFeedbackMessage("Speak a bit louder");
      setFeedbackType("warning");
    } else if (volume > HIGH_VOLUME) {
      setFeedbackMessage("Lower your voice slightly");
      setFeedbackType("warning");
    }
  }, [volume]);
  
  // Get appropriate volume icon
  const VolumeIcon = volume < LOW_VOLUME ? VolumeX : volume > HIGH_VOLUME ? Volume2 : Volume1;
  
  // Don't show feedback if there's no message
  if (!feedbackMessage) return null;
  
  return (
    <div className={cn(
      "mt-3 text-xs py-1 px-3 rounded-full flex items-center gap-2",
      feedbackType === "info" && "bg-blue-100 text-blue-800",
      feedbackType === "warning" && "bg-amber-100 text-amber-800",
      feedbackType === "success" && "bg-green-100 text-green-800"
    )}>
      {seconds < 5 && <Clock className="h-3 w-3" />}
      {seconds >= 5 && <VolumeIcon className="h-3 w-3" />}
      <span>{feedbackMessage}</span>
    </div>
  );
}
