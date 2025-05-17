
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  country: string;
  language: string;
  birthday: string;
  occupation: string;
  reason: string;
  level: number;
  xp: number;
  streak: number;
  totalLearningTime: number;
  dailyGoalMinutes: number;
  referrals: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  requiredLevel: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  prompt: string;
  focusArea: string;
  durationSeconds: number;
  level: number;
  isCompleted: boolean;
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

export interface FeedbackResult {
  score: number;
  positive: string;
  improvement: string;
  xp: number;
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  audioBlob: Blob | null;
}

export interface AppState {
  activeTab: "home" | "learn" | "friends" | "progress" | "profile";
  selectedCategory: Category | null;
  selectedLesson: Lesson | null;
  isLessonActive: boolean;
  isRecordingPermissionGranted: boolean;
  recordingState: RecordingState;
  feedbackResult: FeedbackResult | null;
  isLoading: boolean;
}
