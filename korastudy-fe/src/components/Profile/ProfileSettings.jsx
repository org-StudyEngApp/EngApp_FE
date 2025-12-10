import React from 'react';
import { Globe, Moon, Sun, Shield } from 'lucide-react';

const ProfileSettings = ({ 
  preferences, 
  theme, 
  toggleTheme, 
  handlePreferenceChange 
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Cài đặt học tập
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mức độ TOPIK mục tiêu
            </label>
            <select
              value={preferences.testLevel || 'TOPIK I'}
              onChange={(e) => handlePreferenceChange('testLevel', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="TOPIK I">TOPIK I (Level 1-2)</option>
              <option value="TOPIK II">TOPIK II (Level 3-6)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngôn ngữ giao diện
            </label>
            <select
              value={preferences.interfaceLanguage || 'Vietnamese'}
              onChange={(e) => handlePreferenceChange('interfaceLanguage', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Vietnamese">Tiếng Việt</option>
              <option value="Korean">한국어</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Giao diện & Hiển thị
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Chế độ tối</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bảo vệ mắt khi học vào ban đêm
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Bảo mật
        </h3>
        <div className="space-y-4">
          <button className="flex items-center gap-3 w-full p-4 text-left bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200">
            <Shield size={20} className="text-gray-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Đổi mật khẩu</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cập nhật mật khẩu để bảo mật tài khoản
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;