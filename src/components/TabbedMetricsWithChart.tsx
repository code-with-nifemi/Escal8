'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface MetricTab {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
}

interface TabbedMetricsWithChartProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  selectedAgent: string;
}

const TabbedMetricsWithChart: React.FC<TabbedMetricsWithChartProps> = ({ activeTab, onTabChange, selectedAgent }) => {
  // Agent-specific data
  const getAgentData = (agent: string) => {
    switch (agent) {
      case 'Middle Management Queen':
        return {
          calls: 14,
          duration: '0:48',
          totalMinutes: '11.2',
          avgMinutes: '0.8',
        };
      case 'Jordan - Help Desk Employee':
        return {
          calls: 2,
          duration: '1:15',
          totalMinutes: '2.5',
          avgMinutes: '1.25',
        };
      case 'Richard - CEO/Executive':
        return {
          calls: 1,
          duration: '0:30',
          totalMinutes: '0.5',
          avgMinutes: '0.5',
        };
      default: // All agents
        return {
          calls: 16,
          duration: '0:51',
          totalMinutes: '13.6',
          avgMinutes: '0.85',
        };
    }
  };

  const agentData = getAgentData(selectedAgent);

  const metrics: MetricTab[] = [
    {
      id: 'calls',
      title: 'Number of calls',
      value: agentData.calls,
    },
    {
      id: 'duration',
      title: 'Average duration',
      value: agentData.duration,
    },
    {
      id: 'total-minutes',
      title: 'Total minutes',
      value: agentData.totalMinutes,
      unit: 'min',
    },
    {
      id: 'avg-minutes',
      title: 'Average minutes',
      value: agentData.avgMinutes,
      unit: 'min/call',
    },
  ];

  // Agent-specific chart data
  const getChartData = (agent: string) => {
    if (agent === 'Richard - CEO/Executive') {
      return {
        calls: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 0 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 0 },
          { date: 'Nov 22', value: 1 },
        ],
        duration: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 0 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 0 },
          { date: 'Nov 22', value: 30 },
        ],
        'total-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 0 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 0 },
          { date: 'Nov 22', value: 0.5 },
        ],
        'avg-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 0 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 0 },
          { date: 'Nov 22', value: 0.5 },
        ],
      };
    } else if (agent === 'Middle Management Queen') {
      return {
        calls: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 1 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 2 },
          { date: 'Oct 28', value: 1 },
          { date: 'Oct 29', value: 2 },
          { date: 'Oct 30', value: 2 },
          { date: 'Nov 20', value: 3 },
          { date: 'Nov 21', value: 6 },
          { date: 'Nov 22', value: 14 },
        ],
        duration: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 25 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 35 },
          { date: 'Oct 28', value: 28 },
          { date: 'Oct 29', value: 40 },
          { date: 'Oct 30', value: 35 },
          { date: 'Nov 20', value: 42 },
          { date: 'Nov 21', value: 45 },
          { date: 'Nov 22', value: 48 },
        ],
        'total-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0.4 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 1.2 },
          { date: 'Oct 28', value: 0.5 },
          { date: 'Oct 29', value: 1.3 },
          { date: 'Oct 30', value: 1.2 },
          { date: 'Nov 20', value: 2.1 },
          { date: 'Nov 21', value: 4.5 },
          { date: 'Nov 22', value: 11.2 },
        ],
        'avg-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0.4 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0.6 },
          { date: 'Oct 28', value: 0.5 },
          { date: 'Oct 29', value: 0.65 },
          { date: 'Oct 30', value: 0.6 },
          { date: 'Nov 20', value: 0.7 },
          { date: 'Nov 21', value: 0.75 },
          { date: 'Nov 22', value: 0.8 },
        ],
      };
    } else if (agent === 'Jordan - Help Desk Employee') {
      return {
        calls: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 1 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 1 },
          { date: 'Nov 22', value: 2 },
        ],
        duration: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 80 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 70 },
          { date: 'Nov 22', value: 75 },
        ],
        'total-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 1.3 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 1.2 },
          { date: 'Nov 22', value: 2.5 },
        ],
        'avg-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 1.3 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 1.2 },
          { date: 'Nov 22', value: 1.25 },
        ],
      };
    } else {
      // All agents data (default)
      return {
        calls: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 1 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 2 },
          { date: 'Oct 28', value: 1 },
          { date: 'Oct 29', value: 3 },
          { date: 'Oct 30', value: 2 },
          { date: 'Nov 20', value: 5 },
          { date: 'Nov 21', value: 8 },
          { date: 'Nov 22', value: 16 },
        ],
        duration: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 25 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 35 },
          { date: 'Oct 28', value: 28 },
          { date: 'Oct 29', value: 42 },
          { date: 'Oct 30', value: 38 },
          { date: 'Nov 20', value: 45 },
          { date: 'Nov 21', value: 48 },
          { date: 'Nov 22', value: 51 },
        ],
        'total-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0.4 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 1.2 },
          { date: 'Oct 28', value: 0.5 },
          { date: 'Oct 29', value: 2.1 },
          { date: 'Oct 30', value: 1.3 },
          { date: 'Nov 20', value: 3.8 },
          { date: 'Nov 21', value: 6.4 },
          { date: 'Nov 22', value: 13.6 },
        ],
        'avg-minutes': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0.4 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0.6 },
          { date: 'Oct 28', value: 0.5 },
          { date: 'Oct 29', value: 0.7 },
          { date: 'Oct 30', value: 0.65 },
          { date: 'Nov 20', value: 0.76 },
          { date: 'Nov 21', value: 0.8 },
          { date: 'Nov 22', value: 0.85 },
        ],
      };
    }
  };

  const chartData = getChartData(selectedAgent);

  const getChartTitle = (tab: string) => {
    switch (tab) {
      case 'calls': return 'Number of Calls';
      case 'duration': return 'Average Duration (seconds)';
      case 'total-minutes': return 'Total Minutes';
      case 'avg-minutes': return 'Average Minutes per Call';
      default: return 'Metrics';
    }
  };

  const currentData = chartData[activeTab as keyof typeof chartData] || chartData.calls;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      {/* Tabbed Metrics */}
      <div className="flex border-b border-gray-100">
        {metrics.map((metric, index) => (
          <button
            key={metric.id}
            onClick={() => onTabChange(metric.id)}
            className={`flex-1 p-6 text-left transition-all duration-200 relative ${
              activeTab === metric.id
                ? 'bg-blue-50'
                : 'bg-white hover:bg-gray-50'
            } ${
              index !== metrics.length - 1 ? 'border-r border-gray-100' : ''
            }`}
            style={{
              borderBottom: activeTab === metric.id ? '2px solid black' : '2px solid transparent'
            }}
          >
            <h3 className={`text-sm font-medium mb-2 ${
              activeTab === metric.id ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {metric.title}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${
                activeTab === metric.id ? 'text-black' : 'text-gray-400'
              }`}>
                {metric.value}
              </span>
              {metric.unit && (
                <span className={`text-sm font-medium ${
                  activeTab === metric.id ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {metric.unit}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Connected Chart */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{getChartTitle(activeTab)}</h3>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2">
            View calls
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData}>
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
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TabbedMetricsWithChart;
