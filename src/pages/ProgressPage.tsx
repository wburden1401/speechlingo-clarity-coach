
import { useAppContext } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAchievements } from "@/lib/data";
import { Award, Clock, Users, Flame, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProgressPage() {
  const { user } = useAppContext();
  
  // Calculate XP needed for next level
  const baseXp = 100;
  const xpForNextLevel = baseXp * Math.pow(1.5, user.level);
  const xpProgress = Math.min(100, Math.round((user.xp / xpForNextLevel) * 100));
  
  // Format learning time
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  return (
    <div className="space-y-6 pt-6 pb-24">
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold">Progress</h1>
      </div>

      <div className="px-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium">Your Level</h2>
            <span className="text-xl font-bold">{user.level}</span>
          </div>
          
          <Progress value={xpProgress} className="h-2" />
          
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{user.xp} XP</span>
            <span>{Math.round(xpForNextLevel)} XP needed for Level {user.level + 1}</span>
          </div>
        </Card>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-lingo-orange/20 flex items-center justify-center mb-2">
              <Flame className="h-6 w-6 text-lingo-orange" />
            </div>
            <span className="text-xl font-bold">{user.streak}</span>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </Card>
          
          <Card className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-lingo-blue/20 flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-lingo-blue" />
            </div>
            <span className="text-xl font-bold">{formatTime(user.totalLearningTime)}</span>
            <span className="text-xs text-muted-foreground">Total Practice</span>
          </Card>
          
          <Card className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-lingo-green/20 flex items-center justify-center mb-2">
              <Trophy className="h-6 w-6 text-lingo-green" />
            </div>
            <span className="text-xl font-bold">
              {mockAchievements.filter(a => a.isUnlocked).length}
            </span>
            <span className="text-xs text-muted-foreground">Achievements</span>
          </Card>
          
          <Card className="p-4 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-lingo-darkBlue/20 flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-lingo-darkBlue" />
            </div>
            <span className="text-xl font-bold">{user.referrals}</span>
            <span className="text-xs text-muted-foreground">Referrals</span>
          </Card>
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-semibold mb-3">Achievements</h2>
        <div className="space-y-3">
          {mockAchievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={cn(
                "achievement-card",
                !achievement.isUnlocked && "achievement-locked"
              )}
            >
              <div
                className={cn(
                  "achievement-icon",
                  achievement.color
                )}
              >
                <span className="text-xl">{achievement.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{achievement.title}</h3>
                  <span className="text-xs">
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {achievement.description}
                </p>
                <Progress
                  value={(achievement.progress / achievement.maxProgress) * 100}
                  className="h-1 mt-1"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
