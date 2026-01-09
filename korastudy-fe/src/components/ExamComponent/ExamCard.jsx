import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Star, BookOpen, AlertCircle, X, Lock } from 'lucide-react';
import PremiumBadge from '../Premium/PremiumBadge';
import { usePremiumStatus } from '../../hooks/usePremiumFeatures';

const ExamCard = ({ exam }) => {
  const navigate = useNavigate();
  const { isPremium } = usePremiumStatus();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
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
    const levelLower = level?.toLowerCase();
    switch (levelLower) {
      case 'beginner':
      case 'cơ bản':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
      case 'trung cấp':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
      case 'nâng cao':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExamTypeLabel = (examType) => {
    switch (examType?.toUpperCase()) {
      case 'LISTENING':
        return 'Listening';
      case 'READING':
        return 'Reading';
      case 'FULL_TEST':
        return 'Full Test';
      default:
        return 'Practice';
    }
  };

  const getExamTypeColor = (examType) => {
    switch (examType?.toUpperCase()) {
      case 'LISTENING':
        return 'bg-blue-100 text-blue-800';
      case 'READING':
        return 'bg-purple-100 text-purple-800';
      case 'FULL_TEST':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Đảm bảo dữ liệu từ backend có giá trị mặc định
  const examData = {
    id: exam.id,
    title: exam.title || 'Đề thi không có tiêu đề',
    subtitle: exam.description || exam.subtitle || 'Không có mô tả',
    level: exam.level,
    duration: typeof exam.durationTimes === 'number' ? `${exam.durationTimes} phút` : (exam.duration || '120 phút'),
    questions: exam.totalQuestions || exam.questions || 0,
    participants: exam.totalTaken || exam.participants || 0,
    rating: exam.averageRating || exam.rating || 0,
    difficulty: exam.difficulty,
    price: exam.price || (exam.isLocked ? null : 'Miễn phí'), // Chỉ hiển thị "Miễn phí" nếu không locked
    type: exam.type || 'practice',
    examType: exam.examType || 'PRACTICE',
    isLocked: exam.isLocked === true  // Xử lý strict: chỉ true mới locked, null/undefined/false đều là unlocked
  };

  const handleViewDetail = () => {
    navigate(`/exam/${examData.id}`);
  };

  const handleStartExam = (e) => {
    e.stopPropagation(); // Prevent card click event
    
    // If exam is locked, redirect to premium pricing page
    if (examData.isLocked) {
      navigate('/premium/pricing');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmStartExam = () => {
    setShowConfirmModal(false);
    navigate(`/exam/${examData.id}/test`);
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Xác nhận làm bài</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{examData.title}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span>Thời gian: <strong>{examData.duration}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-400" />
                  <span>Số câu hỏi: <strong>{examData.questions} câu</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExamTypeColor(examData.examType)}`}>
                    {getExamTypeLabel(examData.examType)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(examData.level)}`}>
                    {examData.level}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Sau khi bắt đầu, đồng hồ đếm ngược sẽ chạy. Hãy đảm bảo bạn có đủ thời gian để hoàn thành bài thi.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmStartExam}
                className="flex-1 px-4 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow-lg"
              >
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Card */}
      <div 
        onClick={handleViewDetail}
        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-200 hover:border-sky-300 aspect-square flex flex-col"
      >
        {/* Card Header */}
        <div className="relative flex-1">
          {/* Base gradient background */}
          <div className={`absolute inset-0 flex items-center justify-center overflow-hidden ${
            examData.isLocked 
              ? 'bg-gradient-to-br from-sky-400 to-blue-600' 
              : 'bg-gradient-to-br from-sky-400 to-blue-600'
          }`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            {/* Premium Overlay - Darker overlay for locked exams */}
            {examData.isLocked && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />
            )}
            
            <div className="text-center relative z-20 px-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-3 mb-2 inline-block">
                <BookOpen className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
              
              {/* Level & Type badges */}
              {!examData.isLocked && (
                <div className="flex gap-2 justify-center flex-wrap mt-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${getLevelColor(examData.level)}`}>
                    {examData.level}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${getExamTypeColor(examData.examType)}`}>
                    {getExamTypeLabel(examData.examType)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Simple Premium Badge - Top right corner */}
          {examData.isLocked && (
            <div className="absolute top-3 right-3 z-30">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Lock size={12} />
                Premium
              </span>
            </div>
          )}
          
          {/* Free Badge - Top right corner */}
          {!examData.isLocked && examData.price && (
            <div className="absolute top-3 right-3 z-30">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {examData.price}
              </span>
            </div>
          )}
          
          {/* Level & Type badges for locked - Bottom left */}
          {examData.isLocked && (
            <div className="absolute bottom-3 left-3 z-30 flex gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${getLevelColor(examData.level)}`}>
                {examData.level}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${getExamTypeColor(examData.examType)}`}>
                {getExamTypeLabel(examData.examType)}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 flex flex-col">
          {/* Title with Lock Icon */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors flex items-center gap-2">
            {examData.title}
            {examData.isLocked && <Lock size={16} className="text-yellow-500 flex-shrink-0" />}
          </h3>
          
          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3 gap-2">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              <span>{examData.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={14} className="text-gray-400" />
              <span>{examData.questions} câu</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} className="text-gray-400" />
              <span>{examData.participants}</span>
            </div>
          </div>

          {/* Rating and Difficulty */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-xs font-bold text-gray-900">
                {examData.rating.toFixed(1)}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getDifficultyColor(examData.difficulty)}`}>
              {examData.difficulty}
            </span>
          </div>

          {/* Action Button */}
          <div className="flex gap-2">
            <button 
              onClick={handleViewDetail}
              className="flex-1 px-4 py-2.5 text-center bg-white border-2 border-sky-500 text-sky-600 rounded-lg font-bold text-sm hover:bg-sky-50 transition-all duration-300 shadow-sm"
            >
              Xem chi tiết
            </button>
            {/* Show Upgrade button only if exam is locked AND user doesn't have Premium */}
            {/* Premium users always see Làm bài button */}
            {examData.isLocked && !isPremium ? (
              <button 
                onClick={handleStartExam}
                className="flex-1 px-4 py-2.5 text-center rounded-lg font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600"
              >
                <Lock size={14} />
                <span className="hidden sm:inline">Nâng cấp</span>
              </button>
            ) : (
              <button 
                onClick={handleStartExam}
                className="flex-1 px-4 py-2.5 text-center rounded-lg font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700"
              >
                Làm bài
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExamCard;