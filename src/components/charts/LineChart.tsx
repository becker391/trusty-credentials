import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'May', count: 45 }, { month: 'Jun', count: 52 }, { month: 'Jul', count: 49 },
  { month: 'Aug', count: 63 }, { month: 'Sep', count: 58 }, { month: 'Oct', count: 71 },
  { month: 'Nov', count: 65 }, { month: 'Dec', count: 78 }, { month: 'Jan', count: 82 },
  { month: 'Feb', count: 74 }, { month: 'Mar', count: 91 }, { month: 'Apr', count: 68 },
];

export function IssuanceLineChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsLine data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 20%)" />
        <XAxis dataKey="month" stroke="hsl(215 20% 60%)" fontSize={12} />
        <YAxis stroke="hsl(215 20% 60%)" fontSize={12} />
        <Tooltip contentStyle={{ background: 'hsl(225 25% 11%)', border: '1px solid hsl(225 15% 20%)', borderRadius: '8px' }} />
        <Line type="monotone" dataKey="count" stroke="hsl(168 100% 42%)" strokeWidth={2} dot={{ fill: 'hsl(168 100% 42%)' }} />
      </RechartsLine>
    </ResponsiveContainer>
  );
}
