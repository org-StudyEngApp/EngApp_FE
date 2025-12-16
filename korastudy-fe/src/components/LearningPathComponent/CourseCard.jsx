import React from 'react';
import { Clock, BookOpen, Lock, CheckCircle, Award } from 'lucide-react';

/**
 * CourseCard - Simple card for learning path items
 * Not related to course system, just for displaying learning path content
 */
const CourseCard = ({ course }) => {
  const getStatusConfig = () => {
    switch (course.status) {
      case 'completed':
        return {
          icon: <CheckCircle size={20} />,
          bgColor: 'bg-green-100 dark:bg-green-900',
          textColor: 'text-green-700 dark:text-green-300',
          borderColor: 'border-green-300 dark:border-green-700',
        };
      case 'in-progress':
        return {
          icon: <BookOpen size={20} />,
          bgColor: 'bg-blue-100 dark:bg-blue-900',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-300 dark:border-blue-700',
        };
      case 'locked':
        return {
          icon: <Lock size={20} />,
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-500 dark:text-gray-400',
          borderColor: 'border-gray-300 dark:border-gray-700',
        };
      default:
        return {
          icon: <BookOpen size={20} />,
          bgColor: 'bg-white dark:bg-gray-800',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-300 dark:border-gray-600',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const isLocked = course.status === 'locked';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} p-4 transition-all duration-300 hover:shadow-lg ${isLocked ? 'opacity-60' : ''}`}
    >
      {/* Status Icon */}
      <div className={`absolute right-4 top-4 ${statusConfig.textColor}`}>
        {statusConfig.icon}
      </div>

      {/* Course Level Badge */}
      {course.level && (
        <div className="mb-2 flex items-center gap-2">
          <Award size={16} className="text-yellow-500" />
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Level {course.level}
          </span>
        </div>
      )}

      {/* Course Title */}
      <h4 className={`mb-2 text-lg font-semibold ${statusConfig.textColor}`}>
        {course.title}
      </h4>

      {/* Course Description */}
      {course.description && (
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {course.description}
        </p>
      )}

      {/* Course Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* Duration */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>

          {/* Lessons Count */}
          {course.lessons && (
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <BookOpen size={16} />
              <span>{course.lessons} bài</span>
            </div>
          )}
        </div>

        {/* Progress */}
        {course.progress !== undefined && !isLocked && (
          <div className="text-right">
            <span className={`font-semibold ${statusConfig.textColor}`}>
              {course.progress}%
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {course.progress !== undefined && course.status !== 'locked' && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
