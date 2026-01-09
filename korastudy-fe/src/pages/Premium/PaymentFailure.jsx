import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home, HelpCircle, AlertTriangle } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const transactionCode = searchParams.get('transaction');
  const errorMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-full mb-6 shadow-2xl">
            <XCircle className="w-14 h-14 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Thanh toán thất bại
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Rất tiếc, giao dịch của bạn không thành công
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          {transactionCode && (
            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mã giao dịch:</p>
              <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded">
                {transactionCode}
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Lý do:</h3>
                  <p className="text-red-800 dark:text-red-300">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Nguyên nhân có thể:
            </h3>
            
            <ul className="space-y-3 ml-7">
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 font-bold">•</span>
                <span>Thông tin thẻ không chính xác hoặc hết hạn</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 font-bold">•</span>
                <span>Tài khoản ngân hàng không đủ số dư</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 font-bold">•</span>
                <span>Ngân hàng từ chối giao dịch (kiểm tra hạn mức)</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 font-bold">•</span>
                <span>Phiên thanh toán đã hết hạn</span>
              </li>
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 font-bold">•</span>
                <span>Bạn đã hủy giao dịch</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Help Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            💡 Gợi ý giải quyết
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>• Kiểm tra lại số dư tài khoản ngân hàng</li>
            <li>• Đảm bảo thẻ của bạn đã được kích hoạt thanh toán online</li>
            <li>• Liên hệ ngân hàng nếu giao dịch bị chặn</li>
            <li>• Thử lại sau vài phút hoặc sử dụng phương thức thanh toán khác</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/premium/pricing')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            <RefreshCw size={18} />
            Thử lại thanh toán
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl transition duration-200"
          >
            <Home size={18} />
            Về trang chủ
          </button>
        </div>

        {/* Support Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Vẫn gặp vấn đề?
          </p>
          <a
            href="mailto:support@korastudy.com"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Liên hệ hỗ trợ: support@korastudy.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
