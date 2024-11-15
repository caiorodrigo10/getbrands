import { Card } from "@/components/ui/card";
import { ResponsiveContainer, FunnelChart, Funnel, Cell, Label } from "recharts";

const data = [
  { name: "Members", value: 1200, fill: "#4c1e6c" },
  { name: "Samplers", value: 800, fill: "#6e32a4" },
  { name: "Customers", value: 400, fill: "#9b87f5" },
];

const CustomLabel = (props: any) => {
  const { x, y, width, payload } = props;
  return (
    <g>
      <rect
        x={x + width / 4}
        y={y - 20}
        width={width / 2}
        height={40}
        fill="rgba(255, 255, 255, 0.9)"
        rx={4}
      />
      <text
        x={x + width / 2}
        y={y - 5}
        textAnchor="middle"
        className="text-sm font-medium fill-gray-900"
      >
        {payload.name}
      </text>
      <text
        x={x + width / 2}
        y={y + 15}
        textAnchor="middle"
        className="text-base font-bold fill-gray-900"
      >
        {payload.value.toLocaleString()}
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
              <Label content={CustomLabel} position="right" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesFunnel;