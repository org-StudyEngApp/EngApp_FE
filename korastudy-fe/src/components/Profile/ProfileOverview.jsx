import React from 'react';
import { User, Mail, Calendar, Phone, Users, BookOpen } from 'lucide-react';

const ProfileOverview = ({ 
  user, 
  getGenderDisplay, 
  formatDate 
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Thông tin cá nhân
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <User className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Họ</p>
            <p className="font-medium text-gray-900 dark:text-white">{user.firstName || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <User className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tên</p>
            <p className="font-medium text-gray-900 dark:text-white">{user.lastName || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
            <p className="font-medium text-gray-900 dark:text-white">{user.email || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại</p>
            <p className="font-medium text-gray-900 dark:text-white">{user.phoneNumber || 'Chưa cập nhật'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Users className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Giới tính</p>
            <p className="font-medium text-gray-900 dark:text-white">{getGenderDisplay(user.gender)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="text-gray-400" size={20} />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ngày sinh</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Chưa cập nhật'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-3">
          {user.testHistory && user.testHistory.length > 0 ? (
            user.testHistory.slice(0, 3).map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{test.testName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(test.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getScoreColor(test.score)}`}>{test.score}/100</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{test.level}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p>Chưa có hoạt động nào</p>
              <p className="text-sm">Hãy bắt đầu làm bài thi đầu tiên của bạn!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add the getScoreColor function since it's used in this component
const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-blue-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

export default ProfileOverview;