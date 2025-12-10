import React, { useMemo } from 'react';
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
  Award
} from 'lucide-react';

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
  const badges = useMemo(
    () => [
      'Chứng chỉ TOEIC quốc tế',
      'Lộ trình cá nhân hóa',
      'Feedback bởi chuyên gia 990+',
      'Cam kết đầu ra rõ ràng'
    ],
    []
  );

  const stats = useMemo(
    () => [
      { label: 'Học viên TOEIC', value: '2000+' },
      { label: 'Tỷ lệ đạt mục tiêu', value: '98%' },
      { label: 'Số đề ETS chuẩn', value: '320+' },
      { label: 'Giờ coaching 1-1', value: '1200+' }
    ],
    []
  );

  const featureHighlights = useMemo(
    () => [
      {
        icon: <Layers className="h-6 w-6 text-blue-500" />,
        title: 'Khung năng lực rõ ràng',
        description:
          'Phân tích điểm mạnh, điểm yếu theo từng Part và kỹ năng, đề xuất kế hoạch cải thiện chi tiết tuần-by-tuần.'
      },
      {
        icon: <Headphones className="h-6 w-6 text-blue-500" />,
        title: 'Phòng lab Listening',
        description:
          'Luyện nghe chủ động với chế độ tua chậm, ghi chú từ vựng trọng tâm và bài tập shadowing chuẩn Mỹ.'
      },
      {
        icon: <MessageCircle className="h-6 w-6 text-blue-500" />,
        title: 'Coaching 1-1',
        description:
          'Chuyên gia 990+ đồng hành giải đáp 24/7, sửa lỗi trực tiếp và điều chỉnh chiến lược làm bài theo tiến độ.'
      },
      {
        icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
        title: 'Cam kết đầu ra',
        description:
          'Hoàn học phí nếu không đạt mục tiêu cam kết sau khi tuân thủ đầy đủ lộ trình học tập và kiểm tra.'
      }
    ],
    []
  );

  const methodSteps = useMemo(
    () => [
      {
        step: '01',
        title: 'Đánh giá năng lực',
        description:
          'Test đầu vào chuẩn ETS, phân tích điểm số dựa trên AI và đề xuất lộ trình học 6-12 tuần phù hợp.'
      },
      {
        step: '02',
        title: 'Luyện tập chuyên sâu',
        description:
          'Hệ thống bài học video, lớp live, bài tập daily drill cùng đề full test cập nhật liên tục.'
      },
      {
        step: '03',
        title: 'Theo dõi & coaching',
        description:
          'Chuyên gia phân tích kết quả từng tuần, điều chỉnh chiến lược làm bài và hỗ trợ trước ngày thi.'
      }
    ],
    []
  );

  const modules = useMemo(
    () => [
      {
        title: 'Listening Lab',
        description:
          'Tăng tốc Part 1-4 với bài nghe đa giọng, chế độ nhấn nhá keyword và flashcard từ vựng thực chiến.',
        icon: <Headphones className="h-6 w-6" />
      },
      {
        title: 'Reading Clinic',
        description:
          'Hệ thống kỹ thuật skim-scan, ngân hàng từ vựng chủ đề và phân tích cấu trúc câu khó Part 5-7.',
        icon: <BookOpen className="h-6 w-6" />
      },
      {
        title: 'Strategy Hub',
        description:
          'Checklist trước ngày thi, chiến thuật phân bổ thời gian, mẹo bẫy thường gặp và bộ giải thích đáp án chi tiết.',
        icon: <Target className="h-6 w-6" />
      }
    ],
    []
  );

  const packages = useMemo(
    () => [
      {
        title: 'Starter 450+',
        target: 'Phù hợp người mất gốc hoặc mục tiêu điểm đầu vào doanh nghiệp.',
        price: 'Miễn phí trải nghiệm',
        features: [
          '08 tuần lộ trình nền tảng',
          '160 video bài giảng ngữ pháp - từ vựng',
          '04 đề ETS có chấm điểm tự động',
          'Group coaching hàng tuần'
        ]
      },
      {
        title: 'Accelerator 700+',
        target: 'Dành cho mục tiêu xét tốt nghiệp, xin việc hoặc nâng bậc lương.',
        price: '499.000 VND / khóa',
        features: [
          '12 tuần lộ trình chuyên sâu',
          '08 đề full test chuẩn ETS',
          'Unlimited feedback bài tập',
          '02 buổi coaching 1-1/tháng'
        ]
      },
      {
        title: 'Mastery 900+',
        target: 'Chinh phục TOEIC cao để săn học bổng hoặc chuyển việc quốc tế.',
        price: '799.000 VND / khóa',
        features: [
          '14 tuần lộ trình cá nhân hóa',
          'Coaching 1-1 hàng tuần',
          '12 đề mô phỏng thi thật',
          'Cam kết hoàn học phí nếu không đạt'
        ]
      }
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: 'Nguyen Yen Nhi',
        score: 'TOEIC 915',
        quote:
          'Nhờ hệ thống dashboard rất chi tiết, mình biết chính xác cần tập trung Part nào. Sau 6 tuần điểm tăng 245 điểm.'
      },
      {
        name: 'Tran Hoang Long',
        score: 'TOEIC 865',
        quote:
          'Các buổi coaching giúp mình sửa lỗi phát âm và quản lý thời gian rất tốt. Đề luyện bám sát thi thật.'
      },
      {
        name: 'Pham Quynh Anh',
        score: 'TOEIC 945',
        quote:
          'Mình yêu thích tính năng phân tích câu dài và flashcard thông minh. Đạt học bổng trao đổi nhờ điểm TOEIC.'
      }
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        question: 'Bao lâu sẽ thấy tiến bộ điểm số?',
        answer:
          'Với 3 buổi luyện tập/tuần và hoàn thành đầy đủ bài tập, học viên thường tăng 150-250 điểm sau 6-8 tuần.'
      },
      {
        question: 'Hệ thống chấm điểm có chính xác như thi thật?',
        answer:
          'Chúng tôi sử dụng bộ đề ETS độc quyền và quy đổi thang điểm chuẩn. Bài thi được AI cùng chuyên gia rà soát.'
      },
      {
        question: 'Có hỗ trợ thi Speaking & Writing không?',
        answer:
          'Gói Mastery bao gồm workshop nâng cao Speaking/Writing, chấm bài chi tiết và sửa lỗi trực tiếp qua video call.'
      }
    ],
    []
  );

  return (
    <div className="bg-slate-50 text-gray-900">
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white">
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
              Nền tảng luyện thi TOEIC toàn diện cho mục tiêu 990
            </h1>
            <p className="mt-6 text-lg text-blue-100 md:text-xl">
              Cá nhân hóa lộ trình, luyện đề chuẩn ETS và nhận phản hồi tức thì từ chuyên gia. Chúng tôi đồng hành tới khi bạn đạt được điểm số mơ ước.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/dang-ky"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow-lg shadow-blue-900/20 transition duration-200 hover:bg-slate-200"
              >
                Đặt lịch tư vấn miễn phí
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/exam"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-8 py-4 font-semibold text-white transition duration-200 hover:border-white hover:bg-white/10"
              >
                Xem lộ trình học thử
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
              <div className="overflow-hidden rounded-[26px] bg-gradient-to-br from-white via-sky-100 to-sky-200 p-8 text-left text-slate-900">
                <div className="relative mb-6 h-40 w-full overflow-hidden rounded-2xl bg-blue-200">
                  <img
                    src="/banner/banner1.png"
                    alt="Banner luyện thi TOEIC"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-white/20" />
                </div>




              </div>

              <div className="mt-6 rounded-2xl border border-white/40 bg-white p-5 text-sm text-slate-700 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">Coaching báo cáo hằng tuần</p>
                    <p className="text-xs text-slate-500">Chuyên gia 990+ đánh giá kết quả và điều chỉnh chiến lược cho bạn.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <MotionSection className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-8 text-center text-sm text-slate-500 md:grid-cols-4">
          {['Đối tác đào tạo doanh nghiệp', 'Ngân hàng đề chuẩn quốc tế', 'Hệ sinh thái học liệu số', 'Cố vấn TOEIC 990+'].map(
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Giải pháp toàn diện</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Tất cả công cụ bạn cần để tăng tốc điểm TOEIC</h2>
          <p className="mt-4 text-lg text-slate-600">
            Từ đánh giá đầu vào, luyện kỹ năng từng Part cho tới mô phỏng thi thử – tất cả đều được số hóa trong một nền tảng.
          </p>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureHighlights.map((feature) => (
            <FadeIn
              key={feature.title}
              className="h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 inline-flex items-center justify-center rounded-full bg-blue-50 p-3">
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
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Lộ trình 3 bước</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">Bám sát định hướng ETS, tối ưu từng tuần trước ngày thi</h2>
              <p className="mt-4 text-lg text-slate-600">
                KoraStudy xây dựng kế hoạch chi tiết dựa trên kết quả test đầu vào và lịch thi mong muốn của bạn.
              </p>
              <ul className="mt-6 space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-blue-600" />
                  Cập nhật dashboard tiến độ realtime sau mỗi bài luyện.
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-blue-600" />
                  Nhắc nhở học tập thông minh qua email và ứng dụng di động.
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-4 w-4 text-blue-600" />
                  Bộ đề ETS độc quyền, cập nhật hàng tháng.
                </li>
              </ul>
            </FadeIn>
            <div className="grid gap-6">
              {methodSteps.map((step) => (
                <FadeIn key={step.step} className="rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm" delay={0.1}>
                  <span className="text-sm font-semibold text-blue-600">Bước {step.step}</span>
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Trọng tâm kỹ năng</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Bộ học phần TOEIC chuyên sâu</h2>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module) => (
            <FadeIn key={module.title} className="h-full rounded-3xl bg-white p-6 shadow-md">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-50 p-3 text-blue-600">
                {module.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{module.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{module.description}</p>
            </FadeIn>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <FadeIn className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Chọn gói học phù hợp</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Học phí rõ ràng – linh hoạt theo mục tiêu</h2>
          </FadeIn>
          <div className="grid gap-8 lg:grid-cols-3">
            {packages.map((pack) => (
              <FadeIn
                key={pack.title}
                className="flex h-full flex-col rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-slate-900">{pack.title}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600">{pack.target}</p>
                <p className="mt-5 text-lg font-semibold text-blue-700">{pack.price}</p>
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-slate-600">
                  {pack.features.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-4 w-4 text-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/dang-ky"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Đăng ký tư vấn
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <FadeIn className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Câu chuyện thành công</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Điểm số cao – cơ hội rộng mở</h2>
            <p className="mt-4 text-lg text-slate-600">
              98% học viên hài lòng với lộ trình và dịch vụ coaching. Mỗi người một mục tiêu nhưng đều có chung kết quả: vượt qua kỳ thi với điểm số mong muốn.
            </p>
          </FadeIn>
          <div className="grid gap-6 lg:col-span-2">
            {testimonials.map((item) => (
              <FadeIn key={item.name} className="rounded-3xl bg-white p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-blue-600">{item.score}</p>
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
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Câu hỏi thường gặp</p>
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

      <MotionSection className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,255,255,0.1),_transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Sẵn sàng viết nên câu chuyện TOEIC của riêng bạn?</h2>
          <p className="mt-4 text-lg text-blue-100">
            Đặt lịch tư vấn miễn phí để nhận lộ trình cá nhân hóa và bộ đề luyện thử chuẩn ETS ngay hôm nay.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/dang-ky"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow-lg transition hover:bg-slate-200"
            >
              Nhận tư vấn ngay
            </Link>
            <Link
              to="/lien-he"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-8 py-4 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Tư vấn doanh nghiệp
            </Link>
          </div>
        </div>
      </MotionSection>
    </div>
  );
};

export default Home;