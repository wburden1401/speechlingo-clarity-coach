
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Clock, MicOff, MessageCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function LessonFeedback() {
  const { state, endLesson, user, audioAnalysisResult } = useAppContext();
  const { feedbackResult } = state;
  const { toast } = useToast();

  if (!feedbackResult) {
    return null;
  }

  const handleFinish = () => {
    toast({
      title: "Practice Completed",
      description: `You earned +${feedbackResult.xp} XP!`,
      duration: 3000,
    });
    endLesson();
  };

  const handleTryAgain = () => {
    endLesson();
    // Wait for animation to complete
    setTimeout(() => {
      const lessonElement = document.querySelector(".lesson-button");
      if (lessonElement) {
        (lessonElement as HTMLElement).click();
      }
    }, 300);
  };

  return (
    <div className="flex flex-col animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your Performance</h2>
          <span className="text-lg font-semibold">{feedbackResult.score}/100</span>
        </div>
        <Progress value={feedbackResult.score} className="h-3 mb-2" />
        
        <div className="mt-4 space-y-4">
          <Card className="p-3 bg-green-50 border-green-100">
            <div className="flex">
              <BadgeCheck className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-800">What went well</p>
                <p className="text-sm text-green-700">{feedbackResult.positive}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-amber-50 border-amber-100">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">For improvement</p>
                <p className="text-sm text-amber-700">{feedbackResult.improvement}</p>
              </div>
            </div>
          </Card>
          
          {audioAnalysisResult && (
            <>
              <div className="mt-6">
                <h3 className="font-medium mb-2">Detailed Analysis</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Pace</span>
                    </div>
                    <p className="font-medium">{audioAnalysisResult.paceWordsPerMinute} WPM</p>
                    <Progress value={Math.min(100, (audioAnalysisResult.paceWordsPerMinute / 180) * 100)} className="h-1 mt-2" />
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center">
                      <MicOff className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Filler words</span>
                    </div>
                    <p className="font-medium">{audioAnalysisResult.fillerWordCount}</p>
                    <Progress value={Math.max(0, 100 - audioAnalysisResult.fillerWordCount * 10)} className="h-1 mt-2" />
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Speaking time</span>
                    </div>
                    <p className="font-medium">{audioAnalysisResult.speakingTime}s</p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center">
                      <BadgeCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Clarity</span>
                    </div>
                    <p className="font-medium">{audioAnalysisResult.clarity}/100</p>
                    <Progress value={audioAnalysisResult.clarity} className="h-1 mt-2" />
                  </div>
                </div>
              </div>
              
              {audioAnalysisResult.transcript && (
                <div className="mt-4">
                  <h3 className="font-medium text-sm mb-2">Transcript</h3>
                  <Card className="p-3 bg-muted/50">
                    <p className="text-sm">{audioAnalysisResult.transcript}</p>
                  </Card>
                </div>
              )}
            </>
          )}
          
          <div className="flex items-center justify-between space-x-3">
            <p className="text-sm text-primary font-medium">+ {feedbackResult.xp} XP</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={handleTryAgain}>
          Practice Again
        </Button>
        <Button className="flex-1 bg-lingo-green" onClick={handleFinish}>
          Complete
        </Button>
      </div>
    </div>
  );
}
