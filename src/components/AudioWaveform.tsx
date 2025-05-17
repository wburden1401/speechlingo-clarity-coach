
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
  return (
    <div className="flex items-end justify-center h-10 my-4 gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "waveform-bar",
            isActive ? `animate-wave-${i + 1}` : "h-1"
          )}
        />
      ))}
    </div>
  );
}
