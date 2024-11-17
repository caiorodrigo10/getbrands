import { Card } from "@/components/ui/card";
import { ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList } from "recharts";

const data = [
  { 
    name: "Members", 
    value: 1200, 
    fill: "#6A1B9A",
    percentage: "100%"
  },
  { 
    name: "Samplers", 
    value: 800, 
    fill: "#8E24AA",
    percentage: "67%"
  },
  { 
    name: "Customers", 
    value: 400, 
    fill: "#AB47BC",
    percentage: "33%"
  },
];

interface CustomLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
  name?: string;
  payload?: {
    percentage: string;
  };
}

const CustomLabel = ({ x = 0, y = 0, width = 0, value = 0, name = "", payload }: CustomLabelProps) => {
  return (
    <g>
      <text
        x={x + width / 2}
        y={y + 15}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white font-bold text-2xl"
      >
        {value.toLocaleString()}
      </text>
      {payload && (
        <text
          x={x + width / 2}
          y={y + 40}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white text-sm opacity-80"
        >
          {payload.percentage}
        </text>
      )}
    </g>
  );
};

const SalesFunnel = () => {
  return (
    <Card className="p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Sales Funnel</h3>
        <div className="flex gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.percentage})
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Funnel
              data={data}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  stroke={entry.fill}
                />
              ))}
              <LabelList
                position="center"
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