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
          buzzwords: '28.5',
          contradictions: 15,
          rageQuits: 8,
        };
      case 'Jordan - Help Desk Employee':
        return {
          calls: 2,
          buzzwords: '22.3',
          contradictions: 11,
          rageQuits: 4,
        };
      case 'Richard - CEO/Executive':
        return {
          calls: 1,
          buzzwords: '29.7',
          contradictions: 13,
          rageQuits: 6,
        };
      default: // All agents
        return {
          calls: 17,
          buzzwords: '26.8',
          contradictions: 13,
          rageQuits: 6,
        };
    }
  };

  const agentData = getAgentData(selectedAgent);

  const metrics: MetricTab[] = [
    {
      id: 'calls',
      title: 'Number of Calls',
      value: agentData.calls,
    },
    {
      id: 'buzzwords',
      title: 'Buzzwords Per Minute',
      value: agentData.buzzwords,
      unit: '/min',
    },
    {
      id: 'contradictions',
      title: 'Policy Contradictions',
      value: agentData.contradictions,
    },
    {
      id: 'rage-quits',
      title: 'Total Rage Quits',
      value: agentData.rageQuits,
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
        buzzwords: [
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
          { date: 'Nov 22', value: 29.7 },
        ],
        contradictions: [
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
          { date: 'Nov 22', value: 13 },
        ],
        'rage-quits': [
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
          { date: 'Nov 22', value: 6 },
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
        buzzwords: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 22 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 24 },
          { date: 'Oct 28', value: 23 },
          { date: 'Oct 29', value: 26 },
          { date: 'Oct 30', value: 25 },
          { date: 'Nov 20', value: 27 },
          { date: 'Nov 21', value: 28 },
          { date: 'Nov 22', value: 28.5 },
        ],
        contradictions: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 2 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 4 },
          { date: 'Oct 28', value: 3 },
          { date: 'Oct 29', value: 6 },
          { date: 'Oct 30', value: 5 },
          { date: 'Nov 20', value: 9 },
          { date: 'Nov 21', value: 12 },
          { date: 'Nov 22', value: 15 },
        ],
        'rage-quits': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 1 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 2 },
          { date: 'Oct 28', value: 1 },
          { date: 'Oct 29', value: 3 },
          { date: 'Oct 30', value: 2 },
          { date: 'Nov 20', value: 5 },
          { date: 'Nov 21', value: 7 },
          { date: 'Nov 22', value: 8 },
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
        buzzwords: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 21 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 21.5 },
          { date: 'Nov 22', value: 22.3 },
        ],
        contradictions: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 5 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 8 },
          { date: 'Nov 22', value: 11 },
        ],
        'rage-quits': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 0 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 0 },
          { date: 'Oct 28', value: 0 },
          { date: 'Oct 29', value: 2 },
          { date: 'Oct 30', value: 0 },
          { date: 'Nov 20', value: 0 },
          { date: 'Nov 21', value: 3 },
          { date: 'Nov 22', value: 4 },
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
          { date: 'Nov 22', value: 17 },
        ],
        buzzwords: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 22 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 24 },
          { date: 'Oct 28', value: 23 },
          { date: 'Oct 29', value: 25 },
          { date: 'Oct 30', value: 25 },
          { date: 'Nov 20', value: 26 },
          { date: 'Nov 21', value: 27 },
          { date: 'Nov 22', value: 26.8 },
        ],
        contradictions: [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 2 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 4 },
          { date: 'Oct 28', value: 3 },
          { date: 'Oct 29', value: 6 },
          { date: 'Oct 30', value: 5 },
          { date: 'Nov 20', value: 9 },
          { date: 'Nov 21', value: 11 },
          { date: 'Nov 22', value: 13 },
        ],
        'rage-quits': [
          { date: 'Oct 23', value: 0 },
          { date: 'Oct 24', value: 0 },
          { date: 'Oct 25', value: 1 },
          { date: 'Oct 26', value: 0 },
          { date: 'Oct 27', value: 2 },
          { date: 'Oct 28', value: 1 },
          { date: 'Oct 29', value: 3 },
          { date: 'Oct 30', value: 2 },
          { date: 'Nov 20', value: 4 },
          { date: 'Nov 21', value: 5 },
          { date: 'Nov 22', value: 6 },
        ],
      };
    }
  };

  const chartData = getChartData(selectedAgent);

  const getChartTitle = (tab: string) => {
    switch (tab) {
      case 'calls': return 'Number of Calls';
      case 'buzzwords': return 'Buzzwords Per Minute';
      case 'contradictions': return 'Policy Contradictions';
      case 'rage-quits': return 'Total Rage Quits';
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
