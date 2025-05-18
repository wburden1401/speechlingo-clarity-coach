
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Settings, LogOut, User } from "lucide-react";

export function ProfilePage() {
  const { user } = useAppContext();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
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
        <div className="flex justify-between items-center py-2">
          <div>
            <p className="font-medium">Level {user.level}</p>
            <p className="text-sm text-muted-foreground">{user.xp} XP total</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{user.streak} day streak</p>
            <p className="text-sm text-muted-foreground">{user.totalLearningTime} minutes total</p>
          </div>
        </div>
      </Card>
      
      <Card className="overflow-hidden divide-y">
        <button 
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
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
    </div>
  );
}
