
import { getUserSettings, getNotificationPreferences, NotificationPreferences } from "@/lib/localStorage";

// Define the NotificationAction interface
interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export type NotificationType = 'streakReminder' | 'practiceReminder' | 'achievement' | 'friendActivity';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export const scheduleNotification = (type: NotificationType, time: string, options: NotificationOptions): void => {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  
  const scheduledTime = new Date(now);
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  // If the scheduled time is in the past, set it for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const timeUntilNotification = scheduledTime.getTime() - now.getTime();
  
  setTimeout(() => {
    sendNotification(type, options);
  }, timeUntilNotification);
};

export const sendNotification = (type: NotificationType, options: NotificationOptions): void => {
  const settings = getUserSettings();
  const preferences = getNotificationPreferences();
  
  if (!settings.notifications) {
    return;
  }
  
  if (!shouldSendNotification(type, preferences)) {
    return;
  }
  
  // Request permission if not granted
  requestNotificationPermission().then(granted => {
    if (!granted) return;
    
    // Create and show notification
    try {
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  });
};

export const shouldSendNotification = (type: NotificationType, preferences: NotificationPreferences): boolean => {
  switch (type) {
    case 'streakReminder':
      return preferences.streakAlerts;
    case 'practiceReminder':
      return preferences.dailyReminders;
    case 'achievement':
      return preferences.achievementAlerts;
    case 'friendActivity':
      return preferences.friendActivity;
    default:
      return true;
  }
};

export const scheduleDailyReminder = (): void => {
  const settings = getUserSettings();
  
  if (settings.notifications) {
    scheduleNotification('practiceReminder', settings.reminderTime, {
      title: 'Time to Practice!',
      body: 'Keep your streak going by completing your daily practice session',
      tag: 'daily-reminder'
    });
  }
};

export const scheduleStreakReminder = (currentStreak: number): void => {
  const preferences = getNotificationPreferences();
  
  if (preferences.streakAlerts) {
    // Schedule a reminder at 8 PM if user hasn't practiced today
    scheduleNotification('streakReminder', '20:00', {
      title: 'Streak at Risk!',
      body: `Don't break your ${currentStreak} day streak. Take a few minutes to practice today.`,
      tag: 'streak-reminder',
      requireInteraction: true
    });
  }
};

export const sendAchievementNotification = (achievementTitle: string, description: string): void => {
  sendNotification('achievement', {
    title: '🏆 Achievement Unlocked!',
    body: `${achievementTitle}: ${description}`,
    tag: `achievement-${achievementTitle.toLowerCase().replace(/\s+/g, '-')}`,
  });
};

export const setupInitialNotifications = async (): Promise<void> => {
  const settings = getUserSettings();
  
  if (settings.notifications) {
    const permissionGranted = await requestNotificationPermission();
    
    if (permissionGranted) {
      scheduleDailyReminder();
    }
  }
};
