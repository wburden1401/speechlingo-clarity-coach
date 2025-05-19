
import { User } from "@/types";
import { sendAchievementNotification } from "@/lib/notificationService";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  xpReward: number;
  level: number;
  category: "beginner" | "intermediate" | "advanced" | "social";
}

interface AchievementProgress {
  id: string;
  progress: number;
  isUnlocked: boolean;
  dateUnlocked?: string;
}

/**
 * Get all achievement definitions
 */
export const getAchievements = (): Achievement[] => {
  return [
    {
      id: "first_lesson",
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      color: "text-blue-500",
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 10,
      level: 1,
      category: "beginner"
    },
    {
      id: "three_day_streak",
      title: "Getting in the Rhythm",
      description: "Maintain a 3-day practice streak",
      icon: "🔥",
      color: "text-orange-500", 
      isUnlocked: false,
      progress: 0,
      maxProgress: 3,
      xpReward: 15,
      level: 1,
      category: "beginner"
    },
    {
      id: "complete_category",
      title: "Category Master",
      description: "Complete all lessons in a category",
      icon: "🏅",
      color: "text-purple-500",
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 30,
      level: 2,
      category: "intermediate"
    },
    {
      id: "perfect_clarity",
      title: "Crystal Clear",
      description: "Achieve 95%+ clarity score in a lesson",
      icon: "💎",
      color: "text-cyan-500",
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 25,
      level: 3, 
      category: "intermediate"
    },
    {
      id: "zero_fillers",
      title: "Fluent Speaker",
      description: "Complete a lesson with zero filler words",
      icon: "🎤",
      color: "text-green-500",
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 30,
      level: 4,
      category: "advanced"
    },
    {
      id: "seven_day_streak",
      title: "Dedication",
      description: "Maintain a 7-day practice streak",
      icon: "⚡",
      color: "text-amber-500",
      isUnlocked: false,
      progress: 0,
      maxProgress: 7,
      xpReward: 50,
      level: 2,
      category: "intermediate"
    },
    {
      id: "refer_friend",
      title: "Spread the Word",
      description: "Invite a friend to join SpeechLingo",
      icon: "👥",
      color: "text-indigo-500",
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
      xpReward: 20,
      level: 1,
      category: "social"
    },
    {
      id: "practice_time",
      title: "Practice Makes Perfect",
      description: "Spend a total of 60 minutes practicing",
      icon: "⏱️",
      color: "text-rose-500",
      isUnlocked: false,
      progress: 0,
      maxProgress: 60,
      xpReward: 40,
      level: 3,
      category: "intermediate"
    },
    {
      id: "all_categories",
      title: "Complete Collection",
      description: "Try at least one lesson from each category",
      icon: "🌟",
      color: "text-yellow-500",
      isUnlocked: false,
      progress: 0, 
      maxProgress: 5,
      xpReward: 50,
      level: 5,
      category: "advanced"
    }
  ];
};

/**
 * Get user's achievement progress
 */
export const getUserAchievementProgress = (user: User): Achievement[] => {
  const allAchievements = getAchievements();
  
  // Load user achievement progress from localStorage
  const savedProgress = localStorage.getItem('speechlingo-achievements');
  const userProgress: AchievementProgress[] = savedProgress ? JSON.parse(savedProgress) : [];
  
  // Map achievements with user progress
  return allAchievements.map(achievement => {
    const progress = userProgress.find(p => p.id === achievement.id);
    
    if (progress) {
      return {
        ...achievement,
        progress: progress.progress,
        isUnlocked: progress.isUnlocked
      };
    }
    
    // Set default progress based on user stats
    let currentProgress = 0;
    
    switch (achievement.id) {
      case "three_day_streak":
        currentProgress = Math.min(user.streak, achievement.maxProgress);
        break;
      case "seven_day_streak":
        currentProgress = Math.min(user.streak, achievement.maxProgress);
        break;
      case "practice_time":
        currentProgress = Math.min(user.totalLearningTime, achievement.maxProgress);
        break;
      case "refer_friend":
        currentProgress = Math.min(user.referrals, achievement.maxProgress);
        break;
    }
    
    return {
      ...achievement,
      progress: currentProgress,
      isUnlocked: false
    };
  });
};

