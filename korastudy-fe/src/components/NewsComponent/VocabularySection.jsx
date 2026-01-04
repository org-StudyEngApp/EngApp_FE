import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, Search, Bookmark } from 'lucide-react';
import vocabularyService from '../../api/vocabularyService';
import VocabularyCard from './VocabularyCard';

/**
 * VocabularySection - Section hiển thị từ vựng theo cấp độ (giống Korean vocab UI)
 */
const VocabularySection = ({ articleId, onSaveToFlashcard }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vocabularyData, setVocabularyData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Level configuration
  const levelConfig = [
    {
      key: 'BEGINNER',
      label: 'BEGINNER',
      color: 'purple',
    },
    {
      key: 'INTERMEDIATE',
      label: 'INTERMEDIATE',
      color: 'blue',
    },
    {
      key: 'ADVANCED',
      label: 'ADVANCED',
      color: 'gray',
      
    },
  ];

  // Fetch vocabularies
  useEffect(() => {
    const fetchVocabularies = async () => {
      if (!articleId) {
        console.warn('⚠️ VocabularySection: No articleId provided');
        return;
      }

      console.log('🔍 VocabularySection: Fetching vocabularies for articleId:', articleId);
      setLoading(true);
      setError(null);

      try {
        const data = await vocabularyService.getArticleVocabularies(articleId);
        console.log('✅ VocabularySection: Vocabularies loaded:', data);
        setVocabularyData(data);
      } catch (err) {
        console.error('❌ VocabularySection: Failed to fetch vocabularies:', err);
        setError('Không thể tải từ vựng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularies();
  }, [articleId]);

  // Filter vocabularies by search term
  const filterVocabularies = (vocabs) => {
    if (!searchTerm.trim()) return vocabs;
    
    const search = searchTerm.toLowerCase();
    return vocabs.filter(
      (v) =>
        v.word.toLowerCase().includes(search) ||
        v.vietnamese.toLowerCase().includes(search) ||
        (v.definition && v.definition.toLowerCase().includes(search))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải từ vựng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!vocabularyData || !vocabularyData.vocabularies || vocabularyData.total === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
        <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400">
          Bài báo này chưa có từ vựng.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 space-y-6">
      {/* Search Bar */}
      <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Tìm kiếm từ vựng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Vocabulary Sections by Level */}
      {levelConfig.map((level) => {
        const vocabs = filterVocabularies(
          vocabularyData.vocabularies[level.key] || []
        );
        
        if (vocabs.length === 0) return null;

        const colorClasses = {
          purple: 'bg-purple-500 text-purple-500 bg-purple-50 dark:bg-purple-900/20',
          blue: 'bg-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/20',
          gray: 'bg-gray-500 text-gray-500 bg-gray-50 dark:bg-gray-800',
        };

        return (
          <div
            key={level.key}
            className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-2 rounded-full ${
                    colorClasses[level.color].split(' ')[0]
                  }`}
                ></div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {level.label}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (onSaveToFlashcard) {
                      vocabs.forEach((vocab) => {
                        onSaveToFlashcard({
                          word: vocab.word,
                          phonetic: vocab.phonetic || '',
                          meaning: vocab.vietnamese,
                          definition: vocab.definition || '',
                          example: vocab.exampleSentence || '',
                          exampleTranslate: vocab.exampleVietnamese || '',
                          level: vocab.level,
                        });
                      });
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <Bookmark size={16} />
                  Flashcard
                </button>
                <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Xem thêm
                </button>
              </div>
            </div>

            {/* Words Grid - 2 columns */}
            <div className="grid divide-y divide-gray-200 dark:divide-gray-700 md:grid-cols-2 md:divide-x md:divide-y-0">
              {vocabs.map((vocab, index) => (
                <div
                  key={vocab.id}
                  className={
                    Math.floor(index / 2) > 0
                      ? 'border-t border-gray-200 dark:border-gray-700'
                      : ''
                  }
                >
                  <VocabularyCard vocabulary={vocab} />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* No Results Message */}
      {searchTerm &&
        levelConfig.every(
          (level) =>
            filterVocabularies(
              vocabularyData.vocabularies[level.key] || []
            ).length === 0
        ) && (
          <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Không tìm thấy từ vựng phù hợp với "{searchTerm}"
            </p>
          </div>
        )}
    </div>
  );
};

export default VocabularySection;
