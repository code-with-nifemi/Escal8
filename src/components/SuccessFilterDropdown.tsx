'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FilterOption {
  id: string;
  name: string;
}

const SuccessFilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Success');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filterOptions: FilterOption[] = [
    { id: 'success', name: 'Success' },
    { id: 'failure', name: 'Failure' },
    { id: 'unknown', name: 'Unknown' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelect = (option: FilterOption) => {
    setSelectedFilter(option.name);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors min-w-[100px]"
      >
        <span>{selectedFilter}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleFilterSelect(option)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{option.name}</span>
                {selectedFilter === option.name && (
                  <Check size={14} className="text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessFilterDropdown;
