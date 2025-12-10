import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, Settings, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import notificationService from '../api/notificationService';
import websocketService from '../api/websocketService';
import NotificationDropdown from './NotificationDropdown';
import { toast } from 'react-toastify';

const NavBar = () => {
  // Các state hiện có
  const [showTopikDropdown, setShowTopikDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  // Các hàm xử lý hiện có
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

const handleLogout = async () => {
  try {
    // Ngắt kết nối WebSocket trước khi logout
    websocketService.disconnect();
    
    await logout();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    
    // Reset unreadCount khi logout
    setUnreadCount(0);
    
    // Navigate to home after logout
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Đã xảy ra lỗi khi đăng xuất');
  }
};

  // Các hàm xử lý khác giữ nguyên
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.fullName || user?.username || user?.name || 'User';
  };

// Kết nối WebSocket khi component được mount và người dùng đã đăng nhập
useEffect(() => {
  let mounted = true;
  
  const connectWebSocket = async () => {
    if (isAuthenticated()) {
      try {
        console.log('Đang kết nối WebSocket trong NavBar...');
        await websocketService.connect();
        
        if (mounted) {
          console.log('WebSocket kết nối thành công trong NavBar');
          
          // Thiết lập callback cho thông báo mới
          websocketService.setNotificationCallback((notification) => {
            if (!mounted) return;
            
            console.log('Nhận thông báo mới trong NavBar:', notification);
            
            // Cập nhật số lượng thông báo chưa đọc - Thêm tham số function để đảm bảo update đúng
            setUnreadCount(prevCount => {
              console.log('Cập nhật số thông báo từ', prevCount, 'thành', prevCount + 1);
              return prevCount + 1;
            });
            
            // Hiển thị toast thông báo
            toast.info(
              <div onClick={() => setNotificationOpen(true)}>
                <h4 className="font-medium">{notification.title}</h4>
                <p>{notification.content}</p>
              </div>, 
              { 
                autoClose: 8000,
                onClick: () => setNotificationOpen(true)
              }
            );
          });
        }
      } catch (error) {
        if (mounted) {
          console.error('Lỗi kết nối WebSocket trong NavBar:', error);
          // Hiển thị thông báo lỗi nhưng không ngăn app hoạt động
          toast.warning('Không thể kết nối đến dịch vụ thông báo. Thử lại sau.');
          
          // Thử kết nối lại sau 10 giây
          setTimeout(connectWebSocket, 10000);
        }
      }
    }
  };

  connectWebSocket();
  
  // Cleanup khi component unmount
  return () => {
    mounted = false;
    // Không ngắt kết nối hoàn toàn vì có thể các component khác vẫn cần
    websocketService.setNotificationCallback(null);
  };
}, [isAuthenticated]);

// Debug unreadCount - thêm để kiểm tra giá trị
useEffect(() => {
  console.log('unreadCount đã thay đổi:', unreadCount);
}, [unreadCount]);

  // Lấy số lượng thông báo chưa đọc khi component được mount
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated()) {
        try {
          const count = await notificationService.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    fetchUnreadCount();
    
    // Cập nhật số lượng thông báo mỗi 30 giây
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Xử lý click outside cho dropdown thông báo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Xử lý click outside cho user menu
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Toggle thông báo
  const toggleNotifications = () => {
    setNotificationOpen(prev => !prev);
  };

  // Phần render UI giữ nguyên
  return (
    <>
      {/* Phần UI hiện tại giữ nguyên không thay đổi */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-dark-800 px-4 md:px-8 py-1 shadow-xl border-b border-gray-200 dark:border-dark-700 flex justify-between items-center transition-colors duration-300">
        {/* ... Phần code UI giữ nguyên ... */}
        
        <div className="nav-logo flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="bloom_black.png"
              alt="KoraStudy Logo"
              className="h-12 md:h-16 w-auto mr-2 dark:filter dark:brightness-0 dark:invert"
            />
          </Link>
        </div>

        <ul className="hidden md:flex list-none m-0 p-0 gap-8 items-center">
          {/* Course dropdown */}
          <li className="relative" onMouseEnter={() => setShowCourseDropdown(true)} onMouseLeave={() => setShowCourseDropdown(false)}>
            <Link to="/courses" className="text-gray-800 dark:text-gray-200 text-base px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
              Khóa học
              <ChevronDown size={16} className="ml-1" />
            </Link>
            {showCourseDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-dark-700 z-20">
                <Link to="/courses" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">
                  Tất cả khóa học
                </Link>
                {isAuthenticated() && (
                  <Link to="/my-courses" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">
                    Khóa học của tôi
                  </Link>
                )}
              </div>
            )}
          </li>
          <li><Link to="/flash-card" className="text-gray-800 dark:text-gray-200 text-base px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FlashCard</Link></li>
          <li><Link to="/lo-trinh" className="text-gray-800 dark:text-gray-200 text-base px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Lộ trình</Link></li>

          <li className="relative">
            <Link to="/blog" className="text-gray-800 dark:text-gray-200 px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
            
          </li>

          <li className="relative" onMouseEnter={() => setShowExamDropdown(true)} onMouseLeave={() => setShowExamDropdown(false)}>
             <Link to="/exam" className="text-gray-800 dark:text-gray-200 px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Đề thi</Link>
            {showExamDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-dark-700">
                <Link to="/de-thi/topik1" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">TOPIK I</Link>
                <Link to="/de-thi/topik2" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">TOPIK II</Link>
                <Link to="/de-thi/topik-esp" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">TOPIK ESP</Link>
              </div>
            )}
          </li>

          <li><Link to="/about" className="text-gray-800 dark:text-gray-200 px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Về KoraStudy</Link></li>

          {/* User Authentication Section */}
          <div className="flex items-center space-x-4 ml-8">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {/* Notification Bell - Thêm vào trước phần user menu */}
              {isAuthenticated() && (
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full transition-colors"
                    aria-label="Thông báo"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[18px] h-[18px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown 
                    isOpen={notificationOpen} 
                    onClose={() => setNotificationOpen(false)}
                    onMarkAsRead={() => setUnreadCount(prev => Math.max(prev - 1, 0))}
                    onMarkAllAsRead={() => setUnreadCount(0)}
                  />
                </div>
              )}
            {isAuthenticated() && user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(getDisplayName())}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium max-w-[120px] truncate">
                    {getDisplayName()}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {/* Phần UI menu user dropdown - Giữ nguyên */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-dark-700 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getDisplayName()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || 'Không có email'}
                      </p>
                    </div>
                    
                    {/* Menu Items */}
                    <Link 
                      to="/profile" 
                      onClick={() => setShowUserMenu(false)} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    >
                      <User size={16} className="mr-3" /> Hồ sơ cá nhân
                    </Link>
                    <Link 
                      to="/profile?tab=settings" 
                      onClick={() => setShowUserMenu(false)} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                    >
                      <Settings size={16} className="mr-3" /> Cài đặt
                    </Link>
                    
                    <hr className="my-1 border-gray-200 dark:border-dark-700" />
                    
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/dang-nhap" 
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-500 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link 
                  to="/dang-ky" 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transition-all font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={toggleMobileMenu} 
            className="text-gray-800 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Giữ nguyên */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* ... Phần code mobile menu giữ nguyên ... */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-dark-800 shadow-xl">
            {/* Phần nội dung mobile menu - Giữ nguyên */}
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
                <img src="bloom_black.png" alt="KoraStudy Logo" className="h-10 w-auto dark:filter dark:brightness-0 dark:invert" />
                <button onClick={closeMobileMenu} className="text-gray-800 dark:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-2 px-4">
                  <Link to="/courses" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">Khóa học</Link>
                  {isAuthenticated() && (
                    <Link to="/my-courses" onClick={closeMobileMenu} className="block px-4 py-2 ml-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">Khóa học của tôi</Link>
                  )}
                  <Link to="/flash-card" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">FlashCard</Link>
                  <Link to="/lo-trinh" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">Lộ trình</Link>
                  <Link to="/blog" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">Blog</Link>
                  
                  <Link to="/exam" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">Đề thi</Link>
                  <div className="ml-4 space-y-1">
                    <Link to="/de-thi/topik1" onClick={closeMobileMenu} className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">TOPIK I</Link>
                    <Link to="/de-thi/topik2" onClick={closeMobileMenu} className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">TOPIK II</Link>
                    <Link to="/de-thi/topik-esp" onClick={closeMobileMenu} className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">TOPIK ESP</Link>
                  </div>
                  <Link to="/about" onClick={closeMobileMenu} className="block px-4 py-3 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">Về KoraStudy</Link>
                </nav>
              </div>
              
              {/* Mobile User Section */}
              {/* Thông báo (Mobile) */}
              {isAuthenticated() && (
                <Link 
                  to="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleNotifications();
                    closeMobileMenu();
                  }} 
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Bell size={18} />
                  <span>Thông báo</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ml-auto">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="border-t border-gray-200 dark:border-dark-700 p-4">
                {isAuthenticated() && user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(getDisplayName())}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || 'Không có email'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <Link 
                      to="/profile" 
                      onClick={closeMobileMenu} 
                      className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                    >
                      <User size={18} />
                      <span>Hồ sơ cá nhân</span>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/dang-nhap" 
                      onClick={closeMobileMenu} 
                      className="block w-full text-center bg-white dark:bg-dark-700 border-2 border-primary-500 text-primary-500 font-medium px-6 py-3 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link 
                      to="/dang-ky" 
                      onClick={closeMobileMenu} 
                      className="block w-full text-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium px-6 py-3 rounded-full hover:from-primary-600 hover:to-secondary-600 transition-all"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;