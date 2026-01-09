import { useEffect, useState, useCallback } from 'react';
import paymentService from '../api/paymentService';

/**
 * Custom hook để kiểm tra quyền truy cập các tính năng Premium
 * @returns {Object} - { features, loading, error, refetch, isPremium }
 */
export const usePremiumFeatures = () => {
  const [features, setFeatures] = useState({
    canUseTranslation: false,
    canAccessTest: false,
    canReadArticle: false,
    canDownloadAudio: false,
  });
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkFeatures = useCallback(async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Check features
      const featuresData = await paymentService.checkFeatures();
      setFeatures(featuresData);
      
      // Check premium status
      const premiumData = await paymentService.checkPremium();
      setIsPremium(premiumData.isPremium);
      
    } catch (err) {
      console.error('Error checking features:', err);
      setError(err.message || 'Không thể kiểm tra quyền truy cập');
      // Reset states on error
      setFeatures({
        canUseTranslation: false,
        canAccessTest: false,
        canReadArticle: false,
        canDownloadAudio: false,
      });
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkFeatures();
  }, [checkFeatures]);

  return { 
    features, 
    isPremium,
    loading, 
    error,
    refetch: checkFeatures 
  };
};

/**
 * Custom hook đơn giản chỉ để check premium status
 * @returns {Object} - { isPremium, loading, error, refetch }
 */
export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkPremium = useCallback(async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await paymentService.checkPremium();
      console.log('Premium status from hook:', data); // Debug log
      
      // Kiểm tra response có đúng format không
      if (data && typeof data.isPremium === 'boolean') {
        setIsPremium(data.isPremium);
      } else {
        console.warn('Invalid premium status response:', data);
        setIsPremium(false);
      }
      
    } catch (err) {
      console.error('Error checking premium:', err);
      setError(err.message || 'Không thể kiểm tra trạng thái Premium');
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPremium();
  }, [checkPremium]);

  return { 
    isPremium, 
    loading, 
    error,
    refetch: checkPremium 
  };
};

export default usePremiumFeatures;
