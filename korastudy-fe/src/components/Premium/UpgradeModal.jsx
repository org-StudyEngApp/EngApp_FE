import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Check, Crown } from 'lucide-react';

/**
 * Modal yêu cầu nâng cấp Premium
 * @param {boolean} isOpen - Trạng thái hiển thị modal
 * @param {Function} onClose - Callback khi đóng modal
 * @param {string} feature - Tên tính năng cần Premium
 * @param {string} message - Custom message (optional)
 * @param {string} contentType - Loại nội dung: 'exam' | 'article' | 'feature'
 */
const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  feature = 'tính năng này',
  message = '',
  contentType = 'feature'
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate('/premium/pricing');
  };

  // Custom message based on content type
  const getDefaultMessage = () => {
    if (message) return message;
    
    switch(contentType) {
      case 'exam':
        return 'Bài thi này chỉ dành cho tài khoản Premium. Nâng cấp để tiếp tục!';
      case 'article':
        return 'Bài báo này chỉ dành cho tài khoản Premium. Nâng cấp để đọc toàn bộ!';
      default:
        return `${feature} chỉ dành cho thành viên Premium. Nâng cấp ngay để trải nghiệm đầy đủ!`;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
        >
          <X size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Crown className="w-10 h-10 text-white fill-current" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Nâng cấp lên Premium
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          {getDefaultMessage()}
        </p>

        {/* Benefits */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-750 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Crown size={18} className="text-yellow-600" />
            Quyền lợi Premium:
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Truy cập <strong>KHÔNG GIỚI HẠN</strong> tất cả bài thi
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Truy cập <strong>KHÔNG GIỚI HẠN</strong> tất cả bài báo
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Dịch thuật không giới hạn</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Tải audio miễn phí</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Hỗ trợ ưu tiên từ giáo viên</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg transform hover:scale-105"
          >
            Xem gói Premium
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition duration-200"
          >
            Để sau
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UpgradeModal;
