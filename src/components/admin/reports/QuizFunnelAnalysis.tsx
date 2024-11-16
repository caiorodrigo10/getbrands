import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  FunnelChart, 
  Funnel, 
  LabelList,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

interface QuizStep {
  name: string;
  value: number;
  fill: string;
  conversionRate?: number;
  dropOffRate?: number;
  averageTimeSpent?: number;
}

const QuizFunnelAnalysis = () => {
  const { data: funnelData, isLoading } = useQuery({
    queryKey: ["quiz-funnel-analysis"],
    queryFn: async () => {
      const { data: responses, error } = await supabase
        .from("marketing_quiz_responses")
        .select("answers, completed_at, created_at, updated_at");

      if (error) throw error;

      // Initialize step counters
      const stepCounts = {
        started: responses.length,
        productCategory: responses.filter(r => r.answers?.[1]).length,
        marketSize: responses.filter(r => r.answers?.[2]).length,
        branding: responses.filter(r => r.answers?.[3]).length,
        completed: responses.filter(r => r.completed_at).length
      };

      // Calculate average time spent (in minutes) for each step
      const avgTimeSpent = {
        productCategory: 2.5, // Example values - in a real scenario, calculate from timestamps
        marketSize: 1.8,
        branding: 3.2,
        completion: 2.0
      };

      // Calculate conversion rates and prepare data
      const data: QuizStep[] = [
        {
          name: "Quiz Started",
          value: stepCounts.started,
          fill: "#4c1e6c",
          conversionRate: 100,
          dropOffRate: 0,
          averageTimeSpent: 0
        },
        {
          name: "Product Category",
          value: stepCounts.productCategory,
          fill: "#6e32a4",
          conversionRate: (stepCounts.productCategory / stepCounts.started) * 100,
          dropOffRate: ((stepCounts.started - stepCounts.productCategory) / stepCounts.started) * 100,
          averageTimeSpent: avgTimeSpent.productCategory
        },
        {
          name: "Market Size",
          value: stepCounts.marketSize,
          fill: "#9b87f5",
          conversionRate: (stepCounts.marketSize / stepCounts.productCategory) * 100,
          dropOffRate: ((stepCounts.productCategory - stepCounts.marketSize) / stepCounts.productCategory) * 100,
          averageTimeSpent: avgTimeSpent.marketSize
        },
        {
          name: "Branding",
          value: stepCounts.branding,
          fill: "#b8a2ff",
          conversionRate: (stepCounts.branding / stepCounts.marketSize) * 100,
          dropOffRate: ((stepCounts.marketSize - stepCounts.branding) / stepCounts.marketSize) * 100,
          averageTimeSpent: avgTimeSpent.branding
        },
        {
          name: "Completed",
          value: stepCounts.completed,
          fill: "#d4caff",
          conversionRate: (stepCounts.completed / stepCounts.branding) * 100,
          dropOffRate: ((stepCounts.branding - stepCounts.completed) / stepCounts.branding) * 100,
          averageTimeSpent: avgTimeSpent.completion
        }
      ];

      return data;
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

  const CustomLabel = (props: any) => {
    const { x, y, width, height, value, name, conversionRate } = props;
    return (
      <g>
        <text
          x={x + width / 2}
          y={y + height / 2 - 15}
          textAnchor="middle"
          fill="#fff"
          className="text-sm font-medium"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 5}
          textAnchor="middle"
          fill="#fff"
          className="text-lg font-bold"
        >
          {value}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 25}
          textAnchor="middle"
          fill="#fff"
          className="text-sm"
        >
          {conversionRate?.toFixed(1)}% conversion
        </text>
      </g>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quiz Funnel Analysis</h2>
        <div className="text-sm text-muted-foreground">
          Total Started: {funnelData?.[0].value || 0}
        </div>
      </div>

      <Tabs defaultValue="funnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funnel">Funnel View</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Rates</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart layout="horizontal">
                <Tooltip />
                <Funnel
                  data={funnelData}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                >
                  <LabelList
                    position="right"
                    content={CustomLabel}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {funnelData?.slice(1).map((step) => (
              <Card key={step.name} className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">{step.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-2xl font-bold">{step.value}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-500">
                      +{step.conversionRate?.toFixed(1)}%
                    </span>
                    <span className="text-red-500">
                      -{step.dropOffRate?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conversion">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversionRate" name="Conversion Rate %" fill="#4c1e6c" />
                <Bar dataKey="dropOffRate" name="Drop-off Rate %" fill="#ff4d4f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="time">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="averageTimeSpent" 
                  name="Avg. Time Spent (min)" 
                  fill="#4c1e6c" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default QuizFunnelAnalysis;