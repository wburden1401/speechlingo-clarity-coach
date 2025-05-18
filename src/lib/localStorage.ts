/**
 * Local storage utility for persisting user data
 */

import { User, Category, Lesson } from "@/types";

const STORAGE_KEYS = {
  USER: "speechlingo-user",
  COMPLETED_LESSONS: "speechlingo-completed-lessons",
  LAST_ACTIVE: "speechlingo-last-active",
  SETTINGS: "speechlingo-settings"
};

export type UserSettings = {
  dailyGoalMinutes: number;
  notifications: boolean;
  theme: "light" | "dark" | "system";
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
    theme: "light"
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
 * Clear all stored data (for logout)
 */
export const clearStoredData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
  // Keep last active date for analytics purposes
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
};
