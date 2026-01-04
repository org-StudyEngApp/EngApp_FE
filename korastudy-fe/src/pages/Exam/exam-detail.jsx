import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Play,
  FileText, 
  CheckCircle, 
  AlertCircle,
  Headphones,
  FileQuestion
} from 'lucide-react';
import { examService } from '../../api/ExamService';
import { useUser } from '../../contexts/UserContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

// Cấu trúc TOEIC theo parts
const TOEIC_STRUCTURE = {
  LISTENING: [
    { part: 1, name: 'Photographs', description: 'Mô tả tranh', questions: 6 },
    { part: 2, name: 'Question-Response', description: 'Hỏi-Đáp', questions: 25 },
    { part: 3, name: 'Conversations', description: 'Đối thoại', questions: 39 },
    { part: 4, name: 'Talks', description: 'Bài nói ngắn', questions: 30 }
  ],
  READING: [
    { part: 5, name: 'Incomplete Sentences', description: 'Điền câu', questions: 30 },
    { part: 6, name: 'Text Completion', description: 'Hoàn thành đoạn văn', questions: 16 },
    { part: 7, name: 'Reading Comprehension', description: 'Đọc hiểu', questions: 54 }
  ],
  FULL_TEST: [
    { part: 1, name: 'Photographs', description: 'Mô tả tranh', questions: 6, section: 'Listening' },
    { part: 2, name: 'Question-Response', description: 'Hỏi-Đáp', questions: 25, section: 'Listening' },
    { part: 3, name: 'Conversations', description: 'Đối thoại', questions: 39, section: 'Listening' },
    { part: 4, name: 'Talks', description: 'Bài nói ngắn', questions: 30, section: 'Listening' },
    { part: 5, name: 'Incomplete Sentences', description: 'Điền câu', questions: 30, section: 'Reading' },
    { part: 6, name: 'Text Completion', description: 'Hoàn thành đoạn văn', questions: 16, section: 'Reading' },
    { part: 7, name: 'Reading Comprehension', description: 'Đọc hiểu', questions: 54, section: 'Reading' }
  ]
};

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStartModal, setShowStartModal] = useState(false);

  // Lấy cấu trúc parts theo loại bài thi
  const getExamStructure = () => {
    if (!exam) return [];
    return TOEIC_STRUCTURE[exam.examType] || [];
  };

  // Tính tổng số câu hỏi
  const getTotalQuestions = () => {
    const structure = getExamStructure();
    return structure.reduce((total, part) => total + part.questions, 0);
  };

  // Lấy tên loại bài thi
  const getExamTypeName = (type) => {
    const types = {
      'LISTENING': 'Listening',
      'READING': 'Reading',
      'FULL_TEST': 'Full Test'
    };
    return types[type] || type;
  };

  // Format thời gian
  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins > 0 ? mins + ' phút' : ''}`;
    }
    return `${mins} phút`;
  };

  // Lấy màu cho level badge
  const getLevelColor = (level) => {
    if (!level) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    const levelLower = level.toLowerCase();
    const colorMap = {
      'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'elementary': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'advanced': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'advanced plus': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    return colorMap[levelLower] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Fetch exam detail
  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching exam detail for ID:', id);
        
        if (!examService || !examService.getExamDetail) {
          throw new Error('ExamService not available');
        }
        
        const examData = await examService.getExamDetail(id);
        console.log('Exam data received:', examData);
        
        if (!examData) {
          throw new Error('No exam data received');
        }
        
        setExam(examData);
        
      } catch (err) {
        console.error('Error fetching exam detail:', err);
        setError(err.message || 'Không thể tải thông tin bài thi. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamDetail();
    } else {
      setError('ID bài thi không hợp lệ');
      setLoading(false);
    }
  }, [id]);

  // Handle start exam
  const handleStartExam = () => {
    if (!user) {
      alert('Vui lòng đăng nhập để làm bài thi');
      navigate('/dang-nhap');
      return;
    }
    setShowStartModal(true);
  };

  const confirmStartExam = () => {
    navigate(`/exam/${id}/test`, { 
      state: { 
        exam: {
          ...exam,
          structure: getExamStructure()
        } 
      } 
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin bài thi...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
              >
                Thử lại
              </button>
              <button 
                onClick={() => navigate('/exam')}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Quay lại danh sách bài thi
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // No exam data
  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Không tìm thấy bài thi với ID: {id}</p>
            <button 
              onClick={() => navigate('/exam')}
              className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
            >
              Quay lại danh sách bài thi
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      
      {/* Header Section */}
      <section className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Link 
            to="/exam"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300 mb-6"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại danh sách</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Exam Header */}
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-8 h-8 text-sky-500" />
                  </div>
                  <div className="flex-1">
                    <h1 className="font-bold text-3xl text-gray-800 dark:text-gray-100 mb-3">
                      {exam.title || 'Bài thi TOEIC'}
                    </h1>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(exam.level)}`}>
                        {exam.level || 'Intermediate'}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                        {getExamTypeName(exam.examType)}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-sky-500" />
                        <span>{formatDuration(exam.durationMinutes)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileQuestion size={16} className="text-sky-500" />
                        <span>{getTotalQuestions()} câu hỏi</span>
                      </div>
                      {(exam.examType === 'LISTENING' || exam.examType === 'FULL_TEST') && (
                        <div className="flex items-center gap-2">
                          <Headphones size={16} className="text-sky-500" />
                          <span>Có Audio</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {exam.description && (
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {exam.description}
                  </p>
                )}
              </div>

              {/* Exam Structure */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                  Cấu trúc bài thi
                </h2>
                
                <div className="space-y-4">
                  {getExamStructure().map((part) => (
                    <div 
                      key={part.part}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-600 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sky-600 dark:text-sky-400 font-bold text-lg">
                            P{part.part}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                              Part {part.part}: {part.name}
                            </h3>
                            {part.section && (
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                part.section === 'Listening' 
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              }`}>
                                {part.section}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {part.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                          {part.questions}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          câu hỏi
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="mt-6 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border-2 border-sky-200 dark:border-sky-800">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      Tổng cộng
                    </span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                        {getTotalQuestions()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        câu hỏi
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Start Exam */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700 sticky top-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-2">
                    Sẵn sàng làm bài?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDuration(exam.durationMinutes)} | {getTotalQuestions()} câu hỏi
                  </p>
                </div>

                <button
                  onClick={handleStartExam}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mb-4"
                >
                  <Play size={20} />
                  Bắt đầu làm bài
                </button>

                {/* Exam Info */}
                <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Chấm điểm tự động theo thang 990</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Phân tích chi tiết theo từng Part</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                    <span>Lưu lịch sử làm bài</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Start Exam Confirmation Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Xác nhận bắt đầu làm bài
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {exam.title}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 mb-1">Thời gian</div>
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {formatDuration(exam.durationMinutes)}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="text-gray-500 dark:text-gray-400 mb-1">Số câu hỏi</div>
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {getTotalQuestions()} câu
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmStartExam}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                Xác nhận bắt đầu
              </button>
              <button
                onClick={() => setShowStartModal(false)}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetail;