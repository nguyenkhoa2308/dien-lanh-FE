"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  BadgeCheck,
  Truck,
  Wrench,
  HeadphonesIcon,
  CreditCard,
  RotateCcw,
  Calendar,
  Award,
  Users,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ChevronDown,
  Star,
  Quote,
  CheckCircle2,
  Zap,
  ThumbsUp,
  Heart,
  ShoppingCart,
  ClipboardCheck,
  MapPinned,
  Settings,
  PackageCheck,
  Sparkles,
  Building2,
  TrendingUp,
  Target,
  Rocket,
} from "lucide-react";

const stats = [
  { value: "10+", label: "Năm kinh nghiệm", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
  { value: "50K+", label: "Khách hàng tin dùng", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { value: "100+", label: "Nhân viên chuyên nghiệp", icon: BadgeCheck, color: "text-green-500", bg: "bg-green-50" },
  { value: "20+", label: "Chi nhánh toàn quốc", icon: MapPin, color: "text-red-500", bg: "bg-red-50" },
];

const benefits = [
  { text: "Sản phẩm chính hãng 100% từ các thương hiệu uy tín", icon: Shield },
  { text: "Giá cạnh tranh nhất thị trường - hoàn tiền chênh lệch", icon: BadgeCheck },
  { text: "Miễn phí lắp đặt tận nơi nội thành", icon: Truck },
  { text: "Bảo hành chính hãng lên đến 24 tháng", icon: Wrench },
  { text: "Đội ngũ kỹ thuật viên được đào tạo bài bản", icon: Award },
  { text: "Hỗ trợ tư vấn 24/7 qua hotline", icon: HeadphonesIcon },
  { text: "Chính sách trả góp 0% lãi suất", icon: CreditCard },
  { text: "Bảo trì định kỳ miễn phí năm đầu", icon: Calendar },
  { text: "Đổi trả trong 7 ngày nếu lỗi nhà sản xuất", icon: RotateCcw },
];

const processes = [
  { step: "01", title: "Tư vấn", desc: "Tư vấn miễn phí, giúp bạn chọn máy lạnh phù hợp với không gian và ngân sách", icon: MessageCircle },
  { step: "02", title: "Báo giá", desc: "Báo giá chi tiết, minh bạch, không phát sinh chi phí ẩn", icon: ClipboardCheck },
  { step: "03", title: "Đặt hàng", desc: "Đặt hàng online hoặc tại showroom, thanh toán linh hoạt", icon: ShoppingCart },
  { step: "04", title: "Khảo sát", desc: "Kỹ thuật viên đến khảo sát thực tế vị trí lắp đặt", icon: MapPinned },
  { step: "05", title: "Lắp đặt", desc: "Lắp đặt chuẩn kỹ thuật nhà sản xuất, gọn gàng sạch sẽ", icon: Settings },
  { step: "06", title: "Bàn giao", desc: "Nghiệm thu, hướng dẫn sử dụng và bàn giao giấy tờ bảo hành", icon: PackageCheck },
];

const milestones = [
  { year: "2014", title: "Thành lập", desc: "Khởi đầu với cửa hàng đầu tiên tại TP.HCM", icon: Building2 },
  { year: "2016", title: "Mở rộng", desc: "Mở thêm 5 chi nhánh tại các tỉnh phía Nam", icon: TrendingUp },
  { year: "2018", title: "Phát triển", desc: "Đạt mốc 10,000 khách hàng", icon: Target },
  { year: "2020", title: "Số hóa", desc: "Ra mắt website và app đặt hàng", icon: Zap },
  { year: "2022", title: "Toàn quốc", desc: "Phủ sóng 20+ chi nhánh", icon: MapPin },
  { year: "2024", title: "Vươn xa", desc: "Hơn 50,000 khách hàng tin dùng", icon: Rocket },
];

const partners = [
  { name: "Daikin", logo: "/images/brands/daikin.png" },
  { name: "Panasonic", logo: "/images/brands/panasonic.png" },
  { name: "LG", logo: "/images/brands/lg.png" },
  { name: "Samsung", logo: "/images/brands/samsung.png" },
  { name: "Toshiba", logo: "/images/brands/toshiba.png" },
  { name: "Mitsubishi", logo: "/images/brands/mitsubishi.png" },
];

const faqs = [
  {
    question: "Máy lạnh Inverter có ưu điểm gì so với máy lạnh thường?",
    answer: "Máy lạnh Inverter tiết kiệm điện năng từ 30-50% so với máy lạnh thường nhờ khả năng điều chỉnh công suất linh hoạt. Ngoài ra, máy hoạt động êm ái hơn, làm lạnh nhanh hơn và có tuổi thọ cao hơn do máy nén không phải bật/tắt liên tục."
  },
  {
    question: "Hùng Thành có hỗ trợ trả góp không?",
    answer: "Hùng Thành hỗ trợ trả góp 0% lãi suất qua các ngân hàng và công ty tài chính uy tín như Home Credit, FE Credit, HD Saison, Kredivo. Thủ tục đơn giản, duyệt nhanh trong 15 phút với CMND/CCCD."
  },
  {
    question: "Thời gian lắp đặt máy lạnh mất bao lâu?",
    answer: "Thời gian lắp đặt tiêu chuẩn từ 2-4 giờ tùy thuộc vào vị trí và độ phức tạp. Đối với các trường hợp đặc biệt (tường gạch cứng, vị trí cao...), thời gian có thể kéo dài hơn. Kỹ thuật viên sẽ thông báo trước khi thi công."
  },
  {
    question: "Chính sách bảo hành của Hùng Thành như thế nào?",
    answer: "Hùng Thành cung cấp bảo hành chính hãng từ 12-24 tháng tùy sản phẩm, bảo hành máy nén lên đến 5 năm. Ngoài ra, khách hàng được bảo trì miễn phí năm đầu tiên (vệ sinh, kiểm tra gas, kiểm tra điện)."
  },
  {
    question: "Làm thế nào để chọn công suất máy lạnh phù hợp?",
    answer: "Công suất máy lạnh được tính dựa trên diện tích phòng: 1HP cho phòng 9-15m², 1.5HP cho 15-20m², 2HP cho 20-30m². Tuy nhiên, còn phụ thuộc vào hướng nhà, số người sử dụng, thiết bị tỏa nhiệt. Liên hệ Hùng Thành để được tư vấn chính xác nhất."
  },
  {
    question: "Hùng Thành có dịch vụ sửa chữa máy lạnh không?",
    answer: "Hùng Thành cung cấp dịch vụ sửa chữa, bảo trì máy lạnh tất cả các hãng. Đội ngũ kỹ thuật viên được đào tạo chuyên nghiệp, có chứng chỉ từ các nhà sản xuất. Báo giá minh bạch, bảo hành dịch vụ 3-6 tháng."
  },
];

const reviews = [
  {
    name: "Nguyễn Văn Minh",
    rating: 5,
    date: "15/12/2024",
    comment: "Dịch vụ rất tốt, nhân viên tư vấn nhiệt tình. Máy lạnh chạy êm, mát lạnh. Kỹ thuật viên lắp đặt gọn gàng, dọn dẹp sạch sẽ sau khi hoàn thành.",
    product: "Máy lạnh Daikin Inverter 1.5HP"
  },
  {
    name: "Trần Thị Hương",
    rating: 5,
    date: "10/12/2024",
    comment: "Mua máy lạnh cho cả nhà, tổng 4 máy. Được giảm giá tốt, lắp đặt nhanh trong 1 ngày. Rất hài lòng với dịch vụ của Hùng Thành!",
    product: "Máy lạnh Panasonic 1HP & 2HP"
  },
  {
    name: "Lê Hoàng Nam",
    rating: 5,
    date: "05/12/2024",
    comment: "Giá cả cạnh tranh, thấp hơn nhiều so với đại lý khác. Trả góp 0% rất tiện lợi. Sẽ giới thiệu cho bạn bè và người thân.",
    product: "Máy lạnh LG Inverter 2HP"
  },
  {
    name: "Phạm Thị Mai",
    rating: 4,
    date: "01/12/2024",
    comment: "Máy lạnh Samsung chất lượng tốt, tiết kiệm điện rõ rệt so với máy cũ. Nhân viên CSKH theo dõi sau bán hàng chu đáo.",
    product: "Máy lạnh Samsung Wind-Free 1.5HP"
  },
];

// FAQ Accordion Item Component
function FAQItem({ faq, isOpen, onToggle, index }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-gray-200 last:border-none"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 px-6 text-left hover:bg-blue-50/50 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]'}`}>
            <span className="text-sm font-bold">{String(index + 1).padStart(2, '0')}</span>
          </div>
          <span className="font-semibold text-[var(--gray-900)] pr-4 text-left">{faq.question}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-500'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[72px]">
              <p className="text-[var(--gray-600)] leading-relaxed bg-blue-50/50 p-4 rounded-xl">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[650px] md:min-h-[750px] overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#0d47a1] to-[#1565c0]" />

        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-orange-400 rounded-full blur-3xl"
          />
        </div>

        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-6 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Hơn 10 năm kinh nghiệm</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Hùng Thành mang đến
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mt-2">
                  dịch vụ máy lạnh chuyên nghiệp
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl"
              >
                Chúng tôi cam kết mang đến cho khách hàng những sản phẩm{" "}
                <strong className="text-white">chính hãng 100%</strong>, giá tốt nhất thị trường
                cùng dịch vụ lắp đặt, bảo hành <strong className="text-white">chu đáo tận tâm</strong>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/#products"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                  Xem sản phẩm
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-[var(--primary)] transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Liên hệ ngay
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-wrap gap-6"
              >
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Truck className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Miễn phí lắp đặt</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Bảo hành 24 tháng</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
                >
                  <Image
                    src="/images/about/about-story.png"
                    alt="Hùng Thành Showroom"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>

                {/* Floating Badge - Bottom Left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-xl flex items-center justify-center">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--gray-900)] text-lg">Uy tín 10 năm</div>
                      <div className="text-sm text-[var(--gray-500)]">Khách hàng tin tưởng</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Badge - Top Right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-2xl"
                >
                  <div className="text-center">
                    <div className="text-4xl font-black">50K+</div>
                    <div className="text-xs font-medium opacity-90">Khách hàng</div>
                  </div>
                </motion.div>

                {/* Rating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute top-1/2 -right-8 bg-white px-4 py-3 rounded-xl shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-[var(--gray-900)]">4.9</span>
                  </div>
                  <div className="text-xs text-[var(--gray-500)] mt-1">2,847 đánh giá</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f2f4f7"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-8 z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group cursor-default"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${stat.bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-[var(--gray-900)] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[var(--gray-600)] text-sm font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-sm rounded-full mb-4">
                <ThumbsUp className="w-4 h-4" />
                Tại sao chọn Hùng Thành?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)] mb-6">
                9 lý do khách hàng{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-blue-600">
                  tin tưởng
                </span>{" "}
                Hùng Thành
              </h2>
              <p className="text-[var(--gray-600)] mb-8 leading-relaxed text-lg">
                Chúng tôi không chỉ bán máy lạnh, chúng tôi mang đến giải pháp làm mát toàn diện
                với chất lượng dịch vụ hàng đầu.
              </p>

              <div className="grid gap-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 8, backgroundColor: "rgba(25, 118, 210, 0.05)" }}
                      className="flex items-center gap-4 p-4 rounded-xl transition-all cursor-default border border-transparent hover:border-[var(--primary)]/20"
                    >
                      <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[var(--gray-700)] font-medium">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Right - Images Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group"
                >
                  <Image src="/images/about/service-1.png" alt="Tư vấn" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Dịch vụ</span>
                    </div>
                    <p className="font-bold">Tư vấn tận tâm</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group"
                >
                  <Image src="/images/about/service-2.png" alt="Lắp đặt" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </motion.div>
              </div>
              <div className="space-y-4 pt-8">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group"
                >
                  <Image src="/images/about/service-3.png" alt="Bảo trì" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group"
                >
                  <Image src="/images/about/technician.png" alt="Kỹ thuật viên" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="w-4 h-4" />
                      <span className="text-sm font-medium">Đội ngũ</span>
                    </div>
                    <p className="font-bold">Kỹ thuật viên chuyên nghiệp</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-sm rounded-full mb-4">
              <Settings className="w-4 h-4" />
              Quy trình làm việc
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)] mb-4">
              6 bước đơn giản để có máy lạnh
            </h2>
            <p className="text-[var(--gray-600)] max-w-2xl mx-auto text-lg">
              Quy trình chuyên nghiệp, minh bạch từ khâu tư vấn đến bàn giao
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processes.map((process, index) => {
              const Icon = process.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[var(--primary)]/20 overflow-hidden"
                >
                  {/* Step Number Background */}
                  <div className="absolute -top-8 -right-4 text-[120px] font-black text-[var(--primary)]/5 group-hover:text-[var(--primary)]/10 transition-colors select-none leading-none">
                    {process.step}
                  </div>

                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/30"
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>

                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-[var(--primary)] to-blue-600 px-3 py-1.5 rounded-full shadow-sm">
                        Bước {process.step}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[var(--gray-900)] mb-3">
                      {process.title}
                    </h3>
                    <p className="text-[var(--gray-600)] leading-relaxed">
                      {process.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 font-semibold text-sm rounded-full mb-4">
              <Star className="w-4 h-4 fill-amber-500" />
              Đánh giá từ khách hàng
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)] mb-4">
              Khách hàng nói gì về Hùng Thành?
            </h2>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mt-6"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: star * 0.1 }}
                  >
                    <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-4xl font-black text-[var(--gray-900)]">4.9</span>
              <span className="text-[var(--gray-500)]">/ 5 (2,847 đánh giá)</span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[var(--primary)] to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[var(--gray-900)]">{review.name}</h4>
                    <p className="text-sm text-[var(--gray-500)] mb-1">{review.date}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <Quote className="w-10 h-10 text-[var(--primary)]/10 flex-shrink-0" />
                </div>
                <p className="text-[var(--gray-700)] leading-relaxed mb-4 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-[var(--gray-500)]">Đã mua:</span>
                  <span className="text-[var(--primary)] font-semibold">{review.product}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/danh-gia"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
            >
              Xem tất cả đánh giá
              <Heart className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-sm rounded-full mb-4">
              <MessageCircle className="w-4 h-4" />
              Câu hỏi thường gặp
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)] mb-4">
              Những điều bạn muốn biết
            </h2>
            <p className="text-[var(--gray-600)] text-lg">
              Giải đáp các thắc mắc phổ biến về sản phẩm và dịch vụ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                index={index}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 text-[var(--gray-600)]"
          >
            Còn thắc mắc?{" "}
            <Link href="/lien-he" className="text-[var(--primary)] font-semibold hover:underline inline-flex items-center gap-1">
              Liên hệ với chúng tôi
              <Phone className="w-4 h-4" />
            </Link>
          </motion.p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-sm rounded-full mb-4">
              <Clock className="w-4 h-4" />
              Lịch sử phát triển
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--gray-900)] mb-4">
              Hành trình 10 năm
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--primary)] via-blue-500 to-amber-500 rounded-full" />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-2">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative text-center"
                  >
                    {/* Dot */}
                    <motion.div
                      whileHover={{ scale: 1.3, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="hidden lg:flex mx-auto w-12 h-12 bg-white border-4 border-[var(--primary)] rounded-full items-center justify-center z-10 relative mb-6 shadow-lg"
                    >
                      <Icon className="w-5 h-5 text-[var(--primary)]" />
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl hover:shadow-xl transition-all border border-gray-100"
                    >
                      <div className="text-[var(--primary)] font-black text-2xl mb-1">
                        {milestone.year}
                      </div>
                      <h3 className="font-bold text-[var(--gray-900)] mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-[var(--gray-600)] text-sm">
                        {milestone.desc}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] font-semibold text-sm rounded-full mb-4">
              <BadgeCheck className="w-4 h-4" />
              Đối tác chiến lược
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--gray-900)]">
              Nhà phân phối chính thức của các thương hiệu hàng đầu
            </h2>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center justify-center p-6 bg-white rounded-2xl grayscale hover:grayscale-0 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative w-24 h-14">
                  <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/about/about-cta.png" alt="Hùng Thành" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/95 via-[#0d47a1]/90 to-[#1565c0]/85" />
        </div>

        {/* Animated Shapes */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-400 rounded-full blur-3xl"
        />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Tư vấn miễn phí 24/7
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Sẵn sàng trải nghiệm
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                dịch vụ chuyên nghiệp?
              </span>
            </h2>

            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              Liên hệ ngay để được tư vấn miễn phí và nhận báo giá tốt nhất.
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/lien-he"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30"
                >
                  <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                  Liên hệ tư vấn
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="tel:+84779886666"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-[var(--primary)] transition-all"
                >
                  <Phone className="w-5 h-5" />
                  0779 886 666
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
