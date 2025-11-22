'use client';

import React from 'react';

interface MetricTab {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
}

interface TabbedMetricsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabbedMetrics: React.FC<TabbedMetricsProps> = ({ activeTab, onTabChange }) => {

  const metrics: MetricTab[] = [
    {
      id: 'calls',
      title: 'Number of calls',
      value: 17,
    },
    {
      id: 'duration',
      title: 'Average duration',
      value: '0:51',
    },
    {
      id: 'total-minutes',
      title: 'Policy Contradictions',
      value: '13.6',
      unit: 'min',
    },
    {
      id: 'avg-minutes',
      title: 'Average minutes',
      value: '0.85',
      unit: 'min/call',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
      <div className="flex">
        {metrics.map((metric, index) => (
          <button
            key={metric.id}
            onClick={() => onTabChange(metric.id)}
            className={`flex-1 p-6 text-left transition-all duration-200 relative ${
              activeTab === metric.id
                ? 'bg-blue-50 border-b-2 border-blue-500'
                : 'bg-white hover:bg-gray-50 border-b-2 border-transparent'
            } ${
              index !== metrics.length - 1 ? 'border-r border-gray-100' : ''
            }`}
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
    </div>
  );
};

export default TabbedMetrics;
