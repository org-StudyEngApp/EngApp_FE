import React, { useState, useEffect,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Flag, FlagOff, AlertCircle, CheckCircle } from 'lucide-react';
import { examService } from '../../api/ExamService';
import { useUser } from '@contexts/UserContext.jsx';
import { toast } from 'react-toastify';

// Helper function để parse options từ backend
const parseOptions = (optionString) => {
  if (!optionString) {
    console.warn('⚠️ No option string provided - optionString is:', optionString);
    return [];
  }
  
  console.log('📥 RAW option received:', optionString);
  console.log('📥 Type:', typeof optionString);
  
  // Kiểm tra nếu optionString đã là array
  if (Array.isArray(optionString)) {
    console.log('✅ Already an array, parsing each item');
    return optionString.map(item => {
      if (typeof item === 'object' && item.label && item.text) {
        return item;
      }
      // Parse string items like "A. launch"
      const match = String(item).trim().match(/^([A-D])[.)]\s*(.+)$/);
      if (match) {
        return { label: match[1], text: match[2].trim() };
      }
      return null;
    }).filter(opt => opt !== null);
  }
  
  // Format Backend: JSON string chứa array
  // Ví dụ: "[\"A. Going to the restaurant\", \"B. Ordering takeout\", ...]"
  if (typeof optionString === 'string') {
    const trimmed = optionString.trim();
    
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        console.log('🔄 Attempting to parse JSON string array...');
        const parsedArray = JSON.parse(trimmed);
        
        if (Array.isArray(parsedArray)) {
          console.log('✅ JSON parsed successfully!');
          console.log('✅ Array length:', parsedArray.length);
          console.log('✅ Array items:', parsedArray);
          
          const options = parsedArray.map((item, index) => {
            const itemStr = String(item).trim();
            console.log(`  [${index}] Processing: "${itemStr}"`);
            
            // Match pattern: "A. text" or "A) text"
            const match = itemStr.match(/^([A-D])[.)]\s*(.+)$/);
            
            if (match) {
              const result = { 
                label: match[1], 
                text: match[2].trim() 
              };
              console.log(`    ✓ Parsed to:`, result);
              return result;
            }
            
            console.warn(`    ✗ Could not parse: "${itemStr}"`);
            return null;
          }).filter(opt => opt !== null);
          
          console.log('✅ FINAL parsed options:', options);
          return options;
        } else {
          console.error('❌ JSON parsed but not an array:', parsedArray);
        }
      } catch (error) {
        console.error('❌ JSON parse error:', error.message);
        console.error('❌ Failed to parse string:', trimmed);
      }
    }
    
    // Fallback formats
    // Format 1: "A. text|B. text|C. text|D. text"
    if (trimmed.includes('|')) {
      console.log('🔄 Parsing pipe-separated format...');
      const parts = trimmed.split('|');
      const options = parts.map(part => {
        const match = part.trim().match(/^([A-D])[.)]\s*(.+)$/);
        if (match) {
          return { label: match[1], text: match[2].trim() };
        }
        return null;
      }).filter(opt => opt !== null);
      console.log('✅ Parsed options:', options);
      return options;
    }
  }
  
  console.error('❌ No parsing method worked!');
  console.error('❌ Type:', typeof optionString);
  console.error('❌ Value:', optionString);
  return [];
};

const ExamTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  const audioRef = useRef(null);
  // State management
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentPart, setCurrentPart] = useState(1); // Track current part tab
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set()); // Thêm state cho flagged questions
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Bạn cần đăng nhập để tham gia thi');
      navigate('/dang-nhap', { 
        state: { from: `/exam/${id}/test` } 
      });
      return;
    }
  }, [isAuthenticated, navigate, id]);

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching exam data for ID:', id);
        
        const examData = await examService.getExamDetail(id);
        console.log('✅ Exam data received:', examData);
        
        setExam(examData);
        
        // Set thời gian làm bài (chuyển từ phút sang giây)
        if (examData.durationTimes) {
          setTimeLeft(examData.durationTimes * 60);
        }
        
        // Chuyển đổi dữ liệu từ backend format sang frontend format
        const formattedQuestions = [];
        console.log('🔍 Processing exam parts:', examData.parts?.length || 0);
        
        if (examData.parts && examData.parts.length > 0) {
          examData.parts.forEach((part, partIndex) => {
            console.log(`📑 Part ${partIndex + 1}:`, part.title, '- Questions:', part.questions?.length || 0);
            
            if (part.questions && part.questions.length > 0) {
              part.questions.forEach((question, qIndex) => {
                console.log(`\n❓ Question ${question.questionId}:`);
                console.log('  - Raw option field:', question.option);
                console.log('  - Option type:', typeof question.option);
                console.log('  - Option value:', question.option ? question.option.substring(0, 100) + '...' : 'NULL');
                
                const parsedOptions = parseOptions(question.option);
                console.log(`  ✅ Parsed ${parsedOptions.length} options:`, parsedOptions);
                
                if (parsedOptions.length === 0) {
                  console.error(`  ❌ WARNING: No options parsed for question ${question.questionId}!`);
                }
                
                formattedQuestions.push({
                  id: question.questionId,
                  partId: part.partId,
                  partNumber: part.partNumber,
                  partName: part.title,
                  questionText: question.questionText,
                  options: parsedOptions,
                  type: part.partNumber <= 4 ? 'listening' : 'reading', // TOEIC: 1-4 là listening, 5-7 là reading
                  audioUrl: question.audioUrl,
                  imageUrl: question.imageUrl,
                  correctAnswer: question.correctAnswer
                });
              });
            }
          });
        }
        
        console.log('\n📊 Summary:');
        console.log('  - Total questions formatted:', formattedQuestions.length);
        console.log('  - Questions with options:', formattedQuestions.filter(q => q.options && q.options.length > 0).length);
        console.log('  - Questions WITHOUT options:', formattedQuestions.filter(q => !q.options || q.options.length === 0).length);
        
        setQuestions(formattedQuestions);
        console.log('✅ All formatted questions:', formattedQuestions);
        
      } catch (err) {
        console.error('❌ Error fetching exam data:', err);
        setError('Không thể tải dữ liệu bài thi. Vui lòng thử lại.');
        toast.error('Không thể tải dữ liệu bài thi');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamData();
    }
  }, [id]);
  useEffect(() => {
    // Nếu có audio đang phát, dừng và reset nó
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Cập nhật src cho audio nếu câu hỏi mới có audio
      if (questions[currentQuestion]?.audioUrl) {
        audioRef.current.src = questions[currentQuestion].audioUrl;
        audioRef.current.load();
      }
    }
  }, [currentQuestion, questions]);
  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          toast.warning('Hết thời gian! Tự động nộp bài.');
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format thời gian hiển thị
  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Xử lý chọn đáp án
  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  // Xử lý toggle flag cho câu hỏi
  const handleToggleFlag = (questionId) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };
  
  // Helper function để lấy số thứ tự câu hỏi
  const getCurrentQuestionNumber = (questionId) => {
    const index = questions.findIndex(q => q.id === questionId);
    return index + 1;
  };

  // Chuyển câu hỏi
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestion(index);
    // Update current part based on the question
    const question = questions[index];
    if (question && question.partNumber) {
      setCurrentPart(question.partNumber);
    }
  };

  // Handle part tab change
  const handlePartChange = (partNumber) => {
    setCurrentPart(partNumber);
    // Find first question of this part
    const firstQuestionIndex = questions.findIndex(q => q.partNumber === partNumber);
    if (firstQuestionIndex !== -1) {
      setCurrentQuestion(firstQuestionIndex);
    }
  };

  // Nộp bài thi
  const handleSubmitExam = async () => {
    // Validate user authentication first
    if (!user) {
      console.error('User not found:', user);
      toast.error('Vui lòng đăng nhập để nộp bài');
      navigate('/dang-nhap');
      return;
    }

    // Get the correct user ID - try multiple possible fields
    const userId = user.id || user.userId || user.account?.id || user.accountId;
    
    if (!userId) {
      console.error('No valid user ID found in user object:', user);
      toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      navigate('/dang-nhap');
      return;
    }

    // Validate that we have answers
    if (Object.keys(answers).length === 0) {
      toast.error('Vui lòng trả lời ít nhất một câu hỏi');
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn nộp bài? Hành động này không thể hoàn tác.')) {
      try {
        setIsSubmitting(true);
        
        console.log('=== EXAM SUBMISSION DEBUG ===');
        console.log('User object:', user);
        console.log('User ID found:', userId, 'Type:', typeof userId);
        console.log('Exam ID:', id);
        console.log('Raw answers:', answers);
        
        // Format answers according to backend SubmitAnswerRequest
        const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: parseInt(questionId), // Ensure it's a number
          selectedAnswer: selectedAnswer.toString() // Ensure it's a string
        }));

        console.log('Formatted answers:', formattedAnswers);

        // Validate formatted answers
        if (formattedAnswers.length === 0) {
          toast.error('Không có câu trả lời nào để nộp');
          return;
        }

        // Create request payload matching backend SubmitExamRequest
        const submitRequest = {
          answers: formattedAnswers
        };

        console.log('Submit request payload:', submitRequest);
        console.log('Submitting to exam ID:', id, 'for user ID:', userId);

        // Ensure userId is a valid number
        const validUserId = parseInt(userId);
        if (isNaN(validUserId) || validUserId <= 0) {
          throw new Error('Invalid user ID: ' + userId);
        }

        const result = await examService.submitExam(id, submitRequest, validUserId);
        
        console.log('✅ Submit result received:', result);
        console.log('Answer details count:', result.answerDetails?.length || 0);
        
        toast.success('Nộp bài thành công!');
        
        // Navigate to result page with result data including answer details
        if (result && result.resultId) {
          navigate(`/exam/${id}/result`, { 
            state: { 
              result: result,
              resultId: result.resultId,
              examId: id,
              examTitle: exam.title,
              examData: exam,
              hasAnswerDetails: !!(result.answerDetails && result.answerDetails.length > 0)
            },
            replace: true // Replace history để không quay lại được trang thi
          });
        } else {
          // Fallback: chuyển về trang exam detail
          console.warn('No resultId received, redirecting to exam detail');
          navigate(`/exam/${id}`, { 
            state: { 
              message: 'Nộp bài thành công! Kết quả đang được xử lý.',
              result: result
            } 
          });
        }
        
      } catch (error) {
        console.error('❌ Error submitting exam:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Provide more specific error messages
        if (error.message.includes('User ID not found') || error.message.includes('không tìm thấy người dùng')) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/dang-nhap');
        } else if (error.response?.status === 401) {
          toast.error('Bạn cần đăng nhập để nộp bài.');
          navigate('/dang-nhap');
        } else {
          toast.error('Có lỗi xảy ra khi nộp bài: ' + (error.response?.data?.message || error.message));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Confirm submit dialog
  const ConfirmSubmitDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-medium">Xác nhận nộp bài</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-600">
            Bạn có chắc chắn muốn nộp bài? Sau khi nộp bài sẽ không thể chỉnh sửa.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <span>Đã trả lời:</span>
              <span className="font-medium">{Object.keys(answers).length} / {questions.length}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Chưa trả lời:</span>
              <span className="font-medium">{questions.length - Object.keys(answers).length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Đã đánh dấu:</span>
              <span className="font-medium">{flaggedQuestions.size}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmSubmit(false)}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              setShowConfirmSubmit(false);
              handleSubmitExam();
            }}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/de-thi')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy câu hỏi cho bài thi này</p>
          <button 
            onClick={() => navigate('/exam')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Quay lại danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  // Group questions by part for display
  const groupedByPart = {};
  questions.forEach((q, index) => {
    const partKey = q.partNumber || 1;
    if (!groupedByPart[partKey]) {
      groupedByPart[partKey] = {
        partNumber: partKey,
        partName: q.partName || `Part ${partKey}`,
        questionIndices: []
      };
    }
    groupedByPart[partKey].questionIndices.push(index);
  });
  
  const parts = Object.values(groupedByPart).sort((a, b) => a.partNumber - b.partNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed */}
      <div className="bg-white shadow-md border-b sticky top-0 z-40">
        <div className="max-w-[1920px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Thoát
              </button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="h-5 w-5" />
                <span className="text-lg">Thời gian còn lại: {formatTime(timeLeft)}</span>
              </div>
              
              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
              >
                NỘP BÀI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">
          {/* Left Panel - Question Area */}
          <div className="bg-white border-r">
            {/* Audio Player (for listening parts) */}
            {currentQuestionData.type === 'listening' && currentQuestionData.audioUrl && (
              <div className="border-b bg-gray-50 px-8 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">🎧 Audio:</span>
                  <audio 
                    ref={audioRef}
                    key={currentQuestionData.id || currentQuestion}
                    controls 
                    className="flex-1 h-12"
                    src={currentQuestionData.audioUrl}
                  >
                    Trình duyệt của bạn không hỗ trợ phát audio.
                  </audio>
                </div>
              </div>
            )}

            {/* Part Tabs Navigation */}
            <div className="border-b bg-white sticky top-[73px] z-30">
              <div className="flex items-center px-8 overflow-x-auto">
                {parts.map((part) => {
                  const isActive = currentPart === part.partNumber;
                  const partAnswered = part.questionIndices.filter(idx => answers[questions[idx].id] !== undefined).length;
                  const partTotal = part.questionIndices.length;
                  
                  return (
                    <button
                      key={part.partNumber}
                      onClick={() => handlePartChange(part.partNumber)}
                      className={`px-6 py-4 text-sm font-semibold border-b-3 whitespace-nowrap transition-colors relative ${
                        isActive 
                          ? 'border-blue-600 text-blue-600 bg-blue-50' 
                          : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      Part {part.partNumber}
                      <span className="ml-2 text-xs">
                        ({partAnswered}/{partTotal})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Content */}
            <div className="px-8 py-8 min-h-[600px]">
              {/* Question Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {currentQuestion + 1}
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
                    Câu hỏi {currentQuestion + 1}
                  </span>
                </div>
                
                {/* Flag Button */}
                <button
                  onClick={() => handleToggleFlag(currentQuestionData.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestionData.id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={flaggedQuestions.has(currentQuestionData.id) ? 'Bỏ đánh dấu' : 'Đánh dấu câu hỏi'}
                >
                  {flaggedQuestions.has(currentQuestionData.id) ? (
                    <Flag className="h-5 w-5 fill-current" />
                  ) : (
                    <FlagOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Question Image (for Part 1) */}
              {currentQuestionData.imageUrl && (
                <div className="mb-6">
                  <img 
                    src={currentQuestionData.imageUrl} 
                    alt="Question illustration" 
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Question Text */}
              <div className="mb-8">
                <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {currentQuestionData.questionText}
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {currentQuestionData.options && currentQuestionData.options.length > 0 ? (
                  currentQuestionData.options.map((option, index) => {
                    const isSelected = answers[currentQuestionData.id] === option.label;
                    
                    return (
                      <label
                        key={index}
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50 ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50 shadow-md' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestionData.id}`}
                          value={option.label}
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(currentQuestionData.id, option.label)}
                          className="mt-1 w-5 h-5 text-blue-600 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="text-base text-gray-800 font-medium">
                            {option.label}.
                          </span>
                          <span className="ml-2 text-base text-gray-800">
                            {option.text}
                          </span>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                    <p className="text-yellow-800">⚠️ Không có options cho câu hỏi này</p>
                    <p className="text-xs text-yellow-600 mt-2">
                      Debug: Question ID: {currentQuestionData.id}, 
                      Options: {JSON.stringify(currentQuestionData.options)}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Câu trước
                </button>
                
                <span className="text-sm text-gray-600">
                  {currentQuestion + 1} / {totalQuestions}
                </span>
                
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Câu sau →
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Question Navigator */}
          <div className="bg-white border-l">
            <div className="sticky top-[73px] p-6">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase">
                  Khối phục/Lưu bài làm
                </h3>
                <p className="text-xs text-orange-600 leading-relaxed mb-4">
                  Câu 1- Bạn có thể click vào số thứ tự câu hỏi trong bảng để đánh dấu review
                </p>
              </div>

              {/* Question Grid by Parts */}
              <div className="space-y-6">
                {parts.map((part) => (
                  <div key={part.partNumber}>
                    <h4 className="text-sm font-bold text-gray-800 mb-3">
                      Part {part.partNumber}
                    </h4>
                    <div className="grid grid-cols-5 gap-2">
                      {part.questionIndices.map((questionIndex) => {
                        const question = questions[questionIndex];
                        const isAnswered = answers[question.id] !== undefined;
                        const isCurrent = questionIndex === currentQuestion;
                        const isFlagged = flaggedQuestions.has(question.id);
                        
                        return (
                          <button
                            key={question.id}
                            onClick={() => handleQuestionJump(questionIndex)}
                            className={`relative w-10 h-10 rounded-md text-sm font-semibold transition-all ${
                              isCurrent
                                ? 'bg-blue-600 text-white shadow-md'
                                : isAnswered
                                ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {questionIndex + 1}
                            
                            {/* Flag indicator */}
                            {isFlagged && (
                              <Flag 
                                size={10} 
                                className="absolute -top-1 -right-1 text-red-600 fill-current drop-shadow" 
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-8 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-md"></div>
                  <span className="text-sm text-gray-700">Câu hiện tại</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 border border-green-300 rounded-md"></div>
                  <span className="text-sm text-gray-700">Đã trả lời</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded-md"></div>
                  <span className="text-sm text-gray-700">Chưa trả lời</span>
                </div>
                <div className="flex items-center gap-3">
                  <Flag size={16} className="text-red-600 fill-current ml-2" />
                  <span className="text-sm text-gray-700">Đã đánh dấu review</span>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng số câu:</span>
                    <span className="font-semibold text-gray-900">{totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã trả lời:</span>
                    <span className="font-semibold text-green-600">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chưa trả lời:</span>
                    <span className="font-semibold text-red-600">{totalQuestions - answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã đánh dấu:</span>
                    <span className="font-semibold text-orange-600">{flaggedQuestions.size}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    {Math.round((answeredCount / totalQuestions) * 100)}% hoàn thành
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && <ConfirmSubmitDialog />}
    </div>
  );
};

export default ExamTest;