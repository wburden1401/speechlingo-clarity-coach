
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LessonFeedback() {
  const { state, endLesson, selectLesson, setActiveTab } = useAppContext();
  const { feedbackResult } = state;
  
  if (!feedbackResult) return null;
  
  const handleContinue = () => {
    // Here you would normally mark the lesson as complete
    // Then either load the next lesson or go back to category view
    endLesson();
  };
  
  const handleGoBack = () => {
    endLesson();
    selectLesson(null);
  };
  
  return (
    <div className="animate-fade-in p-4 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex flex-col items-center mb-6">
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-4",
          feedbackResult.score >= 90 ? "bg-lingo-green/20" :
          feedbackResult.score >= 70 ? "bg-lingo-blue/20" : "bg-lingo-orange/20"
        )}>
          <Award className={cn(
            "w-12 h-12",
            feedbackResult.score >= 90 ? "text-lingo-green" :
            feedbackResult.score >= 70 ? "text-lingo-blue" : "text-lingo-orange"
          )} />
        </div>
        
        <h3 className="text-xl font-bold">
          {feedbackResult.score >= 90 ? "Excellent!" :
           feedbackResult.score >= 70 ? "Good Job!" : "Nice Try!"}
        </h3>
        
        <div className="flex items-center mt-2 mb-4">
          <span className="text-2xl font-bold">
            {feedbackResult.score}%
          </span>
          <span className="text-muted-foreground text-sm ml-2">
            Score
          </span>
          <span className="ml-4 px-2 py-1 bg-lingo-blue/20 text-lingo-blue rounded text-sm">
            +{feedbackResult.xp} XP
          </span>
        </div>
        
        <div className="w-full space-y-3">
          <div className="flex p-3 bg-lingo-green/10 rounded-lg">
            <CheckCircle className="w-5 h-5 text-lingo-green mr-2 flex-shrink-0" />
            <p className="text-sm">{feedbackResult.positive}</p>
          </div>
          
          <div className="flex p-3 bg-lingo-orange/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-lingo-orange mr-2 flex-shrink-0" />
            <p className="text-sm">{feedbackResult.improvement}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button onClick={handleContinue} className="bg-lingo-blue hover:bg-lingo-blue/90">
          Continue to Next Lesson
        </Button>
        
        <Button 
          onClick={handleGoBack}
          variant="outline"
          className="border-lingo-blue text-lingo-blue hover:bg-lingo-blue/10"
        >
          Go Back to Learn Dashboard
        </Button>
      </div>
    </div>
  );
}
