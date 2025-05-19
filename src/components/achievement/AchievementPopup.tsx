
import { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AchievementPopupProps {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  xp?: number;
  onComplete?: () => void;
}

export function AchievementPopup({
  title,
  description,
  icon = "🏆",
  color = "text-amber-500",
  xp = 10,
  onComplete
}: AchievementPopupProps) {
  const [visible, setVisible] = useState(true);
  
  // Auto-hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  if (!visible) return null;
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-0 right-0 z-50 flex justify-center"
        >
          <div className="bg-card border shadow-lg rounded-lg p-4 max-w-[90%] sm:max-w-sm flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-2xl", color)}>
              <span>{icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Achievement Unlocked!</h4>
                <span className="text-sm font-medium text-amber-500">+{xp} XP</span>
              </div>
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
