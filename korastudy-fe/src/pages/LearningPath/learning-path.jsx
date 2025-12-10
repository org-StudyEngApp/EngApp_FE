import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Star, Target, ArrowRight } from 'lucide-react';
// import NavBar from '../../components/NavBar';
// import Footer from '../../components/Footer';
import PathHeader from '../../components/LearningPathComponent/PathHeader';
import PathContent from '../../components/LearningPathComponent/PathContent';

const LearningPath = () => {
  const [expandedPath, setExpandedPath] = useState('beginner');
  const [animatedItems, setAnimatedItems] = useState({});
  
  // Trigger animations on scroll
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight - 100;
        
        if (isVisible) {
          const id = el.getAttribute('data-id');
          setAnimatedItems(prev => ({...prev, [id]: true}));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 300);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const learningPaths = [
    {
      id: 'beginner',
      title: 'Lộ trình cho người mới bắt đầu',
      subtitle: 'Từ số 0 đến TOPIK I (Level 1-2)',
      description: 'Lộ trình học tập toàn diện dành cho người mới bắt đầu, giúp bạn xây dựng nền tảng vững chắc với tiếng Hàn và đạt được trình độ TOPIK I.',
      duration: '6 tháng',
      courses: 5,
      students: 8500,
      gradient: 'from-blue-600 via-blue-500 to-sky-500',
      stats: {
        completion: '40%',
        lessons: '25 bài',
        studyTime: '10 giờ',
        rating: '4.9/5'
      },
      levels: [
        {
          id: 'level-1',
          title: 'Cấp độ 1: Làm quen với tiếng Hàn',
          duration: '4-6 tuần',
          courses: [
            {
              id: 1,
              title: 'Bảng chữ cái Hangeul',
              description: 'Học đọc và viết bảng chữ cái tiếng Hàn',
              duration: '2 tuần',
              lessons: 10,
              progress: 100,
              status: 'completed',
              level: 1
            },
            {
              id: 2,
              title: 'Ngữ pháp cơ bản',
              description: 'Các cấu trúc ngữ pháp cơ bản nhất',
              duration: '3 tuần',
              lessons: 15,
              progress: 80,
              status: 'in-progress',
              level: 1
            }
          ]
        },
        {
          id: 'level-2',
          title: 'Cấp độ 2: Giao tiếp cơ bản',
          duration: '8-10 tuần',
          courses: [
            {
              id: 3,
              title: 'Từ vựng chủ đề hàng ngày',
              description: 'Học từ vựng theo chủ đề thông dụng',
              duration: '4 tuần',
              lessons: 20,
              progress: 0,
              status: 'locked',
              level: 1
            },
            {
              id: 4,
              title: 'Luyện nghe cấp độ sơ cấp',
              description: 'Phát triển kỹ năng nghe hiểu cơ bản',
              duration: '4 tuần',
              lessons: 16,
              progress: 0,
              status: 'locked',
              level: 1
            }
          ]
        }
      ]
    },
    
    // TOPIK I
    {
      id: 'topik1',
      title: 'Lộ trình TOPIK I',
      subtitle: 'Luyện thi TOPIK cấp độ 1-2',
      description: 'Khóa học chuyên sâu giúp bạn chuẩn bị tốt nhất cho kỳ thi TOPIK I. Nội dung được thiết kế sát với cấu trúc đề thi, giúp bạn đạt điểm cao.',
      duration: '4 tháng',
      courses: 6,
      students: 5200,
      gradient: 'from-purple-600 via-purple-500 to-pink-500',
      stats: {
        completion: '0%',
        lessons: '30 bài',
        studyTime: '0 giờ',
        rating: '4.8/5'
      },
      levels: [
        {
          id: 'topik1-level-1',
          title: 'Làm quen với TOPIK I',
          duration: '3 tuần',
          courses: [
            {
              id: 101,
              title: 'Giới thiệu cấu trúc đề thi',
              description: 'Tìm hiểu về cấu trúc, thời gian và cách tính điểm TOPIK I',
              duration: '1 tuần',
              lessons: 5,
              progress: 0,
              status: 'locked',
              level: 1
            },
            {
              id: 102,
              title: 'Ôn tập ngữ pháp TOPIK I',
              description: 'Các cấu trúc ngữ pháp quan trọng thường xuất hiện trong TOPIK I',
              duration: '2 tuần',
              lessons: 10,
              progress: 0,
              status: 'locked',
              level: 1
            }
          ]
        },
        {
          id: 'topik1-level-2',
          title: 'Luyện kỹ năng Nghe - Đọc',
          duration: '8 tuần',
          courses: [
            {
              id: 103,
              title: 'Luyện nghe TOPIK I',
              description: 'Luyện tập các dạng bài nghe thường gặp trong TOPIK I',
              duration: '4 tuần',
              lessons: 12,
              progress: 0,
              status: 'locked',
              level: 1
            },
            {
              id: 104,
              title: 'Luyện đọc TOPIK I',
              description: 'Chiến thuật làm bài đọc hiểu trong TOPIK I',
              duration: '4 tuần',
              lessons: 12,
              progress: 0,
              status: 'locked',
              level: 1
            }
          ]
        },
        {
          id: 'topik1-level-3',
          title: 'Đề thi thử TOPIK I',
          duration: '5 tuần',
          courses: [
            {
              id: 105,
              title: 'Đề thi thử TOPIK I (Set 1)',
              description: 'Bài thi thử với cấu trúc và độ khó tương đương đề thi thật',
              duration: '2 tuần',
              lessons: 5,
              progress: 0,
              status: 'locked',
              level: 1
            },
            {
              id: 106,
              title: 'Đề thi thử TOPIK I (Set 2)',
              description: 'Luyện tập với bộ đề thi mới và phân tích chi tiết đáp án',
              duration: '3 tuần',
              lessons: 5,
              progress: 0,
              status: 'locked',
              level: 1
            }
          ]
        }
      ]
    },
    
    // TOPIK II
    {
      id: 'topik2',
      title: 'Lộ trình TOPIK II',
      subtitle: 'Luyện thi TOPIK cấp độ 3-6',
      description: 'Lộ trình học nâng cao dành cho những học viên mong muốn đạt được chứng chỉ TOPIK II với trình độ từ 3-6. Bao gồm tất cả các kỹ năng: Nghe, Đọc, Viết.',
      duration: '8 tháng',
      courses: 8,
      students: 3100,
      gradient: 'from-orange-600 via-amber-500 to-yellow-500',
      stats: {
        completion: '0%',
        lessons: '45 bài',
        studyTime: '0 giờ',
        rating: '4.7/5'
      },
      levels: [
        {
          id: 'topik2-level-1',
          title: 'Ngữ pháp nâng cao TOPIK II',
          duration: '8 tuần',
          courses: [
            {
              id: 201,
              title: 'Ngữ pháp trung cấp',
              description: 'Các cấu trúc ngữ pháp trung cấp cần thiết cho TOPIK II',
              duration: '4 tuần',
              lessons: 15,
              progress: 0,
              status: 'locked',
              level: 3
            },
            {
              id: 202,
              title: 'Ngữ pháp cao cấp',
              description: 'Ngữ pháp cao cấp cho mức độ 5-6',
              duration: '4 tuần',
              lessons: 15,
              progress: 0,
              status: 'locked',
              level: 5
            }
          ]
        },
        {
          id: 'topik2-level-2',
          title: 'Kỹ năng Nghe - Đọc TOPIK II',
          duration: '12 tuần',
          courses: [
            {
              id: 203,
              title: 'Luyện nghe TOPIK II',
              description: 'Phương pháp làm bài nghe hiểu trong TOPIK II',
              duration: '5 tuần',
              lessons: 12,
              progress: 0,
              status: 'locked',
              level: 3
            },
            {
              id: 204,
              title: 'Luyện đọc TOPIK II',
              description: 'Chiến thuật làm bài đọc hiểu trong TOPIK II',
              duration: '5 tuần',
              lessons: 12,
              progress: 0,
              status: 'locked',
              level: 3
            },
            {
              id: 205,
              title: 'Từ vựng học thuật',
              description: 'Từ vựng chuyên biệt cho các chủ đề học thuật',
              duration: '2 tuần',
              lessons: 8,
              progress: 0,
              status: 'locked',
              level: 4
            }
          ]
        },
        {
          id: 'topik2-level-3',
          title: 'Kỹ năng viết TOPIK II',
          duration: '6 tuần',
          courses: [
            {
              id: 206,
              title: 'Viết văn mô tả',
              description: 'Kỹ năng viết văn mô tả cho phần thi viết',
              duration: '3 tuần',
              lessons: 6,
              progress: 0,
              status: 'locked',
              level: 3
            },
            {
              id: 207,
              title: 'Viết văn luận',
              description: 'Kỹ năng viết văn bàn luận cho điểm cao',
              duration: '3 tuần',
              lessons: 6,
              progress: 0,
              status: 'locked',
              level: 5
            }
          ]
        },
        {
          id: 'topik2-level-4',
          title: 'Luyện đề thi TOPIK II',
          duration: '6 tuần',
          courses: [
            {
              id: 208,
              title: 'Đề thi thử TOPIK II',
              description: 'Các bộ đề thi thử toàn diện cho TOPIK II',
              duration: '6 tuần',
              lessons: 10,
              progress: 0,
              status: 'locked',
              level: 4
            }
          ]
        }
      ]
    }
  ];

  const togglePath = (pathId) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
      
      
      {/* Intro Section */}
      <section className="py-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Lộ trình học tiếng Hàn
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Chọn lộ trình phù hợp với mục tiêu của bạn và bắt đầu hành trình chinh phục tiếng Hàn một cách hệ thống
            </p>
          </div>
        </div>
      </section>
      
      {/* Learning Paths */}
      {learningPaths.map((path, index) => (
        <div key={path.id} className="mb-10">
          <PathHeader 
            path={path} 
            isExpanded={expandedPath === path.id} 
            onToggle={togglePath}
          />
          
          {expandedPath === path.id && (
            <PathContent path={path} animatedItems={animatedItems} />
          )}
        </div>
      ))}
      
      {/* Benefits section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-dark-800 dark:to-dark-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll" data-id="benefits-title">
            <h2 className={`text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 transition-all duration-500 ${animatedItems['benefits-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Lợi ích của lộ trình học
            </h2>
            <p className={`text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-500 delay-100 ${animatedItems['benefits-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Học theo lộ trình giúp bạn tiết kiệm thời gian và đạt kết quả tốt nhất
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 animate-on-scroll" data-id="benefits-cards">
            {[
              {
                icon: <Award size={32} />,
                title: "Học có hệ thống",
                description: "Nội dung được sắp xếp từ dễ đến khó, giúp bạn xây dựng kiến thức nền tảng vững chắc."
              },
              {
                icon: <Target size={32} />,
                title: "Tiến độ rõ ràng",
                description: "Theo dõi tiến độ học tập và biết chính xác bạn đã đạt được bao nhiêu phần trăm mục tiêu."
              },
              {
                icon: <Star size={32} />,
                title: "Nội dung chất lượng",
                description: "Bài học được thiết kế bởi các chuyên gia ngôn ngữ với kinh nghiệm giảng dạy nhiều năm."
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className={`bg-white dark:bg-dark-700 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-dark-600 transform transition-all duration-700 hover:-translate-y-2 hover:shadow-xl ${animatedItems['benefits-cards'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center text-white mb-5 shadow-md">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-sky-500 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-10 top-10 w-72 h-72 rounded-full bg-white opacity-10 mix-blend-overlay blur-3xl animate-blob"></div>
          <div className="absolute left-20 bottom-10 w-56 h-56 rounded-full bg-sky-300 opacity-10 mix-blend-overlay blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">
              Bắt đầu lộ trình học của bạn ngay hôm nay
            </h2>
            <p className="text-lg text-blue-100 mb-8 animate-fade-in-up">
              Đăng ký để lưu lại tiến độ và nhận hỗ trợ từ giảng viên trong quá trình học
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
              <Link 
                to="/dang-ky"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 group"
              >
                Đăng ký miễn phí
                <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/dang-nhap"
                className="bg-transparent text-white border-2 border-white/50 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Custom animations styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(0.9); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(0.9); opacity: 1; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .progress-animation {
          position: relative;
          overflow: hidden;
        }
        
        .progress-animation::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: progress-shine 2s infinite;
        }
        
        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      
     
    </div>
  );
};

export default LearningPath;