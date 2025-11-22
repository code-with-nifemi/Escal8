'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import AgentsDropdown from './AgentsDropdown';

const DashboardHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Active calls indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Active calls: 0</span>
          </div>
        </div>

        {/* Right side - Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Workspace info */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-1">My Workspace</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Good afternoon, Tanda hackathon team</h1>
        
        {/* Filter controls */}
        <div className="flex items-center gap-4">
          <AgentsDropdown />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
