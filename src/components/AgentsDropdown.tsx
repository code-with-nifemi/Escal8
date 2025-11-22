'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
}

interface AgentsDropdownProps {
  selectedAgent: string;
  onAgentChange: (agent: string) => void;
}

const AgentsDropdown: React.FC<AgentsDropdownProps> = ({ selectedAgent, onAgentChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const agents: Agent[] = [
    { id: 'all', name: 'All agents' },
    { id: 'middle_mgmt', name: 'Middle Management Queen' },
    { id: 'richard', name: 'Richard - CEO/Executive' },
    { id: 'jordan', name: 'Jordan - Help Desk Employee' },

  ];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAgentSelect = (agent: Agent) => {
    onAgentChange(agent.name);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-black font-medium hover:bg-gray-50 transition-colors"
      >
        <span>{selectedAgent}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Agents List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{agent.name}</span>
                {selectedAgent === agent.name && (
                  <Check size={16} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-700 text-center font-medium">
              No agents found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentsDropdown;
