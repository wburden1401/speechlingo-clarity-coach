
import React from "react";
import { Flame } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

export function StreakCounter() {
  const { user } = useAppContext();
  
  return (
    <div className="streak-counter">
      <Flame className="h-4 w-4 text-lingo-orange animate-pulse" />
      <span>{user.streak} day streak</span>
    </div>
  );
}
