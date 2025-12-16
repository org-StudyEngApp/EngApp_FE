import React, { useRef, useState } from 'react';
import { User, Mail, Camera, Edit3, Save, X, Upload, Image as ImageIcon } from 'lucide-react';
import { getAvatarUrl } from '../../utils/avatarUtils';

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
  getFullName,
  handleAvatarUpload,
  avatarLoading 
}) => {
  const fileInputRef = useRef(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  const handleCameraClick = () => {
    setShowAvatarModal(true);
  };

  const handleImageError = () => {
    setAvatarError(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadConfirm = async () => {
    if (selectedFile && handleAvatarUpload) {
      await handleAvatarUpload(selectedFile);
      setShowAvatarModal(false);
      setPreviewImage(null);
      setSelectedFile(null);
      setAvatarError(false); // Reset error state after successful upload
    }
  };

  const handleModalClose = () => {
    setShowAvatarModal(false);
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {getAvatarUrl(user) && !avatarError ? (
              <img
                src={getAvatarUrl(user)}
                alt={getFullName(user.firstName, user.lastName)}
                className="w-24 h-24 rounded-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
            )}
            <button 
              onClick={handleCameraClick}
              disabled={avatarLoading}
              className={`absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors duration-200 ${
                avatarLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Cập nhật ảnh đại diện"
            >
              {avatarLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Camera size={16} />
              )}
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cập nhật ảnh đại diện
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preview */}
              <div className="flex justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 dark:border-dark-600"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center border-4 border-gray-200 dark:border-dark-600">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Input */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors duration-200"
                >
                  <Upload size={20} className="text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedFile ? selectedFile.name : 'Chọn ảnh từ thiết bị'}
                  </span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  JPG, PNG, GIF hoặc WEBP. Tối đa 5MB
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleModalClose}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUploadConfirm}
                  disabled={!selectedFile || avatarLoading}
                  className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                    !selectedFile || avatarLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600'
                  }`}
                >
                  {avatarLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang tải lên...
                    </div>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
