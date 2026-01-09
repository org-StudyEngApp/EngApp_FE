import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, ChevronLeft, ChevronRight, Loader2, FileText, Crown } from 'lucide-react';
import paymentService from '../../api/paymentService';

const TransactionHistory = () => {
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const fetchTransactions = async (pageNum) => {
    try {
      setLoading(true);
      const data = await paymentService.getTransactionHistory(pageNum, pageSize);
      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      SUCCESS: { 
        text: 'Thành công', 
        className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', 
        icon: '✅' 
      },
      PENDING: { 
        text: 'Đang xử lý', 
        className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', 
        icon: '⏳' 
      },
      FAILED: { 
        text: 'Thất bại', 
        className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', 
        icon: '❌' 
      },
      CANCELLED: { 
        text: 'Đã hủy', 
        className: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400', 
        icon: '🚫' 
      },
      REFUNDED: { 
        text: 'Đã hoàn tiền', 
        className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', 
        icon: '↩️' 
      },
    };
    return badges[status] || badges.PENDING;
  };

  const formatSubscriptionType = (type) => {
    const types = {
      'PREMIUM_MONTHLY': 'Premium Tháng',
      'PREMIUM_YEARLY': 'Premium Năm'
    };
    return types[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && page === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải lịch sử giao dịch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Lịch sử giao dịch
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Quản lý và theo dõi các giao dịch của bạn
              </p>
            </div>
          </div>
          
          {totalElements > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tổng số: <span className="font-semibold">{totalElements}</span> giao dịch
            </p>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
              <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Chưa có giao dịch nào
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Bạn chưa thực hiện giao dịch nào. Nâng cấp Premium để bắt đầu!
            </p>
            
            <button
              onClick={() => navigate('/premium/pricing')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Mua Premium ngay
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Mã GD
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Gói
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Số tiền
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Thời gian
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((transaction) => {
                      const statusBadge = getStatusBadge(transaction.paymentStatus);
                      return (
                        <tr 
                          key={transaction.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm text-gray-900 dark:text-gray-300">
                              {transaction.transactionCode?.substring(0, 8)}...
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Crown size={16} className="text-yellow-500" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatSubscriptionType(transaction.subscriptionType)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {transaction.amount?.toLocaleString('vi-VN')} ₫
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}>
                              <span>{statusBadge.icon}</span>
                              {statusBadge.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(transaction.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {transactions.map((transaction) => {
                const statusBadge = getStatusBadge(transaction.paymentStatus);
                return (
                  <div 
                    key={transaction.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Crown size={18} className="text-yellow-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatSubscriptionType(transaction.subscriptionType)}
                        </span>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}>
                        <span>{statusBadge.icon}</span>
                        {statusBadge.text}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Mã GD:</span>
                        <span className="font-mono text-gray-900 dark:text-white">
                          {transaction.transactionCode?.substring(0, 12)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Số tiền:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {transaction.amount?.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatDate(transaction.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0 || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                  <span className="hidden sm:inline">Trang trước</span>
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Trang <span className="font-semibold text-gray-900 dark:text-white">{page + 1}</span> / {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1 || loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Trang sau</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Back to Subscription Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/premium/subscription')}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            ← Quay lại quản lý subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
