import { ResponsiveContainer, FunnelChart, Funnel, LabelList } from "recharts";

interface FunnelViewProps {
  data?: any[];
}

export const FunnelView = ({ data = [] }: FunnelViewProps) => {
  const CustomLabel = (props: any) => {
    const { x, y, width, height, value, name, conversionRate } = props;
    return (
      <g>
        <text
          x={x + width / 2}
          y={y + height / 2 - 15}
          textAnchor="middle"
          fill="#fff"
          className="text-sm font-medium"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 5}
          textAnchor="middle"
          fill="#fff"
          className="text-lg font-bold"
        >
          {value}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 25}
          textAnchor="middle"
          fill="#fff"
          className="text-sm"
        >
          {conversionRate?.toFixed(1)}% conversion
        </text>
      </g>
    );
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart layout="horizontal">
          <Funnel
            data={data}
            dataKey="value"
            nameKey="name"
            labelLine={false}
          >
            <LabelList
              position="right"
              content={CustomLabel}
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};