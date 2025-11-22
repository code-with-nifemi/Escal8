'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {unit && <span className="text-sm font-medium text-gray-400">{unit}</span>}
    </div>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

const MetricsCards = () => {
  const metrics = [
    {
      title: 'Number of calls',
      value: 17,
    },
    {
      title: 'Average duration',
      value: '0:51',
    },
    {
      title: 'Policy Contradictions',
      value: '13.6',
      unit: 'min',
    },
    {
      title: 'Corporate Buzzwords Per Minute',
      value: '0.85',
      unit: 'BPM',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          unit={metric.unit}
        />
      ))}
    </div>
  );
};

export default MetricsCards;
