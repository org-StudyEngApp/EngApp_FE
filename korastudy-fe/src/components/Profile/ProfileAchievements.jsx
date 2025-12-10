import React from 'react';
import { Trophy, Target, Award, Clock } from 'lucide-react';

const ProfileAchievements = ({ user }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Huy hiệu & Thành tích
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user.badges && user.badges.length > 0 ? (
          user.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-6 rounded-lg border-2 text-center transition-all duration-200 ${
                badge.earned
                  ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-dark-600 dark:bg-dark-700 opacity-60'
              }`}
            >
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {badge.name}
              </h4>
              <p className={`text-sm ${
                badge.earned 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {badge.earned ? 'Đã đạt được' : 'Chưa đạt được'}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            <Trophy size={64} className="mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-medium mb-2">Chưa có huy hiệu</h4>
            <p>Hãy tham gia các bài thi để nhận huy hiệu!</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thống kê học tập
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Trophy className="text-blue-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {user.stats?.totalTests || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng số bài thi</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Target className="text-green-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {user.stats?.averageScore || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Award className="text-yellow-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {user.stats?.studyStreak || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ngày học liên tiếp</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Clock className="text-purple-500 mx-auto mb-2" size={24} />
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user.stats?.totalStudyHours || 0}h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng thời gian học</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAchievements;