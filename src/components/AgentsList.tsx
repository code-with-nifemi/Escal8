'use client';

import React from 'react';

interface AgentsListProps {
  selectedAgent: string;
}

const AgentsList: React.FC<AgentsListProps> = ({ selectedAgent }) => {
  const agents = [
    {
      name: 'Middle Management Queen',
      calls: 14,
    },
    {
      name: 'Jordan - Help Desk Employee',
      calls: 2,
    },
    {
      name: 'Richard - CEO/Executive',
      calls: 1,
    },
  ];

  const topics = [
    {
      name: 'Password Reset',
      count: 8,
    },
    {
      name: 'Account Access Issues',
      count: 5,
    },
    {
      name: 'Billing Questions',
      count: 3,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Most Called Agents */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Most called agents</h3>
        </div>
        <div className="space-y-3">
          {agents.map((agent, index) => {
            const isSelected = selectedAgent === agent.name;
            return (
              <div key={index} className={`flex items-center justify-between py-2 px-2 rounded ${
                isSelected ? 'bg-blue-50 border border-blue-200' : ''
              }`}>
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                }`}>{agent.name}</span>
                <span className={`text-sm font-semibold ${
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                }`}>{agent.calls}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Discussed Topics */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Most discussed topics</h3>
        </div>
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-900">{topic.name}</span>
              <span className="text-sm font-semibold text-gray-900">{topic.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentsList;
