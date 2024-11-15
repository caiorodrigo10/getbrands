import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const data = [
  { name: "In Progress", value: 45, color: "#4c1e6c" },
  { name: "Delayed", value: 15, color: "#ef4444" },
  { name: "Ahead", value: 20, color: "#22c55e" },
  { name: "Completed", value: 20, color: "#3b82f6" },
];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <rect
        x={x - 40}
        y={y - 12}
        width={80}
        height={24}
        fill="rgba(255, 255, 255, 0.9)"
        rx={4}
      />
      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        className="text-sm font-medium fill-gray-900"
      >
        {`${name}: ${value}%`}
      </text>
    </g>
  );
};

const ProjectStatus = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Project Status</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={CustomLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium">
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProjectStatus;