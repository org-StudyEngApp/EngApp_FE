import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, BookOpen, Loader2, AlertCircle, Save, Move } from 'lucide-react';

/**
 * DictionaryModal - Modal hiển thị thông tin từ điển đầy đủ (Draggable)
 * @param {boolean} isOpen - Trạng thái mở/đóng modal
 * @param {function} onClose - Hàm đóng modal
 * @param {object} dictionaryData - Dữ liệu từ điển từ API
 * @param {boolean} loading - Trạng thái đang tải
 * @param {string} error - Thông báo lỗi
 * @param {function} onPlayAudio - Hàm phát âm thanh
 * @param {function} onSaveWord - Hàm lưu từ vào flashcard
 * @param {boolean} isAuthenticated - Trạng thái đăng nhập
 */
const DictionaryModal = ({
  isOpen,
  onClose,
  dictionaryData,
  loading,
  error,
  onPlayAudio,
  onSaveWord,
  isAuthenticated,
}) => {
  const [playingAudio, setPlayingAudio] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  // Center modal on first open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      const centerX = (window.innerWidth - modalWidth) / 2;
      const centerY = (window.innerHeight - modalHeight) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [isOpen]);

  // Handle mouse down on header to start dragging
  const handleMouseDown = (e) => {
    // Không drag nếu click vào nút close
    if (e.target.closest('button')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Giới hạn không cho kéo ra ngoài viewport
      const modalWidth = modalRef.current?.offsetWidth || 0;
      const modalHeight = modalRef.current?.offsetHeight || 0;
      
      const boundedX = Math.max(0, Math.min(newX, window.innerWidth - modalWidth));
      const boundedY = Math.max(0, Math.min(newY, window.innerHeight - modalHeight));
      
      setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, position]);

  if (!isOpen) return null;

  const handlePlayAudio = async () => {
    if (!dictionaryData?.audio || playingAudio) return;
    
    setPlayingAudio(true);
    try {
      await onPlayAudio(dictionaryData.audio);
    } catch (err) {
      console.error('Failed to play audio:', err);
    } finally {
      // Reset after a delay to allow the audio to play
      setTimeout(() => setPlayingAudio(false), 1000);
    }
  };

  const handleSaveWord = () => {
    if (!isAuthenticated || !dictionaryData) return;
    onSaveWord({
      word: dictionaryData.word,
      meaning: dictionaryData.meaning || '',
      example: dictionaryData.exampleEn || '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        ref={modalRef}
        className={`absolute w-full max-w-lg pointer-events-auto transition-shadow ${
          isDragging ? 'shadow-2xl scale-[1.02]' : 'shadow-xl'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          maxHeight: '85vh',
          transition: isDragging ? 'none' : 'box-shadow 0.2s, transform 0.2s',
        }}
      >
        <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 border-2 border-blue-500/20 dark:border-blue-400/20">
          {/* Header - Draggable */}
          <div 
            className={`flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 dark:border-gray-700 select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Dictionary</h2>
              <Move className="h-4 w-4 text-white/60 animate-pulse" title="Kéo để di chuyển" />
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(85vh-140px)] overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
              <p className="text-gray-600 dark:text-gray-400">Looking up word...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-300">
                    Lookup Failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dictionary Data */}
          {!loading && !error && dictionaryData && (
            <div className="space-y-6">
              {/* Word & Phonetic */}
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {dictionaryData.word}
                  </h3>
                  {dictionaryData.audio && (
                    <button
                      onClick={handlePlayAudio}
                      disabled={playingAudio}
                      className="rounded-full bg-blue-100 p-2 text-blue-600 transition-colors hover:bg-blue-200 disabled:opacity-50 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                      title="Play pronunciation"
                    >
                      <Volume2 size={20} className={playingAudio ? 'animate-pulse' : ''} />
                    </button>
                  )}
                </div>

                {dictionaryData.phonetic && (
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {dictionaryData.phonetic}
                  </p>
                )}

                {dictionaryData.partOfSpeech && (
                  <span className="mt-2 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {dictionaryData.partOfSpeech}
                  </span>
                )}
              </div>

              {/* Vietnamese Meaning */}
              {dictionaryData.meaning && (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    Nghĩa tiếng Việt
                  </h4>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {dictionaryData.meaning}
                  </p>
                </div>
              )}

              {/* Example Sentences */}
              {(dictionaryData.exampleEn || dictionaryData.exampleVi) && (
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    Ví dụ
                  </h4>
                  <div className="space-y-3">
                    {dictionaryData.exampleEn && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">English:</p>
                        <p className="italic text-gray-900 dark:text-white">
                          "{dictionaryData.exampleEn}"
                        </p>
                      </div>
                    )}
                    {dictionaryData.exampleVi && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tiếng Việt:
                        </p>
                        <p className="italic text-gray-900 dark:text-white">
                          "{dictionaryData.exampleVi}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Warning Message */}
              {dictionaryData.warning && (
                <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {dictionaryData.warning}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Action Buttons */}
        {!loading && !error && dictionaryData && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900/50">
            <div className="flex gap-3">
              {isAuthenticated && (
                <button
                  onClick={handleSaveWord}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 py-2.5 text-white transition-colors hover:bg-green-600"
                >
                  <Save size={18} />
                  Save to Flashcard
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;
