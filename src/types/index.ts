export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  totalLearningTime: number;
  completedLessons: number;
  dailyGoalMinutes: number;
  reason?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  requiredLevel: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  content: string;
  level: number;
  isCompleted: boolean;
}

export interface FeedbackResult {
  score: number;
  positive: string;
  improvement: string;
  xp: number;
}

export interface AppState {
  activeTab: "home" | "learn" | "friends" | "progress" | "profile";
  selectedCategory: Category | null;
  selectedLesson: Lesson | null;
  isLessonActive: boolean;
  isRecordingPermissionGranted: boolean;
  recordingState: {
    isRecording: boolean;
    duration: number;
    audioBlob: Blob | null;
  };
  feedbackResult: FeedbackResult | null;
  isLoading: boolean;
}
