import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
    this.connected = false;
    this.notificationCallback = null;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 3;
    this.connecting = false;
  }

  connect() {
    // Nếu đã kết nối hoặc đang trong quá trình kết nối, không cần kết nối lại
    if (this.connected || this.connecting) {
      return Promise.resolve();
    }

    // Đánh dấu đang trong quá trình kết nối
    this.connecting = true;

    return new Promise((resolve, reject) => {
      // Lấy token từ localStorage
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        this.connecting = false;
        reject(new Error('Không tìm thấy token xác thực'));
        return;
      }

      // Kiểm soát số lần thử kết nối
      this.connectionAttempts++;
      console.log(`Lần thử kết nối thứ ${this.connectionAttempts}/${this.maxConnectionAttempts}`);
      
      if (this.connectionAttempts > this.maxConnectionAttempts) {
        this.connecting = false;
        console.warn('Đã vượt quá số lần thử kết nối tối đa');
        reject(new Error('Vượt quá số lần thử kết nối'));
        return;
      }

      try {
        // Kết nối trực tiếp với endpoint WebSocket
        const socket = new SockJS(`${API_BASE_URL}/ws`);

        // Thiết lập timeout để tránh chờ mãi
        const connectTimeout = setTimeout(() => {
          if (!this.connected) {
            this.connecting = false;
            console.error('WebSocket kết nối quá thời gian cho phép');
            
            if (this.client) {
              this.client.deactivate();
            }
            
            if (socket && socket.close) {
              socket.close();
            }
            
            reject(new Error('Kết nối WebSocket quá thời gian'));
          }
        }, 10000); // 10 giây

        // Log các sự kiện của SockJS để debug
        socket.onopen = () => console.log('SockJS socket mở');
        socket.onclose = (event) => console.log('SockJS socket đóng:', event);
        socket.onerror = (error) => console.error('SockJS error:', error);

        // Tạo STOMP client với cấu hình mới
        this.client = new Client({
          webSocketFactory: () => socket,
          // Quan trọng: Đặt token trong header kết nối
          connectHeaders: {
            'Authorization': `Bearer ${token}`
          },
          debug: (str) => {
            if (str.includes('error') || str.includes('failed')) {
              console.error('STOMP:', str);
            } else {
              console.log('STOMP:', str);
            }
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        // Xử lý khi kết nối thành công
        this.client.onConnect = (frame) => {
          clearTimeout(connectTimeout);
          this.connected = true;
          this.connecting = false;
          this.connectionAttempts = 0; // Reset counter
          
          console.log('WebSocket kết nối thành công', frame);

          // Đăng ký nhận thông báo dựa trên username từ token
          this.subscribeToNotifications();
          
          resolve();
        };

        // Xử lý lỗi STOMP
        this.client.onStompError = (frame) => {
          clearTimeout(connectTimeout);
          this.connecting = false;
          console.error('Lỗi STOMP:', frame);
          reject(new Error(`Lỗi STOMP: ${frame.headers?.message || 'Unknown error'}`));
        };

        // Xử lý khi WebSocket bị đóng
        this.client.onWebSocketClose = (event) => {
          console.log('WebSocket đóng:', event);
          this.connected = false;
          this.connecting = false;
        };

        // Xử lý lỗi WebSocket
        this.client.onWebSocketError = (event) => {
          clearTimeout(connectTimeout);
          this.connecting = false;
          console.error('Lỗi WebSocket:', event);
          reject(new Error('Lỗi kết nối WebSocket'));
        };

        // Kích hoạt kết nối
        this.client.activate();
      } catch (error) {
        this.connecting = false;
        console.error('Lỗi khi khởi tạo WebSocket:', error);
        reject(error);
      }
    });
  }

  // Phương thức để lấy username từ token
  getUsernameFromToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      // Tùy thuộc vào cấu trúc token của bạn
      return payload.sub || payload.username || payload.email;
    } catch (e) {
      console.error('Lỗi parse token:', e);
      return null;
    }
  }

  // Đăng ký nhận thông báo
  subscribeToNotifications() {
    if (!this.client || !this.connected) {
      console.error('WebSocket chưa kết nối');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const username = this.getUsernameFromToken(token);
      if (!username) {
        console.error('Không thể lấy username từ token');
        return;
      }

      console.log('Đăng ký nhận thông báo cho user:', username);

      // Đăng ký nhận thông báo cá nhân
      this.subscriptions.userNotifications = this.client.subscribe(
        `/user/${username}/queue/notifications`, 
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Nhận thông báo mới:', notification);
            
            // Gọi callback nếu có
            if (this.notificationCallback) {
              this.notificationCallback(notification);
            }
            
            // Hiển thị toast thông báo
            toast.info(
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p>{notification.message || notification.content}</p>
              </div>, 
              { autoClose: 5000 }
            );
          } catch (e) {
            console.error('Lỗi khi xử lý thông báo:', e);
          }
        }
      );

      // Đăng ký kênh thông báo hệ thống
      this.subscriptions.systemNotifications = this.client.subscribe(
        '/topic/system', 
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Nhận thông báo hệ thống:', notification);
            
            // Hiển thị toast thông báo
            toast.info(
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p>{notification.content}</p>
              </div>, 
              { autoClose: 5000 }
            );
          } catch (e) {
            console.error('Lỗi khi xử lý thông báo hệ thống:', e);
          }
        }
      );

      // Đăng ký kênh thông báo công khai
      this.subscriptions.publicNotifications = this.client.subscribe(
        '/topic/public', 
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Nhận thông báo công khai:', notification);
            
            // Hiển thị toast thông báo
            toast.info(
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p>{notification.content}</p>
              </div>, 
              { autoClose: 5000 }
            );
          } catch (e) {
            console.error('Lỗi khi xử lý thông báo công khai:', e);
          }
        }
      );
    } catch (error) {
      console.error('Lỗi khi đăng ký nhận thông báo:', error);
    }
  }

  // Thêm phương thức test để kiểm tra kết nối WebSocket
  testConnection() {
    if (!this.client || !this.connected) {
      console.error('WebSocket chưa kết nối');
      return false;
    }
    
    try {
      this.client.publish({
        destination: '/app/connect',
        headers: {},
        body: JSON.stringify({ message: 'Test connection' })
      });
      console.log('Đã gửi tin nhắn test kết nối');
      return true;
    } catch (error) {
      console.error('Lỗi khi test kết nối:', error);
      return false;
    }
  }

  setNotificationCallback(callback) {
    this.notificationCallback = callback;
  }

  disconnect() {
    if (this.client) {
      // Hủy các subscription
      Object.values(this.subscriptions).forEach(sub => {
        if (sub && typeof sub.unsubscribe === 'function') {
          try {
            sub.unsubscribe();
          } catch (e) {
            console.error('Lỗi khi hủy đăng ký:', e);
          }
        }
      });
      this.subscriptions = {};
      
      // Ngắt kết nối client
      try {
        this.client.deactivate();
        console.log('WebSocket ngắt kết nối');
      } catch (e) {
        console.error('Lỗi khi ngắt kết nối WebSocket:', e);
      }
      
      // Reset các trạng thái
      this.connected = false;
      this.connecting = false;
      this.connectionAttempts = 0;
    }
  }
}

// Singleton instance
const websocketService = new WebSocketService();
export default websocketService;