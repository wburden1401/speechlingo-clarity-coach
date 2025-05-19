
import { User, Category, Lesson } from "@/types";
import { mockCategories } from "@/lib/data";

// Helper to generate random data for demo
const generateRandomData = (count: number, min: number, max: number) => {
  return Array(count).fill(0).map(() => Math.floor(Math.random() * (max - min + 1)) + min);
};

// Helper to get days or months labels based on time range
const getTimeLabels = (timeRange: "week" | "month" | "all") => {
  const now = new Date();
  let labels: string[] = [];
  
  if (timeRange === "week") {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = now.getDay();
    
    // Get labels for past 7 days
    for (let i = 6; i >= 0; i--) {
      const dayIndex = (today - i + 7) % 7;
      labels.push(daysOfWeek[dayIndex]);
    }
  } else if (timeRange === "month") {
    // Get labels for past 30 days (in 5-day groups)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 5));
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
  } else {
    // Get labels for past 6 months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = now.getMonth();
    
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(monthNames[monthIndex]);
    }
  }
  
  return labels;
};

export const getPerformanceData = (timeRange: "week" | "month" | "all") => {
  const dataPoints = timeRange === "week" ? 7 : timeRange === "month" ? 7 : 6;
  
  // Generate random data for demo purposes
  // In a real app, this would come from the user's practice history
  const clarityData = generateRandomData(dataPoints, 60, 95);
  const confidenceData = generateRandomData(dataPoints, 55, 90);
  const paceData = generateRandomData(dataPoints, 65, 100);
  
  // Show improvement trend over time
  clarityData.sort((a, b) => a - b);
  confidenceData.sort((a, b) => a - b);
  
  return {
    clarityData,
    confidenceData,
    paceData,
    labels: getTimeLabels(timeRange),
  };
};

export const getFillerWordsData = (timeRange: "week" | "month" | "all") => {
  // Common filler words
  const fillerWordsLabels = ["um", "uh", "like", "you know", "so", "actually"];
  
  // Generate random data for demo purposes
  // Higher numbers for more common filler words
  const fillerWordsData = [
    Math.floor(Math.random() * 25) + 15, // um (most common)
    Math.floor(Math.random() * 20) + 10, // uh
    Math.floor(Math.random() * 30) + 20, // like (most common)
    Math.floor(Math.random() * 15) + 5,  // you know
    Math.floor(Math.random() * 18) + 8,  // so
    Math.floor(Math.random() * 12) + 3,  // actually (least common)
  ];
  
  return {
    fillerWordsData,
    fillerWordsLabels,
  };
};

export const getPracticeStatsData = (timeRange: "week" | "month" | "all") => {
  const dataPoints = timeRange === "week" ? 7 : timeRange === "month" ? 7 : 6;
  const practiceLabels = getTimeLabels(timeRange);
  
  // Generate random data for demo purposes
  const practiceMinutesData = generateRandomData(dataPoints, 3, 25);
  
  // Calculate total sessions and average duration
  const totalSessions = Math.floor(Math.random() * 5) + dataPoints;
  const totalMinutes = practiceMinutesData.reduce((sum, val) => sum + val, 0);
  const avgDuration = Math.round(totalMinutes / totalSessions);
  
  return {
    practiceMinutesData,
    practiceLabels,
    totalSessions,
    avgDuration,
  };
};

export const getRecommendations = (user: User) => {
  // In a real app, these would be generated based on the user's performance data
  // For now, we'll return some static recommendations
  
  // Find categories available to the user
  const availableCategories = mockCategories.filter(c => c.requiredLevel <= user.level);
  
  return [
    {
      id: "rec1",
      title: "Focus on reducing filler words",
      description: "Our analysis shows you frequently use 'um' and 'like'. Try the Filler Words lesson.",
      categoryId: availableCategories[0]?.id || "",
      lessonId: availableCategories[0]?.lessons[0]?.id || "",
      category: availableCategories[0]
    },
    {
      id: "rec2",
      title: "Work on speech pacing",
      description: "You tend to speak too quickly. Practice controlled pacing with our Pacing exercises.",
      categoryId: availableCategories[1]?.id || "",
      lessonId: availableCategories[1]?.lessons[0]?.id || "",
      category: availableCategories[1]
    },
    {
      id: "rec3",
      title: "Practice daily for better results",
      description: "Users who practice 10 minutes daily improve 3x faster than weekly practice.",
      categoryId: "",
      lessonId: "",
      category: null
    },
  ];
};
