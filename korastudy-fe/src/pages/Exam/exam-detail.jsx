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
  AlertCircle 
} from 'lucide-react';
import { examService } from '../../api/ExamService';
import { useUser } from '../../contexts/UserContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// import ExamQuestion from '../../components/ExamQuestion';

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [exam, setExam] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for missing parts
  const mockFeatures = [
    "Đề thi theo format chính thức TOPIK I",
    "Có file audio cho phần nghe hiểu",
    "Giải thích chi tiết đáp án",
    "Chấm điểm tự động",
    "Phân tích kết quả chi tiết",
    "Lưu lại lịch sử làm bài"
  ];

  const mockRequirements = [
    "Đã học xong bảng chữ cái Hangeul",
    "Có từ vựng cơ bản khoảng 800-1500 từ",
    "Hiểu ngữ pháp cơ bản tiếng Hàn",
    "Máy tính có loa hoặc tai nghe"
  ];

  const mockInstructions = [
    "Đọc kỹ hướng dẫn trước khi bắt đầu",
    "Làm bài theo thứ tự từ phần nghe đến phần đọc",
    "Không được quay lại phần đã làm",
    "Thời gian làm bài tính theo phút",
    "Nộp bài trước khi hết thời gian"
  ];

  const mockSampleQuestions = [
    {
      id: 1,
      type: "listening",
      question: "다음을 듣고 알맞은 것을 고르십시오.",
      options: [
        "가: 어디에 가세요? 나: 학교에 가요.",
        "가: 뭘 드세요? 나: 커피를 마셔요.",
        "가: 언제 만나요? 나: 내일 만나요.",
        "가: 누구와 가세요? 나: 친구와 가요."
      ],
      correctAnswer: 0,
      explanation: "대화를 듣고 상황에 맞는 응답을 선택하는 문제입니다."
    },
    {
      id: 2,
      type: "reading",
      question: "다음 글을 읽고 내용과 같은 것을 고르십시오.",
      passage: "저는 매일 아침 7시에 일어납니다. 그리고 8시에 학교에 갑니다. 학교에서 한국어를 공부합니다. 오후 3시에 집에 돌아와서 숙제를 합니다.",
      options: [
        "저는 오전 7시에 잠을 잡니다.",
        "저는 오전 8시에 학교에 갑니다.",
        "저는 학교에서 영어를 공부합니다.",
        "저는 오후 4시에 집에 돌아옵니다."
      ],
      correctAnswer: 1,
      explanation: "글의 내용에 따르면 '8시에 학교에 갑니다'가 정답입니다."
    }
  ];

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

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!exam) return;
        
        const commentsData = await examService.getExamComments(id);
        const getDateMs = (c) => {
          const d = c?.createdAt || c?.created_at || c?.updatedAt || c?.date;
          const ms = d ? new Date(d).getTime() : 0;
          return Number.isFinite(ms) ? ms : 0;
        };
        const sorted = Array.isArray(commentsData) ? [...commentsData].sort((a,b)=>getDateMs(b)-getDateMs(a)) : [];
        setComments(sorted);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setComments([]);
      }
    };

    if (exam && examService.getExamComments) {
      fetchComments();
    }
  }, [exam, id]);

  // Submit comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để bình luận');
      return;
    }

    if (!newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      setIsSubmittingComment(true);
      
      await examService.addExamComment(id, newComment.trim(), user.id);
      
      // Refresh comments
      const updatedComments = await examService.getExamComments(id);
      const getDateMs = (c) => {
        const d = c?.createdAt || c?.created_at || c?.updatedAt || c?.date;
        const ms = d ? new Date(d).getTime() : 0;
        return Number.isFinite(ms) ? ms : 0;
      };
      const sorted = Array.isArray(updatedComments) ? [...updatedComments].sort((a,b)=>getDateMs(b)-getDateMs(a)) : [];
      setComments(sorted || []);
      
      setNewComment('');
      
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmittingComment(false);
    }
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

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return 'Không giới hạn';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
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
        <Navbar />
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
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Không tìm thấy bài thi với ID: {id}</p>
            <button 
              onClick={() => navigate('/exam')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách bài thi
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: BookOpen },
    { id: 'questions', name: 'Câu hỏi mẫu', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/exam"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Quay lại danh sách</span>
            </Link>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h1 className="font-inter font-bold text-3xl text-gray-800 mb-2">
                    {exam.title || 'Bài thi TOPIK'}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {exam.description || 'Mô tả bài thi'}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-primary-500" />
                      <span>{formatDuration(exam.durationTimes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-primary-500" />
                      <span>{exam.totalQuestions || 0} câu hỏi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary-500" />
                      <span>{exam.participants || 0} người đã thi</span>
                    </div>
                    {exam.rating && (
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500 fill-current" />
                        <span>{exam.rating} ({exam.totalRatings || 0} đánh giá)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {exam.level || 'Sơ cấp'}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {exam.type || 'TOPIK I'}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  Độ khó: {exam.difficulty || 'Trung bình'}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {exam.price ? `${exam.price} VND` : 'Miễn phí'}
                </span>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border sticky top-4">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Sẵn sàng làm bài?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Thời gian: {formatDuration(exam.durationTimes)} | {exam.totalQuestions || 0} câu hỏi
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <Link
                    to={`/exam/${exam.id}/test`}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    Bắt đầu làm bài
                  </Link>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-300">
                    Lưu vào danh sách
                  </button>
                </div>

                {/* Quick Stats */}
                {/* <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-500">{exam.listeningCount || Math.floor(exam.totalQuestions/2) || 0}</div>
                      <div className="text-xs text-gray-600">Câu nghe</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary-500">{exam.readingCount || Math.floor(exam.totalQuestions/2) || 0}</div>
                      <div className="text-xs text-gray-600">Câu đọc</div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Mô tả đề thi</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {exam.description || 'Đề thi thử TOPIK I được thiết kế theo đúng format của kỳ thi chính thức, giúp bạn làm quen với cấu trúc đề thi và rèn luyện kỹ năng làm bài. Đề thi bao gồm phần nghe hiểu và đọc hiểu.'}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Tính năng nổi bật
                        </h3>
                        <ul className="space-y-2">
                          {(exam.features || mockFeatures).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          Yêu cầu trước khi thi
                        </h3>
                        <ul className="space-y-2">
                          {(exam.requirements || mockRequirements).map((requirement, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Hướng dẫn làm bài</h2>
                    <div className="space-y-3">
                      {(exam.instructions || mockInstructions).map((instruction, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">
                      Bình luận ({comments.length})
                    </h2>
                    
                    {/* Add Comment Form */}
                    {user ? (
                      <form onSubmit={handleSubmitComment} className="mb-6">
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.username?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Viết bình luận của bạn..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="flex justify-end mt-2">
                              <button
                                type="submit"
                                disabled={isSubmittingComment || !newComment.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSubmittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 text-center">
                          <Link to="/login" className="text-blue-600 hover:text-blue-700">
                            Đăng nhập
                          </Link> để bình luận
                        </p>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Chưa có bình luận nào</p>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {comment.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-gray-900">
                                    {comment.username || 'Người dùng'}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-gray-700">{comment.context}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Câu hỏi mẫu</h2>
                    <p className="text-gray-600 mb-6">
                      Dưới đây là một số câu hỏi mẫu để bạn làm quen với format đề thi
                    </p>
                    
                    <div className="space-y-8">
                      {(exam.sampleQuestions || mockSampleQuestions).map((question, index) => (
                        <div key={question.id || index} className="border border-gray-200 rounded-lg p-4">
                          <div className="mb-3">
                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium mb-2">
                              Câu {index + 1}
                            </span>
                            <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                            {question.passage && (
                              <div className="mt-2 p-3 bg-gray-50 rounded-md text-gray-700 text-sm">
                                {question.passage}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`p-3 rounded-lg border ${
                                  question.correctAnswer === optionIndex 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'bg-white border-gray-200'
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="h-5 w-5 flex items-center justify-center border border-gray-300 rounded-full mr-2 flex-shrink-0">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                  <span className="text-gray-700">{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-md">
                              <strong>Giải thích:</strong> {question.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Đề thi liên quan</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Link key={i} to={`/exam/${exam.id + i}`} className="block p-4 border rounded-lg hover:border-primary-500 transition-colors duration-300">
                      <h4 className="font-medium text-gray-800 mb-1">TOPIK I - Test {i + 1}</h4>
                      <p className="text-sm text-gray-600 mb-2">Bài thi thử TOPIK I</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>100 phút</span>
                        <span>70 câu</span>
                        <span className="text-green-600 font-medium">Miễn phí</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ExamDetail;