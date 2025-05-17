
import { useAppContext } from "@/contexts/AppContext";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickLessonButton() {
  const { getRandomLesson, selectCategory, selectLesson, setActiveTab } = useAppContext();
  
  const handleRandomLesson = () => {
    const random = getRandomLesson();
    if (random) {
      selectCategory(random.category);
      selectLesson(random.lesson);
      setActiveTab("learn");
    }
  };
  
  return (
    <Button 
      onClick={handleRandomLesson}
      className="w-full bg-lingo-blue hover:bg-lingo-blue/90 text-white flex items-center justify-center gap-2 py-6"
    >
      <Mic className="h-5 w-5" />
      <span>Try a Random Lesson</span>
    </Button>
  );
}
