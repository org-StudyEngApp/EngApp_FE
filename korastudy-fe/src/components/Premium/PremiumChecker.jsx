import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import paymentService from '../../api/paymentService';

/**
 * Component kiểm tra quyền truy cập Premium
 * Nếu user không phải Premium, hiển thị overlay yêu cầu nâng cấp
 * 
 * @param {React.ReactNode} children - Nội dung cần bảo vệ
 * @param {string} feature - Tên tính năng (để hiển thị)
 * @param {boolean} requirePremium - Có bắt buộc premium không (default: true)
 */
const PremiumChecker = ({ children, feature = 'tính năng này', requirePremium = true }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!requirePremium) {
      setLoading(false);
      return;
    }

    checkPremium();
  }, [requirePremium]);

  const checkPremium = async () => {
    try {
      const data = await paymentService.checkPremium();
      setIsPremium(data.isPremium);
    } catch (error) {
      console.error('Error checking premium:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  if (!requirePremium) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="relative min-h-[400px]">
        {/* Blurred content */}
        <div className="filter blur-sm pointer-events-none opacity-50">
          {children}
        </div>
        
        {/* Premium required overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-yellow-400">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Tính năng Premium
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Nâng cấp tài khoản Premium để sử dụng <span className="font-semibold text-yellow-600">{feature}</span>
            </p>
            
            <div className="space-y-3 mb-6 text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Dịch thuật không giới hạn</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Làm bài test không giới hạn</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Đọc tất cả bài báo</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span>
                <span className="text-gray-700 dark:text-gray-300">Tải audio miễn phí</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/premium/pricing')}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg"
              >
                Nâng cấp ngay
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition duration-200"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default PremiumChecker;
