
import { useAppContext } from "@/contexts/AppContext";
import { StreakCounter } from "@/components/StreakCounter";
import { DailyGoal } from "@/components/DailyGoal";
import { QuoteCard } from "@/components/QuoteCard";
import { QuickLessonButton } from "@/components/QuickLessonButton";

export function HomePage() {
  const { user } = useAppContext();

  return (
    <div className="space-y-6 pt-6 pb-24">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
        <StreakCounter />
      </div>
      
      <div className="px-4">
        <QuickLessonButton />
      </div>

      <div className="px-4">
        <DailyGoal />
      </div>
      
      <div className="px-4">
        <QuoteCard />
      </div>
    </div>
  );
}
