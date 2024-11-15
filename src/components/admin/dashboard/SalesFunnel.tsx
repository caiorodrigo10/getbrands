import { Card } from "@/components/ui/card";
import { ResponsiveContainer, FunnelChart, Funnel, LabelList, Tooltip } from "recharts";

const data = [
  { name: "Members", value: 1200, fill: "#4c1e6c" },
  { name: "Samplers", value: 800, fill: "#6e32a4" },
  { name: "Customers", value: 400, fill: "#9b87f5" },
];

const SalesFunnel = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Sales Funnel</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel
              data={data}
              dataKey="value"
              nameKey="name"
              labelLine={false}
            >
              <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesFunnel;