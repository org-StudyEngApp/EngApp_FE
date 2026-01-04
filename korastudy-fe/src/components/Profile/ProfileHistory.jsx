import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Target, BookOpen, TrendingUp, Award } from 'lucide-react';
import { examService } from '../../api/ExamService';

const ProfileHistory = ({ user }) => {
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamHistory = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await examService.getExamHistory(user.id);
        setExamHistory(response);
      } catch (error) {
        console.error('Error fetching exam history:', error);
        setError('Không thể tải lịch sử làm bài. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, [user?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getExamTypeLabel = (examType) => {
    switch (examType) {
      case 'READING': return '📖 Reading';
      case 'LISTENING': return '🎧 Listening';
      case 'FULL_TEST': return '🎯 Full Test';
      default: return examType;
    }
  };

  const getExamTypeBadgeColor = (examType) => {
    switch (examType) {
      case 'READING': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'LISTENING': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'FULL_TEST': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải lịch sử làm bài...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Lịch sử làm bài thi
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Xem lại tất cả các bài thi bạn đã hoàn thành
        </p>
      </div>

      <div className="space-y-4">
        {examHistory && examHistory.length > 0 ? (
          examHistory.map((exam) => (
            <div 
              key={exam.id} 
              className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {exam.examTitle || 'Bài thi'}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExamTypeBadgeColor(exam.examType)}`}>
                      {getExamTypeLabel(exam.examType)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="flex-shrink-0" />
                      <span>{formatDate(exam.submittedAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <BookOpen size={16} className="flex-shrink-0" />
                      <span>{exam.totalQuestions || 0} câu hỏi</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Target size={16} className="flex-shrink-0" />
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {exam.correctAnswers || 0}/{exam.totalQuestions || 0} đúng
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Award size={16} className="flex-shrink-0" />
                      <span>
                        {exam.accuracy ? `${exam.accuracy.toFixed(1)}%` : '0%'} chính xác
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={20} className="text-gray-400" />
                      <span className={`text-3xl font-bold ${getScoreColor(exam.scores || 0)}`}>
                        {exam.scores ? exam.scores.toFixed(1) : '0'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Điểm số
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 dark:bg-dark-700 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={48} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Chưa có lịch sử làm bài
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Hãy bắt đầu làm bài thi đầu tiên để xem lịch sử ở đây!
            </p>
            <a
              href="/exam"
              className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
            >
              Làm bài thi ngay
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHistory;