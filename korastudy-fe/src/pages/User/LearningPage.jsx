import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Loader2,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Lock,
} from 'lucide-react';
import { getCourseDetail, getLessonContent } from '../../services/userCourseService';
import LessonViewer from '../../components/LearningPathComponent/LessonViewer';

/**
 * LearningPage - Giao diện học bài
 * Layout: Fullscreen với Video Player (70%) và Playlist Sidebar (30%)
 */
const LearningPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [courseError, setCourseError] = useState('');
  const [lessonError, setLessonError] = useState('');
  const [accessDenied, setAccessDenied] = useState(false);
  const [openSections, setOpenSections] = useState(new Set());
  const [completedLessons, setCompletedLessons] = useState(new Set());

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      setLoadingCourse(true);
      setCourseError('');
      try {
        const data = await getCourseDetail(courseId);
        setCourse(data);
        
        if (data?.sections) {
          setOpenSections(new Set(data.sections.map(s => s.sectionId)));
        }
      } catch (err) {
        setCourseError(err?.message ?? 'Không thể tải thông tin khóa học.');
        console.error('Error fetching course:', err);
      } finally {
        setLoadingCourse(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Fetch lesson content
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setCurrentLesson(null);
        return;
      }

      setLoadingLesson(true);
      setAccessDenied(false);
      setLessonError('');
      
      // Tìm thông tin bài học từ course để check isTrial
      let currentLessonInfo = null;
      if (course?.sections) {
        for (const section of course.sections) {
          const lesson = section.lessons?.find(l => l.lessonId === parseInt(lessonId));
          if (lesson) {
            currentLessonInfo = lesson;
            break;
          }
        }
      }

      // Kiểm tra token
      const token = localStorage.getItem('accessToken');
      const isLoggedIn = !!token;

      // Trường hợp 1: Bài học KHÔNG phải Trial và chưa login
      if (currentLessonInfo && !currentLessonInfo.isTrial && !isLoggedIn) {
        setAccessDenied(true);
        setCurrentLesson(null);
        setLoadingLesson(false);
        return;
      }

      // Trường hợp 2: Bài học Trial hoặc đã login
      try {
        const isTrialLesson = currentLessonInfo?.isTrial ?? false;
        const data = await getLessonContent(lessonId, { skipAuth: isTrialLesson && !isLoggedIn });
        setCurrentLesson(data);
        setCompletedLessons(prev => new Set([...prev, parseInt(lessonId)]));
      } catch (err) {
        if (err?.status === 403 || err?.response?.status === 403 || err?.message?.includes('403')) {
          setAccessDenied(true);
          setCurrentLesson(null);
        } else if (err?.status === 401 || err?.response?.status === 401) {
          // 401: Chưa đăng nhập hoặc token hết hạn
          setAccessDenied(true);
          setCurrentLesson(null);
        } else {
          setLessonError(err?.message ?? 'Không thể tải nội dung bài học.');
          setCurrentLesson(null);
        }
        console.error('Error fetching lesson:', err);
      } finally {
        setLoadingLesson(false);
      }
    };

    fetchLesson();
  }, [lessonId, course]);

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

  const handleLessonClick = (lesson) => {
    const canAccess = lesson.isTrial || course?.enrolled;
    if (canAccess) {
      navigate(`/learning/${courseId}/${lesson.lessonId}`);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0 phút';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
  };

  const goBackToCourse = () => {
    navigate(`/course/${courseId}`);
  };

  if (loadingCourse) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-gray-400">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (courseError && !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md rounded-xl bg-gray-800 p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">Đã xảy ra lỗi</h3>
          <p className="mt-2 text-sm text-gray-400">{courseError}</p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goBackToCourse}
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <div className="border-l border-gray-700 pl-4">
            <h1 className="text-lg font-semibold text-white line-clamp-1">
              {course?.title || 'Đang tải...'}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Lesson Viewer (70%) */}
        <div className="flex flex-1 flex-col overflow-hidden bg-black lg:w-[70%]">
          <LessonViewer
            lesson={currentLesson}
            loading={loadingLesson}
            error={lessonError}
            accessDenied={accessDenied}
            onBackToCourse={goBackToCourse}
          />
        </div>

        {/* Right: Playlist Sidebar (30%) */}
        <div className="hidden w-[30%] overflow-y-auto border-l border-gray-800 bg-gray-900 lg:block">
          <div className="p-4">
            <h3 className="mb-4 text-lg font-semibold text-white">Nội dung khóa học</h3>
            
            <div className="space-y-2">
              {course?.sections && course.sections.length > 0 ? (
                course.sections.map((section) => {
                  const isOpen = openSections.has(section.sectionId);
                  
                  return (
                    <div key={section.sectionId} className="overflow-hidden rounded-lg border border-gray-800">
                      <button
                        onClick={() => toggleSection(section.sectionId)}
                        className="flex w-full items-center justify-between bg-gray-800 px-4 py-3 text-left transition-colors hover:bg-gray-750"
                      >
                        <div className="flex items-center gap-2">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm font-medium text-white line-clamp-1">
                            {section.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {section.lessons?.length || 0} bài
                        </span>
                      </button>

                      {isOpen && (
                        <div className="bg-gray-900">
                          {(section.lessons || []).map((lesson) => {
                            const isActive = parseInt(lessonId) === lesson.lessonId;
                            const isCompleted = completedLessons.has(lesson.lessonId);
                            const canAccess = lesson.isTrial || course?.enrolled;

                            return (
                              <div
                                key={lesson.lessonId}
                                onClick={() => handleLessonClick(lesson)}
                                className={`flex cursor-pointer items-start gap-3 border-t border-gray-800 px-4 py-3 transition-colors ${
                                  isActive
                                    ? 'bg-blue-600/20 border-l-4 border-l-blue-600'
                                    : canAccess
                                    ? 'hover:bg-gray-800'
                                    : 'cursor-not-allowed opacity-60'
                                }`}
                              >
                                <div className="flex-shrink-0 pt-0.5">
                                  {isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : canAccess ? (
                                    <PlayCircle className="h-5 w-5 text-blue-500" />
                                  ) : (
                                    <Lock className="h-5 w-5 text-gray-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${isActive ? 'font-semibold text-white' : 'text-gray-300'}`}>
                                    {lesson.title}
                                  </p>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDuration(lesson.duration)}</span>
                                    {lesson.isTrial && !course?.enrolled && (
                                      <span className="rounded bg-green-900/50 px-1.5 py-0.5 text-green-400">
                                        Học thử
                                      </span>
                                    )}
                                  </div>
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
                <p className="text-center text-sm text-gray-500 py-8">
                  Chưa có nội dung
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
