
import React from "react";
import { Flame } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export function StreakCounter() {
  const { user } = useAppContext();
  
  return (
    <div className={cn(
      "streak-counter",
      "flex items-center gap-1.5 bg-lingo-orange/10 text-lingo-orange rounded-full px-3 py-1.5 text-sm font-medium transition-all"
    )}>
      <Flame className="h-4 w-4 text-lingo-orange animate-pulse" />
      <span>{user.streak} day streak</span>
    </div>
  );
}
