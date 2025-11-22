'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import TabbedMetricsWithChart from '@/components/TabbedMetricsWithChart';
import Charts from '@/components/Charts';
import AgentsList from '@/components/AgentsList';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('calls');
  const [selectedAgent, setSelectedAgent] = useState('All agents');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader selectedAgent={selectedAgent} onAgentChange={setSelectedAgent} />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Top Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Connected Tabbed Metrics with Chart */}
            <div className="lg:col-span-2">
              {/* Connected Tabbed Metrics with Chart */}
              <TabbedMetricsWithChart activeTab={activeTab} onTabChange={setActiveTab} selectedAgent={selectedAgent} />
            </div>
            
            {/* Right Column - Agents List */}
            <div className="lg:col-span-1">
              <AgentsList selectedAgent={selectedAgent} />
            </div>
          </div>
          
          {/* Full Width Bottom Chart */}
          <div className="w-full">
            <Charts selectedAgent={selectedAgent} />
          </div>
        </main>
      </div>
    </div>
  );
}
