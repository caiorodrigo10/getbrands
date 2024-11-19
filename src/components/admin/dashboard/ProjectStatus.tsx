import { Card } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "In Progress", value: 45, color: "#f0562e" },
  { name: "Delayed", value: 15, color: "#ef4444" },
  { name: "Ahead", value: 20, color: "#22c55e" },
  { name: "Completed", value: 20, color: "#3b82f6" },
];

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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm font-medium">
                  {value}: {entry.payload.value}%
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProjectStatus;