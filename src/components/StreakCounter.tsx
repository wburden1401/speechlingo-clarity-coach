
import React from "react";
import { Flame } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export function StreakCounter() {
  const { user } = useAppContext();
  
  return (
    <div className={cn(
      "streak-counter",
      "flex items-center gap-2 bg-lingo-orange/10 text-lingo-orange rounded-full px-4 py-2 text-base font-medium transition-all"
    )}>
      <Flame className="h-5 w-5 text-lingo-orange animate-pulse" />
      <span>{user.streak} day streak</span>
    </div>
  );
}
