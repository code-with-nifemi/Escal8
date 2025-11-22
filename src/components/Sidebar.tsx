'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  BookOpen, 
  TestTube, 
  Phone, 
  Settings,
  Trophy
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
  ];

  const buildItems = [
    { icon: Users, label: 'Agents', href: '/agents' },
    { icon: BookOpen, label: 'Knowledge Base', href: '/knowledge-base' },
  ];

  const evaluateItems = [
    { icon: Users, label: 'Conversations', href: '#' },
    { icon: TestTube, label: 'Tests', href: '#' },
    { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  ];

  const telephonyItems = [
    { icon: Phone, label: 'Phone Numbers', href: '#' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  const renderMenuItem = (item: any) => {
    const isActive = pathname === item.href;
    const content = (
      <>
        <item.icon size={18} />
        <span className="text-sm font-medium">{item.label}</span>
        {item.badge && (
          <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {item.badge}
          </span>
        )}
      </>
    );

    if (item.href === '#') {
      return (
        <div
          key={item.label}
          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isActive 
            ? 'bg-gray-100 text-gray-900' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        {content}
      </Link>
    );
  };

  const renderSection = (title: string, items: any[]) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map(renderMenuItem)}
      </div>
    </div>
  );

  return (
    <div className="fixed left-0 top-0 w-64 bg-white border-r border-gray-200 h-screen flex flex-col z-10">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E8</span>
          </div>
          <span className="font-semibold text-lg text-gray-900">Escal8</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="mb-6">
          <div className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </div>
        </div>

        {renderSection('Build', buildItems)}
        {renderSection('Evaluate', evaluateItems)}
        {renderSection('Telephony', telephonyItems)}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-1">
          {bottomItems.map(renderMenuItem)}
        </div>
        
        {/* User Profile */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">T</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                TechCorp Solutions
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
