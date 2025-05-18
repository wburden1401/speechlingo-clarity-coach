
import React, { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Flame, Book, Trophy, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function Onboarding() {
  const { user, updateUser } = useAppContext();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(isAuthenticated && (!user.dailyGoalMinutes || !user.reason));
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    goal: user.dailyGoalMinutes || 10,
    reason: user.reason || "Improve public speaking"
  });
  
  const totalSteps = 3;
  
  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Save user data and close
      updateUser({
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
    return false;
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Welcome to SpeechLingo!</h2>
            <p className="text-muted-foreground">Let's set up your practice profile.</p>
            
            <div className="py-4 flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mic className="h-8 w-8 text-primary" />
              </div>
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
        
      default:
        return null;
    }
  };
  
  if (!isAuthenticated || !open) return null;
  
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
