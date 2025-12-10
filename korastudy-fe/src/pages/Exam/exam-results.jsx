import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { examService } from '../../api/ExamService';
import { useUser } from '@contexts/UserContext.jsx';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Award, 
  BarChart3, 
  BookOpen, 
  Volume2,
  ArrowLeft,
  Download,
  Share2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ExamResults = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [examData, setExamData] = useState(null);
  
  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('=== FETCHING EXAM RESULT ===');
        console.log('Exam ID:', id);
        console.log('User:', user);
        console.log('Location state:', location.state);
        
        // Thử lấy từ state trước (từ navigation sau khi submit)
        if (location.state && location.state.result) {
          console.log('Using result from navigation state');
          setResult(location.state.result);
          
          // Fetch exam details if needed
          if (id) {
            try {
              const examDetails = await examService.getExamDetail(id);
              setExamData(examDetails);
            } catch (err) {
              console.warn('Could not fetch exam details:', err);
            }
          }
          
          setLoading(false);
          return;
        }

        // Nếu có resultId từ state
        if (location.state && location.state.resultId) {
          console.log('Fetching result by resultId:', location.state.resultId);
          try {
            const resultData = await examService.getExamResultDetail(location.state.resultId);
            setResult(resultData);
            
            // Fetch exam details if needed
            if (id) {
              try {
                const examDetails = await examService.getExamDetail(id);
                setExamData(examDetails);
              } catch (err) {
                console.warn('Could not fetch exam details:', err);
              }
            }
            
            setLoading(false);
            return;
          } catch (err) {
            console.warn('Failed to fetch by resultId, trying history method');
          }
        }

        // Fallback: lấy từ lịch sử làm bài
        if (user?.id && id) {
          console.log('Fetching from exam history');
          const history = await examService.getExamHistory(user.id);
          console.log('Exam history received:', history);
          
          // Lọc ra các lần làm bài của đề thi này, lấy lần mới nhất
          const filtered = Array.isArray(history)
            ? history.filter(h => String(h.examId) === String(id))
            : [];
          
          console.log('Filtered results for exam', id, ':', filtered);
          
          if (filtered.length > 0) {
            const latest = filtered.sort((a, b) => new Date(b.testDate) - new Date(a.testDate))[0];
            console.log('Latest result:', latest);
            setResult(latest);
            
            // Fetch exam details
            try {
              const examDetails = await examService.getExamDetail(id);
              setExamData(examDetails);
            } catch (err) {
              console.warn('Could not fetch exam details:', err);
            }
          } else {
            setError('Không tìm thấy kết quả bài thi. Có thể bài thi chưa được lưu thành công.');
          }
        } else {
          setError('Thiếu thông tin người dùng hoặc bài thi.');
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setError('Có lỗi xảy ra khi tải kết quả bài thi.');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, user, location.state]);

  // Calculate results and additional metrics
  const calculateResults = () => {
    if (!result) return null;

    const details = Array.isArray(result.answerDetails) ? result.answerDetails : [];
    const correctCount = details.filter(d => d.isCorrect).length;
    const incorrectCount = details.filter(d => !d.isCorrect && d.selectedAnswer).length;
    const unansweredCount = details.filter(d => !d.selectedAnswer).length;
    const totalQuestions = details.length || result.totalQuestions || 0;
    const percentage = result.scores || Math.round((correctCount / totalQuestions) * 100) || 0;

    // TOPIK scoring (approximate)
    let level = 'Not Passed';
    let grade = 'F';
    
    if (percentage >= 80) {
      level = 'Level 2';
      grade = 'A';
    } else if (percentage >= 60) {
      level = 'Level 1';
      grade = 'B';
    } else if (percentage >= 40) {
      level = 'Pre-Level 1';
      grade = 'C';
    }

    // Calculate part-wise results
    const partResults = [];
    if (examData && examData.parts) {
      examData.parts.forEach(part => {
        // Filter questions belonging to this part
        const partDetails = details.filter(q => q.partId === part.id);
        const partCorrect = partDetails.filter(d => d.isCorrect).length;
        const partIncorrect = partDetails.filter(d => !d.isCorrect && d.selectedAnswer).length;
        const partUnanswered = partDetails.filter(d => !d.selectedAnswer).length;
        const partTotal = partDetails.length;
        const partPercentage = partTotal > 0 ? Math.round((partCorrect / partTotal) * 100) : 0;
        
        partResults.push({
          id: part.id,
          title: part.title || `Phần ${part.id}`,
          totalQuestions: partTotal,
          correct: partCorrect,
          incorrect: partIncorrect,
          unanswered: partUnanswered,
          percentage: partPercentage
        });
      });
    } else {
      // If no part data, create one default part
      partResults.push({
        id: 'all',
        title: 'Toàn bài thi',
        totalQuestions: totalQuestions,
        correct: correctCount,
        incorrect: incorrectCount,
        unanswered: unansweredCount,
        percentage: percentage
      });
    }

    return {
      correctCount,
      incorrectCount,
      unansweredCount,
      totalAnswered: correctCount + incorrectCount,
      totalQuestions,
      percentage,
      level,
      grade,
      partResults,
      details
    };
  };

  const results = calculateResults();

  // Parse options từ chuỗi text
  const parseOptions = (optionString) => {
    if (!optionString) return {};
    
    const options = {};
    
    // Thử các pattern khác nhau
    const patterns = [
      /([①②③④])\s*([^①②③④]*?)(?=[①②③④]|$)/g,
      /([ABCD])\)\s*([^ABCD]*?)(?=[ABCD]\)|$)/g,
      /([1234])\)\s*([^1234]*?)(?=[1234]\)|$)/g
    ];
    
    for (const pattern of patterns) {
      const matches = [...(optionString.matchAll(pattern) || [])];
      if (matches.length > 0) {
        matches.forEach(match => {
          const key = match[1];
          const value = match[2].trim();
          if (value) {
            options[key] = value;
          }
        });
        break;
      }
    }
    
    return options;
  };

  const getFilteredQuestions = () => {
    if (!results) return [];
    
    switch (selectedFilter) {
      case 'correct':
        return results.details.filter(q => q.isCorrect);
      case 'incorrect':
        return results.details.filter(q => !q.isCorrect && q.selectedAnswer);
      case 'unanswered':
        return results.details.filter(q => !q.selectedAnswer);
      default:
        return results.details;
    }
  };

  const filteredQuestions = getFilteredQuestions();

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getOptionNumber = (index) => {
    return ['①', '②', '③', '④'][index] || (index + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải kết quả bài thi...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h2>
            <p className="text-red-600 mb-4">{error || 'Không có dữ liệu kết quả'}</p>
            <button 
              onClick={() => navigate(`/exam/${id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Quay lại bài thi
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không có kết quả</h2>
            <Link to="/exam" className="text-primary-500 hover:underline">
              Quay lại danh sách bài thi
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/exam" 
              className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Quay lại danh sách
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {examData?.title || location.state?.examTitle || `Bài thi ID: ${id}`} - Kết quả
            </h1>
            <p className="text-gray-600">Bài thi đã hoàn thành</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Results Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          
          {/* Score Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${results.percentage * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{results.percentage}%</span>
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold ${getGradeColor(results.grade)}`}>
                <Award size={20} />
                {results.grade} Grade
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-gray-800">{results.level}</div>
                <div className="text-sm text-gray-600">TOPIK Level</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{results.correctCount}</div>
                  <div className="text-sm text-gray-600">Đúng</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((results.correctCount / results.totalQuestions) * 100)}% tổng số
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{results.incorrectCount}</div>
                  <div className="text-sm text-gray-600">Sai</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((results.incorrectCount / results.totalQuestions) * 100)}% tổng số
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">{results.unansweredCount}</div>
                  <div className="text-sm text-gray-600">Không trả lời</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((results.unansweredCount / results.totalQuestions) * 100)}% tổng số
              </div>
            </div>
          </div>
        </div>

        {/* Part-wise Results */}
        {/* <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 size={24} />
              Kết quả theo phần
            </h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {results.partResults.map(part => (
                <div key={part.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">{part.title}</h3>
                    <span className="text-lg font-bold text-primary-600">{part.percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${part.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{part.correct}</div>
                      <div className="text-gray-500">Đúng</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{part.incorrect}</div>
                      <div className="text-gray-500">Sai</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-600">{part.unanswered}</div>
                      <div className="text-gray-500">Bỏ qua</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Detailed Review */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen size={24} />
                Chi tiết câu hỏi
              </h2>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                {[
                  { id: 'all', name: 'Tất cả', count: results.totalQuestions },
                  { id: 'correct', name: 'Đúng', count: results.correctCount },
                  { id: 'incorrect', name: 'Sai', count: results.incorrectCount },
                  { id: 'unanswered', name: 'Bỏ qua', count: results.unansweredCount }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      selectedFilter === filter.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.name} ({filter.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {filteredQuestions.map((question, index) => {
                const options = parseOptions(question.questionText || '');
                const hasOptions = Object.keys(options).length > 0;
                
                return (
                <div key={index} className="border rounded-lg p-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        문제 {index + 1}
                      </span>
                      {question.type === 'listening' || question.questionType === 'LISTENING' ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                          <Volume2 size={14} />
                          듣기
                        </span>
                      ) : question.type === 'reading' || question.questionType === 'READING' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          읽기
                        </span>
                      ) : null}
                    </div>
                    
                    {/* Result Status */}
                    <div className="flex items-center gap-2">
                      {question.selectedAnswer ? (
                        question.isCorrect ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={20} />
                            <span className="font-medium">Đúng</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle size={20} />
                            <span className="font-medium">Sai</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock size={20} />
                          <span className="font-medium">Không trả lời</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 font-medium mb-3 text-lg">
                      {hasOptions 
                        ? question.questionText.split(/[①②③④ABCD1234]\)/)[0].trim()
                        : question.questionText || `Câu hỏi ${index + 1}`
                      }
                    </p>
                    
                    {question.passage && (
                      <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                        <p className="text-gray-800 leading-relaxed">{question.passage}</p>
                      </div>
                    )}
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-2 mb-4">
                    {hasOptions ? (
                      Object.entries(options).map(([optionKey, optionText], optionIndex) => {
                        const isUserAnswer = question.selectedAnswer === optionKey;
                        const isCorrectAnswer = question.correctAnswer === optionKey;
                        
                        let optionClass = 'border-gray-200 bg-white';
                        
                        if (isCorrectAnswer) {
                          optionClass = 'border-green-500 bg-green-50 text-green-800';
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          optionClass = 'border-red-500 bg-red-50 text-red-800';
                        }
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${optionClass}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {optionKey}
                              </span>
                              <span className="flex-1">{optionText}</span>
                              
                              {/* Status Icons */}
                              <div className="flex items-center gap-2">
                                {isUserAnswer && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Lựa chọn của bạn
                                  </span>
                                )}
                                {isCorrectAnswer && (
                                  <CheckCircle size={20} className="text-green-500" />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <XCircle size={20} className="text-red-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      // Hiển thị dạng câu trả lời đơn giản nếu không có options
                      <>
                        <div className={`p-3 rounded-lg border-2 ${question.selectedAnswer === question.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium text-gray-700">Câu trả lời của bạn:</span> 
                              <span className={`ml-2 ${question.isCorrect ? 'text-green-700' : 'text-red-700'} font-semibold`}>
                                {question.selectedAnswer || 'Không trả lời'}
                              </span>
                            </div>
                            {question.selectedAnswer && question.isCorrect && (
                              <CheckCircle size={20} className="text-green-500" />
                            )}
                            {question.selectedAnswer && !question.isCorrect && (
                              <XCircle size={20} className="text-red-500" />
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium text-gray-700">Đáp án đúng:</span> 
                              <span className="ml-2 text-green-700 font-semibold">{question.correctAnswer}</span>
                            </div>
                            <CheckCircle size={20} className="text-green-500" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">해설 (Giải thích):</h4>
                      <p className="text-yellow-700 leading-relaxed">{question.explanation}</p>
                    </div>
                  )}

                  {/* Performance Tip for Incorrect Answers */}
                  {question.selectedAnswer && !question.isCorrect && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-red-800 mb-2">💡 Gợi ý học tập:</h4>
                      <p className="text-red-700 text-sm">
                        {question.questionType === 'LISTENING' 
                          ? "Luyện tập nhiều bài nghe hơn và tập trung vào từ vựng và cấu trúc câu quan trọng."
                          : "Ôn tập lại cách sử dụng ngữ pháp và từ vựng trong loại câu hỏi này."
                        }
                      </p>
                    </div>
                  )}
                </div>
              )})}
            </div>
            
            {/* Empty state when no questions match filter */}
            {filteredQuestions.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <AlertCircle size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có câu hỏi nào
                </h3>
                <p className="text-gray-600">
                  Không tìm thấy câu hỏi nào phù hợp với bộ lọc "{
                    selectedFilter === 'all' ? 'Tất cả' : 
                    selectedFilter === 'correct' ? 'Đúng' :
                    selectedFilter === 'incorrect' ? 'Sai' : 'Bỏ qua'
                  }".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/exam/${id}`}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Làm lại bài thi
          </Link>
          
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2">
            <Download size={20} />
            Tải kết quả
          </button>
          
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2">
            <Share2 size={20} />
            Chia sẻ kết quả
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExamResults;