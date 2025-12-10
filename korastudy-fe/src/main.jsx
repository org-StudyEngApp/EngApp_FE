import './polyfills';
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Migration: Chuyển token từ authToken sang accessToken nếu cần
const migrateToken = () => {
  const oldToken = localStorage.getItem('authToken');
  const newToken = localStorage.getItem('accessToken');
  
  if (oldToken && !newToken) {
    localStorage.setItem('accessToken', oldToken);
    localStorage.removeItem('authToken');
    console.log('✅ Token đã được chuyển từ authToken sang accessToken');
    console.log('🔄 Vui lòng reload trang để áp dụng thay đổi');
    // Reload trang để áp dụng token mới
    window.location.reload();
    return;
  }
  
  if (oldToken && newToken) {
    // Xóa token cũ nếu đã có token mới
    localStorage.removeItem('authToken');
    console.log('🧹 Đã xóa authToken cũ');
  }
};

migrateToken();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

