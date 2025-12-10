import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users } from 'lucide-react';

/**
 * CourseCard - Component hiển thị thẻ khóa học
 * Thiết kế theo chuẩn UX/UI E-learning hiện đại
 */
const CourseCard = ({ course }) => {
  // Format giá tiền VND
  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format rating
  const formatRating = (rating) => {
    if (!rating) return '0.0';
    return parseFloat(rating).toFixed(1);
  };

  // Format số học viên
  const formatStudents = (count) => {
    if (!count) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Link
      to={`/course/${course.courseId}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Thumbnail - Tỉ lệ 16:9 */}
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : null}
        <div className="flex h-full items-center justify-center">
          <span className="text-4xl font-bold text-indigo-300">📚</span>
        </div>
        
        {/* Badge giá */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-indigo-600 shadow-md backdrop-blur-sm">
            {formatPrice(course.price)}
          </span>
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        {/* Title - Giới hạn 2 dòng */}
        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>

        {/* Thông tin phụ */}
        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">
              {formatRating(course.averageRating)}
            </span>
          </div>

          {/* Số học viên */}
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatStudents(course.totalStudents)}
            </span>
          </div>
        </div>

        {/* Description - Giới hạn 2 dòng (optional) */}
        {course.description && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-600">
            {course.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
