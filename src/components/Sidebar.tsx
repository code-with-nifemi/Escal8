'use client';

import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Wrench, 
  Mic, 
  TestTube, 
  Link, 
  Phone, 
  PhoneOutgoing, 
  Settings,
  Code,
  Bell,
  ArrowUp
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
  ];

  const buildItems = [
    { icon: Users, label: 'Agents' },
    { icon: BookOpen, label: 'Knowledge Base' },
    { icon: Wrench, label: 'Tools' },
    { icon: Mic, label: 'Voices' },
  ];

  const evaluateItems = [
    { icon: Users, label: 'Conversations' },
    { icon: TestTube, label: 'Tests', badge: 'New' },
  ];

  const integrationItems = [
    { icon: Link, label: 'Integrations' },
  ];

  const telephonyItems = [
    { icon: Phone, label: 'Phone Numbers' },
    { icon: PhoneOutgoing, label: 'Outbound' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings' },
    { icon: Code, label: 'Developers' },
    { icon: Bell, label: 'Notifications' },
    { icon: ArrowUp, label: 'Upgrade' },
  ];

  const renderMenuItem = (item: any, isActive = false) => (
    <div
      key={item.label}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-gray-100 text-gray-900' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <item.icon size={18} />
      <span className="text-sm font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          {item.badge}
        </span>
      )}
    </div>
  );

  const renderSection = (title: string, items: any[]) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map(item => renderMenuItem(item))}
      </div>
    </div>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E8</span>
          </div>
          <span className="font-semibold text-lg">Escal8</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="mb-6">
          <div className="space-y-1">
            {menuItems.map(item => renderMenuItem(item, item.active))}
          </div>
        </div>

        {renderSection('Build', buildItems)}
        {renderSection('Evaluate', evaluateItems)}
        {renderSection('Integrations', integrationItems)}
        {renderSection('Telephony', telephonyItems)}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          {bottomItems.map(item => renderMenuItem(item))}
        </div>
        
        {/* User Profile */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">T</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Tanda hackathon team
              </p>
              <p className="text-xs text-gray-500 truncate">My Workspace</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
