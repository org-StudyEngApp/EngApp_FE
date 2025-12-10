import React from 'react';
import { User, Mail, Camera, Edit3, Save, X } from 'lucide-react';

const ProfileHeader = ({ 
  user, 
  isEditing, 
  editForm, 
  loading,
  error,
  success,
  handleInputChange,
  handleEditSubmit,
  setIsEditing,
  getInitials,
  getFullName 
}) => {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={getFullName(user.firstName, user.lastName)}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {getInitials(user.firstName, user.lastName)}
              </span>
            </div>
          )}
          <button className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors duration-200">
            <Camera size={16} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <X size={16} />
                    {error}
                  </div>
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Save size={16} />
                    {success}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập họ"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập tên"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập email"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={loading}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editForm.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary-500 hover:bg-primary-600'
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Lưu
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // setError('');
                    // setSuccess('');
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                >
                  <X size={16} />
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getFullName(user.firstName, user.lastName)}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-primary-500 transition-colors duration-200"
                >
                  <Edit3 size={18} />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email || 'Chưa có email'}</p>
            </>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">{user.stats?.totalTests || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bài thi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{user.stats?.averageScore || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Điểm TB</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{user.stats?.studyStreak || 0}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ngày liên tiếp</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{user.stats?.totalStudyHours || 0}h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Thời gian học</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;