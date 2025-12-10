import React from 'react';
import { Calendar, Clock, Target, BookOpen } from 'lucide-react';

const ProfileHistory = ({ 
  user, 
  formatDate 
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Lịch sử làm bài thi
      </h3>
      <div className="space-y-4">
        {user.testHistory && user.testHistory.length > 0 ? (
          user.testHistory.map((test) => (
            <div key={test.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {test.testName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formatDate(test.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {test.totalQuestions} câu hỏi
                    </div>
                    <div className="flex items-center gap-1">
                      <Target size={16} />
                      {test.correctAnswers}/{test.totalQuestions} đúng
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(test.score)}`}>
                    {test.score}/100
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {test.level}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BookOpen size={64} className="mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-medium mb-2">Chưa có lịch sử thi</h4>
            <p>Hãy bắt đầu làm bài thi đầu tiên để xem lịch sử ở đây!</p>
          </div>
        )}
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

export default ProfileHistory;