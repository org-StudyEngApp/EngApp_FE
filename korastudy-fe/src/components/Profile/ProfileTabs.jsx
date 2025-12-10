import React from 'react';
import { User, BookOpen, Trophy, Settings } from 'lucide-react';

const ProfileTabs = ({ activeTab, handleTabChange }) => {
  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: User },
    { id: 'history', name: 'Lịch sử thi', icon: BookOpen },
    { id: 'achievements', name: 'Thành tích', icon: Trophy },
    { id: 'settings', name: 'Cài đặt', icon: Settings }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-dark-700">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={18} />
              {tab.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs;