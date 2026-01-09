import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Languages, Loader2, AlertCircle, Crown, Sparkles } from 'lucide-react';

/**
 * TranslationSection Component
 * Display Vietnamese translation for articles with quota management
 * 
 * Features:
 * - Toggle show/hide translation
 * - Display stored translation (FREE)
 * - AI translation with quota tracking (1/day for free users)
 * - Upgrade prompt when quota exceeded
 */
const TranslationSection = ({
  article,
  translation,
  showTranslation,
  translationLoading,
  translationError,
  quotaInfo,
  onToggleTranslation,
  onRequestAITranslation,
}) => {
  const navigate = useNavigate();
  
  // Check if article has content
  if (!article?.htmlContent && !article?.content) {
    return null;
  }

  // Render upgrade modal when quota exceeded
  const renderQuotaExceededMessage = () => (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Crown className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            Đã hết lượt dịch hôm nay
            <span className="text-sm font-normal text-amber-600 dark:text-amber-400">
              ({quotaInfo?.usedTranslations || 1}/{quotaInfo?.dailyLimit || 1})
            </span>
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bạn đã sử dụng hết <strong>lượt dịch AI miễn phí</strong> trong ngày hôm nay. 
            Nâng cấp lên Premium để dịch không giới hạn!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/premium/pricing')}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              Nâng cấp Premium
            </button>
            <button
              onClick={onToggleTranslation}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            💡 <strong>Mẹo:</strong> Lượt dịch sẽ được làm mới vào <strong>00:00 ngày mai</strong>
          </p>
        </div>
      </div>
    </div>
  );

  // Render translation content
  const renderTranslationContent = () => {
    // Loading state
    if (translationLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">
            Đang dịch bài viết... Vui lòng đợi 3-5 giây
          </p>
        </div>
      );
    }

    // Error state - Quota exceeded (429)
    if (translationError?.status === 429 || translationError?.message?.includes('quota') || translationError?.message?.includes('limit')) {
      return renderQuotaExceededMessage();
    }

    // General error state
    if (translationError) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 font-medium">Lỗi khi dịch bài viết</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                {translationError.message || 'Vui lòng thử lại sau'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Has translation - Display it
    if (translation) {
      return (
        <div className="space-y-4">
          {/* Translation metadata */}
          {quotaInfo && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                {quotaInfo.translationType === 'stored' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {quotaInfo.quotaMessage || 'Bản dịch có sẵn (Miễn phí)'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      Dịch bằng AI • Còn lại: {quotaInfo.remainingAiTranslations || 0}/{quotaInfo.dailyLimit || 1} lượt
                    </span>
                  </>
                )}
              </div>
              {quotaInfo.translationType === 'ai' && quotaInfo.remainingAiTranslations === 0 && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Đã hết lượt
                </span>
              )}
            </div>
          )}

          {/* Translation content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50"
              dangerouslySetInnerHTML={{ __html: translation }}
            />
          </div>
        </div>
      );
    }

    // No translation available - Show AI translate button
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Bài viết này chưa có bản dịch tiếng Việt
        </p>
        <button
          onClick={onRequestAITranslation}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-5 h-5" />
          Dịch bằng AI (Gemini)
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            1 lượt/ngày
          </span>
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 Bản dịch sẽ được lưu lại để tất cả người dùng có thể xem miễn phí
        </p>
      </div>
    );
  };

  return (
    <div className="my-8">
      {/* Toggle Translation Button */}
      <button
        onClick={onToggleTranslation}
        className={`
          w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200
          ${showTranslation 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
            : 'bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Languages className={`w-6 h-6 ${showTranslation ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {showTranslation ? 'Ẩn bản dịch tiếng Việt' : 'Xem bản dịch tiếng Việt'}
            </h3>
            {!showTranslation && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Bản dịch có sẵn miễn phí hoặc dịch AI (1 lượt/ngày)
              </p>
            )}
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            showTranslation ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Translation Content (Collapsible) */}
      {showTranslation && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
          {renderTranslationContent()}
        </div>
      )}
    </div>
  );
};

export default TranslationSection;
