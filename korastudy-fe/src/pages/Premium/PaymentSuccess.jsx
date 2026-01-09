import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, Crown, Receipt } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getTransaction } = usePayment();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transactionCode = searchParams.get('transaction');
    
    if (transactionCode) {
      fetchTransactionDetail(transactionCode);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchTransactionDetail = async (code) => {
    try {
      setLoading(true);
      const data = await getTransaction(code);
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSubscriptionType = (type) => {
    const types = {
      'PREMIUM_MONTHLY': 'Premium Tháng',
      'PREMIUM_YEARLY': 'Premium Năm'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin giao dịch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Thanh toán thành công! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Chào mừng bạn trở thành thành viên Premium
          </p>
        </div>

        {/* Transaction Details Card */}
        {transaction && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <Receipt className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Chi tiết giao dịch
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Mã giao dịch</span>
                <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {transaction.transactionCode}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Gói đã mua</span>
                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Crown size={18} className="text-yellow-500" />
                  {formatSubscriptionType(transaction.subscriptionType)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Số tiền</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {transaction.amount?.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Phương thức</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {transaction.paymentMethod || 'VNPay'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 dark:text-gray-400">Thời gian</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Premium Benefits */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-750 rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Crown className="text-yellow-500" />
            Tài khoản Premium đã được kích hoạt!
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Bạn có thể sử dụng tất cả tính năng Premium ngay bây giờ:
          </p>
          
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle size={18} className="text-green-500" />
              Dịch thuật không giới hạn
            </li>
            <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle size={18} className="text-green-500" />
              Làm tất cả bài test
            </li>
            <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle size={18} className="text-green-500" />
              Đọc mọi bài báo
            </li>
            <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <CheckCircle size={18} className="text-green-500" />
              Tải audio miễn phí
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/premium/subscription')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105"
          >
            Xem thông tin Premium
            <ArrowRight size={18} />
          </button>
          
          <button
            onClick={() => navigate('/premium/history')}
            className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow border border-gray-200 dark:border-gray-700"
          >
            Xem lịch sử giao dịch
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl transition duration-200"
          >
            Về trang chủ
          </button>
        </div>

        {/* Email Confirmation Note */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>📧 Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
