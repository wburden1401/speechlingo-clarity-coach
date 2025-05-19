
import { useNetwork } from "@/contexts/NetworkContext";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline } = useNetwork();
  
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none">
      <div className="bg-amber-500 text-white px-4 py-1 rounded-full flex items-center gap-2 shadow-md pointer-events-auto">
        <WifiOff className="h-3 w-3" />
        <span className="text-xs font-medium">Offline Mode</span>
      </div>
    </div>
  );
}
