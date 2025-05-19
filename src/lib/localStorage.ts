/**
 * Local storage utility for persisting user data
 */

import { User, Category, Lesson } from "@/types";

const STORAGE_KEYS = {
  USER: "speechlingo-user",
  COMPLETED_LESSONS: "speechlingo-completed-lessons",
  LAST_ACTIVE: "speechlingo-last-active",
  SETTINGS: "speechlingo-settings",
  OFFLINE_RECORDINGS: "speechlingo-offline-recordings",
  NOTIFICATION_PREFERENCES: "speechlingo-notifications",
  PENDING_SYNCS: "speechlingo-pending-syncs",
  NETWORK_STATUS: "speechlingo-network-status"
};

export type UserSettings = {
  dailyGoalMinutes: number;
  notifications: boolean;
  theme: "light" | "dark" | "system";
  reminderTime: string; // Time of day for practice reminders (HH:MM format)
  soundEffects: boolean;
};

export type NotificationPreferences = {
  dailyReminders: boolean;
  streakAlerts: boolean;
  achievementAlerts: boolean;
  friendActivity: boolean;
};

export type OfflineRecording = {
  id: string;
  blob: Blob;
  lessonId: string | null;
  categoryId: string | null;
  timestamp: string;
  duration: number;
  pendingSync: boolean;
};

/**
 * Save user data to local storage
 */
export const saveUserData = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Load user data from local storage
 */
export const loadUserData = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error("Failed to parse user data:", error);
    return null;
  }
};

/**
 * Save completed lesson
 */
export const saveCompletedLesson = (categoryId: string, lessonId: string): void => {
  const completedLessons = getCompletedLessons();
  
  if (!completedLessons[categoryId]) {
    completedLessons[categoryId] = [];
  }
  
  if (!completedLessons[categoryId].includes(lessonId)) {
    completedLessons[categoryId].push(lessonId);
    localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(completedLessons));
    
    // Add to pending sync queue if offline
    if (!isOnline()) {
      addPendingSync('completedLesson', { categoryId, lessonId });
    }
  }
};

/**
 * Get all completed lessons
 */
export const getCompletedLessons = (): Record<string, string[]> => {
  const completedLessons = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
  if (!completedLessons) return {};
  
  try {
    return JSON.parse(completedLessons) as Record<string, string[]>;
  } catch (error) {
    console.error("Failed to parse completed lessons:", error);
    return {};
  }
};

/**
 * Update streak data based on last activity
 */
export const updateStreak = (user: User): User => {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE);
  
  if (!lastActive) {
    // First time user
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, today);
    return user;
  }
  
  if (lastActive === today) {
    // Already active today, no change needed
    return user;
  }
  
  // Check if last activity was yesterday
  const lastActiveDate = new Date(lastActive);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const updatedUser = { ...user };
  
  if (lastActiveDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
    // Streak continues
    updatedUser.streak += 1;
  } else {
    // Streak broken
    updatedUser.streak = 1; // Reset to 1 (today)
  }
  
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE, today);
  saveUserData(updatedUser);
  
  return updatedUser;
};

/**
 * Save user settings
 */
export const saveUserSettings = (settings: UserSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

/**
 * Get user settings
 */
export const getUserSettings = (): UserSettings => {
  const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const defaultSettings: UserSettings = {
    dailyGoalMinutes: 10,
    notifications: true,
    theme: "light",
    reminderTime: "08:00",
    soundEffects: true
  };
  
  if (!settings) return defaultSettings;
  
  try {
    return { ...defaultSettings, ...JSON.parse(settings) as Partial<UserSettings> };
  } catch (error) {
    console.error("Failed to parse user settings:", error);
    return defaultSettings;
  }
};

/**
 * Save notification preferences
 */
export const saveNotificationPreferences = (preferences: NotificationPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(preferences));
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = (): NotificationPreferences => {
  const preferences = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
  const defaultPreferences: NotificationPreferences = {
    dailyReminders: true,
    streakAlerts: true,
    achievementAlerts: true,
    friendActivity: false
  };
  
  if (!preferences) return defaultPreferences;
  
  try {
    return { ...defaultPreferences, ...JSON.parse(preferences) as Partial<NotificationPreferences> };
  } catch (error) {
    console.error("Failed to parse notification preferences:", error);
    return defaultPreferences;
  }
};

/**
 * Save an offline recording
 */
export const saveOfflineRecording = (recording: OfflineRecording): void => {
  const recordings = getOfflineRecordings();
  recordings.push(recording);
  localStorage.setItem(STORAGE_KEYS.OFFLINE_RECORDINGS, JSON.stringify(recordings));
};

/**
 * Get all offline recordings
 */
export const getOfflineRecordings = (): OfflineRecording[] => {
  const recordings = localStorage.getItem(STORAGE_KEYS.OFFLINE_RECORDINGS);
  if (!recordings) return [];
  
  try {
    return JSON.parse(recordings) as OfflineRecording[];
  } catch (error) {
    console.error("Failed to parse offline recordings:", error);
    return [];
  }
};

/**
 * Remove an offline recording
 */
export const removeOfflineRecording = (id: string): void => {
  const recordings = getOfflineRecordings().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.OFFLINE_RECORDINGS, JSON.stringify(recordings));
};

/**
 * Add a pending sync operation
 */
export const addPendingSync = (type: string, data: any): void => {
  const pendingSyncs = getPendingSyncs();
  pendingSyncs.push({
    id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    type,
    data,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.PENDING_SYNCS, JSON.stringify(pendingSyncs));
};

/**
 * Get all pending sync operations
 */
export const getPendingSyncs = (): Array<{id: string, type: string, data: any, timestamp: string}> => {
  const syncs = localStorage.getItem(STORAGE_KEYS.PENDING_SYNCS);
  if (!syncs) return [];
  
  try {
    return JSON.parse(syncs) as Array<{id: string, type: string, data: any, timestamp: string}>;
  } catch (error) {
    console.error("Failed to parse pending syncs:", error);
    return [];
  }
};

/**
 * Remove a pending sync operation
 */
export const removePendingSync = (id: string): void => {
  const syncs = getPendingSyncs().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.PENDING_SYNCS, JSON.stringify(syncs));
};

/**
 * Set the online/offline status
 */
export const setOnlineStatus = (online: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.NETWORK_STATUS, online.toString());
};

/**
 * Check if app is online
 */
export const isOnline = (): boolean => {
  const status = localStorage.getItem(STORAGE_KEYS.NETWORK_STATUS);
  if (status === null) return navigator.onLine;
  return status === 'true';
};

/**
 * Clear all stored data (for logout)
 */
export const clearStoredData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.OFFLINE_RECORDINGS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
  localStorage.removeItem(STORAGE_KEYS.PENDING_SYNCS);
  // Keep last active date and network status for analytics purposes
};
