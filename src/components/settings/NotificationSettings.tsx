
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bell, BellOff } from "lucide-react";
import { 
  getNotificationPreferences, 
  saveNotificationPreferences, 
  getUserSettings, 
  saveUserSettings,
  NotificationPreferences
} from "@/lib/localStorage";
import { requestNotificationPermission } from "@/lib/notificationService";
import { useToast } from "@/components/ui/use-toast";

export function NotificationSettings() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>(getNotificationPreferences());
  const [settings, setSettings] = useState(getUserSettings());
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  
  // Check notification permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      if ('Notification' in window) {
        const permission = Notification.permission;
        setPermissionGranted(permission === 'granted');
      } else {
        setPermissionGranted(false);
      }
    };
    
    checkPermission();
  }, []);
  
  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setPermissionGranted(true);
        updateSettings({ ...settings, notifications: true });
        toast({
          title: "Notifications enabled",
          description: "You will now receive notifications for your daily goals and streaks.",
        });
      } else {
        toast({
          title: "Permission denied",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    } else {
      updateSettings({ ...settings, notifications: false });
      toast({
        title: "Notifications disabled",
        description: "You will no longer receive notifications.",
      });
    }
  };
  
  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };
  
  const updatePreferences = (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    saveNotificationPreferences(newPreferences);
  };
  
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    if (granted) {
      updateSettings({ ...settings, notifications: true });
      toast({
        title: "Notifications enabled",
        description: "You will now receive notifications for your daily goals and streaks.",
      });
    } else {
      toast({
        title: "Permission denied",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Control how and when you receive notifications
          </p>
        </div>
        <Switch
          checked={settings.notifications}
          onCheckedChange={handleToggleNotifications}
          disabled={!permissionGranted && settings.notifications}
        />
      </div>
      
      {!permissionGranted && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-3">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Notifications are disabled</p>
              <p className="text-sm text-muted-foreground">
                Enable browser notifications to receive reminders and updates
              </p>
            </div>
            <Button size="sm" onClick={handleRequestPermission}>
              Enable
            </Button>
          </div>
        </Card>
      )}
      
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="daily-reminder" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Daily practice reminder
            </Label>
            <Switch
              id="daily-reminder"
              checked={preferences.dailyReminders}
              onCheckedChange={(checked) => updatePreferences({...preferences, dailyReminders: checked})}
              disabled={!settings.notifications}
            />
          </div>
          
          {preferences.dailyReminders && settings.notifications && (
            <div className="ml-6">
              <Label htmlFor="reminder-time" className="text-sm mb-1 block">
                Reminder time
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({...settings, reminderTime: e.target.value})}
                className="w-32"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Label htmlFor="streak-alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Streak alerts
            </Label>
            <Switch
              id="streak-alerts"
              checked={preferences.streakAlerts}
              onCheckedChange={(checked) => updatePreferences({...preferences, streakAlerts: checked})}
              disabled={!settings.notifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="achievement-alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Achievement notifications
            </Label>
            <Switch
              id="achievement-alerts"
              checked={preferences.achievementAlerts}
              onCheckedChange={(checked) => updatePreferences({...preferences, achievementAlerts: checked})}
              disabled={!settings.notifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="friend-activity" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Friend activity updates
            </Label>
            <Switch
              id="friend-activity"
              checked={preferences.friendActivity}
              onCheckedChange={(checked) => updatePreferences({...preferences, friendActivity: checked})}
              disabled={!settings.notifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
