
import React, { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Flame, Book, Trophy, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const { user, updateUser } = useAppContext();
  const [open, setOpen] = useState(!user.name || user.name === "Guest User");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: user.name !== "Guest User" ? user.name : "",
    goal: user.dailyGoalMinutes,
    reason: user.reason || "Improve public speaking"
  });
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Save user data and close
      updateUser({
        name: formData.name || "Friend",
        dailyGoalMinutes: formData.goal,
        reason: formData.reason
      });
      setOpen(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const isNextDisabled = () => {
    if (step === 0 && !formData.name) return true;
    return false;
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Welcome to SpeechLingo!</h2>
            <p className="text-muted-foreground">Let's get to know you better.</p>
            
            <div className="py-4">
              <label className="block text-sm font-medium mb-1">What's your name?</label>
              <Input
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-center"
                autoFocus
              />
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold">Why are you here?</h2>
            <p className="text-muted-foreground">Select your main goal</p>
            
            <div className="grid grid-cols-2 gap-3 py-4">
              {[
                { reason: "Improve public speaking", icon: <Mic className="h-6 w-6" /> },
                { reason: "Reduce filler words", icon: <Book className="h-6 w-6" /> },
                { reason: "Daily practice", icon: <Flame className="h-6 w-6" /> },
                { reason: "Professional growth", icon: <Trophy className="h-6 w-6" /> }
              ].map((item) => (
                <Card 
                  key={item.reason}
                  className={cn(
                    "p-3 flex flex-col items-center gap-2 cursor-pointer hover:border-primary transition-colors",
                    formData.reason === item.reason ? "border-2 border-primary" : ""
                  )}
                  onClick={() => setFormData(prev => ({ ...prev, reason: item.reason }))}
                >
                  {item.icon}
                  <span className="text-xs text-center">{item.reason}</span>
                </Card>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold">Set your daily goal</h2>
            <p className="text-muted-foreground">How many minutes would you like to practice each day?</p>
            
            <div className="py-4">
              <div className="flex items-center justify-center gap-3">
                {[5, 10, 15, 20].map(minutes => (
                  <Button
                    key={minutes}
                    variant={formData.goal === minutes ? "default" : "outline"}
                    className={cn(
                      "h-12 w-12",
                      formData.goal === minutes ? "bg-primary" : ""
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, goal: minutes }))}
                  >
                    {minutes}
                  </Button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Minutes per day</p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold">You're all set!</h2>
            <p className="text-muted-foreground">Here's what you can do in SpeechLingo:</p>
            
            <div className="py-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-lingo-blue/20 flex items-center justify-center flex-shrink-0">
                  <Book className="h-5 w-5 text-lingo-blue" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Learn speaking skills</p>
                  <p className="text-xs text-muted-foreground">Practice with guided exercises</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-lingo-green/20 flex items-center justify-center flex-shrink-0">
                  <Mic className="h-5 w-5 text-lingo-green" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Record practice sessions</p>
                  <p className="text-xs text-muted-foreground">Get instant feedback on your speech</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-lingo-orange/20 flex items-center justify-center flex-shrink-0">
                  <Flame className="h-5 w-5 text-lingo-orange" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Build a daily streak</p>
                  <p className="text-xs text-muted-foreground">Stay consistent with your practice</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (!open) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm p-6 rounded-xl">
        {renderStep()}
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-2 h-2 rounded-full",
                  i === step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="gap-1"
          >
            {step === totalSteps - 1 ? "Get Started" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
