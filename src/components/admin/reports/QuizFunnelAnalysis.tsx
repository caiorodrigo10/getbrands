import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunnelView } from "./funnel/FunnelView";
import { ConversionRates } from "./funnel/ConversionRates";
import { TimeAnalysis } from "./funnel/TimeAnalysis";

const QuizFunnelAnalysis = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["quiz-funnel-analytics"],
    queryFn: async () => {
      const response = await fetch('/api/quiz-analytics')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quiz Funnel Analysis</h2>
        <div className="text-sm text-muted-foreground">
          Total Started: {analyticsData?.totalStarted || 0}
        </div>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Funnel View</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <FunnelView data={analyticsData?.funnelData} />
        </TabsContent>

        <TabsContent value="conversion">
          <ConversionRates data={analyticsData?.conversionData} />
        </TabsContent>

        <TabsContent value="time">
          <TimeAnalysis data={analyticsData?.timeData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default QuizFunnelAnalysis;