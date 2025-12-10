import React, { useState } from 'react';
import { Volume2, CheckCircle, XCircle, Eye, Flag, FlagOff, Image as ImageIcon } from 'lucide-react';

const ExamQuestion = ({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect, 
  isPreview = false, 
  isTest = false,
  isFlagged = false,
  onToggleFlag,
  showCorrectAnswer = false,
  correctAnswer = null
}) => {
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Parse options from string format
  const parseOptions = (optionString) => {
    if (!optionString) return [];
    
    try {
      // Nếu là JSON string
      if (optionString.startsWith('{') || optionString.startsWith('[')) {
        return JSON.parse(optionString);
      }
      
      // Nếu là format "A) option1 B) option2..."
      const matches = optionString.match(/([A-D])\)\s*([^A-D]*?)(?=\s*[A-D]\)|$)/g);
      if (matches) {
        const options = {};
        matches.forEach(match => {
          const [, letter, text] = match.match(/([A-D])\)\s*(.*)/);
          options[letter] = text.trim();
        });
        return options;
      }
      
      // Fallback: split by common delimiters
      const parts = optionString.split(/\s*[,;|]\s*/).filter(part => part.trim());
      const options = {};
      const letters = ['A', 'B', 'C', 'D'];
      parts.forEach((part, index) => {
        if (index < letters.length) {
          options[letters[index]] = part.trim();
        }
      });
      return options;
      
    } catch (error) {
      console.error('Error parsing options:', error);
      return {};
    }
  };

  const options = parseOptions(question.option);
  const optionKeys = Object.keys(options);

  const handleAudioPlay = () => {
    if (question.audioUrl) {
      const audio = new Audio(question.audioUrl);
      setAudioPlaying(true);
      audio.play();
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => setAudioPlaying(false);
    }
  };

  const getOptionClass = (optionKey) => {
    let baseClass = "w-full p-4 text-left border rounded-lg transition-colors ";
    
    if (showCorrectAnswer && correctAnswer === optionKey) {
      baseClass += "bg-green-100 border-green-300 text-green-800";
    } else if (selectedAnswer === optionKey) {
      if (showCorrectAnswer && correctAnswer !== optionKey) {
        baseClass += "bg-red-100 border-red-300 text-red-800";
      } else {
        baseClass += "bg-blue-100 border-blue-300 text-blue-800";
      }
    } else {
      baseClass += "bg-white border-gray-300 hover:bg-gray-50";
    }
    
    return baseClass;
  };

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Audio Button */}
          {question.audioUrl && (
            <button
              onClick={handleAudioPlay}
              disabled={audioPlaying}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                audioPlaying 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {audioPlaying ? 'Đang phát...' : 'Nghe'}
            </button>
          )}
          
          {/* Question Number */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500">
              Câu {questionNumber}
            </span>
            {showCorrectAnswer && (
              <div className="flex items-center space-x-1">
                {selectedAnswer === correctAnswer ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Flag Button */}
        {isTest && onToggleFlag && (
          <button
            onClick={onToggleFlag}
            className={`p-2 rounded-lg transition-colors ${
              isFlagged 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isFlagged ? <Flag className="h-4 w-4" /> : <FlagOff className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Question Image */}
      {question.imageUrl && (
        <div className="flex justify-center">
          <img 
            src={question.imageUrl} 
            alt="Question"
            className="max-w-full h-auto rounded-lg shadow-sm"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Question Text */}
      <div className="prose max-w-none">
        <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
          {question.questionText}
        </p>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {optionKeys.map((optionKey) => (
          <button
            key={optionKey}
            onClick={() => !isPreview && onAnswerSelect && onAnswerSelect(optionKey)}
            disabled={isPreview}
            className={getOptionClass(optionKey)}
          >
            <div className="flex items-start">
              <span className="font-medium text-gray-900 mr-3">
                {optionKey})
              </span>
              <span className="text-gray-900 flex-1 text-left">
                {options[optionKey]}
              </span>
              {selectedAnswer === optionKey && (
                <div className="ml-2">
                  {showCorrectAnswer && correctAnswer === optionKey ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : showCorrectAnswer && correctAnswer !== optionKey ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Show correct answer in preview mode */}
      {showCorrectAnswer && correctAnswer && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Đáp án đúng: {correctAnswer}) {options[correctAnswer]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamQuestion;