'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = data.success + data.failure + data.unknown;
    
    const getPercentage = (value: number) => {
      return total === 0 ? 0 : Math.round((value / total) * 100);
    };
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[180px]">
        <p className="font-semibold text-gray-900 mb-3 text-sm">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-700">Unknown</span>
            </div>
            <span className="text-xs font-medium text-gray-900">
              {data.unknown} ({getPercentage(data.unknown)}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Failure</span>
            </div>
            <span className="text-xs font-medium text-gray-900">
              {data.failure} ({getPercentage(data.failure)}%)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Success</span>
            </div>
            <span className="text-xs font-medium text-gray-900">
              {data.success} ({getPercentage(data.success)}%)
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface ChartsProps {
  selectedAgent: string;
}

const Charts: React.FC<ChartsProps> = ({ selectedAgent }) => {
  const successData = [
    { date: 'Oct 23', success: 0, failure: 0, unknown: 0 },
    { date: 'Oct 24', success: 0, failure: 0, unknown: 0 },
    { date: 'Oct 25', success: 45, failure: 35, unknown: 20 },
    { date: 'Oct 26', success: 0, failure: 0, unknown: 0 },
    { date: 'Oct 27', success: 60, failure: 25, unknown: 15 },
    { date: 'Oct 28', success: 55, failure: 30, unknown: 15 },
    { date: 'Oct 29', success: 65, failure: 20, unknown: 15 },
    { date: 'Oct 30', success: 58, failure: 28, unknown: 14 },
    { date: 'Nov 20', success: 70, failure: 18, unknown: 12 },
    { date: 'Nov 21', success: 68, failure: 22, unknown: 10 },
    { date: 'Nov 22', success: 75, failure: 15, unknown: 10 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall success rate</h3>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-500">75%</span>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Failure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Unknown</span>
            </div>
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
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="success" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="failure" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#EF4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="unknown" 
                stroke="#9CA3AF" 
                strokeWidth={2}
                dot={{ fill: '#9CA3AF', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#9CA3AF' }}
              />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