/**
 * Update progress for a specific achievement
 */
export const updateAchievementProgress = (
  achievementId: string, 
  progressValue: number,
  forceComplete: boolean = false
): Achievement | null => {
  const allAchievements = getAchievements();
  const achievement = allAchievements.find(a => a.id === achievementId);
  
  if (!achievement) return null;
  
  // Load current progress
  const savedProgress = localStorage.getItem('speechlingo-achievements');
  const userProgress: AchievementProgress[] = savedProgress ? JSON.parse(savedProgress) : [];
  
  // Find existing progress or create new entry
  let achievementProgress = userProgress.find(p => p.id === achievementId);
  
  if (!achievementProgress) {
    achievementProgress = {
      id: achievementId,
      progress: 0,
      isUnlocked: false
    };
    userProgress.push(achievementProgress);
  }
  
  // Skip if already unlocked
  if (achievementProgress.isUnlocked && !forceComplete) {
    return { ...achievement, ...achievementProgress };
  }
  
  // Update progress
  achievementProgress.progress = forceComplete 
    ? achievement.maxProgress 
    : Math.min(achievementProgress.progress + progressValue, achievement.maxProgress);
  
  // Check if achievement is now completed
  if (achievementProgress.progress >= achievement.maxProgress && !achievementProgress.isUnlocked) {
    achievementProgress.isUnlocked = true;
    achievementProgress.dateUnlocked = new Date().toISOString();
    
    // Send notification
    sendAchievementNotification(achievement.title, achievement.description);
    
    // Return the updated achievement for the popup
    const updatedAchievement = { ...achievement, ...achievementProgress };
    
    // Save progress
    localStorage.setItem('speechlingo-achievements', JSON.stringify(userProgress));
    
    return updatedAchievement;
  }
  
  // Save progress
  localStorage.setItem('speechlingo-achievements', JSON.stringify(userProgress));
  
  return { ...achievement, ...achievementProgress };
};

/**
 * Trigger achievement checks based on events
 */
export const checkForAchievements = (user: User, event: string, payload?: any): Achievement | null => {
  switch (event) {
    case "lesson_complete":
      // Check for first lesson achievement
      let achievement = updateAchievementProgress("first_lesson", 1);
      if (achievement?.isUnlocked) return achievement;
      
      // Check for perfect clarity
      if (payload?.clarity && payload.clarity >= 95) {
        achievement = updateAchievementProgress("perfect_clarity", 1);
        if (achievement?.isUnlocked) return achievement;
      }
      
      // Check for zero fillers
      if (payload?.fillerWordCount === 0) {
        achievement = updateAchievementProgress("zero_fillers", 1);
        if (achievement?.isUnlocked) return achievement;
      }
      
      break;
      
    case "streak_update":
      // Check for streak achievements
      if (user.streak >= 3) {
        achievement = updateAchievementProgress("three_day_streak", user.streak, true);
        if (achievement?.isUnlocked) return achievement;
      }
      
      if (user.streak >= 7) {
        achievement = updateAchievementProgress("seven_day_streak", user.streak, true);
        if (achievement?.isUnlocked) return achievement;
      }
      
      break;
      
    case "category_complete":
      achievement = updateAchievementProgress("complete_category", 1);
      if (achievement?.isUnlocked) return achievement;
      break;
      
    case "practice_time_update":
      achievement = updateAchievementProgress("practice_time", user.totalLearningTime, true);
      if (achievement?.isUnlocked) return achievement;
      break;
      
    case "referral_added":
      achievement = updateAchievementProgress("refer_friend", 1);
      if (achievement?.isUnlocked) return achievement;
      break;
  }
  
  return null;
};
