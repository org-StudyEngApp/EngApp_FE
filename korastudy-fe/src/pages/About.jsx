import React, { useEffect, useState, useRef } from 'react';
import { Award, BookOpen, Users, Target, Star, TrendingUp, Globe, BookMarked, ShieldCheck } from 'lucide-react';
// import NavBar from '@components/NavBar.jsx';
// import Footer from '@components/Footer.jsx';

const About = () => {
  const [animatedItems, setAnimatedItems] = useState({});
  const observerRefs = useRef([]);
  
  // Thiết lập Intersection Observer để phát hiện khi phần tử xuất hiện trong viewport
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          if (id) {
            setAnimatedItems(prev => ({
              ...prev,
              [id]: true
            }));
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Thêm tất cả các phần tử cần quan sát vào observer
    document.querySelectorAll('[data-id]').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const teamMembers = [
  
  {
    name: "Vũ Minh Quang",
    title: "Technical Lead & TOEIC Expert",
    experience: "4+ năm kinh nghiệm, TOEIC 950+",
    image: "/public/teamdev/quang.jpg",
    bio: "Tốt nghiệp Đại học CNTT Việt Hàn với chuyên ngành Lập trình Back-end. Với điểm TOEIC 950+, anh đã phát triển nhiều tính năng AI hỗ trợ luyện thi TOEIC hiệu quả."
  },
  {
    name: "Từ Đàm Văn Thiên",
    title: "Founder & CEO",
    experience: "5+ năm kinh nghiệm, TOEIC 990",
    image: "public/teamdev/thien.jpg",
    bio: "Người sáng lập KoraStudy TOEIC, tốt nghiệp loại giỏi chuyên ngành Full-stack Development tại Đại học CNTT Việt Hàn. Đạt điểm TOEIC 990 tuyệt đối, anh đã khởi xướng dự án với sứ mệnh giúp người Việt chinh phục TOEIC và nâng cao cơ hội nghề nghiệp.",
    isLeader: true
  },
  {
    name: "Nguyễn Văn Trung",
    title: "UX/UI Designer & TOEIC Coach",
    experience: "4+ năm kinh nghiệm, TOEIC 920+",
    image: "/public/teamdev/trung.jpg",
    bio: "Tốt nghiệp Đại học CNTT Việt Hàn, chuyên về thiết kế trải nghiệm học tập TOEIC. Với điểm TOEIC 920+, anh hiểu rõ tâm lý và nhu cầu của học viên luyện thi."
  }
];

  const coreValues = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "Mục tiêu rõ ràng",
      description: "Phương pháp luyện thi tối ưu, giúp học viên đạt điểm TOEIC mục tiêu trong thời gian ngắn nhất."
    },
    {
      icon: <ShieldCheck className="w-12 h-12" />,
      title: "Chất lượng đảm bảo",
      description: "Cam kết mang đến nội dung luyện thi chất lượng cao, được biên soạn bởi các chuyên gia TOEIC."
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Cộng đồng học tập",
      description: "Xây dựng môi trường luyện thi sôi động, nơi học viên có thể chia sẻ kinh nghiệm và động viên lẫn nhau."
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Cơ hội toàn cầu",
      description: "Mở ra cơ hội nghề nghiệp quốc tế thông qua việc đạt điểm TOEIC cao và nâng cao năng lực tiếng Anh."
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
     
      
      {/* Hero Section */}
      <section className="relative py-24 bg-sky-500 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-60 -left-40 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div 
            className="text-center mb-8 transition-all duration-700"
            data-id="hero-title"
          >
            <h1 className={`font-inter font-bold text-5xl mb-6 transition-all duration-700 ${animatedItems['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Về KoraStudy TOEIC
            </h1>
            <p className={`text-xl text-white/80 max-w-2xl mx-auto transition-all duration-700 delay-300 ${animatedItems['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Nền tảng luyện thi TOEIC trực tuyến hàng đầu Việt Nam, giúp bạn chinh phục mục tiêu 990+ điểm TOEIC một cách hiệu quả và khoa học.
            </p>
          </div>
          
          <div className={`flex justify-center transition-all duration-700 delay-500 ${animatedItems['hero-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-20 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </section>
      
      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className="text-center mb-16"
            data-id="mission-vision-title"
          >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['mission-vision-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Sứ mệnh & Tầm nhìn
            </h2>
            <div className={`w-20 h-1 bg-sky-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['mission-vision-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div 
              className="bg-white dark:bg-dark-800 p-8 rounded-xl shadow-lg transition-all duration-700"
              data-id="mission-card"
            >
              <div className={`w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-500 mb-6 transition-all duration-700 ${animatedItems['mission-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Target size={32} />
              </div>
              <h3 className={`font-semibold text-2xl text-gray-800 dark:text-white mb-4 transition-all duration-700 delay-100 ${animatedItems['mission-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Sứ mệnh
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 delay-200 ${animatedItems['mission-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                KoraStudy TOEIC ra đời với sứ mệnh giúp người Việt Nam chinh phục kỳ thi TOEIC một cách hiệu quả và tự tin. Chúng tôi cam kết mang đến phương pháp luyện thi khoa học, công nghệ học tập tiên tiến và đội ngũ giảng viên chuyên nghiệp, giúp học viên đạt điểm số TOEIC mong muốn.
              </p>
            </div>
            
            <div 
              className="bg-white dark:bg-dark-800 p-8 rounded-xl shadow-lg transition-all duration-700"
              data-id="vision-card"
            >
              <div className={`w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-500 mb-6 transition-all duration-700 ${animatedItems['vision-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <BookMarked size={32} />
              </div>
              <h3 className={`font-semibold text-2xl text-gray-800 dark:text-white mb-4 transition-all duration-700 delay-100 ${animatedItems['vision-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Tầm nhìn
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 delay-200 ${animatedItems['vision-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                KoraStudy TOEIC hướng tới trở thành nền tảng luyện thi TOEIC hàng đầu Việt Nam, nơi mọi học viên đều có thể đạt được điểm số mục tiêu. Chúng tôi không ngừng đổi mới phương pháp luyện thi, cá nhân hóa lộ trình học tập và mở rộng cơ hội nghề nghiệp thông qua việc nâng cao năng lực tiếng Anh.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-20 bg-gray-100 dark:bg-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className="text-center mb-16"
            data-id="core-values-title"
          >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['core-values-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Giá trị cốt lõi
            </h2>
            <div className={`w-20 h-1 bg-sky-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['core-values-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['core-values-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Những giá trị định hướng mọi hoạt động của KoraStudy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-dark-700 p-8 rounded-xl shadow-lg text-center transition-all duration-700"
                data-id={`core-value-${index}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`text-sky-500 mx-auto mb-6 transition-all duration-700 transform ${animatedItems[`core-value-${index}`] ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-10 rotate-45'}`}>
                  {value.icon}
                </div>
                <h3 className={`font-semibold text-xl text-gray-800 dark:text-white mb-4 transition-all duration-700 delay-200 ${animatedItems[`core-value-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {value.title}
                </h3>
                <p className={`text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-700 delay-300 ${animatedItems[`core-value-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Future Direction Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div 
            className="text-center mb-16"
            data-id="future-title"
          >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['future-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Định hướng tương lai
            </h2>
            <div className={`w-20 h-1 bg-sky-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['future-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['future-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Những bước tiến tiếp theo của KoraStudy
            </p>
          </div>
          
          <div 
            className="bg-sky-500 rounded-2xl p-8 md:p-12 text-white shadow-xl"
            data-id="future-card"
          >
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className={`font-semibold text-2xl mb-6 transition-all duration-700 ${animatedItems['future-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  Lộ trình phát triển
                </h3>
                <ul className="space-y-4">
                  <li className={`flex items-start gap-3 transition-all duration-700 delay-100 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-6 h-6 bg-white text-sky-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <p className="text-white/90">
                      Phát triển thêm các khóa học TOEIC chuyên sâu: Business TOEIC, TOEIC Speaking & Writing.
                    </p>
                  </li>
                  <li className={`flex items-start gap-3 transition-all duration-700 delay-200 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-6 h-6 bg-white text-sky-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <p className="text-white/90">
                      Ứng dụng công nghệ AI để phân tích điểm yếu và đề xuất lộ trình luyện thi cá nhân hóa.
                    </p>
                  </li>
                  <li className={`flex items-start gap-3 transition-all duration-700 delay-300 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-6 h-6 bg-white text-sky-500 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <p className="text-white/90">
                      Hợp tác với các doanh nghiệp để tổ chức thi thử TOEIC và cấp chứng chỉ uy tín.
                    </p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className={`font-semibold text-2xl mb-6 transition-all duration-700 delay-400 ${animatedItems['future-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  Cam kết của chúng tôi
                </h3>
                <p className={`text-white/90 mb-6 leading-relaxed transition-all duration-700 delay-500 ${animatedItems['future-card'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  KoraStudy TOEIC cam kết không ngừng đổi mới và cải tiến để mang đến trải nghiệm luyện thi TOEIC tốt nhất cho học viên. Chúng tôi hướng tới việc:
                </p>
                <ul className="space-y-3">
                  <li className={`flex items-center gap-3 transition-all duration-700 delay-600 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span>Cá nhân hóa lộ trình luyện thi dựa trên điểm số hiện tại và mục tiêu</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-all duration-700 delay-700 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span>Ứng dụng AI và công nghệ hiện đại vào việc phân tích và luyện thi</span>
                  </li>
                  <li className={`flex items-center gap-3 transition-all duration-700 delay-800 ${animatedItems['future-card'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></div>
                    <span>Xây dựng cộng đồng học viên TOEIC mạnh mẽ và hỗ trợ lẫn nhau</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
    <section className="py-20 bg-gray-100 dark:bg-dark-800">
    <div className="max-w-7xl mx-auto px-4">
        <div 
        className="text-center mb-16"
        data-id="team-title"
        >
        <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['team-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Đội ngũ phát triển
        </h2>
        <div className={`w-20 h-1 bg-sky-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['team-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
        <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['team-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Đội ngũ phát triển KoraStudy TOEIC gồm các chuyên gia công nghệ và đạt điểm TOEIC cao
        </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
            <div 
            key={index}
            className={`bg-white dark:bg-dark-700 rounded-xl overflow-hidden shadow-lg transition-all duration-700 ${member.isLeader ? 'md:col-span-3 lg:col-span-1 ring-4 ring-sky-500 transform hover:-translate-y-2' : 'transform hover:-translate-y-1'}`}
            data-id={`team-member-${index}`}
            style={{ transitionDelay: `${index * 100}ms` }}
            >
            <div className={`h-64 ${member.isLeader ? 'bg-yellow-400' : 'bg-sky-500'} flex items-center justify-center transition-all duration-700 ${animatedItems[`team-member-${index}`] ? 'opacity-100' : 'opacity-0'} relative`}>
                {member.isLeader && (
                <div className="absolute top-4 right-4 bg-white text-sky-600 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Founder
                </div>
                )}
                <div className="relative w-48 h-60 rounded-xl overflow-hidden border-4 border-yellow-100 shadow-lg mx-auto">
                    <img 
                    src={member.image} 
                    alt={member.name}
                    className={`w-full h-full object-cover object-top transition-all duration-700 transform ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'}`}
                    />
                </div>
            </div>
            <div className={`p-6 ${member.isLeader ? 'bg-blue-50 dark:bg-dark-700' : ''}`}>
                <h3 className={`font-semibold ${member.isLeader ? 'text-2xl' : 'text-xl'} text-gray-800 dark:text-white mb-1 transition-all duration-700 delay-200 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.name}
                </h3>
                <p className={`${member.isLeader ? 'text-sky-600 font-semibold' : 'text-sky-500'} mb-2 transition-all duration-700 delay-300 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.title}
                </p>
                <p className={`text-sm text-gray-500 dark:text-gray-400 mb-4 transition-all duration-700 delay-400 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.experience}
                </p>
                <p className={`text-gray-600 dark:text-gray-300 transition-all duration-700 delay-500 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {member.bio}
                </p>
                {member.isLeader && (
                <div className={`mt-4 flex justify-end transition-all duration-700 delay-600 ${animatedItems[`team-member-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 mr-4">
                    LinkedIn
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600">
                    GitHub
                    </a>
                </div>
                )}
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>
    

        {/* Road Map Section */}
        <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
            <div 
            className="text-center mb-16"
            data-id="roadmap-title"
            >
            <h2 className={`font-inter font-bold text-4xl text-gray-800 dark:text-white mb-4 transition-all duration-700 ${animatedItems['roadmap-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Lộ trình luyện thi TOEIC
            </h2>
            <div className={`w-20 h-1 bg-sky-500 mx-auto mb-6 transition-all duration-700 delay-300 ${animatedItems['roadmap-title'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
            <p className={`text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-all duration-700 delay-500 ${animatedItems['roadmap-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                Con đường chinh phục điểm số TOEIC từ người mới bắt đầu đến 990+ tuyệt đối
            </p>
            </div>
            
            {/* Timeline */}
            <div className="relative">
            {/* Middle line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-sky-500"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
                {/* Level 1 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level1"
                >
                <div className={`md:w-1/2 md:pr-16 transition-all duration-700 ${animatedItems['roadmap-level1'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 1 - Mức độ cơ bản (200-400)
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Nền tảng tiếng Anh</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Học ngữ pháp cơ bản, từ vựng thông dụng và làm quen với định dạng đề thi TOEIC. Tập trung phát triển kỹ năng nghe và đọc hiểu cơ bản.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 2-3 tháng</div>
                    </div>
                    </div>
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level1'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    1
                    </div>
                </div>
                
                <div className="md:w-1/2 md:pl-16 md:mt-0 mt-6">
                    {/* Empty for alignment */}
                </div>
                </div>
                
                {/* Level 2 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level2"
                >
                <div className="md:w-1/2 md:pr-16">
                    {/* Empty for alignment */}
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level2'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    2
                    </div>
                </div>
                
                <div className={`md:w-1/2 md:pl-16 md:mt-0 mt-6 transition-all duration-700 ${animatedItems['roadmap-level2'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-600 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 2 - Mức độ trung bình (450-600)
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Nâng cao kỹ năng TOEIC</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Luyện các dạng đề Listening và Reading cơ bản, học các chiến lược làm bài và quản lý thời gian hiệu quả.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 3-4 tháng</div>
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Level 3 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level3"
                >
                <div className={`md:w-1/2 md:pr-16 transition-all duration-700 ${animatedItems['roadmap-level3'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 3 - Mức độ khá (650-750)
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Làm chủ kỹ thuật TOEIC</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Luyện các dạng đề nâng cao, từ vựng Business English và các kỹ thuật làm bài chuyên sâu cho từng phần thi.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 4-5 tháng</div>
                    </div>
                    </div>
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level3'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    3
                    </div>
                </div>
                
                <div className="md:w-1/2 md:pl-16 md:mt-0 mt-6">
                    {/* Empty for alignment */}
                </div>
                </div>
                
                {/* Level 4 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level4"
                >
                <div className="md:w-1/2 md:pr-16">
                    {/* Empty for alignment */}
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level4'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    4
                    </div>
                </div>
                
                <div className={`md:w-1/2 md:pl-16 md:mt-0 mt-6 transition-all duration-700 ${animatedItems['roadmap-level4'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 4 - Mức độ giỏi (800-900)
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Chuẩn bị thi thật</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Luyện đề thi thật theo đúng format TOEIC, phân tích các dạng đề khó và xây dựng chiến lược thi hiệu quả.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 3-4 tháng</div>
                    </div>
                    </div>
                </div>
                </div>
                
                {/* Level 5 */}
                <div 
                className="relative flex flex-col md:flex-row"
                data-id="roadmap-level5"
                >
                <div className={`md:w-1/2 md:pr-16 transition-all duration-700 ${animatedItems['roadmap-level5'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-500 inline-block px-4 py-1 rounded-full text-sm font-medium mb-4">
                        Level 5 - Xuất sắc (900-990)
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Đạt đỉnh cao TOEIC</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Hoàn thiện kỹ năng và chiến lược để đạt 990 điểm tuyệt đối. Cải thiện điểm số Speaking & Writing nếu cần thiết.
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div>Thời gian: 2-6 tháng</div>
                    </div>
                    </div>
                </div>
                
                {/* Circle in middle */}
                <div className="hidden md:flex absolute left-1/2 top-6 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-10 h-10 rounded-full bg-green-500 flex items-center justify-center z-10 text-white font-bold transition-all duration-700 ${animatedItems['roadmap-level5'] ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    5
                    </div>
                </div>
                
                <div className="md:w-1/2 md:pl-16 md:mt-0 mt-6">
                    {/* Empty for alignment */}
                </div>
                </div>
            </div>
            </div>
            
            {/* Button to Learning Path */}
            <div className={`flex justify-center mt-12 transition-all duration-700 ${animatedItems['roadmap-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '700ms' }}>
            <a 
                href="/courses"
                className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
                Xem khóa học TOEIC
            </a>
            </div>
        </div>
        </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-sky-500 text-white">
        <div 
          className="max-w-4xl mx-auto text-center px-4"
          data-id="cta-section"
        >
          <h2 className={`font-inter font-bold text-4xl mb-6 transition-all duration-700 ${animatedItems['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Trở thành một phần của cộng đồng KoraStudy TOEIC
          </h2>
          <p className={`text-xl text-white/80 mb-8 transition-all duration-700 delay-300 ${animatedItems['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Bắt đầu hành trình chinh phục TOEIC 990+ của bạn ngày hôm nay
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${animatedItems['cta-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <a 
              href="/dang-ky"
              className="bg-white text-sky-500 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg inline-flex items-center justify-center gap-2"
            >
              Đăng ký miễn phí
            </a>
            <a 
              href="/lien-he"
              className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/30 transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>
      
      
      {/* Thêm hiệu ứng counter số */}
      <style jsx>{`
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .count-up {
          animation: count-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default About;