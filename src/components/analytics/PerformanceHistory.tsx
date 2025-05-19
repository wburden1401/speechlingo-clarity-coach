
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { getPerformanceData } from "@/lib/analyticsService";
import { LineChart } from "@/components/ui/chart";

interface PerformanceHistoryProps {
  timeRange: "week" | "month" | "all";
}

export function PerformanceHistory({ timeRange }: PerformanceHistoryProps) {
  const { user } = useAppContext();
  
  // Get performance data based on time range
  const { clarityData, confidenceData, paceData } = getPerformanceData(timeRange);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Performance History</CardTitle>
        <CardDescription>Your speech clarity, confidence, and pace over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <LineChart 
            data={[
              {
                name: "Clarity",
                data: clarityData,
                color: "#8b5cf6",
              },
              {
                name: "Confidence",
                data: confidenceData,
                color: "#0ea5e9",
              },
              {
                name: "Pace",
                data: paceData,
                color: "#f97316",
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
