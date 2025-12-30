import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, BookOpen, Play, Users, Star, ArrowRight, 
  Lock, Shuffle, Brain, Target, Clock, Trophy, Trash2, Edit
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { flashcardService } from '../../api/flashcardService';
import { toast } from 'react-toastify';


const FlashCard = () => {
  const [systemSets, setSystemSets] = useState([]);
  const [userSets, setUserSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState(null);

  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('explore');

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Lấy system sets mà không phụ thuộc vào trạng thái đăng nhập
      try {
        const systemData = await flashcardService.getSystemSets();
        setSystemSets(systemData || []); // Đảm bảo luôn có mảng kể cả khi API lỗi
      } catch (error) {
        console.error('Error fetching system flashcards:', error);
        setSystemSets([]);
        // Không hiển thị toast error vì đã xử lý trong interceptor
      }
      
      // Chỉ lấy user sets nếu đã đăng nhập
      if (isAuthenticated()) {
        try {
          const userData = await flashcardService.getUserSets();
          setUserSets(userData || []);
        } catch (error) {
          console.error('Error fetching user flashcards:', error);
          setUserSets([]);
          // Không hiển thị toast error vì đã xử lý trong interceptor
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated]);

  // Mock data for vocabulary topics (system vocabulary)
  const getRandomColor = (id) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-purple-500 to-pink-500",
      "from-indigo-500 to-blue-500",
      "from-red-500 to-pink-500"
    ];
    return colors[id % colors.length];
  };
  
  const vocabularyTopics = systemSets.map(set => ({
    id: set.id,
    title: set.title,
    description: set.description,
    cardCount: set.cards?.length || 0,
    level: set.category || "Beginner",
    image: "/api/placeholder/300/200",
    color: getRandomColor(set.id), // Hàm helper để chọn màu ngẫu nhiên
    popular: set.popular || false
  }));

  // Mock data for user's word lists (only shown when authenticated)
  const userWordLists = userSets.map(set => ({
    id: set.id,
    title: set.title,
    description: set.description,
    cardCount: set.cards?.length || 0,
    progress: set.progress?.percent || 0,
    lastStudied: set.lastStudiedAt || new Date().toISOString(),
    isCustom: true
  }));


  const handleTopicClick = (topicId) => {
    if (!isAuthenticated()) {
      navigate('/dang-nhap', { 
        state: { 
          from: { pathname: `/flash-card/practice/${topicId}` },
          message: "Vui lòng đăng nhập để học flashcard"
        }
      });
    } else {
      navigate(`/flash-card/practice/${topicId}`);
    }
  };

  const handleCreateWordList = () => {
    navigate('/flash-card/create');
  };

  // Xử lý khi người dùng muốn sửa một bộ flashcard
  const handleEditSet = (e, setId) => {
    e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên card cha
    e.preventDefault(); // Ngăn chuyển hướng
    navigate(`/flash-card/edit/${setId}`);
  };

  // Xử lý khi người dùng muốn xóa một bộ flashcard
  const openDeleteDialog = (e, setId) => {
    e.stopPropagation(); // Ngăn sự kiện click lan tỏa lên card cha
    e.preventDefault(); // Ngăn chuyển hướng nếu bọc trong thẻ link
    setSelectedSetId(setId);
    setDeleteDialogOpen(true);
  };

  // Xử lý khi người dùng xác nhận xóa
  const handleDeleteSet = async () => {
    if (!selectedSetId) return;
    
    try {
      await flashcardService.deleteFlashcardSet(selectedSetId);
      // Cập nhật lại state để UI cập nhật ngay
      setUserSets(prevSets => prevSets.filter(set => set.id !== selectedSetId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
    }
  };

  const AnimatedSection = ({ children, className = "" }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-sky-500 py-20 px-4 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-bold text-5xl lg:text-6xl mb-6">
              FlashCard Học Tiếng Anh
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Học từ vựng tiếng Anh hiệu quả với hệ thống flashcard thông minh
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 flex gap-2">
                {isAuthenticated() && (
                  <>
                    <button
                      onClick={() => setActiveSection('my-words')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        activeSection === 'my-words'
                          ? 'bg-white text-blue-600'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      Từ của tôi
                    </button>
                    <button
                      onClick={() => setActiveSection('studying')}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        activeSection === 'studying'
                          ? 'bg-white text-blue-600'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      Đang học
                    </button>
                  </>
                )}
                <button
                  onClick={() => setActiveSection('explore')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeSection === 'explore'
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  Khám phá
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {/* My Word Lists Section - Only shown when authenticated */}
          {isAuthenticated() && activeSection === 'my-words' && (
            <motion.div
              key="my-words"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Danh sách từ vựng của tôi
                </h2>
                <motion.button
                  onClick={handleCreateWordList}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={20} />
                  Tạo danh sách mới
                </motion.button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userWordLists.map((list, index) => (
                  <motion.div
                    key={list.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Các nút thao tác ở góc trên bên phải */}
                    <div className="absolute top-3 right-3 flex gap-1 z-20">
                      <button
                        onClick={(e) => handleEditSet(e, list.id)}
                        className="p-2 bg-white/80 hover:bg-blue-50 dark:bg-gray-700/80 dark:hover:bg-blue-900/30 rounded-full transition-all shadow-sm"
                        title="Sửa bộ flashcard"
                      >
                        <Edit size={18} className="text-blue-500" />
                      </button>
                      <button
                        onClick={(e) => openDeleteDialog(e, list.id)}
                        className="p-2 bg-white/80 hover:bg-red-50 dark:bg-gray-700/80 dark:hover:bg-red-900/30 rounded-full transition-all shadow-sm"
                        title="Xóa bộ flashcard"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start mb-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                            {list.title}
                          </h3>
                          {list.isCustom && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full inline-block mr-2">
                              Tự tạo
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {list.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>{list.cardCount} từ</span>
                        <span>Học lần cuối: {new Date(list.lastStudied).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">Tiến độ</span>
                          <span className="text-sky-600 dark:text-sky-400">{list.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            className="bg-sky-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${list.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/flash-card/practice/user/${list.id}`)}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        Tiếp tục học
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Studying Section - Only shown when authenticated */}
          {isAuthenticated() && activeSection === 'studying' && (
            <motion.div
              key="studying"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                Đang học
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Quick Practice */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Luyện tập nhanh
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Ôn tập 20 từ ngẫu nhiên từ các danh sách đã học
                  </p>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                    Bắt đầu luyện tập
                  </button>
                </div>

                {/* Mixed Practice */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Shuffle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Luyện tập tổng hợp
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Kết hợp nhiều danh sách để luyện tập toàn diện
                  </p>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                    Chọn danh sách
                  </button>
                </div>
              </div>

              {/* Recent Lists */}
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Danh sách gần đây
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userWordLists.slice(0, 3).map((list, index) => (
                  <motion.div
                    key={list.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {list.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {list.cardCount} từ • {list.progress}% hoàn thành
                    </p>
                    <button
                      onClick={() => navigate(`/flash-card/practice/user/${list.id}`)}
                      className="w-full bg-sky-500 text-white py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors duration-300"
                    >
                      Tiếp tục
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Explore Section - Always visible */}
          {activeSection === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                  Khám phá chủ đề từ vựng
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Chọn chủ đề phù hợp với trình độ và mục tiêu học tập của bạn
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {vocabularyTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group relative cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    onClick={() => handleTopicClick(topic.id)}
                  >
                    {topic.popular && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                        Phổ biến
                      </div>
                    )}
                    
                    <div className="relative overflow-hidden h-48">
                      <div className={`absolute inset-0 ${topic.color} opacity-90`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white" />
                      </div>
                      {!isAuthenticated() && (
                        <div className="absolute top-4 right-4">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
                          {topic.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          topic.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          topic.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {topic.level}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {topic.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen size={16} />
                          {topic.cardCount} từ
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={16} />
                          {Math.floor(Math.random() * 1000) + 500}+ học viên
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="text-yellow-400 fill-current" />
                          ))}
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            4.8
                          </span>
                        </div>
                        
                        <motion.div
                          className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold"
                          whileHover={{ x: 5 }}
                        >
                          {isAuthenticated() ? 'Học ngay' : 'Đăng nhập để học'}
                          <ArrowRight size={16} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Section for non-authenticated users */}
              {!isAuthenticated() && (
                <motion.div
                  className="mt-16 bg-sky-500 rounded-2xl p-8 text-center text-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h3 className="text-2xl font-bold mb-4">
                    Bắt đầu hành trình học từ vựng tiếng Anh
                  </h3>
                  <p className="text-lg mb-6 text-white/90">
                    Đăng nhập để truy cập tất cả chủ đề và tạo danh sách từ vựng riêng
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/dang-ky"
                      className="bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Đăng ký miễn phí
                    </Link>
                    <Link
                      to="/dang-nhap"
                      className="bg-transparent text-white px-8 py-3 rounded-xl font-semibold border-2 border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay nền tối */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setDeleteDialogOpen(false)}
          />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm w-full z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bạn có chắc chắn muốn xóa bộ từ vựng này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteSet}
                className="px-4 py-2 bg-red-500 rounded-lg font-semibold text-white transition-all duration-300 hover:bg-red-600"
              >
                Xóa bộ từ vựng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashCard;
