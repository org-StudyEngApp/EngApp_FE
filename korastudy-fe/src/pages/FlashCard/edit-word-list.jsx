import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { flashcardService } from '../../api/flashcardService';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Plus, Trash2, Save, 
  BookOpen, X, Check
} from 'lucide-react';

const EditWordList = () => {
  const navigate = useNavigate();
  const { setId } = useParams();
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch existing flashcard data
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        const data = await flashcardService.getFlashcardSet(setId);
        
        // Populate form with existing data
        setListTitle(data.title);
        setListDescription(data.description);
        
        // Convert cards to words format
        const convertedWords = data.cards.map((card, index) => ({
          id: card.id || Date.now() + index,
          english: card.term,
          vietnamese: card.definition,
          pronunciation: '',  // API doesn't provide this
          example: card.example || '',
          imageUrl: card.imageUrl
        }));
        
        setWords(convertedWords.length > 0 ? convertedWords : [
          { id: Date.now(), english: '', vietnamese: '', pronunciation: '', example: '' }
        ]);
      } catch (error) {
        console.error('Error fetching flashcard data:', error);
        toast.error('Không thể tải dữ liệu flashcard');
        navigate('/flash-card');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [setId, navigate]);

  // Add new word
  const addWord = () => {
    const newWord = {
      id: Date.now(),
      english: '',
      vietnamese: '',
      pronunciation: '',
      example: ''
    };
    setWords([...words, newWord]);
  };

  // Remove word
  const removeWord = (id) => {
    if (words.length > 1) {
      setWords(words.filter(word => word.id !== id));
    } else {
      toast.info('Bộ flashcard phải có ít nhất một từ');
    }
  };

  // Update word
  const updateWord = (id, field, value) => {
    setWords(words.map(word => 
      word.id === id ? { ...word, [field]: value } : word
    ));
  };

  // Save word list
  const handleSave = async () => {
    if (!listTitle.trim()) {
      toast.error('Vui lòng nhập tên danh sách');
      return;
    }

    const validWords = words.filter(word => 
      word.english.trim() && word.vietnamese.trim()
    );

    if (validWords.length === 0) {
      toast.error('Vui lòng thêm ít nhất một từ vựng');
      return;
    }

    setIsLoading(true);
    
    try {
      await flashcardService.updateFlashcardSet(setId, {
        title: listTitle,
        description: listDescription,
        category: "Từ vựng",
        words: validWords
      });
      
      navigate('/flash-card');
    } catch (error) {
      console.error('Error updating word list:', error);
      toast.error('Có lỗi xảy ra khi cập nhật danh sách từ vựng');
    } finally {
      setIsLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/flash-card')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                Cập nhật danh sách từ vựng
              </h1>
            </div>

            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save size={16} />
              )}
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* List info */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Thông tin danh sách
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên danh sách *
              </label>
              <input
                type="text"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                placeholder="Ví dụ: Từ vựng du lịch"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mô tả (tùy chọn)
              </label>
              <textarea
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                placeholder="Mô tả ngắn về danh sách từ vựng này..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Words list */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Từ vựng ({words.length})
            </h2>
            <button
              onClick={addWord}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
            >
              <Plus size={16} />
              Thêm từ
            </button>
          </div>

          <div className="space-y-4">
            {words.map((word, index) => (
              <motion.div
                key={word.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Từ #{index + 1}
                  </span>
                  <button
                    onClick={() => removeWord(word.id)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-300"
                    disabled={words.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tiếng Anh *
                    </label>
                    <input
                      type="text"
                      value={word.english}
                      onChange={(e) => updateWord(word.id, 'english', e.target.value)}
                      placeholder="Hello"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tiếng Việt *
                    </label>
                    <input
                      type="text"
                      value={word.vietnamese}
                      onChange={(e) => updateWord(word.id, 'vietnamese', e.target.value)}
                      placeholder="Xin chào"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phát âm
                    </label>
                    <input
                      type="text"
                      value={word.pronunciation || ''}
                      onChange={(e) => updateWord(word.id, 'pronunciation', e.target.value)}
                      placeholder="/həˈləu/"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ví dụ
                    </label>
                    <input
                      type="text"
                      value={word.example || ''}
                      onChange={(e) => updateWord(word.id, 'example', e.target.value)}
                      placeholder="Hello, nice to meet you"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick add section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-4">
              Thêm nhanh từ mẫu
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { english: 'Hello', vietnamese: 'Xin chào' },
                { english: 'Thank you', vietnamese: 'Cảm ơn' },
                { english: 'Sorry', vietnamese: 'Xin lỗi' },
                { english: 'It\'s okay', vietnamese: 'Không sao' },
                { english: 'Yes', vietnamese: 'Vâng' },
                { english: 'No', vietnamese: 'Không' },
                { english: 'Delicious', vietnamese: 'Ngon' },
                { english: 'I love you', vietnamese: 'Tôi yêu bạn' }
              ].map((sample, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const newWord = {
                      id: Date.now() + index,
                      english: sample.english,
                      vietnamese: sample.vietnamese,
                      pronunciation: '',
                      example: ''
                    };
                    setWords([...words, newWord]);
                  }}
                  className="p-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  {sample.english}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditWordList;
