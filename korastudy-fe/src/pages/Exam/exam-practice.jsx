import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { examService } from '../../api/ExamService';
import { useUser } from '../../contexts/UserContext';
import { toast } from 'react-toastify';

const ExamPractice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUser();
  
  const [exam, setExam] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.warning('Bạn cần đăng nhập để luyện tập');
      navigate('/dang-nhap');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const examData = await examService.getExamDetail(id);
        setExam(examData);
      } catch (err) {
        console.error('Error fetching exam:', err);
        setError('Không thể tải thông tin bài thi');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExamData();
    }
  }, [id]);

  const handlePartToggle = (partId) => {
    setSelectedParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const handleStartPractice = () => {
    if (selectedParts.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một phần để luyện tập');
      return;
    }

    // Navigate to practice test with selected parts
    navigate(`/exam/${id}/practice-test`, {
      state: { selectedParts, exam }
    });
  };

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

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy bài thi'}</p>
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

  const totalSelectedQuestions = selectedParts.reduce((total, partId) => {
    const part = exam.parts.find(p => p.partId === partId);
    return total + (part?.questions?.length || 0);
  }, 0);

  const totalSelectedTime = selectedParts.reduce((total, partId) => {
    const part = exam.parts.find(p => p.partId === partId);
    return total + (part?.timeLimit || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Luyện tập theo phần</h1>
              <p className="text-gray-600">{exam.title}</p>
            </div>
            <button
              onClick={() => navigate(`/exam/${id}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Hướng dẫn luyện tập</h2>
            <ul className="text-blue-800 space-y-2">
              <li>• Chọn một hoặc nhiều phần bạn muốn luyện tập</li>
              <li>• Thời gian làm bài sẽ được tính theo tổng thời gian của các phần đã chọn</li>
              <li>• Kết quả sẽ được lưu riêng và không ảnh hưởng đến điểm thi chính thức</li>
              <li>• Bạn có thể xem lại đáp án sau khi hoàn thành</li>
            </ul>
          </div>

          {/* Parts Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Chọn phần luyện tập</h2>
            
            <div className="space-y-4">
              {exam.parts && exam.parts.map((part) => (
                <div
                  key={part.partId}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedParts.includes(part.partId)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePartToggle(part.partId)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                        selectedParts.includes(part.partId)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedParts.includes(part.partId) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          Phần {part.partNumber}: {part.title}
                        </h3>
                        {part.description && (
                          <p className="text-gray-600 mt-1">{part.description}</p>
                        )}
                        {part.instructions && (
                          <p className="text-sm text-gray-500 mt-2">
                            <strong>Hướng dẫn:</strong> {part.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <PlayCircle size={16} />
                          <span>{part.questions?.length || 0} câu</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{part.timeLimit || 0} phút</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedParts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt luyện tập</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedParts.length}</div>
                  <div className="text-sm text-gray-600">Phần đã chọn</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalSelectedQuestions}</div>
                  <div className="text-sm text-gray-600">Câu hỏi</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{totalSelectedTime}</div>
                  <div className="text-sm text-gray-600">Phút</div>
                </div>
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartPractice}
              disabled={selectedParts.length === 0}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Bắt đầu luyện tập ({totalSelectedQuestions} câu - {totalSelectedTime} phút)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPractice;
