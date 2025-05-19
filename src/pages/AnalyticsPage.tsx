
import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, LineChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { PerformanceHistory } from "@/components/analytics/PerformanceHistory";
import { FillerWordAnalysis } from "@/components/analytics/FillerWordAnalysis";
import { PracticeStats } from "@/components/analytics/PracticeStats"; 
import { PracticeRecommendations } from "@/components/analytics/PracticeRecommendations";
import { ChartLine, BarChart, Clock, TrendingUp, Calendar } from "lucide-react";

export function AnalyticsPage() {
  const { user, audioAnalysisResult } = useAppContext();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  
  return (
    <div className="space-y-6 pt-6 pb-24">
      <div className="px-4 mb-2">
        <h1 className="text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground">Track your progress and identify areas for improvement</p>
      </div>

      <div className="px-4 flex gap-2 pb-2 overflow-x-auto scrollbar-none">
        <Badge 
          variant={timeRange === "week" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTimeRange("week")}
        >
          This Week
        </Badge>
        <Badge 
          variant={timeRange === "month" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTimeRange("month")}
        >
          This Month
        </Badge>
        <Badge 
          variant={timeRange === "all" ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => setTimeRange("all")}
        >
          All Time
        </Badge>
      </div>

      <div className="px-4">
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <ChartLine className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Practice</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="space-y-4 mt-4">
            <PerformanceHistory timeRange={timeRange} />
            <FillerWordAnalysis timeRange={timeRange} />
          </TabsContent>
          
          <TabsContent value="practice" className="space-y-4 mt-4">
            <PracticeStats timeRange={timeRange} />
            <PracticeRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
