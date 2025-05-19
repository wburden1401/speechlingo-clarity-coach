
import React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getUserSettings, saveUserSettings } from "@/lib/localStorage";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";

export function AppSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(getUserSettings());
  
  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
    });
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Customize your experience and preferences
        </p>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color theme
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={settings.theme === "light" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => updateSettings({...settings, theme: "light"})}
                >
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </Button>
                
                <Button
                  variant={settings.theme === "dark" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => updateSettings({...settings, theme: "dark"})}
                >
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </Button>
                
                <Button
                  variant={settings.theme === "system" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => updateSettings({...settings, theme: "system"})}
                >
                  <div className="h-5 w-5 bg-gradient-to-bl from-black to-white rounded-full" />
                  <span>System</span>
                </Button>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  {settings.soundEffects ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  <Label htmlFor="sound-effects">Sound effects</Label>
                </div>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => updateSettings({...settings, soundEffects: checked})}
                />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="p-4">
            <NotificationSettings />
          </Card>
        </TabsContent>
        
        <TabsContent value="practice" className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Daily Goal</h3>
                <p className="text-sm text-muted-foreground">
                  Set your daily practice goal
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="daily-goal">Minutes per day</Label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20, 30].map(minutes => (
                    <Button
                      key={minutes}
                      variant={settings.dailyGoalMinutes === minutes ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => updateSettings({...settings, dailyGoalMinutes: minutes})}
                    >
                      {minutes}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
