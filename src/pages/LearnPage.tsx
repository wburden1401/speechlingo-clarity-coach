import { useAppContext } from "@/contexts/AppContext";
import { ArrowLeft, Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RecordingButton } from "@/components/RecordingButton";
import { LessonFeedback } from "@/components/LessonFeedback";
import { Card } from "@/components/ui/card";

function LearnPage() {
  const { state, categories, user, selectCategory, selectLesson, startLesson } = useAppContext();
  const { selectedCategory, selectedLesson, isLessonActive, feedbackResult } = state;

  // Show category list if no category is selected
  if (!selectedCategory) {
    return (
      <div className="space-y-6 pt-6 pb-24">
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-bold">Learn</h1>
          <p className="text-muted-foreground">
            Choose a category to improve your speaking skills
          </p>
        </div>

        <div className="px-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((category) => {
            const isLocked = category.requiredLevel > user.level;
            
            return (
              <Card
                key={category.id}
                className={cn(
                  "category-card cursor-pointer",
                  isLocked && "opacity-70"
                )}
                onClick={() => {
                  if (!isLocked) {
                    selectCategory(category);
                  }
                }}
              >
                <div className="category-image h-28" style={{ backgroundColor: `var(--${category.color})` }}>
                  <div className="flex items-center justify-center h-full text-3xl">
                    {category.icon}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold">{category.name}</h2>
                    {isLocked && (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isLocked
                      ? `Unlocks at level ${category.requiredLevel}`
                      : category.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Show lesson list if no lesson is selected
  if (!selectedLesson) {
    return (
      <div className="space-y-6 pt-6 pb-24">
        <div className="px-4 mb-4">
          <Button
            variant="ghost"
            className="mb-4 pl-0 flex items-center"
            onClick={() => selectCategory(null)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Categories
          </Button>
          
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2 text-3xl">{selectedCategory.icon}</span>
            {selectedCategory.name}
          </h1>
          <p className="text-muted-foreground">{selectedCategory.description}</p>
        </div>

        <div className="px-4 space-y-3">
          {selectedCategory.lessons.map((lesson) => {
            const isLocked = lesson.level > user.level;
            
            return (
              <div
                key={lesson.id}
                className={cn(
                  "lesson-card relative cursor-pointer",
                  isLocked && "opacity-70"
                )}
                onClick={() => {
                  if (!isLocked) {
                    selectLesson(lesson);
                  }
                }}
              >
                <div className="level-indicator">Level {lesson.level}</div>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0",
                    `${selectedCategory.color}/20`
                  )}>
                    {isLocked ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Play className={cn("h-5 w-5", selectedCategory.color)} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {isLocked
                        ? `Unlocks at level ${lesson.level}`
                        : `${lesson.durationSeconds}s • ${lesson.focusArea}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Show lesson view
  return (
    <div className="space-y-6 pt-6 pb-24">
      <div className="px-4 mb-4">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center"
          onClick={() => selectLesson(null)}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to {selectedCategory.name}
        </Button>
        
        <h1 className="text-2xl font-bold">{selectedLesson.title}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-muted-foreground text-sm">
            {selectedLesson.durationSeconds}s
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            {selectedCategory.name}
          </span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            Level {selectedLesson.level}
          </span>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-card rounded-xl border border-border p-4 mb-6">
          <h2 className="font-semibold mb-2">Focus: {selectedLesson.focusArea}</h2>
          <p className="text-muted-foreground mb-4">
            {selectedLesson.description}
          </p>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="italic">{selectedLesson.prompt}</p>
          </div>
        </div>
        
        {!isLessonActive && !feedbackResult && (
          <Button 
            className="w-full bg-lingo-blue hover:bg-lingo-blue/90"
            onClick={startLesson}
          >
            Start Exercise
          </Button>
        )}
        
        {isLessonActive && !feedbackResult && (
          <div className="animate-fade-in">
            <RecordingButton maxDuration={selectedLesson.durationSeconds} />
          </div>
        )}
        
        {feedbackResult && <LessonFeedback />}
      </div>
    </div>
  );
}

export default LearnPage;
