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

const CustomLabel = (props: any) => {
  const { x, y, width, value, name, payload } = props;
  return (
    <g>
      <text
        x={x + width / 2}
        y={y - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white font-medium text-base"
      >
        {name}
      </text>
      <text
        x={x + width / 2}
        y={y + 15}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white font-bold text-xl"
      >
        {value.toLocaleString()}
      </text>
      <text
        x={x + width / 2}
        y={y + 35}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm opacity-80"
      >
        {payload.percentage}
      </text>
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
              <span className="text-sm text-muted-foreground">{item.name}</span>
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
              neckWidth="20%"
              neckHeight="20%"
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
                content={CustomLabel}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesFunnel;