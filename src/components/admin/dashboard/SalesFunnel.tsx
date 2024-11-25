import { Card } from "@/components/ui/card";
import { ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList } from "recharts";

const data = [
  { 
    name: "user_signed_up", 
    value: 7,
    label: "1 user_signed_up",
    percentage: "100%",
    fill: "#FF6B6B"
  },
  { 
    name: "Onboarding Completed", 
    value: 6, 
    label: "2 Onboarding Completed",
    percentage: "85%",
    fill: "#FF7E7E"
  },
  { 
    name: "Catalog Viewed", 
    value: 3, 
    label: "3 Catalog Viewed",
    percentage: "50%",
    fill: "#FF9292"
  },
  { 
    name: "Order Completed", 
    value: 0, 
    label: "4 Order Completed",
    percentage: "0%",
    fill: "#FFB5B5"
  }
];

interface CustomLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  payload?: {
    percentage: string;
    label: string;
  };
}

const CustomLabel = ({ x = 0, y = 0, width = 0, height = 0, value = 0, payload }: CustomLabelProps) => {
  if (!payload) return null;
  
  return (
    <g>
      <text
        x={x + width / 2}
        y={y + (height || 0) / 2 - 12}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-medium fill-current"
      >
        {payload.label}
      </text>
      <text
        x={x + width / 2}
        y={y + (height || 0) / 2 + 12}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-bold fill-current"
      >
        {`${value} total times • ${payload.percentage}`}
      </text>
    </g>
  );
};

const SalesFunnel = () => {
  return (
    <Card className="p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Conversion Funnel</h3>
        <div className="text-sm text-muted-foreground">
          Overall • {data[data.length - 1].percentage}
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart layout="horizontal">
            <Funnel
              data={data}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              isAnimationActive={true}
              orientation="horizontal"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  stroke={entry.fill}
                />
              ))}
              <LabelList
                position="right"
                content={<CustomLabel />}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesFunnel;