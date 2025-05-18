import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState, Category, Lesson, FeedbackResult, User } from "@/types";
import { mockUser, mockCategories } from "@/lib/data";
import { useToast } from "@/components/ui/use-toast";
import { 
  saveUserData, 
  loadUserData, 
  updateStreak, 
  saveCompletedLesson,
  getCompletedLessons
} from "@/lib/localStorage";
import { AudioAnalysisResult } from "@/lib/audioRecorder";
import { useAuth } from "@/contexts/AuthContext";

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
  markLessonComplete: (categoryId: string, lessonId: string) => void;
  audioAnalysisResult: AudioAnalysisResult | null;
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
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User>(currentUser || mockUser);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [audioAnalysisResult, setAudioAnalysisResult] = useState<AudioAnalysisResult | null>(null);
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

  // Update user when auth changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  // Initialize state from local storage
  useEffect(() => {
    const storedUser = loadUserData();
    if (storedUser) {
      // Update streak based on last login
      const userWithUpdatedStreak = updateStreak(storedUser);
      setUser(userWithUpdatedStreak);
    } else {
      // First time user - save mock data to local storage
      saveUserData(mockUser);
    }
    
    // Mark completed lessons from local storage
    const completedLessons = getCompletedLessons();
    if (Object.keys(completedLessons).length > 0) {
      const updatedCategories = categories.map(category => {
        if (completedLessons[category.id]) {
          const updatedLessons = category.lessons.map(lesson => ({
            ...lesson,
            isCompleted: completedLessons[category.id].includes(lesson.id)
          }));
          return { ...category, lessons: updatedLessons };
        }
        return category;
      });
      
      setCategories(updatedCategories);
    }
    
    checkMicrophonePermission();
  }, []);

  // Save user data when it changes
  useEffect(() => {
    saveUserData(user);
  }, [user]);

  // Check for microphone permission
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setState((prev) => ({
        ...prev,
        isRecordingPermissionGranted: true,
      }));
      
      // Clean up
      stream.getTracks().forEach(track => track.stop());
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
    setAudioAnalysisResult(null);
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
    setState((currentState) => ({
      ...currentState,
      recordingState: {
        ...currentState.recordingState,
        isRecording: false,
      },
      isLoading: true,
    }));

    // Simulate processing delay
    setTimeout(() => {
      import('@/lib/audioRecorder').then(({ analyzeAudio }) => {
        // Create mock audio blob if not available
        const audioBlob = state.recordingState.audioBlob || new Blob([], { type: 'audio/webm' });
        
        analyzeAudio(audioBlob).then(analysisResult => {
          setAudioAnalysisResult(analysisResult);
          
          // Use analysis result to generate feedback
          const mockFeedback: FeedbackResult = {
            score: analysisResult.clarity,
            positive: `Great job! ${analysisResult.improvement.general}`,
            improvement: analysisResult.fillerWordCount > 0 
              ? analysisResult.improvement.fillers 
              : analysisResult.improvement.pace,
            xp: Math.floor(analysisResult.clarity / 10) + 5, // 5-15 XP
          };

          setState((currentState) => ({
            ...currentState,
            feedbackResult: mockFeedback,
            isLoading: false,
          }));

          // Store the current state to access for updating user
          const updatedState = { ...state };
          
          // Update user XP and learning time
          updateUser({
            xp: user.xp + mockFeedback.xp,
            totalLearningTime: user.totalLearningTime + Math.ceil(updatedState.recordingState.duration / 60),
          });
          
          // Mark lesson as completed if we're in a lesson
          if (state.selectedCategory && state.selectedLesson) {
            markLessonComplete(state.selectedCategory.id, state.selectedLesson.id);
          }
        });
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
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      saveUserData(updated);
      return updated;
    });
  };
  
  const markLessonComplete = (categoryId: string, lessonId: string) => {
    // Save to local storage
    saveCompletedLesson(categoryId, lessonId);
    
    // Update in-memory state
    setCategories(currentCategories => 
      currentCategories.map(category => {
        if (category.id === categoryId) {
          const updatedLessons = category.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, isCompleted: true };
            }
            return lesson;
          });
          return { ...category, lessons: updatedLessons };
        }
        return category;
      })
    );
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
    markLessonComplete,
    audioAnalysisResult
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
