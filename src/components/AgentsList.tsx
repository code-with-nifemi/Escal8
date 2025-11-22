'use client';

import React from 'react';

const AgentsList = () => {
  const agents = [
    {
      name: 'Middle Management Queen',
      calls: 14,
    },
    {
      name: 'Jordan - Help Desk Employee',
      calls: 2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Most Called Agents */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Most called agents</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Calls</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Show all →
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {agents.map((agent, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-900">{agent.name}</span>
              <span className="text-sm font-semibold text-gray-900">{agent.calls}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentsList;
