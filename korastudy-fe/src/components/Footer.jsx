import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-sky-700 text-white mt-auto font-sans">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 py-[60px]">
          {/* Logo and Description Section */}
          <div className="lg:col-span-2 max-w-[300px]">
            <div className="flex items-center gap-3 mb-5">
              
              <div className="w-[200px] h-[110px] flex-shrink-0">
                <img 
                  src="bloom_black_text.png" 
                  alt="KoraStudy Logo" 
                  className="w-full h-full object-contain rounded-lg"
                  // onError={(e) => {
                  //   e.target.style.display = 'none';
                  //   e.target.parentElement.innerHTML = '<div class="w-full h-full bg-white/20 rounded-lg flex items-center justify-center text-2xl">🌸</div>';
                  // }}
                />
              </div>
            </div>
            <p className="text-sm leading-[1.6] text-white/80 mb-[30px]">
              Nền tảng luyện thi TOEIC trực tuyến hàng đầu Việt Nam. 
              Giúp bạn chinh phục mục tiêu 990+ với phương pháp học hiệu quả.
            </p>
            <div className="mt-5">
              <h4 className="text-base font-semibold mb-[15px] text-white">Theo dõi chúng tôi</h4>
              <div className="flex gap-3">
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_messenger.png" 
                    alt="Messenger"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>💬</span>';
                    }}
                  />
                </a>
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_gmail.png" 
                    alt="Gmail"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>📧</span>';
                    }}
                  />
                </a>
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_phone.png" 
                    alt="Phone"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>📞</span>';
                    }}
                  />
                </a>
                <a href="https://www.facebook.com/Trungnv.0701" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5 relative">
                  <img 
                    src="/img_social/ic_zalo.png" 
                    alt="Zalo"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('text-xl');
                      e.target.parentElement.innerHTML = '<span>💬</span>';
                    }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Khóa học TOEIC</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-3">
                <Link to="/exam" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Luyện đề TOEIC
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/courses" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Khóa học Listening
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/courses" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Khóa học Reading
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/flashcard" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Flashcard từ vựng
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/my-courses" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Khóa học của tôi
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/blog" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Mẹo thi TOEIC
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Hỗ trợ học viên</h3>
            <ul className="list-none p-0 m-0">
              <li className="mb-3">
                <Link to="/about" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Giới thiệu
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/coaching" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Coaching 1-1
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/study-plan" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Lộ trình học tập
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/progress" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Báo cáo tiến độ
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/faq" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/support" className="text-white/80 text-sm transition-colors duration-300 hover:text-white hover:underline">
                  Hỗ trợ kỹ thuật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Thông tin liên hệ</h3>
            <div className="flex flex-col gap-[15px]">
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">📧</span>
                </div>
                <span>toeic@korastudy.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">📞</span>
                </div>
                <span>Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">📚</span>
                </div>
                <span>Coaching TOEIC 990+</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-base">🏆</span>
                </div>
                <span>Cam kết đầu ra rõ ràng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="bg-white/10 rounded-xl p-[30px] mb-10">
          <div className="text-center max-w-[600px] mx-auto">
            <h3 className="text-2xl font-semibold mb-2.5 text-white">Đăng ký nhận thông tin mới nhất</h3>
            <p className="text-sm text-white/80 mb-[25px] leading-[1.5]">
              Nhận thông báo về các khóa học mới, tài liệu học tập và lịch thi TOPIK
            </p>
            <div className="flex gap-3 max-w-[400px] mx-auto">
              <input 
                type="email" 
                placeholder="Nhập địa chỉ email của bạn"
                className="flex-1 px-4 py-3 border-0 rounded-lg text-sm outline-none bg-white text-gray-800 placeholder-gray-500"
              />
              <button className="px-6 py-3 bg-sky-500 text-white border-0 rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-300 whitespace-nowrap hover:bg-sky-600">
                Đăng ký
              </button>
            </div>
          </div>
        </div> */}

        {/* Footer Bottom */}
        <div className="border-t border-white/20 py-[25px]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-[15px]">
            <div>
              <p className="m-0 text-sm text-white/70">&copy; 2025 KoraStudy TOEIC. Nền tảng luyện thi TOEIC hàng đầu Việt Nam.</p>
            </div>
            <div className="flex items-center gap-[15px] flex-wrap justify-center">
              <Link to="/terms" className="text-white/70 text-sm transition-colors duration-300 hover:text-white">
                Điều khoản dịch vụ
              </Link>
              <span className="text-white/50 text-sm">|</span>
              <Link to="/privacy" className="text-white/70 text-sm transition-colors duration-300 hover:text-white">
                Chính sách bảo mật
              </Link>
              <span className="text-white/50 text-sm">|</span>
              <Link to="/cookies" className="text-white/70 text-sm transition-colors duration-300 hover:text-white">
                Chính sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
