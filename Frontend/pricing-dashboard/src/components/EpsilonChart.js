import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function EpsilonChart({ data }) {
  const formatted = data.map((v, i) => ({ x: i, y: v }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted}>
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Line dataKey="y" stroke="#3b82f6" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}