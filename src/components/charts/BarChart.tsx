import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Nov', count: 18 },
  { month: 'Dec', count: 24 },
  { month: 'Jan', count: 31 },
  { month: 'Feb', count: 22 },
  { month: 'Mar', count: 28 },
  { month: 'Apr', count: 15 },
];

export function IssuanceBarChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsBar data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 20%)" />
        <XAxis dataKey="month" stroke="hsl(215 20% 60%)" fontSize={12} />
        <YAxis stroke="hsl(215 20% 60%)" fontSize={12} />
        <Tooltip contentStyle={{ background: 'hsl(225 25% 11%)', border: '1px solid hsl(225 15% 20%)', borderRadius: '8px' }} />
        <Bar dataKey="count" fill="hsl(168 100% 42%)" radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
}
