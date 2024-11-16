import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  FunnelChart, 
  Funnel, 
  LabelList, 
  Tooltip 
} from "recharts";

interface QuizStep {
  name: string;
  value: number;
  fill: string;
  conversionRate?: number;
}

const QuizFunnelAnalysis = () => {
  const { data: funnelData, isLoading } = useQuery({
    queryKey: ["quiz-funnel-analysis"],
    queryFn: async () => {
      const { data: responses, error } = await supabase
        .from("marketing_quiz_responses")
        .select("answers, completed_at");

      if (error) throw error;

      // Initialize step counters
      const stepCounts = {
        started: responses.length,
        productCategory: responses.filter(r => r.answers?.[1]).length,
        marketSize: responses.filter(r => r.answers?.[2]).length,
        branding: responses.filter(r => r.answers?.[3]).length,
        completed: responses.filter(r => r.completed_at).length
      };

      // Calculate conversion rates and prepare data
      const data: QuizStep[] = [
        {
          name: "Quiz Started",
          value: stepCounts.started,
          fill: "#4c1e6c",
          conversionRate: 100
        },
        {
          name: "Product Category",
          value: stepCounts.productCategory,
          fill: "#6e32a4",
          conversionRate: (stepCounts.productCategory / stepCounts.started) * 100
        },
        {
          name: "Market Size",
          value: stepCounts.marketSize,
          fill: "#9b87f5",
          conversionRate: (stepCounts.marketSize / stepCounts.productCategory) * 100
        },
        {
          name: "Branding",
          value: stepCounts.branding,
          fill: "#b8a2ff",
          conversionRate: (stepCounts.branding / stepCounts.marketSize) * 100
        },
        {
          name: "Completed",
          value: stepCounts.completed,
          fill: "#d4caff",
          conversionRate: (stepCounts.completed / stepCounts.branding) * 100
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
      <h2 className="text-xl font-semibold mb-6">Quiz Funnel Analysis</h2>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel
              data={funnelData}
              dataKey="value"
              nameKey="name"
              labelLine={false}
            >
              <LabelList
                position="center"
                content={CustomLabel}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default QuizFunnelAnalysis;