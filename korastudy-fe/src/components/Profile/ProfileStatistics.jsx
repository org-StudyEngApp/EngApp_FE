import React, { useEffect, useState } from 'react';
import { examService } from '../../api/ExamService';
import { BookOpen, Headphones, BarChart3, TrendingUp, Target, Award, Clock, FileCheck } from 'lucide-react';

const ProfileStatistics = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await examService.getStatistics(userId);
        setStats(response);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Không thể tải thống kê. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Không có dữ liệu thống kê</p>
      </div>
    );
  }

  const hasData = stats.overallStatistics?.numberOfExamsTaken > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <BarChart3 className="text-gray-300 dark:text-gray-600 mb-4" size={80} />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có dữ liệu thống kê
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Bạn chưa làm bài thi nào. Hãy bắt đầu làm bài để xem thống kê của bạn!
        </p>
        <a
          href="/exam"
          className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
        >
          Làm bài thi ngay
        </a>
      </div>
    );
  }

  const StatCard = ({ title, icon: Icon, statistics, colorClass, bgClass }) => {
    const hasExams = statistics?.numberOfExamsTaken > 0;
    
    return (
      <div className={`${bgClass} rounded-xl shadow-sm p-6 border border-gray-200 dark:border-dark-700`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`${colorClass} bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg`}>
              <Icon className={colorClass} size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
        </div>

        {hasExams ? (
          <div className="space-y-4">
            {/* Row 1: Số bài và Độ chính xác */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="text-gray-400" size={16} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Số bài đã làm</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statistics.numberOfExamsTaken}
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-gray-400" size={16} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</p>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {statistics.accuracy.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Row 2: Điểm trung bình và Câu đúng/Tổng câu */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-gray-400" size={16} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</p>
                </div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {statistics.averageScore.toFixed(1)}
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="text-gray-400" size={16} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tổng câu đúng</p>
                </div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {statistics.totalCorrectAnswers}/{statistics.totalQuestionsAttempted}
                </p>
              </div>
            </div>

            {/* Row 3: Điểm cao nhất và thấp nhất */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Điểm cao nhất</p>
                <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {statistics.highestScore.toFixed(1)}
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Điểm thấp nhất</p>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                  {statistics.lowestScore.toFixed(1)}
                </p>
              </div>
            </div>

            {/* Thời gian trung bình (nếu có) */}
            {statistics.averageTimeMinutes && (
              <div className="bg-white dark:bg-dark-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-gray-400" size={16} />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Thời gian TB</p>
                </div>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {statistics.averageTimeMinutes.toFixed(1)} phút
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có dữ liệu cho loại bài thi này
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Thống kê bài thi
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Xem chi tiết kết quả và tiến độ học tập của bạn
        </p>
      </div>

      {/* Overall Statistics - Highlight */}
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <BarChart3 size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Thống kê tổng quan</h3>
            <p className="text-sky-100 text-sm">Bao gồm tất cả các loại bài thi</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sky-100 text-sm mb-1">Tổng số bài</p>
            <p className="text-3xl font-bold">{stats.overallStatistics.numberOfExamsTaken}</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sky-100 text-sm mb-1">Độ chính xác</p>
            <p className="text-3xl font-bold">{stats.overallStatistics.accuracy.toFixed(1)}%</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sky-100 text-sm mb-1">Điểm TB</p>
            <p className="text-3xl font-bold">{stats.overallStatistics.averageScore.toFixed(1)}</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sky-100 text-sm mb-1">Tổng câu đúng</p>
            <p className="text-3xl font-bold">
              {stats.overallStatistics.totalCorrectAnswers}/
              {stats.overallStatistics.totalQuestionsAttempted}
            </p>
          </div>
        </div>
      </div>

      {/* Reading and Listening Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-green-600 dark:text-green-400 bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg bg-green-600">
                <BookOpen className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reading Statistics</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reading riêng + phần Reading từ Full Test</p>
              </div>
            </div>
          </div>

          {stats.readingStatistics.numberOfExamsTaken > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Số bài đã làm</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.readingStatistics.numberOfExamsTaken}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.readingStatistics.accuracy.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.readingStatistics.averageScore.toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tổng câu đúng</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.readingStatistics.totalCorrectAnswers}/{stats.readingStatistics.totalQuestionsAttempted}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Điểm cao nhất</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.readingStatistics.highestScore.toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Điểm thấp nhất</p>
                  <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                    {stats.readingStatistics.lowestScore.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có dữ liệu Reading
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-purple-600 dark:text-purple-400 bg-opacity-10 dark:bg-opacity-20 p-3 rounded-lg bg-purple-600">
                <Headphones className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Listening Statistics</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Listening riêng + phần Listening từ Full Test</p>
              </div>
            </div>
          </div>

          {stats.listeningStatistics.numberOfExamsTaken > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Số bài đã làm</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.listeningStatistics.numberOfExamsTaken}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.listeningStatistics.accuracy.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.listeningStatistics.averageScore.toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="text-gray-400" size={16} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tổng câu đúng</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.listeningStatistics.totalCorrectAnswers}/{stats.listeningStatistics.totalQuestionsAttempted}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Điểm cao nhất</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.listeningStatistics.highestScore.toFixed(1)}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Điểm thấp nhất</p>
                  <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                    {stats.listeningStatistics.lowestScore.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có dữ liệu Listening
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full Test Statistics - Đề thi thật */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <FileCheck size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Full Test Statistics</h3>
            <p className="text-orange-100 text-sm">Đề thi thật hoàn chỉnh - 200 câu (100 Reading + 100 Listening)</p>
          </div>
        </div>

        {stats.fullTestStatistics.numberOfExamsTaken > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-orange-100 text-sm mb-1">Số đề đã làm</p>
                <p className="text-3xl font-bold">{stats.fullTestStatistics.numberOfExamsTaken}</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-orange-100 text-sm mb-1">Độ chính xác</p>
                <p className="text-3xl font-bold">{stats.fullTestStatistics.accuracy.toFixed(1)}%</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-orange-100 text-sm mb-1">Điểm TB</p>
                <p className="text-3xl font-bold">{stats.fullTestStatistics.averageScore.toFixed(0)}</p>
              </div>
              
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-orange-100 text-sm mb-1">Điểm cao nhất</p>
                <p className="text-3xl font-bold">{stats.fullTestStatistics.highestScore.toFixed(0)}</p>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-orange-100 text-sm mb-2">
                💡 <strong>Lưu ý:</strong> Khi bạn làm 1 đề Full Test:
              </p>
              <ul className="text-orange-50 text-sm space-y-1">
                <li>• Số bài Reading tăng +1 (100 câu Reading trong Full Test)</li>
                <li>• Số bài Listening tăng +1 (100 câu Listening trong Full Test)</li>
                <li>• Số đề Full Test tăng +1 (đề hoàn chỉnh 200 câu)</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-orange-100 mb-4">
              Bạn chưa làm đề thi thật nào. Hãy thử sức với đề thi 200 câu để đánh giá năng lực tổng hợp!
            </p>
            <a
              href="/exam"
              className="inline-block px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-semibold"
            >
              Làm đề thi thật
            </a>
          </div>
        )}
      </div>

      {/* Performance Comparison */}
      {stats.readingStatistics.numberOfExamsTaken > 0 && stats.listeningStatistics.numberOfExamsTaken > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            So sánh hiệu suất
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác Reading</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stats.readingStatistics.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${stats.readingStatistics.accuracy}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác Listening</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {stats.listeningStatistics.accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${stats.listeningStatistics.accuracy}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {stats.readingStatistics.accuracy > stats.listeningStatistics.accuracy ? (
                  <>
                    <span className="font-semibold text-green-600 dark:text-green-400">Reading</span> là điểm mạnh của bạn! 
                    Hãy cố gắng cải thiện <span className="font-semibold text-purple-600 dark:text-purple-400">Listening</span> thêm nữa.
                  </>
                ) : stats.listeningStatistics.accuracy > stats.readingStatistics.accuracy ? (
                  <>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Listening</span> là điểm mạnh của bạn! 
                    Hãy cố gắng cải thiện <span className="font-semibold text-green-600 dark:text-green-400">Reading</span> thêm nữa.
                  </>
                ) : (
                  <>Bạn có kỹ năng Reading và Listening cân bằng! Tiếp tục phát huy nhé! 🎉</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Test Insights */}
      {stats.fullTestStatistics.numberOfExamsTaken > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-dark-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Phân tích Full Test
          </h3>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                🎯 Cách tính điểm mới
              </h4>
              <div className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
                <p>
                  <strong>Reading Statistics:</strong> Bao gồm bài Reading riêng (30 câu) + phần Reading từ Full Test (100 câu)
                </p>
                <p>
                  <strong>Listening Statistics:</strong> Bao gồm bài Listening riêng (25 câu) + phần Listening từ Full Test (100 câu)
                </p>
                <p>
                  <strong>Full Test Statistics:</strong> Chỉ tính đề thi thật hoàn chỉnh (200 câu)
                </p>
                <div className="mt-3 pt-3 border-t border-blue-300 dark:border-blue-700">
                  <p className="font-semibold">Ví dụ: Nếu bạn làm 1 đề Full Test</p>
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>→ Reading Statistics +1 (vì có 100 câu Reading trong đó)</li>
                    <li>→ Listening Statistics +1 (vì có 100 câu Listening trong đó)</li>
                    <li>→ Full Test Statistics +1 (đề hoàn chỉnh 200 câu)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                Về Full Test (Đề thi thật)
              </h4>
              <ul className="text-sm text-orange-800 dark:text-orange-400 space-y-1">
                <li>• <strong>200 câu:</strong> Part 1-4 (Listening - 100 câu) + Part 5-7 (Reading - 100 câu)</li>
                <li>• <strong>Thời gian:</strong> 120 phút (45 phút Listening + 75 phút Reading)</li>
                <li>• <strong>Điểm:</strong> Thang điểm 990 (mỗi phần 495 điểm)</li>
                <li>• <strong>Mục đích:</strong> Mô phỏng kỳ thi TOEIC chính thức</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng câu đã làm</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.fullTestStatistics.totalQuestionsAttempted}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng câu đúng</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.fullTestStatistics.totalCorrectAnswers}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Điểm thấp nhất</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {stats.fullTestStatistics.lowestScore.toFixed(0)}
                </p>
              </div>
            </div>

            {stats.fullTestStatistics.averageScore >= 850 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-300 text-center">
                  🎉 <strong>Xuất sắc!</strong> Điểm trung bình của bạn đạt {stats.fullTestStatistics.averageScore.toFixed(0)} - 
                  đây là kết quả rất tốt! Tiếp tục duy trì nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStatistics;
