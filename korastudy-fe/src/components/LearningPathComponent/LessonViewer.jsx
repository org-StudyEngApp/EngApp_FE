import React from 'react';
import ReactPlayer from 'react-player';
import {
  Loader2,
  Lock,
  PlayCircle,
  AlertCircle,
  FileText,
  Video,
  ClipboardList,
} from 'lucide-react';

/**
 * LessonViewer - Component hiển thị nội dung bài học
 * Hỗ trợ: VIDEO, TEXT (văn bản/tài liệu), QUIZ
 * 
 * @param {Object} lesson - Lesson data từ API
 * @param {boolean} loading - Trạng thái đang tải
 * @param {string} error - Thông báo lỗi
 * @param {boolean} accessDenied - Trạng thái bị khóa
 * @param {Function} onBackToCourse - Callback quay lại trang khóa học
 */
const LessonViewer = ({ lesson, loading, error, accessDenied, onBackToCourse }) => {
  // Loading State
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-sm text-gray-400">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  // Access Denied State
  if (accessDenied) {
    const token = localStorage.getItem('accessToken');
    const isLoggedIn = !!token;

    return (
      <div className="flex h-full items-center justify-center bg-gray-900 px-4">
        <div className="max-w-lg rounded-xl bg-gray-800 p-8 text-center shadow-xl">
          <Lock className="mx-auto h-16 w-16 text-yellow-500" />
          <h2 className="mt-4 text-2xl font-bold text-white">
            Nội dung bị khóa
          </h2>
          <p className="mt-3 text-gray-400">
            {isLoggedIn
              ? 'Vui lòng mua khóa học để truy cập toàn bộ nội dung và tài liệu học tập.'
              : 'Bạn cần đăng nhập và mua khóa học để xem nội dung này.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => window.location.href = '/login'}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={onBackToCourse}
                  className="rounded-lg border border-gray-600 bg-gray-700 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-600"
                >
                  Xem chi tiết khóa học
                </button>
              </>
            ) : (
              <button
                onClick={onBackToCourse}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700"
              >
                Mua khóa học
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md rounded-xl bg-gray-800 p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">Không thể tải bài học</h3>
          <p className="mt-2 text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // Empty State - No Lesson Selected
  if (!lesson) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <PlayCircle className="mx-auto h-16 w-16 opacity-50" />
          <p className="mt-4 text-lg">Chọn bài học để bắt đầu</p>
        </div>
      </div>
    );
  }

  /**
   * Render nội dung bài học theo type
   */
  const renderLessonContent = () => {
    switch (lesson.type) {
      case 'VIDEO':
        return (
          <div className="flex h-full flex-col bg-gray-900">
            {/* Video Player Container */}
            {lesson.videoUrl ? (
              <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
                {/* 16:9 Aspect Ratio Container */}
                <div className="absolute inset-0">
                  <ReactPlayer
                    url={lesson.videoUrl}
                    controls={true}
                    width="100%"
                    height="100%"
                    playing={false}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center bg-black py-32">
                <div className="text-center text-gray-400">
                  <Video className="mx-auto h-16 w-16 opacity-50" />
                  <p className="mt-4">Video không khả dụng</p>
                </div>
              </div>
            )}

            {/* Video Description */}
            {lesson.content && (
              <div className="flex-1 overflow-y-auto border-t border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Mô tả bài học</h3>
                <div
                  className="prose prose-invert prose-lg max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </div>
            )}
          </div>
        );

      case 'TEXT':
        return (
          <div className="h-full overflow-y-auto bg-gray-900">
            <div className="mx-auto max-w-4xl px-6 py-8">
              {lesson.content ? (
                <div
                  className="prose prose-lg prose-invert max-w-none text-gray-300"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              ) : (
                <div className="flex h-96 items-center justify-center">
                  <div className="text-center text-gray-400">
                    <FileText className="mx-auto h-16 w-16 opacity-50" />
                    <p className="mt-4">Không có nội dung</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'QUIZ':
        return (
          <div className="flex h-full items-center justify-center bg-gray-900 p-8">
            <div className="max-w-lg rounded-xl bg-gray-800 p-8 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/30">
                <ClipboardList className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">Đây là bài tập trắc nghiệm</h3>
              <p className="mb-6 text-gray-400">
                Kiểm tra kiến thức của bạn với bài tập này
              </p>
              <button className="rounded-lg bg-purple-600 px-8 py-3 font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-lg">
                Bắt đầu làm bài
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex h-full items-center justify-center bg-gray-900">
            <div className="text-center text-gray-400">
              <AlertCircle className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-4">Loại bài học không được hỗ trợ</p>
              <p className="mt-2 text-sm">Type: {lesson.type}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Lesson Header */}
      <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900 px-6 py-4">
        <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            {lesson.type === 'VIDEO' && <Video className="h-4 w-4" />}
            {lesson.type === 'TEXT' && <FileText className="h-4 w-4" />}
            {lesson.type === 'QUIZ' && <ClipboardList className="h-4 w-4" />}
            <span className="font-medium">
              {lesson.type === 'VIDEO' && 'Video'}
              {lesson.type === 'TEXT' && 'Tài liệu'}
              {lesson.type === 'QUIZ' && 'Bài tập'}
            </span>
          </span>
          {lesson.duration && (
            <span className="text-gray-500">
              • {Math.floor(lesson.duration / 60)} phút
            </span>
          )}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1 overflow-hidden">
        {renderLessonContent()}
      </div>
    </div>
  );
};

export default LessonViewer;
