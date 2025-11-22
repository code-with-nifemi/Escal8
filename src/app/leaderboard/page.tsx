'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LeaderboardHeader from '@/components/LeaderboardHeader';
import LeaderboardTable from '@/components/LeaderboardTable';
import MetricSelector from '@/components/MetricSelector';

export default function LeaderboardPage() {
  const [selectedView, setSelectedView] = useState('Agents');
  const [selectedMetric, setSelectedMetric] = useState('buzzwords');

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <LeaderboardHeader selectedView={selectedView} onViewChange={setSelectedView} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedView} Leaderboard
            </h1>
            <p className="text-gray-600">
              Compare {selectedView.toLowerCase()} performance across key metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <MetricSelector selectedMetric={selectedMetric} onMetricChange={setSelectedMetric} />
            <LeaderboardTable selectedMetric={selectedMetric} selectedView={selectedView} />
          </div>
        </main>
      </div>
    </div>
  );
}
