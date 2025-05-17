
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Award,
  Clock,
  Calendar
} from "lucide-react";

export function ProfilePage() {
  const { user, updateUser } = useAppContext();

  // Goal options in minutes
  const goalOptions = [5, 10, 15, 20, 30];

  const handleUpdateGoal = (minutes: number) => {
    updateUser({ dailyGoalMinutes: minutes });
  };

  return (
    <div className="space-y-6 pt-6 pb-24">
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* User Profile Card */}
      <div className="px-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <div className="flex items-center mt-1">
                <Award className="h-4 w-4 mr-1 text-lingo-blue" />
                <span className="text-sm">Level {user.level}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Goal */}
      <div className="px-4">
        <h2 className="font-semibold mb-3">Daily Goal</h2>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-3">
            How much time would you like to practice speaking each day?
          </p>
          <div className="flex flex-wrap gap-2">
            {goalOptions.map((minutes) => (
              <Button
                key={minutes}
                size="sm"
                variant={user.dailyGoalMinutes === minutes ? "default" : "outline"}
                className={user.dailyGoalMinutes === minutes ? "bg-lingo-blue" : ""}
                onClick={() => handleUpdateGoal(minutes)}
              >
                {minutes} min
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* User Information */}
      <div className="px-4">
        <h2 className="font-semibold mb-3">User Information</h2>
        <Card className="divide-y">
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p>{user.country}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-muted-foreground">Language</p>
              <p>{user.language}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-muted-foreground">Birthday</p>
              <p>{new Date(user.birthday).toLocaleDateString()}</p>
            </div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-muted-foreground">Occupation</p>
              <p>{user.occupation}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-muted-foreground">Reason for joining</p>
              <p>{user.reason}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Account Settings */}
      <div className="px-4">
        <h2 className="font-semibold mb-3">Account Settings</h2>
        <Card>
          <div className="p-4 flex items-center">
            <Bell className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Notifications</span>
            <div className="ml-auto">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <Separator />
          
          <div className="p-4 flex items-center">
            <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Account Settings</span>
            <div className="ml-auto">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          
          <Separator />
          
          <div className="p-4 flex items-center">
            <LogOut className="h-5 w-5 mr-3 text-muted-foreground" />
            <span>Log Out</span>
            <div className="ml-auto">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
