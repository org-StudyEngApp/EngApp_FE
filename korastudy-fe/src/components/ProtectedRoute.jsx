import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useUser();
  const location = useLocation();
  const toastShown = useRef(false);

  useEffect(() => {
    if (!loading && !isAuthenticated() && !toastShown.current) {
      toast.warn("Bạn cần đăng nhập để truy cập trang này.", {
        toastId: "auth-required", // Thêm ID để ngăn thông báo trùng lặp
      });
      toastShown.current = true; // Đánh dấu là đã hiển thị thông báo
    }
  }, [loading, isAuthenticated]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated()) {
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;