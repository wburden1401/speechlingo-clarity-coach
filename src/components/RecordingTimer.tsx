
interface RecordingTimerProps {
  seconds: number;
  totalSeconds?: number;
}

export function RecordingTimer({ seconds, totalSeconds }: RecordingTimerProps) {
  // Format seconds to MM:SS format
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };
  
  // Calculate progress percentage if totalSeconds is provided
  const progress = totalSeconds ? (seconds / totalSeconds) * 100 : 0;
  
  return (
    <div className="flex flex-col items-center">
      <div className="text-lg font-mono">{formatTime(seconds)}</div>
      {totalSeconds && (
        <div className="w-full h-1 bg-muted rounded-full mt-1">
          <div
            className="h-1 bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
