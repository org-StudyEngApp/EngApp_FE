import React, { useState } from 'react';
import { Crown, Check, Zap, Shield, Star, ArrowRight, Loader2 } from 'lucide-react';
import { usePayment } from '../../hooks/usePayment';
import { toast } from 'react-toastify';

const SUBSCRIPTION_PLANS = [
  {
    type: 'PREMIUM_MONTHLY',
    name: 'Premium Monthly',
    displayName: 'Gói Tháng',
    price: 99000,
    originalPrice: null,
    duration: '1 tháng',
    badge: null,
    popular: false,
    features: [
      'Dịch thuật không giới hạn',
      'Làm tất cả bài test',
      'Đọc mọi bài báo',
      'Tải audio miễn phí',
      'Xem lịch sử chi tiết',
      'Hỗ trợ qua email'
    ],
    savings: null
  },
  {
    type: 'PREMIUM_YEARLY',
    name: 'Premium Yearly',
    displayName: 'Gói Năm',
    price: 990000,
    originalPrice: 1188000,
    duration: '12 tháng',
    badge: 'Tiết kiệm nhất',
    popular: true,
    features: [
      'Tất cả tính năng Gói Tháng',
      'Tiết kiệm 17% (~82,500đ/tháng)',
      'Ưu tiên hỗ trợ',
      'Cập nhật tính năng mới trước',
      'Tặng 1 tháng miễn phí',
    ],
    savings: '198,000đ'
  },
];

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('PREMIUM_YEARLY');
  const { createPayment, loading } = usePayment();

  const handleBuyPremium = async (subscriptionType) => {
    try {
      await createPayment(subscriptionType);
      // User will be redirected to VNPay
    } catch (error) {
      // Error already handled in usePayment hook
      console.error('Payment creation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-xl">
            <Crown className="w-10 h-10 text-white fill-current" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Nâng cấp tài khoản <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Premium</span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mở khóa toàn bộ tính năng và tăng tốc việc học tiếng Hàn của bạn
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.type}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                plan.popular ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
                  {plan.badge}
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.displayName}
                </h3>
                
                {/* Duration */}
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {plan.duration}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className="text-gray-400 dark:text-gray-500 line-through text-lg mb-1">
                      {plan.originalPrice.toLocaleString('vi-VN')} ₫
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xl text-gray-500 dark:text-gray-400">₫</span>
                  </div>
                  {plan.savings && (
                    <div className="mt-2 inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
                      <Zap size={14} />
                      Tiết kiệm {plan.savings}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleBuyPremium(plan.type)}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
                      : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      Mua ngay
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Highlight */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Tại sao chọn Premium?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Học không giới hạn
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Truy cập tất cả tài liệu, bài test và tính năng mà không bị giới hạn
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Hỗ trợ ưu tiên
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nhận được sự hỗ trợ nhanh chóng từ đội ngũ của chúng tôi
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tính năng mới
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Trải nghiệm các tính năng mới nhất trước người dùng khác
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Note */}
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            💳 Thanh toán an toàn qua VNPay
          </p>
          <p className="text-sm">
            Bạn có thể hủy bất cứ lúc nào. Chính sách hoàn tiền trong 7 ngày đầu tiên.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
