import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function RevenueChart({ data, monthNames }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="month"
          tickFormatter={(m) => monthNames[m - 1]}
        />

        <YAxis />

        <Tooltip
          formatter={(value) => [`₹ ${value}`, "Revenue"]}
          labelFormatter={(label) => monthNames[label - 1]}
        />

        <Line
          type="monotone"
          dataKey="amount"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false} // 🔥 reduces render cost
        />
      </LineChart>
    </ResponsiveContainer>
  );
}