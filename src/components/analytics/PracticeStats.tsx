
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { getPracticeStatsData } from "@/lib/analyticsService";
import { AreaChart } from "@/components/ui/chart";

interface PracticeStatsProps {
  timeRange: "week" | "month" | "all";
}

export function PracticeStats({ timeRange }: PracticeStatsProps) {
  const { user } = useAppContext();
  
  // Get practice statistics based on time range
  const { practiceMinutesData, practiceLabels, totalSessions, avgDuration } = getPracticeStatsData(timeRange);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Practice Statistics</CardTitle>
        <CardDescription>Your practice minutes over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <AreaChart
            data={[
              {
                name: "Minutes",
                data: practiceMinutesData,
              },
            ]}
            categories={practiceLabels}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-xl font-bold">{totalSessions}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Avg. Duration</p>
            <p className="text-xl font-bold">{avgDuration}m</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
