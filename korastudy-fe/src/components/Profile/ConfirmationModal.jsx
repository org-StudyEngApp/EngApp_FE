import React from 'react';

const ConfirmationModal = ({ showConfirmModal, setShowConfirmModal, handleConfirmSave }) => {
  if (!showConfirmModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Xác nhận lưu thông tin
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Bạn có chắc chắn muốn cập nhật thông tin cá nhân?
        </p>
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-500 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirmSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;