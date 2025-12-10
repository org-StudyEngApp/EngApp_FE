import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Star, Play, CheckCircle, Lock, ArrowRight, Users } from 'lucide-react';

const CourseCard = ({ course, delay, enrollmentStatus }) => {
  // Format price display
  const formatPrice = (price) => {
    if (course.isFree) {
      return 'Miễn phí';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
  };
  
  // Render status icon (completed, in-progress, locked)
  const renderStatusIcon = () => {
    if (enrollmentStatus === 'completed') {
      return (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg backdrop-blur-sm bg-opacity-90 animate-pulse-slow">
          <CheckCircle size={14} />
        </div>
      );
    } else if (enrollmentStatus === 'in-progress') {
      return (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg backdrop-blur-sm bg-opacity-90">
          <Play size={14} className="animate-ping-slow" />
        </div>
      );
    } else if (enrollmentStatus === 'locked') {
      return (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg backdrop-blur-sm bg-opacity-90">
          <Lock size={14} />
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${course.status === 'locked' ? 'grayscale-[0.4]' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Thumbnail với chiều cao tùy chỉnh cho mobile */}
      <div className="relative h-40 sm:h-56 bg-gradient-to-br from-teal-500 to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-4 text-white">
          {/* Floating elements for visual interest */}
          <div className="absolute right-5 top-5 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white/20 animate-float"></div>
          <div className="absolute left-8 bottom-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white/30 animate-float animation-delay-2000"></div>
          
          <h4 className="text-xl sm:text-3xl font-bold mb-1 drop-shadow-md">TOPIK {course.level || '3'}</h4>
          <p className="text-sm sm:text-lg font-medium text-white/90 mb-2 sm:mb-4 drop-shadow-md">KHÓA HỌC ONLINE</p>
          <div className="flex gap-2 sm:gap-3 text-xs sm:text-base">
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full flex items-center transition-all duration-300 hover:bg-white/30">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-300 rounded-full mr-1 sm:mr-2"></span>
              Nghe
            </span>
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full flex items-center transition-all duration-300 hover:bg-white/30">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-300 rounded-full mr-1 sm:mr-2"></span>
              Đọc
            </span>
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/20 backdrop-blur-sm rounded-full flex items-center transition-all duration-300 hover:bg-white/30">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-300 rounded-full mr-1 sm:mr-2"></span>
              Viết
            </span>
          </div>
        </div>
        
        {/* Status icon */}
        {renderStatusIcon()}
      </div>
      
      {/* Course info với padding nhỏ hơn cho mobile */}
      <div className="p-4 sm:p-6">
        <h5 className="font-bold text-gray-800 dark:text-gray-200 text-base sm:text-lg mb-2 sm:mb-3">
          {course.title}
        </h5>
        <p className="text-gray-600 dark:text-gray-400 mb-4 sm:mb-5 text-sm sm:text-base">
          {course.description}
        </p>
        
        {/* Stats với icon */}
        <div className="flex justify-between mb-4 sm:mb-5 text-xs sm:text-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock size={14} className="mr-1 sm:mr-1.5 text-blue-500" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <BookOpen size={14} className="mr-1 sm:mr-1.5 text-blue-500" />
              <span>{course.lessons} bài học</span>
            </div>
          </div>
          
          {/* Rating - ẩn trên mobile rất nhỏ */}
          <div className="hidden xs:flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < 4 ? "currentColor" : "none"} 
                  className={i < 4 ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Progress bar với animation */}
        {course.status !== 'locked' && (
          <div className="mb-3 sm:mb-4">
            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 sm:h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${course.status === 'completed' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-sky-500'} progress-animation`}
                style={{width: `${course.progress}%`}}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1 sm:mt-2 text-xs sm:text-sm">
              <div className="font-medium text-blue-500">Tiến độ</div>
              <div className={`font-bold ${course.status === 'completed' ? 'text-green-500' : 'text-blue-500'}`}>
                {course.progress}%
              </div>
            </div>
          </div>
        )}
        
        {/* Action button với animation */}
        <Link 
          to={course.status !== 'locked' ? `/course/${course.id}` : '#'}
          className={`group relative mt-2 sm:mt-3 block text-center py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-xl font-medium overflow-hidden text-sm sm:text-base ${
            course.status === 'locked'
              ? 'bg-gray-200 dark:bg-dark-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : course.status === 'completed' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white'
          } transition-all duration-300 shadow-md hover:shadow-lg`}
        >
          {course.status !== 'locked' && (
            <span className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full hover:translate-x-0 transition-transform duration-300"></span>
          )}
          <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
            {course.status === 'completed' ? (
              <>
                <CheckCircle size={16} /> Xem lại khóa học
              </>
            ) : course.status === 'in-progress' ? (
              <>
                <Play size={16} /> Tiếp tục học
              </>
            ) : (
              <>
                <Lock size={16} /> Khóa học này chưa mở
              </>
            )}
            
            {course.status !== 'locked' && (
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
            )}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;