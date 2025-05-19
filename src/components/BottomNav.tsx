
import { useAppContext } from "@/contexts/AppContext";
import { Home, BookOpen, Users, BarChart, LineChart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
}

export function BottomNav() {
  const { state, setActiveTab } = useAppContext();
  const { activeTab } = state;

  const navItems: NavItem[] = [
    {
      id: "home",
      icon: Home,
      label: "Home"
    },
    {
      id: "learn",
      icon: BookOpen,
      label: "Learn"
    },
    {
      id: "friends",
      icon: Users,
      label: "Friends"
    },
    {
      id: "progress",
      icon: BarChart,
      label: "Progress"
    },
    {
      id: "analytics",
      icon: LineChart,
      label: "Analytics"
    },
    {
      id: "profile",
      icon: User,
      label: "Profile"
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-30">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            className={cn(
              "flex flex-1 flex-col items-center justify-center h-16 text-xs",
              activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
            onClick={() => setActiveTab(item.id as any)}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
