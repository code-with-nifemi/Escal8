'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Charts = () => {
  const successData = [
    { date: 'Oct 23', rate: 0 },
    { date: 'Oct 24', rate: 0 },
    { date: 'Oct 25', rate: 0 },
    { date: 'Oct 26', rate: 0 },
    { date: 'Oct 27', rate: 0 },
    { date: 'Oct 28', rate: 0 },
    { date: 'Oct 29', rate: 0 },
    { date: 'Oct 30', rate: 0 },
    { date: 'Nov 20', rate: 0 },
    { date: 'Nov 21', rate: 0 },
    { date: 'Nov 22', rate: 50 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall success rate</h3>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">50%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-gray-300 rounded px-3 py-1 bg-white">
            <option>Success</option>
          </select>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View calls →
          </button>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={successData}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[0, 100]}
            />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
