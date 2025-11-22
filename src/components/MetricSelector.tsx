'use client';

import React from 'react';

interface MetricSelectorProps {
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
}

const metricsRow1 = [
  { id: 'buzzwords', label: 'Buzzwords Per Minute', description: 'Average buzzwords used per minute' },
  { id: 'contradictions', label: 'Policy Contradictions', description: 'Number of policy violations' },
  { id: 'rage-quits', label: 'Rage Quits', description: 'Customer hang-ups during calls' },
];

const metricsRow2 = [
  { id: 'transfers', label: 'Number of Transfers', description: 'Calls transferred to other agents' },
  { id: 'promises', label: 'Unfulfillable Promises Made', description: 'Promises that cannot be kept' },
  { id: 'mispronunciations', label: 'Name Mispronunciations', description: 'Customer names said incorrectly' },
];

const MetricSelector: React.FC<MetricSelectorProps> = ({ selectedMetric, onMetricChange }) => {
  const renderMetricButton = (metric: any) => (
    <button
      key={metric.id}
      onClick={() => onMetricChange(metric.id)}
      className={`p-4 rounded-lg border-2 text-left transition-all ${
        selectedMetric === metric.id
          ? 'border-blue-500 bg-blue-50 text-blue-900'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <h3 className={`font-semibold text-sm mb-1 ${
        selectedMetric === metric.id ? 'text-blue-900' : 'text-gray-900'
      }`}>{metric.label}</h3>
      <p className={`text-xs ${
        selectedMetric === metric.id ? 'text-blue-700' : 'text-gray-700'
      }`}>{metric.description}</p>
    </button>
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Metric</h2>
      
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {metricsRow1.map(metric => renderMetricButton(metric))}
      </div>
      
      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricsRow2.map(metric => renderMetricButton(metric))}
      </div>
    </div>
  );
};

export default MetricSelector;
