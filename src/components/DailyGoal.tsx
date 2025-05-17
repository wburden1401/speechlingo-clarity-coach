
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export function DailyGoal() {
  const { user } = useAppContext();
  
  // For demo purposes, let's assume the user completed 6 minutes out of their 10-minute daily goal
  const minutesCompleted = 6;
  const dailyGoalMinutes = user.dailyGoalMinutes;
  const percentComplete = Math.min(100, Math.round((minutesCompleted / dailyGoalMinutes) * 100));
  const isGoalReached = minutesCompleted >= dailyGoalMinutes;
  
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Daily Goal</h3>
        <span className="text-sm text-muted-foreground">{percentComplete}% complete</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="progress-circle w-14 h-14 border-4 border-muted">
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `conic-gradient(hsl(var(--primary)) ${percentComplete}%, transparent ${percentComplete}%)` 
            }}
          />
          <span className="relative text-sm font-medium">
            {minutesCompleted}/{dailyGoalMinutes}
          </span>
        </div>
        
        <div className="flex-1">
          {isGoalReached ? (
            <p className="text-sm font-medium text-lingo-green">
              Awesome! You've reached your daily goal! 🎉
            </p>
          ) : (
            <p className="text-sm">
              <span className="font-medium">{dailyGoalMinutes - minutesCompleted} minutes</span> left to reach your daily goal
            </p>
          )}
          <div className="w-full bg-muted h-2 rounded-full mt-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                isGoalReached ? "bg-lingo-green" : "bg-primary"
              )} 
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
