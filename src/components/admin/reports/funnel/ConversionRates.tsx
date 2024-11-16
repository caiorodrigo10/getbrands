import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ConversionRatesProps {
  data?: any[];
}

export const ConversionRates = ({ data = [] }: ConversionRatesProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="conversionRate" name="Conversion Rate %" fill="#4c1e6c" />
          <Bar dataKey="dropOffRate" name="Drop-off Rate %" fill="#ff4d4f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};