'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import TabbedMetricsWithChart from '@/components/TabbedMetricsWithChart';
import Charts from '@/components/Charts';
import AgentsList from '@/components/AgentsList';

export default function Home() {
  const [activeTab, setActiveTab] = useState('calls');

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Connected Tabbed Metrics with Chart + Success Rate Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Connected Tabbed Metrics with Chart */}
              <TabbedMetricsWithChart activeTab={activeTab} onTabChange={setActiveTab} />
              
              {/* Success Rate Chart */}
              <Charts />
            </div>
            
            {/* Right Column - Agents and Language Lists */}
            <div className="lg:col-span-1">
              <AgentsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
