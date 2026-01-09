import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Filter, Clock, Users, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ExamCard from '../../components/ExamComponent/ExamCard';
import { examService } from '../../api/ExamService';
import { useUser } from '../../contexts/UserContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const Exams = () => {
  const location = useLocation();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { user } = useUser();

  // Xác định loại bài thi từ URL
  const examType = location.pathname.includes('listening') ? 'LISTENING' : 
                   location.pathname.includes('reading') ? 'READING' :
                   location.pathname.includes('full-test') ? 'FULL_TEST' : 'all';

  // Fetch danh sách bài thi từ API
  useEffect(() => {
    fetchExams();
  }, [examType]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      let data;
      
      if (examType === 'LISTENING') {
        data = await examService.getListeningExams();
      } else if (examType === 'READING') {
        data = await examService.getReadingExams();
      } else if (examType === 'FULL_TEST') {
        data = await examService.getFullTestExams();
      } else {
        data = await examService.getAllExams();
      }
      
      console.log('📊 Exam data from API:', data);
      console.log('📊 First exam structure:', data[0]);
      console.log('📊 Exams with isLocked:', data.filter(e => e.isLocked).length);
      
      setExams(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách bài thi. Vui lòng thử lại sau.');
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      let data;
      
      // Nếu có bộ lọc examType, fetch theo type trước
      if (examType !== 'all') {
        if (examType === 'LISTENING') {
          data = await examService.getListeningExams();
        } else if (examType === 'READING') {
          data = await examService.getReadingExams();
        } else if (examType === 'FULL_TEST') {
          data = await examService.getFullTestExams();
        }
      } else {
        data = await examService.searchExams(
          searchTerm,
          getLevelForApi(selectedLevel),
          null
        );
      }
      
      setExams(data);
      setError(null);
    } catch (err) {
      setError('Không thể tìm kiếm bài thi. Vui lòng thử lại sau.');
      console.error('Error searching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedLevel('all');
    setSelectedType('all');
    fetchExams();
  };

  const getLevelForApi = (levelId) => {
    switch(levelId) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return '';
    }
  };

  const levels = [
    { id: 'all', name: 'Tất cả cấp độ' },
    { id: 'beginner', name: 'Cơ bản' },
    { id: 'intermediate', name: 'Trung cấp' },
    { id: 'advanced', name: 'Nâng cao' }
  ];

  // Cập nhật examTypes để phù hợp với TOEIC
  const examTypes = [
    { id: 'all', name: 'Tất cả loại' },
    { id: 'listening', name: 'Listening' },
    { id: 'reading', name: 'Reading' },
    { id: 'full_test', name: 'Thi thật' }
  ];

  // Helper để lấy tiêu đề và mô tả theo examType
  const getPageTitle = () => {
    switch(examType) {
      case 'LISTENING': return 'Bài thi Listening';
      case 'READING': return 'Bài thi Reading';
      case 'FULL_TEST': return 'Đề thi thật';
      default: return 'Thư viện đề thi';
    }
  };

  const getPageDescription = () => {
    switch(examType) {
      case 'LISTENING': return 'Luyện tập kỹ năng nghe với các bài thi TOEIC Listening';
      case 'READING': return 'Luyện tập kỹ năng đọc với các bài thi TOEIC Reading';
      case 'FULL_TEST': return 'Thi thử TOEIC đầy đủ với cả phần Listening và Reading';
      default: return 'Luyện tập với hàng trăm đề thi thử TOEIC và bài kiểm tra chuyên sâu';
    }
  };

  // Filter exams based on search and filters (client-side filtering as backup)
  const filteredExams = exams.filter(exam => {
    const matchesSearch = searchTerm === '' || 
                         (exam.title && exam.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (exam.description && exam.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || 
                        (selectedLevel === 'beginner' && (exam.level === 'Beginner' || exam.level === 'Cơ bản')) ||
                        (selectedLevel === 'intermediate' && (exam.level === 'Intermediate' || exam.level === 'Trung cấp')) ||
                        (selectedLevel === 'advanced' && (exam.level === 'Advanced' || exam.level === 'Nâng cao'));
    
    return matchesSearch && matchesLevel;
  });

  // Pagination
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải danh sách bài thi...</p>
          </div>
        </div>
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <Clock className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-semibold">{error}</p>
            </div>
            <button
              onClick={fetchExams}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      {/* Hero Section */}
      <section className="bg-sky-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="font-inter font-bold text-4xl lg:text-5xl mb-4">
              {getPageTitle()}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              {getPageDescription()}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đề thi, bài kiểm tra..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl border-0 text-gray-800 placeholder-gray-500 text-lg outline-none focus:ring-4 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                <div className="flex items-center gap-2 mb-6">
                  <Filter size={20} className="text-sky-500" />
                  <h3 className="font-semibold text-lg text-gray-800">Bộ lọc</h3>
                </div>

                {/* Level Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3">Cấp độ</h4>
                  <div className="space-y-2">
                    {levels.map(level => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                          selectedLevel === level.id 
                            ? 'bg-sky-500 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {level.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter - Ẩn khi đang ở trang cụ thể */}
                {examType === 'all' && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">Loại bài thi</h4>
                    <div className="space-y-2">
                      <Link
                        to="/exam"
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                      >
                        Tất cả loại
                      </Link>
                      <Link
                        to="/de-thi/listening"
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                      >
                        Listening
                      </Link>
                      <Link
                        to="/de-thi/reading"
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                      >
                        Reading
                      </Link>
                      <Link
                        to="/de-thi/full-test"
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200"
                      >
                        Thi thật
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Đề thi và bài kiểm tra
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Tìm thấy {filteredExams.length} kết quả
                  </p>
                </div>
              </div>

              {/* Exams Grid */}
              {currentExams.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {currentExams.map(exam => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy bài thi nào</h3>
                  <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    Xem tất cả bài thi
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentPage === index + 1
                          ? 'bg-sky-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    

      
    </div>
  );
};

export default Exams;