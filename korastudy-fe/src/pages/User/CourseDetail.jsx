import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Loader2,
  Lock,
  PlayCircle,
  Star,
  Users,
  BookOpen,
  Award,
  Globe,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { getCourseDetail } from '../../services/userCourseService';
import { enrollCourse, checkEnrollment } from '../../services/enrollmentService';
import { useUser } from '../../contexts/UserContext';

/**
 * CourseDetail - Trang chi tiết khóa học
 * Layout: 2 cột (Content bên trái + Sidebar bên phải)
 */
const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openSections, setOpenSections] = useState(new Set());
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      setLoading(true);
      setError('');
      try {
        const data = await getCourseDetail(courseId);
        setCourse(data);
        // Mở section đầu tiên mặc định
        if (data?.sections?.length > 0) {
          setOpenSections(new Set([data.sections[0].sectionId]));
        }
      } catch (err) {
        setError(err?.message ?? 'Không thể tải thông tin khóa học.');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Kiểm tra enrollment status
  useEffect(() => {
    const checkUserEnrollment = async () => {
      if (!user?.id || !courseId) {
        setIsEnrolled(false);
        return;
      }

      setCheckingEnrollment(true);
      try {
        const enrolled = await checkEnrollment(user.id, courseId);
        setIsEnrolled(!!enrolled);
      } catch (err) {
        console.error('Error checking enrollment:', err);
        setIsEnrolled(false);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkUserEnrollment();
  }, [user, courseId]);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 phút';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}p`;
  };

  const calculateTotalDuration = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce((total, section) => {
      return total + (section.lessons || []).reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
    }, 0);
  };

  const calculateTotalLessons = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce((total, section) => total + (section.lessons || []).length, 0);
  };

  const hasAccess = isEnrolled; // Check if user enrolled

  const handleEnroll = () => {
    if (!user) {
      // Chưa đăng nhập -> redirect to login
      navigate('/login', { state: { from: `/course/${courseId}` } });
      return;
    }

    if (hasAccess) {
      // Đã đăng ký -> Vào học
      const firstLesson = course?.sections?.[0]?.lessons?.[0];
      if (firstLesson) {
        navigate(`/learning/${courseId}/${firstLesson.lessonId}`);
      }
    } else {
      // Chưa đăng ký -> Hiện modal xác nhận
      setShowEnrollModal(true);
    }
  };

  const handleConfirmEnroll = async () => {
    if (!user?.id || !courseId) return;

    setEnrolling(true);
    try {
      await enrollCourse(parseInt(courseId), user.id);
      setIsEnrolled(true);
      setEnrollSuccess(true);
      
      // Đóng modal sau 2 giây và chuyển đến trang học
      setTimeout(() => {
        setShowEnrollModal(false);
        setEnrollSuccess(false);
        const firstLesson = course?.sections?.[0]?.lessons?.[0];
        if (firstLesson) {
          navigate(`/learning/${courseId}/${firstLesson.lessonId}`);
        }
      }, 2000);
    } catch (err) {
      console.error('Error enrolling course:', err);
      alert(err?.message || 'Đăng ký khóa học thất bại. Vui lòng thử lại!');
    } finally {
      setEnrolling(false);
    }
  };

  const handleTrialLesson = (lessonId) => {
    navigate(`/learning/${courseId}/${lessonId}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8 h-10 w-3/4 rounded-lg bg-gray-200"></div>
            <div className="mb-4 h-6 w-1/2 rounded bg-gray-200"></div>
            
            {/* Content Grid */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 rounded-xl bg-gray-200"></div>
                <div className="h-32 rounded-xl bg-gray-200"></div>
              </div>
              <div className="h-96 rounded-xl bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-xl border-l-4 border-red-500 bg-white p-8 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">Không thể tải khóa học</h3>
              <p className="mt-2 text-sm text-gray-600">{error || 'Khóa học không tồn tại'}</p>
              <button
                onClick={() => navigate('/courses')}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalDuration = calculateTotalDuration();
  const totalLessons = calculateTotalLessons();

  // Enrollment Modal Component
  const EnrollmentModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        {/* Close Button */}
        {!enrolling && !enrollSuccess && (
          <button
            onClick={() => setShowEnrollModal(false)}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {enrollSuccess ? (
          // Success State
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">Đăng ký thành công!</h3>
            <p className="text-gray-600">Đang chuyển đến trang học...</p>
          </div>
        ) : (
          // Confirm State
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Xác nhận đăng ký</h3>
              <p className="text-gray-600">Bạn có chắc muốn đăng ký khóa học này?</p>
            </div>

            {/* Course Info */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-semibold text-gray-900">{course?.title}</h4>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{totalLessons} bài học</span>
                <span className="text-xl font-bold text-blue-600">{formatPrice(course?.price)}</span>
              </div>
            </div>

            {/* Warning */}
            {course?.price > 0 && (
              <div className="mb-6 flex gap-3 rounded-lg bg-yellow-50 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Hiện tại hệ thống đang trong giai đoạn thử nghiệm. Bạn có thể đăng ký miễn phí.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowEnrollModal(false)}
                disabled={enrolling}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmEnroll}
                disabled={enrolling}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {enrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enrollment Modal */}
      {showEnrollModal && <EnrollmentModal />}
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                {course.title}
              </h1>
              <p className="mt-4 text-lg text-blue-100">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course.totalStudents || 0} học viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{totalLessons} bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Curriculum Section */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Nội dung khóa học</h2>
              
              <div className="space-y-3">
                {course.sections && course.sections.length > 0 ? (
                  course.sections.map((section) => {
                    const isOpen = openSections.has(section.sectionId);
                    const sectionDuration = (section.lessons || []).reduce(
                      (sum, lesson) => sum + (lesson.duration || 0),
                      0
                    );

                    return (
                      <div key={section.sectionId} className="overflow-hidden rounded-lg border border-gray-200">
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.sectionId)}
                          className="flex w-full items-center justify-between bg-gray-50 px-4 py-4 text-left transition-colors hover:bg-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            {isOpen ? (
                              <ChevronDown className="h-5 w-5 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-600" />
                            )}
                            <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{section.lessons?.length || 0} bài</span>
                            <span>{formatDuration(sectionDuration)}</span>
                          </div>
                        </button>

                        {/* Lessons List */}
                        {isOpen && (
                          <div className="divide-y divide-gray-100 bg-white">
                            {(section.lessons || []).map((lesson) => {
                              const canPlay = lesson.isTrial || hasAccess;

                              return (
                                <div
                                  key={lesson.lessonId}
                                  className={`flex items-center justify-between px-4 py-3 transition-colors ${
                                    canPlay ? 'cursor-pointer hover:bg-blue-50' : 'cursor-not-allowed bg-gray-50'
                                  }`}
                                  onClick={() => canPlay && handleTrialLesson(lesson.lessonId)}
                                >
                                  <div className="flex items-center gap-3">
                                    {canPlay ? (
                                      <PlayCircle className="h-5 w-5 text-blue-600" />
                                    ) : (
                                      <Lock className="h-5 w-5 text-gray-400" />
                                    )}
                                    <div>
                                      <p className={`text-sm font-medium ${canPlay ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {lesson.title}
                                      </p>
                                      {lesson.isTrial && !hasAccess && (
                                        <span className="mt-1 inline-block rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                          Học thử
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDuration(lesson.duration)}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500 py-8">Chưa có nội dung khóa học</p>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Mô tả khóa học</h2>
              <div className="prose prose-blue max-w-none text-gray-700">
                {course.description || 'Chưa có mô tả chi tiết'}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Thumbnail Card */}
              <div className="overflow-hidden rounded-xl bg-white shadow-lg">
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-16 w-16 text-indigo-300" />
                    </div>
                  )}
                </div>

                {/* Pricing Info */}
                <div className="p-6">
                  <div className="mb-6 text-center">
                    <p className="text-4xl font-extrabold text-blue-600">
                      {formatPrice(course.price)}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleEnroll}
                    disabled={checkingEnrollment}
                    className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingEnrollment ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Đang kiểm tra...
                      </span>
                    ) : hasAccess ? (
                      'Vào Học Ngay'
                    ) : (
                      'Đăng Ký Học Ngay'
                    )}
                  </button>

                  {/* Enrollment Status Badge */}
                  {hasAccess && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Bạn đã đăng ký khóa học này</span>
                    </div>
                  )}

                  {/* Course Features */}
                  <div className="mt-6 space-y-3 border-t pt-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span>{formatDuration(totalDuration)} video</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>{totalLessons} bài học</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span>Học mọi lúc mọi nơi</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span>Chứng chỉ hoàn thành</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
