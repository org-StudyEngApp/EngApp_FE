import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Headphones,
  Layers,
  BookOpen,
  Target,
  Star,
  MessageCircle,
  ShieldCheck,
  Award,
  Calendar,
  User,
  Clock,
  TrendingUp
} from 'lucide-react';
import { blogService } from '../api/blogService';
import newsService from '../api/newsService';
import { flashcardService } from '../api/flashcardService';

const MotionSection = ({ children, className = '' }) => (
  <motion.section
    className={className}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.section>
);

const FadeIn = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [popularFlashcards, setPopularFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data khi component mount
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      
      // Fetch blog posts (lấy 3 bài mới nhất)
      try {
        const postsData = await blogService.getAllPosts();
        const latestPosts = Array.isArray(postsData) ? postsData.slice(0, 3) : [];
        setRecentPosts(latestPosts);
        console.log('✅ Blog posts loaded:', latestPosts.length);
      } catch (error) {
        console.error('❌ Error fetching blog posts:', error);
        setRecentPosts([]);
      }
      
      // Fetch news articles (lấy 3 bài mới nhất)
      // Tạm thời comment vì backend chưa có endpoint /api/v1/articles
      /*
      try {
        const newsData = await newsService.getArticles({ page: 0, size: 3, sortBy: 'publishedAt', sortDir: 'DESC' });
        console.log('📰 News API response:', newsData);
        const latestNews = newsData?.content || [];
        setRecentNews(latestNews);
        console.log('✅ News articles loaded:', latestNews.length);
      } catch (error) {
        console.error('❌ Error fetching news:', error);
        setRecentNews([]);
      }
      */
      setRecentNews([]); // Tạm thời set empty array
      
      // Fetch flashcards (lấy system flashcards)
      try {
        const flashcardsData = await flashcardService.getSystemSets();
        console.log('🎴 Flashcards API response:', flashcardsData);
        const popularCards = Array.isArray(flashcardsData) ? flashcardsData.slice(0, 3) : [];
        setPopularFlashcards(popularCards);
        console.log('✅ Flashcards loaded:', popularCards.length);
      } catch (error) {
        console.error('❌ Error fetching flashcards:', error);
        setPopularFlashcards([]);
      }
      
      setLoading(false);
    };

    fetchHomeData();
  }, []);

  const badges = useMemo(
    () => [
      'Học tiếng Anh miễn phí',
      'Bài kiểm tra đa dạng',
      'Flashcard thông minh',
      'Cộng đồng học tập'
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: 'Người dùng', value: '2000+' },
      { label: 'Bài viết Blog', value: '150+' },
      { label: 'Bài kiểm tra', value: '100+' },
      { label: 'Bộ Flashcard', value: '500+' }
    ],
    []
  );

  const featureHighlights = useMemo(
    () => [
      {
        icon: <BookOpen className="h-6 w-6 text-sky-500" />,
        title: 'Blog học tiếng Anh',
        description:
          'Kho tài liệu phong phú với các bài viết về ngữ pháp, từ vựng, mẹo học tập và kinh nghiệm chinh phục tiếng Anh.'
      },
      {
        icon: <Target className="h-6 w-6 text-sky-500" />,
        title: 'Bài kiểm tra',
        description:
          'Hệ thống bài kiểm tra đa dạng giúp bạn đánh giá và cải thiện trình độ tiếng Anh qua các kỹ năng Reading, Listening.'
      },
      {
        icon: <Layers className="h-6 w-6 text-sky-500" />,
        title: 'Flashcard từ vựng',
        description:
          'Học từ vựng hiệu quả với hệ thống flashcard thông minh, hỗ trợ ghi nhớ lâu dài theo phương pháp lặp lại ngắt quãng.'
      },
      {
        icon: <MessageCircle className="h-6 w-6 text-sky-500" />,
        title: 'Tin tức tiếng Anh',
        description:
          'Cập nhật tin tức thế giới bằng tiếng Anh, vừa học vừa biết, nâng cao khả năng đọc hiểu và vốn từ vựng thực tế.'
      }
    ],
    []
  );

  const methodSteps = useMemo(
    () => [
      {
        step: '01',
        title: 'Khám phá nội dung',
        description:
          'Tìm hiểu các bài viết blog, tin tức và tài liệu học tập phù hợp với trình độ và mục tiêu của bạn.'
      },
      {
        step: '02',
        title: 'Luyện tập & kiểm tra',
        description:
          'Thực hành với bài kiểm tra và flashcard để củng cố kiến thức, theo dõi tiến trình học tập của bạn.'
      },
      {
        step: '03',
        title: 'Phát triển kỹ năng',
        description:
          'Đọc tin tức, viết bình luận, trao đổi với cộng đồng để nâng cao kỹ năng tiếng Anh toàn diện.'
      }
    ],
    []
  );

  const modules = useMemo(
    () => [
      {
        title: 'Blog & Bài viết',
        description:
          'Kho tài liệu học tiếng Anh với các chủ đề đa dạng từ cơ bản đến nâng cao, được cập nhật thường xuyên.',
        icon: <BookOpen className="h-6 w-6" />
      },
      {
        title: 'Bài kiểm tra',
        description:
          'Đánh giá trình độ và luyện tập các kỹ năng tiếng Anh với hệ thống bài kiểm tra được thiết kế bài bản.',
        icon: <Target className="h-6 w-6" />
      },
      {
        title: 'Flashcard',
        description:
          'Học từ vựng hiệu quả với flashcard thông minh, giúp ghi nhớ từ mới nhanh chóng và lâu dài.',
        icon: <Layers className="h-6 w-6" />
      }
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: 'Nguyen Yen Nhi',
        role: 'Sinh viên',
        quote:
          'KoraStudy giúp mình cải thiện tiếng Anh rất nhiều. Các bài blog dễ hiểu và hệ thống flashcard rất hữu ích!'
      },
      {
        name: 'Tran Hoang Long',
        role: 'Nhân viên văn phòng',
        quote:
          'Mình thích đọc tin tức tiếng Anh trên KoraStudy, vừa học vừa biết. Các bài kiểm tra giúp mình theo dõi tiến bộ.'
      },
      {
        name: 'Pham Quynh Anh',
        role: 'Học sinh',
        quote:
          'Flashcard thông minh giúp mình nhớ từ vựng lâu hơn. Giao diện đẹp và dễ sử dụng, rất phù hợp cho việc học!'
      }
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        question: 'KoraStudy có miễn phí không?',
        answer:
          'Có, KoraStudy hoàn toàn miễn phí. Bạn có thể truy cập tất cả các tính năng như blog, bài kiểm tra, flashcard và tin tức mà không mất phí.'
      },
      {
        question: 'Làm sao để theo dõi tiến trình học tập?',
        answer:
          'Bạn có thể đăng nhập tài khoản để xem lịch sử bài kiểm tra, flashcard đã học và các hoạt động khác trong profile cá nhân.'
      },
      {
        question: 'Tôi có thể tạo flashcard riêng không?',
        answer:
          'Có, bạn có thể tạo bộ flashcard của riêng mình với từ vựng và định nghĩa tùy chỉnh để phù hợp với nhu cầu học tập.'
      }
    ],
    []
  );

  return (
    <div className="bg-slate-50 text-gray-900">
      <header className="relative overflow-hidden bg-sky-600 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 px-6 py-20 lg:flex-row lg:items-center lg:py-28">
          <div className="flex-1">
            <div className="mb-6 flex flex-wrap gap-3 text-sm text-blue-100">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm"
                >
                  <CheckCircle className="h-4 w-4" />
                  {badge}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Nền tảng học tiếng Anh toàn diện và miễn phí
            </h1>
            <p className="mt-6 text-lg text-blue-100 md:text-xl">
              Học tiếng Anh hiệu quả với blog, bài kiểm tra, flashcard và tin tức cập nhật hàng ngày. Nơi bạn phát triển kỹ năng tiếng Anh một cách toàn diện.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/dang-ky"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition duration-200 hover:bg-slate-200"
              >
                Bắt đầu học ngay
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/exam"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-8 py-4 font-semibold text-white transition duration-200 hover:border-white hover:bg-white/10"
              >
                Khám phá bài kiểm tra
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((item) => (
                <motion.div
                  key={item.label}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-sm"
                  whileHover={{ translateY: -4 }}
                >
                  <p className="text-2xl font-bold md:text-3xl">{item.value}</p>
                  <p className="mt-1 text-sm text-blue-100">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <motion.div
              className="mx-auto max-w-lg rounded-3xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              >
              <div className="overflow-hidden rounded-[26px] bg-sky-100 p-8 text-left text-slate-900">
                <div className="relative mb-6 h-40 w-full overflow-hidden rounded-2xl bg-blue-200">
                  <img
                    src="/banner/banner1.png"
                    alt="Banner học tiếng Anh"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/40 bg-white p-5 text-sm text-slate-700 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                    <Star className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Học tập hiệu quả</p>
                    <p className="text-xs text-slate-500">Theo dõi tiến trình và phát triển kỹ năng tiếng Anh toàn diện.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <MotionSection className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-8 text-center text-sm text-slate-500 md:grid-cols-4">
          {['Học tiếng Anh miễn phí', 'Cộng đồng học tập', 'Tài liệu phong phú', 'Cập nhật liên tục'].map(
            (item) => (
              <span key={item} className="rounded-xl bg-slate-50 px-4 py-3 shadow-sm">
                {item}
              </span>
            )
          )}
        </div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-6xl px-6 py-16">
        <FadeIn className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Tính năng nổi bật</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Tất cả công cụ bạn cần để học tiếng Anh hiệu quả</h2>
          <p className="mt-4 text-lg text-slate-600">
            Từ đọc blog, làm bài kiểm tra, học flashcard cho tới đọc tin tức – tất cả đều miễn phí trong một nền tảng.
          </p>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureHighlights.map((feature) => (
            <FadeIn
              key={feature.title}
              className="h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 inline-flex items-center justify-center rounded-full bg-sky-50 p-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </FadeIn>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <FadeIn>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Phương pháp học tập</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Học tiếng Anh hiệu quả với 3 bước đơn giản</h2>
              <p className="mt-4 text-lg text-slate-600">
                KoraStudy cung cấp đầy đủ tài liệu và công cụ để bạn phát triển kỹ năng tiếng Anh một cách toàn diện.
              </p>
              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-sky-600" />
                  Theo dõi tiến trình học tập với dashboard cá nhân.
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-sky-600" />
                  Tương tác với cộng đồng qua bình luận và chia sẻ.
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-sky-600" />
                  Nội dung được cập nhật liên tục hàng ngày.
                </li>
              </ul>
            </FadeIn>
            <div className="grid gap-6">
              {methodSteps.map((step) => (
                <FadeIn key={step.step} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm" delay={0.1}>
                  <span className="text-sm font-semibold text-sky-600">Bước {step.step}</span>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-6xl px-6 py-16">
        <FadeIn className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Các tính năng chính</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Công cụ học tập toàn diện</h2>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module) => (
            <FadeIn key={module.title} className="h-full rounded-3xl bg-white p-6 shadow-md">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-sky-50 p-3 text-sky-600">
                {module.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{module.description}</p>
            </FadeIn>
          ))}
        </div>
      </MotionSection>

      {/* Blog Posts Section */}
      <MotionSection className="mx-auto max-w-6xl px-6 py-16">
        <FadeIn className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Blog mới nhất</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Bài viết học tiếng Anh</h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-600 font-semibold"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
        
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {recentPosts.map((post) => (
              <FadeIn key={post.post_id || post.id} className="h-full">
                <Link
                  to={`/blog/${post.post_id || post.id}`}
                  className="block h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {post.post_image && (
                    <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={post.post_image}
                        alt={post.post_title || post.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(post.created_at || post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-2">
                    {post.post_title || post.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {post.post_content?.replace(/<[^>]*>/g, '').substring(0, 150) || 'Đọc thêm...'}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-sky-600">
                    <User className="h-3 w-3" />
                    <span>{post.author?.username || 'Admin'}</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">Chưa có bài viết nào.</p>
        )}
      </MotionSection>

      {/* News Section */}
      <MotionSection className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <FadeIn className="mb-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Tin tức</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Tin tức tiếng Anh mới nhất</h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-600 font-semibold"
            >
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : recentNews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {recentNews.map((article) => (
                <FadeIn key={article.id} className="h-full">
                  <Link
                    to={`/user-news/${article.id}`}
                    className="block h-full rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {article.imageUrl && (
                      <div className="mb-4 h-40 w-full overflow-hidden rounded-2xl bg-slate-200">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="mb-3 flex items-center gap-2">
                      {article.level && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.level === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                          article.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {article.level === 'BEGINNER' ? 'Cơ bản' : 
                           article.level === 'INTERMEDIATE' ? 'Trung cấp' : 'Nâng cao'}
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3">
                      {article.summary || 'Đọc để khám phá thêm...'}
                    </p>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">Chưa có tin tức nào.</p>
          )}
        </div>
      </MotionSection>

      {/* Flashcards Section */}
      <MotionSection className="mx-auto max-w-6xl px-6 py-16">
        <FadeIn className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Flashcard phổ biến</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Bộ thẻ từ vựng</h2>
          </div>
          <Link
            to="/flashcard"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-600 font-semibold"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
        
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : popularFlashcards.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {popularFlashcards.map((flashcard) => (
              <FadeIn key={flashcard.id} className="h-full">
                <Link
                  to={`/flashcard/practice/${flashcard.id}`}
                  className="block h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex items-center justify-center rounded-full bg-purple-50 p-3 text-purple-600">
                      <Layers className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
                      {flashcard.wordCount || 0} từ
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {flashcard.title || flashcard.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {flashcard.description || 'Bộ thẻ từ vựng hữu ích'}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Phổ biến</span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">Chưa có bộ flashcard nào.</p>
        )}
      </MotionSection>

      <MotionSection className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <FadeIn className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Bắt đầu ngay</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Miễn phí và dễ dàng sử dụng</h2>
            <p className="mt-4 text-lg text-slate-600">
              Tất cả tính năng hoàn toàn miễn phí. Tạo tài khoản và bắt đầu học tiếng Anh ngay hôm nay!
            </p>
          </FadeIn>
          <div className="grid gap-8 lg:grid-cols-3">
            {modules.map((module) => (
              <FadeIn
                key={module.title}
                className="flex h-full flex-col rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center rounded-full bg-sky-50 p-3 text-sky-600">
                    {module.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{module.title}</h3>
                </div>
                <p className="mt-4 flex-1 text-sm text-slate-600">{module.description}</p>
                <Link
                  to={
                    module.title === 'Blog & Bài viết'
                      ? '/blog'
                      : module.title === 'Bài kiểm tra'
                      ? '/exam'
                      : '/flashcard'
                  }
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600"
                >
                  Khám phá ngay
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <FadeIn className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Người dùng nói gì</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Trải nghiệm từ cộng đồng</h2>
            <p className="mt-4 text-lg text-slate-600">
              Hàng ngàn người dùng đã tin tưởng và sử dụng KoraStudy để cải thiện tiếng Anh của mình.
            </p>
          </FadeIn>
          <div className="grid gap-6 lg:col-span-2">
            {testimonials.map((item) => (
              <FadeIn key={item.name} className="rounded-3xl bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-sky-600">{item.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">"{item.quote}"</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <FadeIn className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Câu hỏi thường gặp</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Giải đáp trước khi bạn bắt đầu</h2>
          </FadeIn>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <FadeIn key={faq.question} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm">
                <details>
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900">{faq.question}</summary>
                  <p className="mt-3 text-slate-600">{faq.answer}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </MotionSection>
    </div>
  );
};

export default Home;