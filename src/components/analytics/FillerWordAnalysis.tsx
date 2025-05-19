
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { getFillerWordsData } from "@/lib/analyticsService";
import { BarChart } from "@/components/ui/chart";

interface FillerWordAnalysisProps {
  timeRange: "week" | "month" | "all";
}

export function FillerWordAnalysis({ timeRange }: FillerWordAnalysisProps) {
  const { user } = useAppContext();
  
  // Get filler words data based on time range
  const { fillerWordsData, fillerWordsLabels } = getFillerWordsData(timeRange);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Filler Word Analysis</CardTitle>
        <CardDescription>Frequency of common filler words in your speech</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <BarChart
            data={[
              {
                name: "Occurrences",
                data: fillerWordsData,
              },
            ]}
            categories={fillerWordsLabels}
          />
        </div>
        <div className="mt-4 space-y-1">
          <p className="text-sm text-muted-foreground">Tip: Replace filler words with purposeful pauses to sound more confident.</p>
        </div>
      </CardContent>
    </Card>
  );
}
