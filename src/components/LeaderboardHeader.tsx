'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface LeaderboardHeaderProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({ selectedView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const viewOptions = ['Agents', 'Companies'];

  const handleSelect = (view: string) => {
    onViewChange(view);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      </div>

      {/* Workspace info */}
      <div className="mt-6">
        <p className="text-sm text-gray-500 mb-1">My Workspace</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Good afternoon, TechCorp Solutions</h1>
        
        {/* Filter controls */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center justify-between w-48 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-black font-medium shadow-sm hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{selectedView}</span>
              <ChevronDown size={16} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100">
                <div className="py-1">
                  {viewOptions.map((view) => (
                    <div
                      key={view}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelect(view)}
                    >
                      <span>{view}</span>
                      {selectedView === view && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
