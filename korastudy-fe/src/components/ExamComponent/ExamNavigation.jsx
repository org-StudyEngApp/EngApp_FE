import React from 'react';
import { Flag, CheckCircle, Circle } from 'lucide-react';

const ExamNavigation = ({ 
  parts, 
  questions, 
  currentQuestion, 
  currentPart, 
  answers, 
  flaggedQuestions, 
  onQuestionSelect, 
  onPartSelect 
}) => {
  
  const getQuestionStatus = (questionId) => {
    if (answers[questionId] !== undefined) {
      return 'answered';
    }
    if (flaggedQuestions.has(questionId)) {
      return 'flagged';
    }
    if (questionId === currentQuestion) {
      return 'current';
    }
    return 'unanswered';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white';
      case 'flagged':
        return 'bg-yellow-500 text-white';
      case 'current':
        return 'bg-primary-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    }
  };

  const getPartProgress = (partId) => {
    const partQuestions = questions.filter(q => q.part === partId);
    const answeredCount = partQuestions.filter(q => answers[q.id] !== undefined).length;
    return { answered: answeredCount, total: partQuestions.length };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
      <h3 className="font-semibold text-lg mb-4">Question Navigation</h3>
      
      {/* Parts */}
      <div className="space-y-4">
        {parts.map(part => {
          const partQuestions = questions.filter(q => q.part === part.id);
          const progress = getPartProgress(part.id);
          
          return (
            <div key={part.id} className="border rounded-lg p-3">
              <div 
                className={`flex items-center justify-between cursor-pointer mb-3 ${
                  currentPart === part.id ? 'text-primary-600' : 'text-gray-700'
                }`}
                onClick={() => onPartSelect(part.id)}
              >
                <h4 className="font-medium text-sm">{part.title}</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {progress.answered}/{progress.total}
                </span>
              </div>
              
              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {partQuestions.map(question => {
                  const status = getQuestionStatus(question.id);
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => onQuestionSelect(question.id)}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors duration-200 relative ${getStatusColor(status)}`}
                      title={`Question ${question.id}`}
                    >
                      {question.id}
                      
                      {/* Flag indicator */}
                      {flaggedQuestions.has(question.id) && (
                        <Flag 
                          size={10} 
                          className="absolute -top-1 -right-1 text-yellow-600 fill-current" 
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="font-medium text-sm mb-3">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-500 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Not answered</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Total Questions:</span>
            <span className="font-medium">{questions.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Answered:</span>
            <span className="font-medium text-green-600">{Object.keys(answers).length}</span>
          </div>
          <div className="flex justify-between">
            <span>Flagged:</span>
            <span className="font-medium text-yellow-600">{flaggedQuestions.size}</span>
          </div>
          <div className="flex justify-between">
            <span>Remaining:</span>
            <span className="font-medium text-gray-600">
              {questions.length - Object.keys(answers).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamNavigation;
