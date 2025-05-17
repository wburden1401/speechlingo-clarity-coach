
import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState, Category, Lesson, FeedbackResult, User } from "@/types";
import { mockUser, mockCategories } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";

interface AppContextProps {
  state: AppState;
  user: User;
  categories: Category[];
  setActiveTab: (tab: AppState["activeTab"]) => void;
  selectCategory: (category: Category | null) => void;
  selectLesson: (lesson: Lesson | null) => void;
  startLesson: () => void;
  endLesson: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setFeedbackResult: (result: FeedbackResult | null) => void;
  getRandomLesson: () => { category: Category; lesson: Lesson } | null;
  updateUser: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User>(mockUser);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [state, setState] = useState<AppState>({
    activeTab: "home",
    selectedCategory: null,
    selectedLesson: null,
    isLessonActive: false,
    isRecordingPermissionGranted: false,
    recordingState: {
      isRecording: false,
      duration: 0,
      audioBlob: null,
    },
    feedbackResult: null,
    isLoading: false,
  });

  // Initialize permissions check
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  // Check for microphone permission
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setState((prev) => ({
        ...prev,
        isRecordingPermissionGranted: true,
      }));
      
      // Clean up
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Microphone permission denied:", error);
      setState((prev) => ({
        ...prev,
        isRecordingPermissionGranted: false,
      }));
      toast({
        title: "Microphone Access Required",
        description: "Please grant microphone permissions to use the recording features.",
        variant: "destructive",
      });
    }
  };

  const setActiveTab = (tab: AppState["activeTab"]) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const selectCategory = (category: Category | null) => {
    setState((prev) => ({ ...prev, selectedCategory: category }));
  };

  const selectLesson = (lesson: Lesson | null) => {
    setState((prev) => ({ ...prev, selectedLesson: lesson }));
  };

  const startLesson = () => {
    setState((prev) => ({ ...prev, isLessonActive: true }));
  };

  const endLesson = () => {
    setState((prev) => ({ 
      ...prev, 
      isLessonActive: false,
      feedbackResult: null,
      recordingState: {
        isRecording: false,
        duration: 0,
        audioBlob: null,
      }
    }));
  };

  const startRecording = () => {
    setState((prev) => ({
      ...prev,
      recordingState: {
        ...prev.recordingState,
        isRecording: true,
      },
    }));
  };

  const stopRecording = () => {
    setState((prev) => ({
      ...prev,
      recordingState: {
        ...prev.recordingState,
        isRecording: false,
      },
      isLoading: true,
    }));

    // Simulate processing delay
    setTimeout(() => {
      const mockFeedback: FeedbackResult = {
        score: Math.floor(Math.random() * 30) + 70, // 70-99
        positive: "Great structure and confident delivery!",
        improvement: "You said 'um' 5 times. Try replacing fillers with short pauses.",
        xp: Math.floor(Math.random() * 10) + 8, // 8-17
      };

      setState((prev) => ({
        ...prev,
        feedbackResult: mockFeedback,
        isLoading: false,
      }));

      // Update user XP
      updateUser({
        xp: user.xp + mockFeedback.xp,
        totalLearningTime: user.totalLearningTime + Math.ceil(prev.recordingState.duration / 60),
      });
    }, 2000);
  };

  const setFeedbackResult = (result: FeedbackResult | null) => {
    setState((prev) => ({ ...prev, feedbackResult: result }));
  };

  const getRandomLesson = () => {
    // Filter to categories available at user's level
    const availableCategories = categories.filter(c => c.requiredLevel <= user.level);
    
    if (availableCategories.length === 0) return null;
    
    // Pick a random category
    const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    
    // Pick a random lesson from that category
    const availableLessons = randomCategory.lessons.filter(l => l.level <= user.level);
    
    if (availableLessons.length === 0) return null;
    
    const randomLesson = availableLessons[Math.floor(Math.random() * availableLessons.length)];
    
    return { category: randomCategory, lesson: randomLesson };
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const value: AppContextProps = {
    state,
    user,
    categories,
    setActiveTab,
    selectCategory,
    selectLesson,
    startLesson,
    endLesson,
    startRecording,
    stopRecording,
    setFeedbackResult,
    getRandomLesson,
    updateUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
