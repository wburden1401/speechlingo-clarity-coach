
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { getRecommendations } from "@/lib/analyticsService";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from "lucide-react";

export function PracticeRecommendations() {
  const { user, selectCategory, selectLesson, setActiveTab } = useAppContext();
  
  // Get personalized recommendations
  const recommendations = getRecommendations(user);
  
  const handleStartLesson = (categoryId: string, lessonId: string) => {
    const category = recommendations.find(r => r.categoryId === categoryId)?.category;
    if (!category) return;
    
    const lesson = category.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    selectCategory(category);
    selectLesson(lesson);
    setActiveTab("learn");
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Personalized Recommendations</CardTitle>
        <CardDescription>Based on your practice history and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => (
          <div key={recommendation.id} className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{recommendation.title}</h4>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              {recommendation.lessonId && (
                <Button 
                  variant="link" 
                  className="px-0 h-auto text-xs flex items-center" 
                  onClick={() => handleStartLesson(recommendation.categoryId, recommendation.lessonId)}
                >
                  Practice this skill
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
