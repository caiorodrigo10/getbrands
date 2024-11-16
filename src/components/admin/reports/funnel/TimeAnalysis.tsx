import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface TimeAnalysisProps {
  data?: any[];
}

export const TimeAnalysis = ({ data = [] }: TimeAnalysisProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
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
  );
};