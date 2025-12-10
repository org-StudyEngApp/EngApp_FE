import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, BookOpen } from 'lucide-react';

const ExamCard = ({ exam }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'dễ':
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'khó':
      case 'hard':
        return 'bg-red-100 text-red-800';
      case 'trung bình':
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'nâng cao':
      case 'advanced':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'topik i':
        return 'bg-blue-100 text-blue-800';
      case 'topik ii':
        return 'bg-purple-100 text-purple-800';
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Đảm bảo dữ liệu từ backend có giá trị mặc định
  const examData = {
    id: exam.id,
    title: exam.title || 'Đề thi không có tiêu đề',
    subtitle: exam.description || exam.subtitle || 'Không có mô tả',
    level: exam.level || 'Trung cấp',
    duration: typeof exam.duration === 'number' ? `${exam.duration} phút` : (exam.duration || '100 phút'),
    questions: exam.totalQuestions || exam.questions || 0,
    participants: exam.totalTaken || exam.participants || 0,
    rating: exam.averageRating || exam.rating || 0,
    difficulty: exam.difficulty || 'Trung bình',
    price: exam.price || 'Miễn phí',
    type: exam.type || 'practice'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="mx-auto h-12 w-12 text-blue-500 mb-2" />
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(examData.level)}`}>
              {examData.level}
            </span>
          </div>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-90 text-green-600 px-2 py-1 rounded-lg text-sm font-semibold">
            {examData.price}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {examData.title}
        </h3>
        
        {/* Subtitle */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {examData.subtitle}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{examData.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>{examData.questions} câu</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{examData.participants}</span>
          </div>
        </div>

        {/* Rating and Difficulty */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">
              {examData.rating.toFixed(1)}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(examData.difficulty)}`}>
            {examData.difficulty}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/exam/${examData.id}`}
            className="flex-1 px-4 py-2.5 text-center border-2 border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:border-primary-500 hover:text-primary-500 transition-colors duration-300"
          >
            Xem trước
          </Link>
          <Link
            to={`/exam/${examData.id}/test`}
            className="flex-1 px-4 py-2.5 text-center bg-primary-500 text-white rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors duration-300"
          >
            Làm bài
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;