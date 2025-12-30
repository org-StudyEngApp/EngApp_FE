import React, { useState, useEffect } from 'react';
import { X, Plus, BookOpen, Loader2, Search } from 'lucide-react';
import flashcardService from '../../api/flashcardService';

/**
 * SaveWordModal - Modal để chọn flashcard set để lưu từ vựng
 * @param {boolean} isOpen - Trạng thái mở/đóng modal
 * @param {function} onClose - Hàm đóng modal
 * @param {object} wordData - Dữ liệu từ vựng cần lưu { word, meaning, example }
 * @param {function} onSaveSuccess - Callback khi lưu thành công
 */
const SaveWordModal = ({ isOpen, onClose, wordData, onSaveSuccess }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newSetTitle, setNewSetTitle] = useState('');

  // Fetch user's flashcard sets
  useEffect(() => {
    if (isOpen) {
      fetchFlashcardSets();
    }
  }, [isOpen]);

  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const sets = await flashcardService.getUserSets();
      setFlashcardSets(sets || []);
    } catch (error) {
      console.error('Failed to fetch flashcard sets:', error);
      setFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc flashcard sets theo search query
  const filteredSets = flashcardSets.filter(set =>
    set.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Thêm từ vào flashcard set đã chọn
  const handleAddToExistingSet = async (setId) => {
    setSaving(true);
    try {
      await flashcardService.addWordToFlashcard(setId, wordData);
      onSaveSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to add word to flashcard:', error);
    } finally {
      setSaving(false);
    }
  };

  // Tạo flashcard set mới và thêm từ
  const handleCreateNewSet = async () => {
    if (!newSetTitle.trim()) return;

    setSaving(true);
    try {
      await flashcardService.createFlashcardWithWord(newSetTitle, wordData);
      onSaveSuccess?.();
      onClose();
      setNewSetTitle('');
      setShowCreateNew(false);
    } catch (error) {
      console.error('Failed to create new flashcard set:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Save to Flashcard</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
          {/* Word Info */}
          <div className="mb-6 rounded-lg bg-sky-50 p-4 dark:bg-gray-700">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg font-bold text-sky-700 dark:text-sky-300">
                {wordData?.word}
              </span>
            </div>
            {wordData?.meaning && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {wordData.meaning}
              </p>
            )}
          </div>

          {/* Search Bar */}
          {!showCreateNew && (
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your flashcard sets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
          )}

          {/* Create New Set Form */}
          {showCreateNew ? (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Flashcard Set Name
                </label>
                <input
                  type="text"
                  placeholder="E.g., News Vocabulary 2024"
                  value={newSetTitle}
                  onChange={(e) => setNewSetTitle(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateNewSet}
                  disabled={!newSetTitle.trim() || saving}
                  className="flex-1 rounded-lg bg-sky-500 py-2 text-white transition-colors hover:bg-sky-600 disabled:opacity-50"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create & Save'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowCreateNew(false);
                    setNewSetTitle('');
                  }}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Create New Button */}
              <button
                onClick={() => setShowCreateNew(true)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-sky-300 bg-sky-50 py-3 text-sky-600 transition-colors hover:border-sky-400 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-400 dark:hover:border-sky-600"
              >
                <Plus size={20} />
                <span className="font-medium">Create New Flashcard Set</span>
              </button>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                </div>
              )}

              {/* Flashcard Sets List */}
              {!loading && filteredSets.length === 0 && (
                <div className="py-8 text-center">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? 'No flashcard sets found'
                      : 'You have no flashcard sets yet'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                    Create a new set to start saving words
                  </p>
                </div>
              )}

              {!loading && filteredSets.length > 0 && (
                <div className="space-y-2">
                  <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select a flashcard set:
                  </p>
                  {filteredSets.map((set) => (
                    <button
                      key={set.id}
                      onClick={() => handleAddToExistingSet(set.id)}
                      disabled={saving}
                      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-sky-300 hover:bg-sky-50 hover:shadow-md disabled:opacity-50 dark:border-gray-700 dark:bg-gray-700 dark:hover:border-sky-600 dark:hover:bg-gray-600"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {set.title}
                      </h3>
                      {set.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {set.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <span>{set.cardCount || 0} words</span>
                        {set.category && (
                          <>
                            <span>•</span>
                            <span>{set.category}</span>
                          </>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveWordModal;
