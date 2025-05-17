
import { AppProvider } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { HomePage } from "@/pages/HomePage";
import { LearnPage } from "@/pages/LearnPage";
import { FriendsPage } from "@/pages/FriendsPage";
import { ProgressPage } from "@/pages/ProgressPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { useAppContext } from "@/contexts/AppContext";

// Main content component that renders the active tab
const MainContent = () => {
  const { state } = useAppContext();
  
  switch (state.activeTab) {
    case "home":
      return <HomePage />;
    case "learn":
      return <LearnPage />;
    case "friends":
      return <FriendsPage />;
    case "progress":
      return <ProgressPage />;
    case "profile":
      return <ProfilePage />;
    default:
      return <HomePage />;
  }
};

// App container with context
const SpeechLingo = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background pb-16">
        <MainContent />
        <BottomNav />
      </div>
    </AppProvider>
  );
};

// Export the main component
const Index = () => <SpeechLingo />;

export default Index;
