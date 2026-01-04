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
import NavBar from '../../components/NavBar';
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

  // Calculate TOEIC results and additional metrics
  const calculateResults = () => {
    if (!result) return null;

    const details = Array.isArray(result.answerDetails) ? result.answerDetails : [];
    const correctCount = details.filter(d => d.isCorrect).length;
    const incorrectCount = details.filter(d => !d.isCorrect && d.selectedAnswer).length;
    const unansweredCount = details.filter(d => !d.selectedAnswer).length;
    const totalQuestions = details.length || result.totalQuestions || 0;

    // TOEIC scoring: Convert correct answers to TOEIC scale (5-495 per section)
    // Total possible score: 990 (495 Listening + 495 Reading)
    const calculateTOEICScore = (correct, total) => {
      if (total === 0) return 5;
      
      // TOEIC conversion table (approximate)
      const percentage = correct / total;
      let score;
      
      if (percentage >= 0.96) score = 495;
      else if (percentage >= 0.92) score = 490;
      else if (percentage >= 0.88) score = 475;
      else if (percentage >= 0.84) score = 460;
      else if (percentage >= 0.80) score = 445;
      else if (percentage >= 0.76) score = 425;
      else if (percentage >= 0.72) score = 405;
      else if (percentage >= 0.68) score = 385;
      else if (percentage >= 0.64) score = 365;
      else if (percentage >= 0.60) score = 345;
      else if (percentage >= 0.56) score = 325;
      else if (percentage >= 0.52) score = 305;
      else if (percentage >= 0.48) score = 285;
      else if (percentage >= 0.44) score = 265;
      else if (percentage >= 0.40) score = 245;
      else if (percentage >= 0.36) score = 225;
      else if (percentage >= 0.32) score = 205;
      else if (percentage >= 0.28) score = 185;
      else if (percentage >= 0.24) score = 165;
      else if (percentage >= 0.20) score = 145;
      else if (percentage >= 0.16) score = 125;
      else if (percentage >= 0.12) score = 105;
      else if (percentage >= 0.08) score = 85;
      else if (percentage >= 0.04) score = 65;
      else score = 45;
      
      return score;
    };

    // Split into Listening (Part 1-4, questions 1-100) and Reading (Part 5-7, questions 101-200)
    const listeningDetails = details.filter(d => {
      const qNum = d.questionNumber || d.questionId || 0;
      return qNum <= 100;
    });
    const readingDetails = details.filter(d => {
      const qNum = d.questionNumber || d.questionId || 0;
      return qNum > 100;
    });

    const listeningCorrect = listeningDetails.filter(d => d.isCorrect).length;
    const readingCorrect = readingDetails.filter(d => d.isCorrect).length;
    
    const listeningScore = calculateTOEICScore(listeningCorrect, listeningDetails.length || 100);
    const readingScore = calculateTOEICScore(readingCorrect, readingDetails.length || 100);
    const totalScore = listeningScore + readingScore;

    // TOEIC Level based on total score
    let level = 'Beginner';
    let levelColor = 'red';
    
    if (totalScore >= 905) {
      level = 'Advanced Plus';
      levelColor = 'purple';
    } else if (totalScore >= 785) {
      level = 'Advanced';
      levelColor = 'blue';
    } else if (totalScore >= 550) {
      level = 'Intermediate';
      levelColor = 'green';
    } else if (totalScore >= 225) {
      level = 'Elementary';
      levelColor = 'yellow';
    }

    // Calculate part-wise results (TOEIC 7 parts)
    const partRanges = [
      { id: 1, title: 'Part 1: Photos', range: [1, 6], type: 'listening' },
      { id: 2, title: 'Part 2: Question-Response', range: [7, 31], type: 'listening' },
      { id: 3, title: 'Part 3: Conversations', range: [32, 70], type: 'listening' },
      { id: 4, title: 'Part 4: Talks', range: [71, 100], type: 'listening' },
      { id: 5, title: 'Part 5: Incomplete Sentences', range: [101, 130], type: 'reading' },
      { id: 6, title: 'Part 6: Text Completion', range: [131, 146], type: 'reading' },
      { id: 7, title: 'Part 7: Reading Comprehension', range: [147, 200], type: 'reading' }
    ];

    const partResults = partRanges.map(part => {
      const partDetails = details.filter(d => {
        const qNum = d.questionNumber || d.questionId || 0;
        return qNum >= part.range[0] && qNum <= part.range[1];
      });
      
      const partCorrect = partDetails.filter(d => d.isCorrect).length;
      const partIncorrect = partDetails.filter(d => !d.isCorrect && d.selectedAnswer).length;
      const partUnanswered = partDetails.filter(d => !d.selectedAnswer).length;
      const partTotal = part.range[1] - part.range[0] + 1;
      const partPercentage = partTotal > 0 ? Math.round((partCorrect / partTotal) * 100) : 0;
      
      return {
        id: part.id,
        title: part.title,
        type: part.type,
        range: `Q${part.range[0]}-${part.range[1]}`,
        totalQuestions: partTotal,
        correct: partCorrect,
        incorrect: partIncorrect,
        unanswered: partUnanswered,
        percentage: partPercentage
      };
    });

    return {
      correctCount,
      incorrectCount,
      unansweredCount,
      totalAnswered: correctCount + incorrectCount,
      totalQuestions,
      totalScore,
      listeningScore,
      readingScore,
      listeningCorrect,
      readingCorrect,
      listeningTotal: listeningDetails.length || 100,
      readingTotal: readingDetails.length || 100,
      level,
      levelColor,
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

  const getLevelColor = (levelColor) => {
    switch (levelColor) {
      case 'purple': return 'text-purple-600 bg-purple-100';
      case 'blue': return 'text-blue-600 bg-blue-100';
      case 'green': return 'text-green-600 bg-green-100';
      case 'yellow': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getOptionNumber = (index) => {
    return ['①', '②', '③', '④'][index] || (index + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
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
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h2>
            <p className="text-red-600 mb-4">{error || 'Không có dữ liệu kết quả'}</p>
            <button 
              onClick={() => navigate(`/exam/${id}`)}
              className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
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
        <NavBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không có kết quả</h2>
            <Link to="/exam" className="text-sky-500 hover:underline">
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
      <NavBar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/exam" 
              className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Quay lại danh sách
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              {examData?.title || location.state?.examTitle || `Bài thi ID: ${id}`}
            </h1>
            <p className="text-blue-100 text-lg">TOEIC Test Results</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Results Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Total Score Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-blue-600">
              <h3 className="text-gray-600 text-sm font-semibold mb-4 uppercase">Total Score</h3>
              
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(results.totalScore / 990) * 283} 283`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-800">{results.totalScore}</span>
                  <span className="text-sm text-gray-500">/990</span>
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold ${getLevelColor(results.levelColor)}`}>
                <Award size={18} />
                {results.level}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-500">Số câu đúng</div>
                <div className="text-2xl font-bold text-gray-800">{results.correctCount}/{results.totalQuestions}</div>
              </div>
            </div>
          </div>

          {/* Listening & Reading Scores */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {/* Listening Score */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Listening</h3>
                  <p className="text-sm text-gray-500">Part 1-4</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-5xl font-bold text-green-600 mb-1">{results.listeningScore}</div>
                <div className="text-sm text-gray-500">out of 495</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(results.listeningScore / 495) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Correct: {results.listeningCorrect}/{results.listeningTotal}</span>
                <span className="font-semibold text-green-600">
                  {Math.round((results.listeningCorrect / results.listeningTotal) * 100)}%
                </span>
              </div>
            </div>

            {/* Reading Score */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Reading</h3>
                  <p className="text-sm text-gray-500">Part 5-7</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-5xl font-bold text-purple-600 mb-1">{results.readingScore}</div>
                <div className="text-sm text-gray-500">out of 495</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(results.readingScore / 495) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Correct: {results.readingCorrect}/{results.readingTotal}</span>
                <span className="font-semibold text-purple-600">
                  {Math.round((results.readingCorrect / results.readingTotal) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">{results.correctCount}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((results.correctCount / results.totalQuestions) * 100)}% of total
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-red-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{results.incorrectCount}</div>
                <div className="text-sm text-gray-600">Incorrect Answers</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((results.incorrectCount / results.totalQuestions) * 100)}% of total
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-gray-400">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-600">{results.unansweredCount}</div>
                <div className="text-sm text-gray-600">Unanswered</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((results.unansweredCount / results.totalQuestions) * 100)}% of total
            </div>
          </div>
        </div>

        {/* Part-wise Results */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <BarChart3 size={28} className="text-blue-600" />
              Part-by-Part Analysis
            </h2>
            <p className="text-gray-600 text-sm mt-1">Detailed breakdown of your performance across all TOEIC parts</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {results.partResults.map(part => (
                <div key={part.id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        part.type === 'listening' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {part.type === 'listening' ? 'Listening' : 'Reading'}
                      </span>
                      <h3 className="font-bold text-gray-800 text-lg">{part.title}</h3>
                      <span className="text-sm text-gray-500">{part.range}</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{part.percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        part.type === 'listening'
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : 'bg-gradient-to-r from-purple-400 to-purple-600'
                      }`}
                      style={{ width: `${part.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="font-bold text-gray-700 text-lg">{part.totalQuestions}</div>
                      <div className="text-gray-500 text-xs">Total</div>
                    </div>
                    <div className="text-center bg-green-50 rounded-lg p-3">
                      <div className="font-bold text-green-600 text-lg">{part.correct}</div>
                      <div className="text-gray-500 text-xs">Correct</div>
                    </div>
                    <div className="text-center bg-red-50 rounded-lg p-3">
                      <div className="font-bold text-red-600 text-lg">{part.incorrect}</div>
                      <div className="text-gray-500 text-xs">Wrong</div>
                    </div>
                    <div className="text-center bg-gray-50 rounded-lg p-3">
                      <div className="font-bold text-gray-600 text-lg">{part.unanswered}</div>
                      <div className="text-gray-500 text-xs">Skipped</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                        ? 'bg-sky-500 text-white'
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
                      <span className="bg-sky-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        Câu {index + 1}
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
            className="bg-sky-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors duration-300 flex items-center justify-center gap-2"
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
