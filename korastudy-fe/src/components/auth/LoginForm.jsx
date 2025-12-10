import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, XCircle, CheckCircle, Loader } from 'lucide-react';

const LoginForm = ({
  formData,
  errors,
  touched,
  isLoading,
  apiError,
  showPassword,
  handleInputChange,
  handleBlur,
  handleSubmit,
  toggleShowPassword
}) => {
  return (
    <div className="w-full max-w-md bg-white dark:bg-dark-800 rounded-3xl p-6 lg:p-10 shadow-card my-4 lg:my-10">
      <h2 className="font-inter font-bold text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 mb-6 lg:mb-8 text-center">
        Đăng nhập
      </h2>
      
      {/* API Error Message */}
      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          <p className="text-sm flex items-center gap-2">
            <XCircle size={16} />
            {apiError}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="w-full" noValidate>
        {/* Username Field */}
        <div className="mb-4 lg:mb-5">
          <label htmlFor="username" className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
            Tên đăng nhập:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Nhập tên đăng nhập của bạn"
            className={`w-full h-12 lg:h-11 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 text-sm font-inter transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
              errors.username && touched.username
                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                : 'border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
            }`}
            disabled={isLoading}
            required
          />
          {errors.username && touched.username && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <XCircle size={12} />
              {errors.username}
            </p>
          )}
          {!errors.username && touched.username && formData.username && (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <CheckCircle size={12} />
              Tên đăng nhập hợp lệ
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4 lg:mb-5">
          <label htmlFor="password" className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
            Mật khẩu:
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Nhập mật khẩu của bạn"
              className={`w-full h-12 lg:h-11 bg-gray-50 dark:bg-dark-700 border-2 rounded-xl px-4 pr-12 text-sm font-inter transition-all duration-300 outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 ${
                errors.password && touched.password
                  ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
                  : 'border-gray-200 dark:border-dark-600 focus:border-primary-500 focus:bg-white dark:focus:bg-dark-600 focus:shadow-[0_0_0_3px_rgba(52,188,249,0.1)]'
              }`}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors duration-300"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <XCircle size={12} />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 my-4 lg:my-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 border-2 border-gray-300 dark:border-dark-600 rounded cursor-pointer accent-primary-500"
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="font-inter text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Ghi nhớ
            </label>
          </div>
          <Link to="/forgot-password" className="font-inter text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login Button with Loading State */}
        <button 
          type="submit" 
          className="w-full h-12 lg:h-12 bg-gradient-to-r from-primary-500 via-secondary-400 to-secondary-500 border-0 rounded-xl text-white font-inter font-semibold text-base cursor-pointer transition-all duration-300 mb-4 lg:mb-5 shadow-[0_4px_12px_rgba(52,188,249,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(52,188,249,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center gap-2"
          disabled={Object.values(errors).some(error => error !== '') || isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Đang xử lý...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>

        {/* Register Link */}
        <div className="text-center my-4 lg:my-5">
          <span className="font-inter text-sm text-gray-500 dark:text-gray-400">Bạn chưa có tài khoản? </span>
          <Link to="/dang-ky" className="font-inter font-semibold text-sm text-primary-500 hover:text-blue-600 hover:underline transition-colors duration-300">
            Đăng ký ngay
          </Link>
        </div>

        {/* Google Login */}
        <button 
          type="button" 
          className="w-full h-12 bg-white dark:bg-dark-700 border-2 border-gray-200 dark:border-dark-600 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 my-4 lg:my-5 hover:border-gray-300 dark:hover:border-dark-500 hover:bg-gray-50 dark:hover:bg-dark-600"
          disabled={isLoading}
        >
          <img src="/img_social/ic_google.png" alt="Google" className="w-5 h-5" />
          <span className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300">Google</span>
        </button>
      </form>

      {/* Terms and Privacy */}
      <div className="text-center mt-6 lg:mt-8 pt-4 lg:pt-5 border-t border-gray-200 dark:border-dark-600">
        <Link to="/terms" className="font-inter text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:underline transition-colors duration-300">
          Điều khoản dịch vụ
        </Link>
        <span className="font-inter text-xs text-gray-500 dark:text-gray-400 mx-1"> & </span>
        <Link to="/privacy" className="font-inter text-xs text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:underline transition-colors duration-300">
          Chính sách bảo mật
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;