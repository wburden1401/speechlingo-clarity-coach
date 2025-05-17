
import { Home, BookOpen, Users, BarChart2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";

export function BottomNav() {
  const { state, setActiveTab } = useAppContext();
  
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "friends", label: "Friends", icon: Users },
    { id: "progress", label: "Progress", icon: BarChart2 },
    { id: "profile", label: "Profile", icon: User }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border sm:floating-nav">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center py-2 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
              state.activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={item.label}
            aria-current={state.activeTab === item.id ? "page" : undefined}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
