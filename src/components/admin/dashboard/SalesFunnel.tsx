import { Card } from "@/components/ui/card";
import { ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList } from "recharts";

const data = [
  { name: "Members", value: 1200, fill: "#4c1e6c" },
  { name: "Samplers", value: 800, fill: "#6e32a4" },
  { name: "Customers", value: 400, fill: "#9b87f5" },
];

const CustomLabel = (props: any) => {
  const { x, y, width, value, name } = props;
  return (
    <g>
      <text
        x={x + width / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white font-medium text-sm"
      >
        {name}
      </text>
      <text
        x={x + width / 2}
        y={y + 20}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white font-bold text-lg"
      >
        {value.toLocaleString()}
      </text>
    </g>
  );
};

const SalesFunnel = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Sales Funnel</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Funnel
              data={data}
              dataKey="value"
              nameKey="name"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
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