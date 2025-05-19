
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
  referrals: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image?: string;
  requiredLevel: number;
  lessons: Lesson[];
  color: string;
  icon: string;
}

export interface Lesson {
  id: string;
  name?: string;
  title?: string;  // Added title as an optional property
  description: string;
  content?: string;
  level: number;
  isCompleted: boolean;
  durationSeconds: number;
  focusArea: string;
  prompt: string;
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  streak: number;
  lastActive: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  timestamp: string;
}
