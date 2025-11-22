'use client';

import React from 'react';
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface LeaderboardTableProps {
  selectedMetric: string;
  selectedView: string;
}

interface AgentData {
  name: string;
  buzzwords: number;
  contradictions: number;
  rageQuits: number;
  transfers: number;
  promises: number;
  mispronunciations: number;
}

interface CompanyData {
  name: string;
  buzzwords: number;
  contradictions: number;
  rageQuits: number;
  transfers: number;
  promises: number;
  mispronunciations: number;
}

const agentData: AgentData[] = [
  {
    name: 'Jordan - Help Desk Employee',
    buzzwords: 22.3,
    contradictions: 11,
    rageQuits: 4,
    transfers: 2,
    promises: 1,
    mispronunciations: 3,
  },
  {
    name: 'Middle Management Queen',
    buzzwords: 28.5,
    contradictions: 15,
    rageQuits: 8,
    transfers: 6,
    promises: 4,
    mispronunciations: 7,
  },
  {
    name: 'Richard - CEO/Executive',
    buzzwords: 29.7,
    contradictions: 13,
    rageQuits: 6,
    transfers: 3,
    promises: 5,
    mispronunciations: 2,
  },
];

const companyData: CompanyData[] = [
  {
    name: 'TechCorp Solutions',
    buzzwords: 18.2,
    contradictions: 8,
    rageQuits: 3,
    transfers: 12,
    promises: 5,
    mispronunciations: 7,
  },
  {
    name: 'Global Industries',
    buzzwords: 21.5,
    contradictions: 12,
    rageQuits: 5,
    transfers: 18,
    promises: 9,
    mispronunciations: 11,
  },
  {
    name: 'StartupHub Inc',
    buzzwords: 25.8,
    contradictions: 18,
    rageQuits: 9,
    transfers: 25,
    promises: 14,
    mispronunciations: 16,
  },
  {
    name: 'Enterprise Corp',
    buzzwords: 28.1,
    contradictions: 22,
    rageQuits: 12,
    transfers: 31,
    promises: 18,
    mispronunciations: 23,
  },
];

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ selectedMetric, selectedView }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</span>;
    }
  };

  const getMetricValue = (item: AgentData | CompanyData, metric: string) => {
    switch (metric) {
      case 'buzzwords':
        return `${item.buzzwords}/min`;
      case 'contradictions':
        return item.contradictions;
      case 'rage-quits':
        return item.rageQuits;
      case 'transfers':
        return item.transfers;
      case 'promises':
        return item.promises;
      case 'mispronunciations':
        return item.mispronunciations;
      default:
        return 0;
    }
  };

  const getSortedData = (metric: string) => {
    const data = selectedView === 'Agents' ? agentData : companyData;
    const sorted = [...data].sort((a, b) => {
      switch (metric) {
        case 'buzzwords':
          return b.buzzwords - a.buzzwords; // Higher is better for buzzwords
        case 'contradictions':
          return b.contradictions - a.contradictions; // Higher is better
        case 'rage-quits':
          return b.rageQuits - a.rageQuits; // Higher is better
        case 'transfers':
          return b.transfers - a.transfers; // Higher is better
        case 'promises':
          return b.promises - a.promises; // Higher is better
        case 'mispronunciations':
          return b.mispronunciations - a.mispronunciations; // Higher is better
        default:
          return b.buzzwords - a.buzzwords; // Default to buzzwords
      }
    });
    return sorted;
  };

  const getMetricTitle = (metric: string) => {
    switch (metric) {
      case 'buzzwords':
        return 'Buzzwords Per Minute';
      case 'contradictions':
        return 'Policy Contradictions';
      case 'rage-quits':
        return 'Rage Quits';
      case 'transfers':
        return 'Number of Transfers';
      case 'promises':
        return 'Unfulfillable Promises Made';
      case 'mispronunciations':
        return 'Name Mispronunciations';
      default:
        return 'Metrics';
    }
  };

  const getPerformanceIndicator = (rank: number, total: number) => {
    const percentage = (rank - 1) / (total - 1);
    if (percentage <= 0.33) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (percentage >= 0.67) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <div className="w-4 h-4 rounded-full bg-yellow-400"></div>;
  };

  const sortedData = getSortedData(selectedMetric);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedView} Rankings by {getMetricTitle(selectedMetric)}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {selectedView === 'Agents' ? 'Agent' : 'Company'}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {getMetricTitle(selectedMetric)}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => {
              const rank = index + 1;
              return (
                <tr key={item.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRankIcon(rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {item.name.split(' ')[0][0]}{item.name.split(' ')[1] ? item.name.split(' ')[1][0] : ''}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {getMetricValue(item, selectedMetric)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPerformanceIndicator(rank, sortedData.length)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total {selectedView}: {sortedData.length}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Top Performer</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span>Average</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span>Needs Improvement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;
