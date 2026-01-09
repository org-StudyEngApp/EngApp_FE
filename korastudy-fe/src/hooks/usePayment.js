import { useState, useCallback } from 'react';
import paymentService from '../api/paymentService';
import { toast } from 'react-toastify';

/**
 * Custom hook để xử lý payment và subscription
 * @returns {Object} Payment methods and states
 */
export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Tạo payment và redirect đến VNPay
   * @param {string} subscriptionType - 'PREMIUM_MONTHLY' hoặc 'PREMIUM_YEARLY'
   * @param {string} bankCode - Optional bank code
   */
  const createPayment = useCallback(async (subscriptionType, bankCode = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await paymentService.createPayment({
        subscriptionType,
        bankCode
      });
      
      // Redirect to VNPay payment URL
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Không nhận được URL thanh toán');
      }
      
      return data;
    } catch (err) {
      console.error('Create payment error:', err);
      const errorMessage = err.message || 'Không thể tạo thanh toán';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Lấy chi tiết giao dịch
   */
  const getTransaction = useCallback(async (transactionCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await paymentService.getTransaction(transactionCode);
      return data;
    } catch (err) {
      console.error('Get transaction error:', err);
      const errorMessage = err.message || 'Không thể lấy thông tin giao dịch';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Hủy subscription
   */
  const cancelSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await paymentService.cancelSubscription();
      toast.success('Đã hủy subscription thành công');
      return data;
    } catch (err) {
      console.error('Cancel subscription error:', err);
      const errorMessage = err.message || 'Không thể hủy subscription';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createPayment,
    getTransaction,
    cancelSubscription,
  };
};

export default usePayment;
