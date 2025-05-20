import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, LogOut, User, Award, Clock, Zap, Flame } from "lucide-react";
import { AppSettings } from "@/components/settings/AppSettings";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function ProfilePage() {
  const { user } = useAppContext();
  const { logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  
  const handleLogout = () => {
    logout();
  };

  const getTimeString = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ''}`;
    }
  };
  
  return (
    <div className="container max-w-md py-6 space-y-6">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <User className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
      
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <Award className="h-5 w-5 text-amber-500 mb-1" />
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="font-bold text-lg">{user.level}</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <Zap className="h-5 w-5 text-blue-500 mb-1" />
            <p className="text-sm text-muted-foreground">XP</p>
            <p className="font-bold text-lg">{user.xp}</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <Clock className="h-5 w-5 text-green-500 mb-1" />
            <p className="text-sm text-muted-foreground">Practice Time</p>
            <p className="font-bold text-base">{getTimeString(user.totalLearningTime)}</p>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
            <Flame className="h-5 w-5 text-lingo-orange mb-1" />
            <p className="text-sm text-muted-foreground">Streak</p>
            <p className="font-bold text-lg">{user.streak} days</p>
          </div>
        </div>
      </Card>
      
      <Card className="overflow-hidden divide-y">
        <button 
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span>Settings</span>
        </button>
        
        <Button 
          variant="ghost" 
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors rounded-none h-auto text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </Button>
      </Card>
      
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <AppSettings />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfilePage;
