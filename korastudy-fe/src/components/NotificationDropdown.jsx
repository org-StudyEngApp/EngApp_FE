import React, { useState, useEffect } from 'react';
import { CheckCheck, X, Bell, Award, Users, AlertCircle } from 'lucide-react';
import notificationService from '../api/notificationService';

const NotificationTab = ({ label, count, isActive, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 flex items-center gap-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium'
        : 'hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300'
    }`}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span className="ml-auto bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </button>
);

const NOTIFICATION_TYPES = {
  ALL: 'all',
  SYSTEM: 'SYSTEM',
  EXAM_RESULT: 'EXAM_RESULT',
  FORUM_INTERACTION: 'FORUM_INTERACTION'
};

const NotificationDropdown = ({ isOpen, onClose, onMarkAsRead, onMarkAllAsRead }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(NOTIFICATION_TYPES.ALL);
  const [unreadCounts, setUnreadCounts] = useState({
    [NOTIFICATION_TYPES.ALL]: 0,
    [NOTIFICATION_TYPES.SYSTEM]: 0,
    [NOTIFICATION_TYPES.EXAM_RESULT]: 0,
    [NOTIFICATION_TYPES.FORUM_INTERACTION]: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      fetchUnreadCounts();
    }
  }, [isOpen, activeTab]);

  const fetchUnreadCounts = async () => {
    try {
      const allCount = await notificationService.getUnreadCount();
      const systemCount = await notificationService.getUnreadCountByType('SYSTEM');
      const examCount = await notificationService.getUnreadCountByType('EXAM_RESULT');
      const forumCount = await notificationService.getUnreadCountByType('FORUM_INTERACTION');
      
      setUnreadCounts({
        [NOTIFICATION_TYPES.ALL]: allCount,
        [NOTIFICATION_TYPES.SYSTEM]: systemCount,
        [NOTIFICATION_TYPES.EXAM_RESULT]: examCount,
        [NOTIFICATION_TYPES.FORUM_INTERACTION]: forumCount
      });
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === NOTIFICATION_TYPES.ALL) {
        data = await notificationService.getMyNotifications();
      } else {
        data = await notificationService.getMyNotificationsByType(activeTab);
      }
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      fetchUnreadCounts(); // Cập nhật số lượng chưa đọc
      onMarkAsRead?.();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      // Cập nhật lại tất cả số đếm về 0
      setUnreadCounts({
        [NOTIFICATION_TYPES.ALL]: 0,
        [NOTIFICATION_TYPES.SYSTEM]: 0,
        [NOTIFICATION_TYPES.EXAM_RESULT]: 0,
        [NOTIFICATION_TYPES.FORUM_INTERACTION]: 0
      });
      onMarkAllAsRead?.();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SYSTEM':
        return <Bell size={14} className="text-blue-500" />;
      case 'EXAM_RESULT':
        return <Award size={14} className="text-green-500" />;
      case 'FORUM_INTERACTION':
        return <Users size={14} className="text-purple-500" />;
      case 'PROFILE':
        return <AlertCircle size={14} className="text-yellow-500" />;
      default:
        return <Bell size={14} className="text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-dark-700 z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-dark-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Thông báo</h3>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="p-1 text-gray-500 hover:text-primary-500 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
            title="Đánh dấu tất cả là đã đọc"
          >
            <CheckCheck size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 dark:border-dark-700 overflow-x-auto">
        <NotificationTab
          label="Tất cả"
          count={unreadCounts[NOTIFICATION_TYPES.ALL]}
          isActive={activeTab === NOTIFICATION_TYPES.ALL}
          icon={<Bell size={16} />}
          onClick={() => setActiveTab(NOTIFICATION_TYPES.ALL)}
        />
        <NotificationTab
          label="Hệ thống"
          count={unreadCounts[NOTIFICATION_TYPES.SYSTEM]}
          isActive={activeTab === NOTIFICATION_TYPES.SYSTEM}
          icon={<Bell size={16} />}
          onClick={() => setActiveTab(NOTIFICATION_TYPES.SYSTEM)}
        />
        <NotificationTab
          label="Bài thi"
          count={unreadCounts[NOTIFICATION_TYPES.EXAM_RESULT]}
          isActive={activeTab === NOTIFICATION_TYPES.EXAM_RESULT}
          icon={<Award size={16} />}
          onClick={() => setActiveTab(NOTIFICATION_TYPES.EXAM_RESULT)}
        />
        <NotificationTab
          label="Cộng đồng"
          count={unreadCounts[NOTIFICATION_TYPES.FORUM_INTERACTION]}
          isActive={activeTab === NOTIFICATION_TYPES.FORUM_INTERACTION}
          icon={<Users size={16} />}
          onClick={() => setActiveTab(NOTIFICATION_TYPES.FORUM_INTERACTION)}
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-4 text-center text-gray-500 dark:text-gray-400">
            Không có thông báo nào
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                notification.read ? 'opacity-70' : 'bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
                  {getTypeIcon(notification.type)}
                  {notification.title}
                </h4>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-1 text-xs text-primary-500 hover:text-primary-600"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                {notification.content}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {formatDate(notification.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;