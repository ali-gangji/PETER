import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { EvaluationResult } from '../domain/entity/EvaluationVersions';

interface Props {
  result: EvaluationResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-slate-300 rounded-md shadow-lg">
        <p className="font-semibold text-slate-800">{`${payload[0].name}`}</p>
        <p className="text-slate-600">{`Impact: ${payload[0].value.toFixed(2)} kg CO₂e (${payload[0].payload.percent.toFixed(1)}%)`}</p>
      </div>
    );
  }
  return null;
};

function PieChartComponent({ result }: Props) {
  const chartData = result.impacts.map((impact) => ({
    name: impact.name,
    value: impact.total,
    percent: result.impactsSpread[impact.name] || 0,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartComponent;