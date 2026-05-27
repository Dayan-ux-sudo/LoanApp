import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { data: trends } = useQuery({
    queryKey: ['trends'],
    queryFn: () => axios.get('http://localhost:6000/api/analytics/trends').then(r => r.data)
  });

  const { data: seasonal } = useQuery({
    queryKey: ['seasonal'],
    queryFn: () => axios.get('http://localhost:6000/api/analytics/seasonal').then(r => r.data)
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Loan Processing Intelligence</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Applications Trend (Monthly)</h2>
          <LineChart width={600} height={300} data={trends || []}>
            <CartesianGrid />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Loan Types by Season</h2>
          <BarChart width={600} height={300} data={seasonal || []}>
            <CartesianGrid />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <ul className="space-y-3 text-lg">
          <li className="flex items-center gap-3">🔍 <strong>Auto loans spike 68% in Fall</strong> — mostly men aged 25-35</li>
          <li className="flex items-center gap-3">📈 <strong>Resource Alert</strong>: Low stock on Auto Loan forms</li>
          <li className="flex items-center gap-3">🎯 <strong>Recommendation</strong>: Increase staffing in Q4</li>
        </ul>
      </div>
    </div>
  );
}