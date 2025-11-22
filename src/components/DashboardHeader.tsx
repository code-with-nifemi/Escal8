'use client';

import React from 'react';
import AgentsDropdown from './AgentsDropdown';

interface DashboardHeaderProps {
  selectedAgent: string;
  onAgentChange: (agent: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ selectedAgent, onAgentChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        {/* Active calls indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">Active calls: 0</span>
        </div>
      </div>

      {/* Workspace info */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-1">My Workspace</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Good afternoon, Tanda hackathon team</h1>
        
        {/* Filter controls */}
        <div className="flex items-center gap-4">
          <AgentsDropdown selectedAgent={selectedAgent} onAgentChange={onAgentChange} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
