import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import vocabularyService from '../../api/vocabularyService';

/**
 * VocabularyCard - Compact card hiển thị một từ vựng (giống Korean vocab UI)
 */
const VocabularyCard = ({ vocabulary }) => {
  const [playingAudio, setPlayingAudio] = useState(false);

  const handlePlayAudio = async () => {
    if (playingAudio) return;
    
    setPlayingAudio(true);
    try {
      await vocabularyService.playPronunciation(vocabulary.word);
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setTimeout(() => setPlayingAudio(false), 1000);
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
      {/* Audio Button */}
      <button
        onClick={handlePlayAudio}
        disabled={playingAudio}
        className="flex-shrink-0 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 mt-0.5"
        title="Phát âm"
      >
        <Volume2 
          size={16} 
          className={`text-gray-500 dark:text-gray-400 ${playingAudio ? 'animate-pulse' : ''}`} 
        />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Word */}
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
          {vocabulary.word}
        </h4>
        
        {/* Phonetic */}
        {vocabulary.phonetic && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {vocabulary.phonetic}
          </p>
        )}

        {/* Vietnamese Meaning */}
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {vocabulary.vietnamese}
        </p>
      </div>
    </div>
  );
};

export default VocabularyCard;
