import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Shuffle, ChevronLeft, ChevronRight, 
  ThumbsUp, ThumbsDown, RotateCcw, Volume2, X,
  Flag, CheckCircle, XCircle
} from 'lucide-react';
import { flashcardService } from '../../api/flashcardService';
import { toast } from 'react-toastify';

const FlashCardPractice = () => {
  const { topicId, listId } = useParams();
  const navigate = useNavigate();

  // Thêm state cho loading và set info
  const [loading, setLoading] = useState(true);
  const [setInfo, setSetInfo] = useState(null);
  
  // State management
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState(new Set());
  const [unknownCards, setUnknownCards] = useState(new Set());
  const [isShuffled, setIsShuffled] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
  const fetchCardData = async () => {
    setLoading(true);
    try {
      // Sử dụng topicId hoặc listId tùy thuộc vào route
      const setId = topicId || listId;
      if (!setId) {
        toast.error('Không tìm thấy ID của bộ flashcard');
        return;
      }

      const response = await flashcardService.getFlashcardSet(setId);
      
      setSetInfo({
        title: response.title,
        description: response.description
      });

      // Chuyển đổi định dạng dữ liệu từ API sang định dạng của component
      const formattedCards = response.cards.map(card => ({
        id: card.id,
        front: card.term,        // term trong API tương ứng với front trong UI
        back: card.definition,   // definition trong API tương ứng với back trong UI
        example: card.example || "",
        pronunciation: "",       // API không có trường này, có thể bổ sung sau
        exampleTranslation: "",  // API không có trường này, có thể bổ sung sau
        image: card.imageUrl,
        isKnown: card.isKnown
      }));
      
      setCards(formattedCards);
      
      // Cập nhật trạng thái đã biết/chưa biết dựa trên dữ liệu từ API
      const knownCardIds = new Set(
        formattedCards.filter(card => card.isKnown).map(card => card.id)
      );
      const unknownCardIds = new Set(
        formattedCards.filter(card => !card.isKnown && response.progress?.total > 0)
          .map(card => card.id)
      );
      
      setKnownCards(knownCardIds);
      setUnknownCards(unknownCardIds);
      
    } catch (error) {
      toast.error('Không thể tải dữ liệu flashcard');
      console.error('Error fetching flashcard data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchCardData();
}, [topicId, listId]);
  // Mock flashcard data
  const mockCards = [
    {
      id: 1,
      front: "Hello",
      back: "Xin chào",
      pronunciation: "/həˈləʊ/",
      example: "Hello, nice to meet you.",
      exampleTranslation: "Xin chào, rất vui được gặp bạn.",
      image: null,
      audio: null
    },
    {
      id: 2,
      front: "Thank you",
      back: "Cảm ơn",
      pronunciation: "/θæŋk juː/",
      example: "Thank you for your help.",
      exampleTranslation: "Cảm ơn bạn đã giúp đỡ.",
      image: null,
      audio: null
    },
    {
      id: 3,
      front: "Sorry",
      back: "Xin lỗi",
      pronunciation: "/ˈsɒri/",
      example: "I am sorry for being late.",
      exampleTranslation: "Tôi xin lỗi vì đã đến muộn.",
      image: null,
      audio: null
    },
    {
      id: 4,
      front: "I love you",
      back: "Tôi yêu bạn",
      pronunciation: "/aɪ lʌv juː/",
      example: "I love you so much.",
      exampleTranslation: "Tôi yêu bạn rất nhiều.",
      image: null,
      audio: null
    },
    {
      id: 5,
      front: "Delicious",
      back: "Ngon",
      pronunciation: "/dɪˈlɪʃəs/",
      example: "This food is really delicious.",
      exampleTranslation: "Món ăn này thực sự rất ngon.",
      image: null,
      audio: null
    }
  ];

  // Initialize cards
  // useEffect(() => {
  //   setCards(mockCards);
  // }, [topicId, listId]);

  // Get current card
  const currentCard = cards[currentCardIndex];

  // Calculate progress
  const totalCards = cards.length;
  const studiedCards = knownCards.size + unknownCards.size;
  const progress = totalCards > 0 ? (studiedCards / totalCards) * 100 : 0;

  // Handle card flip
  const handleFlip = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleFlip();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case '1':
          event.preventDefault();
          handleKnown();
          break;
        case '2':
          event.preventDefault();
          handleUnknown();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, currentCardIndex]);

  // Navigation functions
  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  // Handle know/don't know
  const handleKnown = async () => {
    const cardId = currentCard.id;
    try {
      await flashcardService.updateCardProgress(cardId, true);
      
      setKnownCards(prev => new Set([...prev, cardId]));
      setUnknownCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      
      // Auto advance to next card
      setTimeout(() => {
        handleNext();
      }, 500);
      } catch (error) {
        toast.error('Không thể cập nhật tiến độ');
        console.error('Error updating card progress:', error);
      }
  };

  const handleUnknown = async () => {
    const cardId = currentCard.id;
    try {
      await flashcardService.updateCardProgress(cardId, false);
      
      setUnknownCards(prev => new Set([...prev, cardId]));
      setKnownCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      
      // Auto advance to next card
      setTimeout(() => {
        handleNext();
      }, 500);
    } catch (error) {
      toast.error('Không thể cập nhật tiến độ');
      console.error('Error updating card progress:', error);
    }
  };

  // Shuffle cards
  const handleShuffle = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
  };

  // Reset practice
  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setUnknownCards(new Set());
    setShowResult(false);
  };

  // Play audio
  const playAudio = () => {
    if (currentCard.audio) {
      const audio = new Audio(currentCard.audio);
      audio.play().catch(console.error);
    }
  };

  if (!currentCard && !showResult) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải flashcard...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Hoàn thành!
          </h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Tổng số từ:</span>
              <span className="font-semibold text-gray-800 dark:text-white">{totalCards}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Đã biết:</span>
              <span className="font-semibold text-green-600">{knownCards.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Chưa biết:</span>
              <span className="font-semibold text-red-600">{unknownCards.size}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-300"
            >
              Học lại
            </button>
            <button
              onClick={() => navigate('/flash-card')}
              className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300"
            >
              Về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back button and title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/flash-card')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {setInfo?.title || "Đang tải..."}
              </h1>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
                title="Trộn bài"
              >
                <Shuffle size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
                title="Bắt đầu lại"
              >
                <RotateCcw size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>{currentCardIndex + 1} / {totalCards}</span>
              <span>{Math.round(progress)}% hoàn thành</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Flashcard */}
          <div className="relative w-full max-w-lg h-80 mb-8">
            <motion.div
              className="w-full h-full cursor-pointer"
              onClick={handleFlip}
              style={{ perspective: 1000 }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of card */}
                <div
                  className="absolute inset-0 w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-8"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                      {currentCard.front}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
                      [{currentCard.pronunciation}]
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio();
                      }}
                      className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
                    >
                      <Volume2 size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 text-sm text-gray-400 dark:text-gray-500">
                    Nhấn để xem nghĩa
                  </div>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-white"
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">
                      {currentCard.back}
                    </h2>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                      <p className="text-lg mb-2">
                        <strong>Ví dụ:</strong> {currentCard.example}
                      </p>
                      <p className="text-white/80">
                        {currentCard.exampleTranslation}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 text-sm text-white/70">
                    Nhấn để quay lại
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </button>

            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {currentCardIndex + 1} / {totalCards}
            </span>

            <button
              onClick={handleNext}
              className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Know/Don't know buttons */}
          <div className="flex gap-4">
            <motion.button
              onClick={handleUnknown}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThumbsDown size={20} />
              Chưa biết
            </motion.button>

            <motion.button
              onClick={handleKnown}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThumbsUp size={20} />
              Đã biết
            </motion.button>
          </div>

          {/* Keyboard shortcuts */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Phím tắt:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Space</kbd> Lật thẻ</span>
              <span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">←</kbd> Trước</span>
              <span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">→</kbd> Sau</span>
              <span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">1</kbd> Đã biết</span>
              <span><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">2</kbd> Chưa biết</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardPractice;
