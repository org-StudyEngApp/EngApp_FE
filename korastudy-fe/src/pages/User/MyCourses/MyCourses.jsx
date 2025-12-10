import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, PlayCircle, TrendingUp, Search, BookmarkPlus } from 'lucide-react';
import { getMyCourses } from '../../../services/userCourseService';
import { toast } from 'react-toastify';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const data = await getMyCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching my courses:', error);
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = (course) => {
    // Nếu có lastLessonId, tiếp tục từ bài đó, nếu không thì bắt đầu từ đầu
    if (course.lastLessonId) {
      navigate(`/learning/${course.courseId}/lesson/${course.lastLessonId}`);
    } else {
      // Chuyển đến trang learning, component sẽ tự động load bài đầu tiên
      navigate(`/learning/${course.courseId}`);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-64 bg-gray-200 dark:bg-dark-700 rounded-lg mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-dark-800 rounded-xl p-4 animate-pulse">
                <div className="bg-gray-200 dark:bg-dark-700 h-40 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-dark-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BookOpen className="text-white" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Bạn chưa đăng ký khóa học nào
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!
          </p>
          <button
            onClick={() => navigate('/khoahoc')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 inline-flex items-center gap-2"
          >
            <Search size={20} />
            Tìm khóa học ngay
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Khóa học của tôi
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Bạn đang theo học {courses.length} khóa học
              </p>
            </div>

            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.courseId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-dark-700 group"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden bg-gray-200 dark:bg-dark-700">
                <img
                  src={course.thumbnailUrl || '/api/placeholder/400/240'}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/240';
                  }}
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <TrendingUp size={14} />
                  {Math.round(course.progressPercentage)}%
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {course.title}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={16} />
                    <span>{course.totalLessons} bài học</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookmarkPlus size={16} />
                    <span>{course.completedLessons} hoàn thành</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tiến độ
                    </span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(course.progressPercentage)}% hoàn thành
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progressPercentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-sm"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStartLesson(course)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-purple-500/30 active:scale-95"
                >
                  <PlayCircle size={20} />
                  {course.progressPercentage > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {searchTerm && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Không tìm thấy khóa học nào phù hợp với "{searchTerm}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
