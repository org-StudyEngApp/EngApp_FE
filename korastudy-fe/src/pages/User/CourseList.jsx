import React, { useEffect, useState } from 'react';
import { Loader2, Search, Filter } from 'lucide-react';
import { getPublicCourses } from '../../services/userCourseService';
import CourseCard from '../../components/LearningPathComponent/CourseCardNew';

/**
 * CourseList - Danh sách khóa học
 * Layout: Grid responsive (1 cột mobile, 3 cột desktop)
 * Thiết kế hiện đại với Tailwind CSS
 */
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getPublicCourses();
        setCourses(data ?? []);
      } catch (err) {
        setError(err?.message ?? 'Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses theo search term
  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Khóa học tiếng Anh
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
              Khám phá và nâng cao kỹ năng tiếng Anh của bạn với các khóa học chất lượng
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border-0 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Stats Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {loading ? (
              <span>Đang tải...</span>
            ) : (
              <span className="font-medium">
                Tìm thấy <span className="text-indigo-600">{filteredCourses.length}</span> khóa học
                {searchTerm && ` cho "${searchTerm}"`}
              </span>
            )}
          </div>
          
          {/* Filter Button (Optional) */}
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:border-gray-400">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 rounded-xl border-l-4 border-red-500 bg-red-50 p-6 shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-indigo-600" />
              <p className="mt-4 text-sm font-medium text-gray-600">Đang tải khóa học...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredCourses.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-white p-12 shadow-sm">
                <div className="text-center">
                  <div className="mx-auto h-24 w-24 text-gray-300">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {searchTerm ? 'Không tìm thấy khóa học' : 'Chưa có khóa học nào'}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {searchTerm 
                      ? 'Thử tìm kiếm với từ khóa khác' 
                      : 'Các khóa học sẽ sớm được cập nhật'}
                  </p>
                </div>
              </div>
            ) : (
              /* Course Grid - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.courseId} course={course} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CourseList;
