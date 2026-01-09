import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Calendar, Clock, Zap, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import paymentService from '../../api/paymentService';
import { usePayment } from '../../hooks/usePayment';
import { usePremiumStatus } from '../../hooks/usePremiumFeatures';
import { toast } from 'react-toastify';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { cancelSubscription, loading: actionLoading } = usePayment();
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setApiError(false);
      const data = await paymentService.getSubscription();
      console.log('Subscription data:', data); // Debug log
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setApiError(true);
      // Không hiển thị toast nữa để tránh spam
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      setShowCancelConfirm(false);
      fetchSubscription(); // Refresh data
    } catch (error) {
      // Error already handled in hook
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSubscriptionType = (type) => {
    const types = {
      'PREMIUM_MONTHLY': 'Premium Tháng',
      'PREMIUM_YEARLY': 'Premium Năm'
    };
    return types[type] || type;
  };

  const getDaysRemainingColor = (days) => {
    if (days > 30) return 'text-green-600 dark:text-green-400';
    if (days > 7) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading || premiumLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin subscription...</p>
        </div>
      </div>
    );
  }

  // Nếu user có premium nhưng API không trả về subscription data
  // Hiển thị thông tin premium cơ bản
  if (isPremium && (!subscription || apiError)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-xl">
              <Crown className="w-10 h-10 text-white fill-current" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Tài khoản Premium
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400">
              Bạn đang sử dụng tài khoản Premium
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl mb-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Premium Active</h2>
                  <p className="text-yellow-100">Tài khoản của bạn đã được kích hoạt</p>
                </div>
                <Crown className="w-16 h-16 fill-current opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="text-green-600 dark:text-green-400" />
                Quyền lợi của bạn:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Dịch thuật: Không giới hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Bài test: Không giới hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Bài báo: Không giới hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Tải audio: Có</span>
                </div>
              </div>
            </div>

            {apiError && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                      Không thể tải chi tiết subscription
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Để xem chi tiết subscription, vui lòng thử lại sau hoặc liên hệ hỗ trợ.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => fetchSubscription()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
              >
                Tải lại thông tin
              </button>
              <button
                onClick={() => navigate('/premium/pricing')}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
              >
                Gia hạn Premium
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/premium/history')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-6 rounded-xl shadow-lg transition text-left"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Lịch sử giao dịch
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Xem tất cả giao dịch thanh toán của bạn
              </p>
            </button>

            <button
              onClick={() => navigate('/')}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-6 rounded-xl shadow-lg transition text-left"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Bắt đầu học
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Khám phá tất cả tính năng Premium
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No subscription or inactive - Sửa lại để check đúng field name
  if (!subscription || !subscription.active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Bạn chưa có Premium
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Nâng cấp để truy cập tất cả tính năng và tăng tốc việc học của bạn!
            </p>
            
            <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Dịch thuật không giới hạn</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Làm tất cả bài test</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Đọc mọi bài báo</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Tải audio miễn phí</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/premium/pricing')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Xem gói Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Has active subscription
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-xl">
            <Crown className="w-10 h-10 text-white fill-current" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Tài khoản Premium
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý subscription của bạn
          </p>
        </div>

        {/* Subscription Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Premium Badge Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {formatSubscriptionType(subscription.subscriptionType)}
                </h2>
                <p className="text-yellow-100">Đang hoạt động</p>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${getDaysRemainingColor(subscription.daysRemaining)}`}>
                  {subscription.daysRemaining}
                </div>
                <p className="text-yellow-100">ngày còn lại</p>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày bắt đầu</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(subscription.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ngày hết hạn</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Status */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="text-green-600 dark:text-green-400" />
                Quyền lợi của bạn:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Dịch thuật: Không giới hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Bài test: Không giới hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Bài báo: Không giới hạn</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Tải audio: Có</span>
                </div>
              </div>
            </div>

            {/* Auto Renew Status */}
            {subscription.autoRenew ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                      Tự động gia hạn
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Subscription sẽ tự động gia hạn khi hết hạn
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                      Không tự động gia hạn
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Tài khoản sẽ trở về Free sau {formatDate(subscription.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/premium/pricing')}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105"
              >
                Gia hạn ngay
              </button>

              {subscription.isActive && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition duration-200"
                >
                  Hủy subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/premium/history')}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-6 rounded-xl shadow-lg transition text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Lịch sử giao dịch
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Xem tất cả giao dịch thanh toán của bạn
            </p>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 p-6 rounded-xl shadow-lg transition text-left"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Bắt đầu học
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Khám phá tất cả tính năng Premium
            </p>
          </button>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Xác nhận hủy subscription
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bạn có chắc muốn hủy Premium? Bạn vẫn có thể sử dụng đến hết ngày {formatDate(subscription.endDate)}.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang hủy...
                    </span>
                  ) : (
                    'Xác nhận hủy'
                  )}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition"
                >
                  Giữ Premium
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
