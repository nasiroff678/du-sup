/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import {
  Waves,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Compass,
  MapPin,
  ChevronRight,
  Sparkles,
  Award,
  Users,
  Anchor,
  ShieldAlert,
  ArrowRight,
  ArrowUp,
  Rocket,
  Eye,
  Info,
  ShieldCheck,
  LifeBuoy
} from 'lucide-react';
import { Tour, RentalOption, Booking } from './types';
import { TOURS, RENTALS } from './data';
import QuizSection from './components/QuizSection';
import BookingModal from './components/BookingModal';
import AdminPanel from './components/AdminPanel';
import GalleryViewer from './components/GalleryViewer';
import FAQSection from './components/FAQSection';
import InteractiveRouteMap from './components/InteractiveRouteMap';
import WeatherWidget from './components/WeatherWidget';
import WaterParticles from './components/WaterParticles';

// Initial dummy bookings to populate admin panel
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'DS-482910',
    customerName: 'Владислав Шакиров',
    customerPhone: '+7 (917) 456-12-89',
    serviceType: 'tour',
    serviceName: 'Маршрут «Туринка»',
    date: '2026-07-02',
    timeSlot: '10:00',
    quantity: 2,
    totalPrice: 3200,
    discountCode: 'DUSUP20',
    status: 'confirmed',
    notes: 'Нужен один мужской жилет XL и женский S.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'DS-892134',
    customerName: 'Эльвира Мухаметова',
    customerPhone: '+7 (927) 890-54-32',
    serviceType: 'rental',
    serviceName: 'Прокат сапбордов (1 час)',
    date: '2026-06-29',
    timeSlot: '18:00',
    quantity: 3,
    totalPrice: 1500,
    status: 'pending',
    notes: 'Бронируем на вечерний закат.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'DS-112398',
    customerName: 'Алексей Петров',
    customerPhone: '+7 (905) 123-45-67',
    serviceType: 'yoga',
    serviceName: 'Йога на воде DilyaYoga (1.5 часа)',
    date: '2026-07-05',
    timeSlot: '10:00',
    quantity: 1,
    totalPrice: 800,
    status: 'completed',
    createdAt: new Date().toISOString()
  }
];

// Animated Counter component
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <p ref={ref} className="text-2xl font-extrabold text-primary">{count}{suffix}</p>;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<{
    type: 'tour' | 'rental' | 'yoga';
    id: string;
  } | null>(null);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isHoveredBackToTop, setIsHoveredBackToTop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const footerVideoRef = useRef<HTMLVideoElement>(null);
  const [footerVideoEnded, setFooterVideoEnded] = useState(false);
  const [showEnding, setShowEnding] = useState(false);

  // After video ends, show logo for 5 seconds then revert to footer columns
  useEffect(() => {
    if (footerVideoEnded) {
      setShowEnding(true);
      const timer = setTimeout(() => setShowEnding(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [footerVideoEnded]);

  // Parallax effects for Hero Background using framer-motion (motion/react)
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, 160]);
  const opacityBg = useTransform(scrollY, [0, 800], [1, 0.35]);

  // Cursor parallax for hero bg
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set((e.clientX - cx) / rect.width  * -18);
    mouseY.set((e.clientY - cy) / rect.height * -12);
  }, [mouseX, mouseY]);

  const handleHeroMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Slow down hero video playback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  // Slow down footer video playback
  useEffect(() => {
    if (footerVideoRef.current) {
      footerVideoRef.current.playbackRate = 0.6;
    }
  }, []);

  // Load and save bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dusup_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        setBookings(INITIAL_BOOKINGS);
      }
    } else {
      setBookings(INITIAL_BOOKINGS);
      localStorage.setItem('dusup_bookings', JSON.stringify(INITIAL_BOOKINGS));
    }
  }, []);

  // Update scrolled state for navbar styling and Back To Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(15); // Short haptic pulse for tactile response
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCreateBooking = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('dusup_bookings', JSON.stringify(updated));
  };

  const handleUpdateBookingStatus = (id: string, status: Booking['status']) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(updated);
    localStorage.setItem('dusup_bookings', JSON.stringify(updated));
  };

  const handleDeleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('dusup_bookings', JSON.stringify(updated));
  };

  const openBookingModal = (type: 'tour' | 'rental' | 'yoga', id: string) => {
    setPreselectedService({ type, id });
    setIsBookingOpen(true);
  };

  const handleApplyPromo = (code: string, discount: number) => {
    setAppliedPromo(code);
    setAppliedDiscount(discount);
  };

  return (
    <div className="water-flow-bg min-h-screen text-river-deep font-sans selection:bg-secondary selection:text-river-deep">
      {/* Sticky Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md py-3 custom-light-shadow border-b border-slate-100'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-16 flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 group-hover:rotate-6 transition-all duration-300">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rounded square container for premium branding feel in Deep Sea Turquoise (#088395) */}
                <rect width="100" height="100" rx="24" fill="#088395" />
                
                {/* Stylized river waves in white */}
                <path d="M20 62 C 35 69, 45 55, 60 62 C 75 69, 80 62, 80 62" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 76 C 35 83, 45 69, 60 76 C 75 83, 80 76, 80 76" stroke="white" strokeWidth="4.5" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Stylized paddle board in vibrant yellow #FACC15 */}
                <path d="M42 22 C 42 16, 58 16, 58 22 L 52 58 C 52 61, 48 61, 48 58 Z" fill="#FACC15" />
                
                {/* Stylized Paddle in yellow #FACC15 */}
                <line x1="30" y1="24" x2="70" y2="54" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                <path d="M68 52 L 74 61 C 76 63, 72 66, 69 64 L 64 56 Z" fill="#FACC15" stroke="#FACC15" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-lg md:text-xl text-river-deep tracking-tight leading-none">
                DU-SUP
              </h1>
              <span className="text-[9px] uppercase tracking-wider font-bold text-primary">
                Agidel River
              </span>
            </div>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-semibold text-river-deep hover:text-primary transition-colors">
              Направления
            </a>
            <a href="#tours" className="text-sm font-semibold text-river-deep hover:text-primary transition-colors">
              Сплавы
            </a>
            <a href="#rental" className="text-sm font-semibold text-river-deep hover:text-primary transition-colors">
              Прокат
            </a>
            <a href="#supmaran" className="text-sm font-semibold text-river-deep hover:text-primary transition-colors">
              Сапмараны
            </a>
            <a href="#yoga" className="text-sm font-semibold text-river-deep hover:text-primary transition-colors">
              Йога
            </a>
            <a href="#gift-certificate" className="text-sm font-semibold text-river-deep hover:text-primary transition-colors">
              Сертификаты
            </a>
            <a href="#gallery" className="text-sm font-semibold text-river-deep hover:text-primary transition-colors">
              Галерея
            </a>
            <button
              onClick={() => setCurrentView(currentView === 'landing' ? 'admin' : 'landing')}
              className="text-xs font-bold text-river-deep/70 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ShieldAlert size={12} />
              {currentView === 'landing' ? 'Админ-панель' : 'На сайт'}
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Weather widget */}
            <WeatherWidget />

            {/* Quick booking button - using Accent Yellow */}
            <button
              onClick={() => {
                setPreselectedService(null);
                setIsBookingOpen(true);
              }}
              className="bg-accent text-river-deep hover:bg-accent/90 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.03] cursor-pointer"
            >
              Забронировать
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      {currentView === 'admin' ? (
        <AdminPanel
          bookings={bookings}
          onUpdateStatus={handleUpdateBookingStatus}
          onDeleteBooking={handleDeleteBooking}
          onClose={() => setCurrentView('landing')}
        />
      ) : (
        <>
          {/* HERO SECTION */}
          <header
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
          >
            {/* Cinematic Video Background with cursor parallax */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.div
                className="absolute inset-x-0 -top-[10%] h-[120%]"
                style={{
                  y: yBg,
                  x: springX,
                  translateY: springY,
                  opacity: opacityBg,
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                  ref={videoRef}
                  src="/hero-video.mp4"
                />
              </motion.div>
              {/* Misty calm overlay */}
              <div className="absolute inset-0 hero-mist-overlay" />
              <div className="absolute inset-0 hero-bg-glow" />
            </div>

            {/* Hero content */}
            <div className="relative z-10 text-center px-4 max-w-4xl space-y-8">
              {/* Badge with shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-1.5 badge-shimmer text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest border border-white/20"
              >
                <Waves size={14} className="text-white/70" />
                <span>Сап-сплавы и прокат в Дюртюлях</span>
              </motion.div>

              {/* Main headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-headline font-extrabold text-4xl sm:text-6xl text-white hero-text-shadow tracking-tight leading-[1.1]"
              >
                Почувствуй реку.<br />
                <span className="hero-gradient-text">Стань частью течения.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium"
              >
                Республика Башкортостан, река Агидель. Всё необходимое для незабываемого и безопасного отдыха на воде — в одном месте.
              </motion.p>

              {/* Redesigned CTA buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              >
                {/* Primary CTA — accent yellow */}
                <a
                  href="#tours"
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-river-deep px-8 py-4 rounded-2xl font-extrabold uppercase tracking-wider text-sm transition-all shadow-[0_4px_24px_rgba(250,204,21,0.45)] hover:shadow-[0_6px_32px_rgba(250,204,21,0.65)] hover:scale-105 cursor-pointer"
                >
                  <Waves size={16} className="group-hover:rotate-12 transition-transform" />
                  ВЫБРАТЬ СПЛАВ
                </a>
                {/* Secondary CTA — glassmorphism */}
                <a
                  href="#rental"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 btn-glass text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm hover:scale-105 cursor-pointer"
                >
                  <Anchor size={16} />
                  ПРОКАТ САПБОРДОВ
                </a>
                {/* Tertiary CTA — glassmorphism subtle */}
                <a
                  href="#services"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 btn-glass text-white/80 px-8 py-4 rounded-2xl font-bold uppercase tracking-wider text-sm hover:scale-105 hover:text-white cursor-pointer"
                >
                  <Compass size={16} />
                  ВСЕ УСЛУГИ
                </a>
              </motion.div>

              {/* Live stats row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-6 pt-2"
              >
                {[
                  { label: 'туристов за сезон', value: '500+' },
                  { label: 'маршрутов', value: '5' },
                  { label: 'рейтинг', value: '4.9★' },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span className="text-white font-extrabold text-xl leading-none">{stat.value}</span>
                    <span className="text-white/50 text-[10px] uppercase tracking-widest mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Soft fade into calm white content */}
            <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none h-32 hero-bottom-fade" />

            {/* Scroll Indicator */}
            <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-[3]">
              <span className="text-[10px] text-white/50 font-semibold tracking-widest uppercase">Листайте вниз</span>
              <span className="material-symbols-outlined text-white/60 text-3xl">keyboard_double_arrow_down</span>
            </div>
          </header>

          <div className="midpage-background relative overflow-hidden">
            <div className="river-flow-overlay pointer-events-none absolute inset-0" />
            <WaterParticles />
          {/* ABOUT US SECTION */}
          <section className="py-24 px-4 md:px-16 max-w-7xl mx-auto overflow-hidden" id="about">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="inline-block px-4 py-1.5 bg-river-deep/10 text-river-deep rounded-full font-semibold text-xs uppercase tracking-widest font-label-md">
                  О нас
                </div>
                <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-river-deep leading-tight uppercase">
                  DU-SUP — это ваш выход к воде в Дюртюлях.
                </h2>
                <div className="h-1 w-20 bg-secondary rounded" />
                <p className="text-base md:text-lg text-on-surface-variant leading-relaxed font-medium">
                  Мы объединяем <strong>"Du"</strong> (Дюртюли) и <strong>"Sup"</strong> (стиль жизни на воде). Мы любим нашу реку Агидель (Белую реку) — мягкую, чистую, энергичную, и хотим поделиться этой любовью с вами.
                </p>
                <p className="text-base text-on-surface-variant leading-relaxed">
                  Наши сплавы — это не просто active спорт, это медитация в движении, возможность увидеть родные берега с совершенно нового ракурса и почувствовать настоящую свободу на водной глади.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                  <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                    <AnimatedCounter target={90} suffix="%" />
                    <p className="text-[10px] text-on-surface-variant font-semibold uppercase mt-1">Новичков</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                    <AnimatedCounter target={100} suffix="%" />
                    <p className="text-[10px] text-on-surface-variant font-semibold uppercase mt-1">Безопасно</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                    <AnimatedCounter target={49} suffix="/5★" />
                    <p className="text-[10px] text-on-surface-variant font-semibold uppercase mt-1">Отзывы</p>
                  </div>
                </div>
              </motion.div>

              {/* Styled Image Container */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative lg:ml-6 h-[420px] w-full flex items-center justify-center"
              >
                {/* Wavy lines in the background */}
                <div className="absolute inset-0 -z-10 opacity-30">
                  <svg viewBox="0 0 400 400" className="w-full h-full text-secondary" fill="none">
                    <path d="M 0,200 Q 100,150 200,200 T 400,200" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 0,220 Q 100,170 200,220 T 400,220" stroke="currentColor" strokeWidth="1" />
                    <path d="M 0,240 Q 100,190 200,240 T 400,240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                  </svg>
                </div>

                {/* Overlapping images */}
                {/* Back/smaller sunset image */}
                <div className="absolute left-2 bottom-6 w-[62%] aspect-[4/3] rounded-2xl shadow-lg border-4 border-white overflow-hidden z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO0qpWVt9H6-uoaUw17eqIZA5i_WjuY_bh7x63GxTUqfNhKkq3njJAB10mgGs-RRBVPVTcikxjtP89kIuQkFEvZA7kdwoBhDc7EpSM1UlI6ozk9DiTIiSYb2uR9wFoM6n95rOUgqMThGoRDlWXAAJuZI3KX0zXvr8abpf3tLcI-vOmweoSM26qoPNkRz-ilbbAeXol9lGk3UyDh3kcBRVeTqvR1WdbovscLyIxjJAmhxuNZMjtY-vX-BKOl6DYdjefGNuLjRHp0Jpa"
                    alt="Sunset on Agidel"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Front/larger action image */}
                <div className="absolute right-2 top-6 w-[62%] aspect-[4/3] rounded-2xl shadow-2xl border-4 border-white overflow-hidden z-20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF_JAXxkUkY64HYMQu6Tl1T9f4DKfjdmFcJeSp1Pu0fFS7kxi5ZyGc1r7A74yhU34CmCqwDug2lfcJujowoHgGErS4yKxjzTncna6c3Zgjo8EAvxBhTQJTNglPuLzNF81ZrkihwpFkfvnTXqu2rAGJp6_QEoeJYt9SJ4KU_2ls5a03uUA7kHK9Rtm8TZqiEuuOjLhRt4duQoXgqF0WE9-EKoaY5J-CGRa2r2JAKgGeblco-xnbNlWHEjUnPWZEr_kDdLlXHAh2UJto"
                    alt="Paddleboarding DU-SUP"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* SERVICES NAVIGATOR SECTION */}
          <section className="py-24 bg-surface-container" id="services">
            <div className="px-4 md:px-16 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-2xl mx-auto mb-16 space-y-3"
              >
                <span className="text-xs font-bold text-river-deep/60 uppercase tracking-widest font-mono">SERVICES NAVIGATOR</span>
                <div className="h-[1px] w-24 bg-river-deep/20 mx-auto" />
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep">Выбирай свой формат отдыха</h2>
                <p className="text-on-surface-variant text-base">
                  От медитативной одиночной прогулки до масштабных групповых туров на целый день
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Service Card 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.0 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white p-8 rounded-2xl custom-light-shadow hover:shadow-[0_10px_30px_rgba(0,123,255,0.12)] hover:border-primary/30 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">kayaking</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-river-deep mb-3">Сплавы по Агидели</h3>
                  <p className="text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                    Групповые туры по живописным маршрутам с трансфером и сопровождением.
                  </p>
                  <a href="#tours" className="border-2 border-primary text-primary font-bold text-xs uppercase tracking-wider py-2 px-8 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer">
                    Выбрать
                  </a>
                </motion.div>

                {/* Service Card 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white p-8 rounded-2xl custom-light-shadow hover:shadow-[0_10px_30px_rgba(0,123,255,0.12)] hover:border-primary/30 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-sky-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">surfing</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-river-deep mb-3">Прокат сапбордов</h3>
                  <p className="text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                    Почасовая и полупочасовая аренда качественных досок на пляже «Котлован».
                  </p>
                  <a href="#rental" className="border-2 border-primary text-primary font-bold text-xs uppercase tracking-wider py-2 px-8 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer">
                    Выбрать
                  </a>
                </motion.div>

                {/* Service Card 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white p-8 rounded-2xl custom-light-shadow hover:shadow-[0_10px_30px_rgba(0,123,255,0.12)] hover:border-primary/30 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">sailing</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-river-deep mb-3">Семейные Сапмараны</h3>
                  <p className="text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                    Гибрид катамарана и сапа. Максимально устойчив и безопасен для детей.
                  </p>
                  <a href="#supmaran" className="border-2 border-primary text-primary font-bold text-xs uppercase tracking-wider py-2 px-8 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer">
                    Выбрать
                  </a>
                </motion.div>

                {/* Service Card 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white p-8 rounded-2xl custom-light-shadow hover:shadow-[0_10px_30px_rgba(0,123,255,0.12)] hover:border-primary/30 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">self_improvement</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-river-deep mb-3">Йога на воде</h3>
                  <p className="text-sm text-on-surface-variant mb-6 flex-grow leading-relaxed">
                    Утренние и вечерние практики баланса и гармонии совместно с DilyaYoga.
                  </p>
                  <a href="#yoga" className="border-2 border-purple-500 text-purple-500 font-bold text-xs uppercase tracking-wider py-2 px-8 rounded-full hover:bg-purple-500 hover:text-white transition-all cursor-pointer">
                    Выбрать
                  </a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* TOURS SECTION */}
          <section className="py-24 px-4 md:px-16 max-w-7xl mx-auto" id="tours">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
            >
              <div>
                <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-label-md">Групповые Туры</span>
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep mt-1">Сплавы по Агидели</h2>
                <div className="h-1 w-20 bg-secondary rounded mt-3" />
              </div>
              <p className="text-on-surface-variant text-sm md:text-base max-w-md">
                Все туры проводятся в сопровождении квалифицированных гидов. В стоимость входит прокат оборудования, спасжилеты и трансфер.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {TOURS.map((tour, idx) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-outline-variant/20 flex flex-col justify-between group hover:shadow-xl transition-shadow"
                >
                  <div className="relative overflow-hidden h-64 sm:h-80">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${tour.imageUrl})` }}
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                      <Compass size={12} />
                      <span>{tour.distance}</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                      {tour.duration}
                    </div>
                  </div>

                  <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-headline font-extrabold text-xl sm:text-2xl text-river-deep">
                          {tour.title}
                        </h3>
                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-secondary whitespace-nowrap">
                            {tour.price} ₽
                          </p>
                          <span className="text-[10px] text-on-surface-variant/70 font-semibold uppercase">С человека</span>
                        </div>
                      </div>

                      <p className="text-sm text-on-surface-variant italic leading-relaxed">
                        {tour.description}
                      </p>

                      <div className="space-y-2.5 pt-2">
                        {tour.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-secondary text-sm flex-shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span className="leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => openBookingModal('tour', tour.id)}
                      className="w-full bg-primary hover:bg-secondary text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-sm cursor-pointer"
                    >
                      ЗАБРОНИРОВАТЬ ТУР
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* INTERACTIVE ROUTE MAP */}
          <InteractiveRouteMap onBook={openBookingModal} />

          {/* QUIZ SECTION COMPONENT */}
          <QuizSection onApplyPromo={handleApplyPromo} onSelectTour={(tourId) => openBookingModal('tour', tourId)} />

          {/* RENTAL SECTION */}
          <section className="py-24 px-4 md:px-16 max-w-7xl mx-auto overflow-hidden" id="rental">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Grid Images */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="grid grid-cols-2 gap-4"
              >
                <div
                  className="aspect-square bg-cover bg-center rounded-2xl shadow-md border border-outline-variant/10"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6w9Q2pYocqqF-H2Y5HpKm45gl29Md5Dl6TB3-Zmkj9giiWnaa0570UeVdpMvZ2qe96HpIP3UJYF9CjijVkagtb0mhB9rf8RLPrSTusz6_52mjNIGSOZNT2XbSsA0Ee_C8dEX5wulVCYgecWolp8L37NBjlGsExl1GiD5YxuGJzwor6gerA6Dj_13kbkz8I6LNT2SVQstcTj7TGddmkrjCLeJ5d4JqkKnr0ztEjHpWFEXFFxEB-xsAdp4kaKeDz3q6K0AWWb-5ziX6')`
                  }}
                />
                <div
                  className="aspect-[3/4] bg-cover bg-center rounded-2xl shadow-md border border-outline-variant/10 mt-8"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBD3hGxKdJZJ_OrCaRLnw-XQ_TNVTTu5N883nQAx66zJh782SXofGfykb-OJGOymPC6gJXgfNLxWDkC73z2wt289FQ12jTkaX_RAyy9AeDXmlVWJvFuB7crjYERFWj7maauz2qXTJbVicOjnE7pXfln-c6BOGSFPcSIZqHU0rjHj4jVWL9EVTzP-KwTEGLDmxV6slobp9D9lUTJSvsb2jTR94iZI8-f9jqR72NUSelCh8PGrFd0ear2FZp9xzCb-9p3ppsKT203M5FG')`
                  }}
                />
              </motion.div>

              {/* Right Column: Pricing Content */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full font-semibold text-xs uppercase tracking-widest font-label-md">
                    ЛОКАЦИЯ: ПЛЯЖ «КОТЛОВАН»
                  </div>
                  <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep">
                    Почасовой прокат сапбордов
                  </h2>
                  <div className="h-1 w-20 bg-secondary rounded" />
                </div>

                <p className="text-base text-on-surface-variant leading-relaxed">
                  Идеальный вариант для тех, кто хочет освежиться после тяжелого рабочего дня, устроить незабываемое свидание или просто насладиться спокойной водой в черте города. Работаем ежедневно на городском пляже Дюртюлей.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-xl border-l-4 border-secondary shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-label-md">30 минут</p>
                    <p className="text-2xl font-extrabold text-river-deep mt-1">300 ₽</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border-l-4 border-secondary shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-label-md">1 час</p>
                    <p className="text-2xl font-extrabold text-river-deep mt-1">500 ₽</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => openBookingModal('rental', 'sup_rental')}
                    className="flex-1 bg-primary hover:bg-opacity-95 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar size={16} />
                    Забронировать заранее
                  </button>
                  <a
                    href="https://wa.me/79000000000"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    СВЯЗАТЬСЯ В WHATSAPP
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* SUPMARAN SECTION */}
          <section className="py-24 bg-primary text-white overflow-hidden" id="supmaran">
            <div className="px-4 md:px-16 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                 <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="inline-block px-3 py-1 bg-accent text-river-deep text-[10px] font-bold uppercase tracking-wider rounded-md">
                    ТОЛЬКО У НАС В DU-SUP
                  </div>
                  <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                    Сапмаран — лучший семейный выбор
                  </h2>
                  <p className="text-base text-white/85 leading-relaxed">
                    Уникальный устойчивый гибрид, объединяющий поперечную стабильность катамарана и маневренность сапборда. Практически невозможно перевернуть! Идеально подходит для прогулок с маленькими детьми и теми, кто пока боится упасть в воду.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-secondary">
                        <Users size={16} />
                      </div>
                      <span className="text-sm font-medium">Комфортная вместимость: 2 взрослых + 2 ребенка</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-secondary">
                        <Anchor size={16} />
                      </div>
                      <span className="text-sm font-medium">Сверхпрочная конструкция и повышенная остойчивость</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-sm">payments</span>
                      </div>
                      <span className="text-sm font-medium">Стоимость проката: 1000 ₽ / 30 мин  •  2000 ₽ / 1 час</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => openBookingModal('rental', 'supmaran_rental')}
                    className="bg-accent hover:bg-yellow-400 text-river-deep px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    ХОЧУ ПОПРОБОВАТЬ!
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="relative"
                >
                  <div
                    className="aspect-video bg-cover bg-center rounded-2xl shadow-2xl transform rotate-1 border-4 border-white/10"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAj660e83wBMWkT60pVrbr7Rvpel67luDmMPVzhoZ7ikgldk6hzpkyLKLXWWA0TTo7KHDAPnBmHe_S6di7AhwGcYa52rJeT0xDPMeKT8dy7v-39N_ZNqZUA-IGW484qyqBTrKVStKsSAdUaQM8Q-1FdPLL_iN7Pn65hG3LbEh3Jf8Xfdl2yBkoGO0FtbJsfaPVy3FK0m5mRp7SY1WSzWYc_X8uXEbJUwnJpSPjzZXCtTG1aPqsDeuwUEr56IVMbpw3OmpDRi0bdglpT')`
                    }}
                  />
                  <div className="absolute -bottom-6 -left-6 bg-accent text-river-deep p-5 rounded-2xl shadow-xl hidden md:block border border-white/10">
                    <p className="font-headline font-bold text-lg leading-none">NEW 2026</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-80">Хит сезона</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* YOGA SECTION */}
          <section className="py-24 px-4 md:px-16 max-w-7xl mx-auto overflow-hidden" id="yoga">
            <div className="bg-sand-bleached/30 rounded-[32px] p-8 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[350px]">spa</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="aspect-square bg-cover bg-center rounded-full border-8 border-white shadow-xl max-w-md mx-auto w-full"
                  style={{
                    backgroundImage: `url('/yoga.png')`
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-[1px] bg-river-deep" />
                    <span className="font-semibold text-xs uppercase tracking-widest text-river-deep font-label-md">
                      КОЛЛАБОРАЦИЯ С DILYAYOGA
                    </span>
                  </div>

                  <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep leading-tight">
                    Йога на воде: Гармония и баланс
                  </h2>

                  <p className="text-base text-on-surface-variant leading-relaxed">
                    Откройте для себя новый уровень духовной и физической практики. Балансирование на доске во время йоги задействует глубокие мышцы-стабилизаторы, а мягкое покачивание и шелест волн помогают отпустить все мысли и войти в состояние глубокого покоя.
                  </p>

                  <div className="p-5 bg-white rounded-2xl border border-outline-variant/30 shadow-sm text-sm text-on-surface-variant italic relative">
                    "Это лучший способ отключиться от внешней суеты, соединиться с природой Башкирии и глубоко прочувствовать возможности своего тела."
                    <span className="block font-bold text-xs text-river-deep font-label-md not-italic mt-2">
                      — Диля, сертифицированный инструктор по сап-йоге
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => openBookingModal('yoga', 'yoga_water')}
                      className="bg-primary hover:bg-secondary text-white px-6 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer"
                    >
                      ЗАПИСАТЬСЯ НА ЙОГУ
                    </button>
                    <a
                      href="https://vk.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all cursor-pointer"
                    >
                      Группа в VK
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section className="py-24 bg-surface-container" id="how-it-works">
            <div className="px-4 md:px-16 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-xl mx-auto mb-16 space-y-3"
              >
                <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-label-md">Просто и надежно</span>
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep">Как устроен ваш отдых</h2>
                <div className="h-1 w-20 bg-secondary rounded mx-auto" />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Visual Connector line */}
                <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-outline-variant/40 -z-10" />

                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.0 }}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-white text-secondary rounded-full shadow-md flex items-center justify-center font-headline font-bold text-xl border-4 border-background">
                    1
                  </div>
                  <h4 className="font-headline font-bold text-base text-river-deep">Выбор и заявка</h4>
                  <p className="text-xs text-on-surface-variant max-w-[200px] leading-relaxed">
                    Выберите сплав или время проката на сайте и заполните простую форму бронирования.
                  </p>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-white text-secondary rounded-full shadow-md flex items-center justify-center font-headline font-bold text-xl border-4 border-background">
                    2
                  </div>
                  <h4 className="font-headline font-bold text-base text-river-deep">Подтверждение</h4>
                  <p className="text-xs text-on-surface-variant max-w-[200px] leading-relaxed">
                    Администратор мгновенно свяжется с вами для резервации и вышлет всю полезную информацию.
                  </p>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-white text-secondary rounded-full shadow-md flex items-center justify-center font-headline font-bold text-xl border-4 border-background">
                    3
                  </div>
                  <h4 className="font-headline font-bold text-base text-river-deep">Инструктаж и старт</h4>
                  <p className="text-xs text-on-surface-variant max-w-[200px] leading-relaxed">
                    Встречаемся на базе, подбираем жилет по размеру, проходим разминку и выходим на воду.
                  </p>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-white text-secondary rounded-full shadow-md flex items-center justify-center font-headline font-bold text-xl border-4 border-background">
                    4
                  </div>
                  <h4 className="font-headline font-bold text-base text-river-deep">Кайф и фото</h4>
                  <p className="text-xs text-on-surface-variant max-w-[200px] leading-relaxed">
                    Наслаждайтесь течением! Мы запечатлим лучшие моменты вашего дня на профессиональных снимках.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE MEDIA GALLERY */}
          <GalleryViewer />

          {/* PRICING TABLE SUMMARY */}
          <section className="py-24 px-4 md:px-16 max-w-7xl mx-auto bg-white border-t border-outline-variant/20" id="pricing">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto mb-16 space-y-3"
            >
              <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-label-md">Прозрачные тарифы</span>
              <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep">Стоимость услуг</h2>
              <div className="h-1 w-20 bg-secondary rounded mx-auto" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-background rounded-2xl overflow-hidden border border-outline-variant/30 max-w-4xl mx-auto shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-river-deep text-white font-headline text-xs uppercase tracking-wider">
                      <th className="p-5">Категория / Услуга</th>
                      <th className="p-5">Длительность</th>
                      <th className="p-5 text-right">Стоимость</th>
                      <th className="p-5 text-center">Запись</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="p-5 font-bold text-river-deep">Прокат сапборда на пляже</td>
                      <td className="p-5 text-on-surface-variant font-medium">30 минут</td>
                      <td className="p-5 text-right font-extrabold text-secondary">300 ₽</td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => openBookingModal('rental', 'sup_rental')}
                          className="bg-primary hover:bg-secondary text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="p-5 font-bold text-river-deep">Прокат сапборда на пляже</td>
                      <td className="p-5 text-on-surface-variant font-medium">1 час</td>
                      <td className="p-5 text-right font-extrabold text-secondary">500 ₽</td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => openBookingModal('rental', 'sup_rental')}
                          className="bg-primary hover:bg-secondary text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="p-5 font-bold text-river-deep">Сапмаран семейный</td>
                      <td className="p-5 text-on-surface-variant font-medium">30 минут</td>
                      <td className="p-5 text-right font-extrabold text-secondary">1000 ₽</td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => openBookingModal('rental', 'supmaran_rental')}
                          className="bg-primary hover:bg-secondary text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="p-5 font-bold text-river-deep">Сапмаран семейный</td>
                      <td className="p-5 text-on-surface-variant font-medium">1 час</td>
                      <td className="p-5 text-right font-extrabold text-secondary">2000 ₽</td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => openBookingModal('rental', 'supmaran_rental')}
                          className="bg-primary hover:bg-secondary text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                      <td className="p-5 font-bold text-river-deep">Йога на воде (DilyaYoga)</td>
                      <td className="p-5 text-on-surface-variant font-medium">1.5 часа</td>
                      <td className="p-5 text-right font-extrabold text-secondary">800 ₽</td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => openBookingModal('yoga', 'yoga_water')}
                          className="bg-primary hover:bg-secondary text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="p-5 font-bold text-river-deep">Групповые сплавы по Агидели</td>
                      <td className="p-5 text-on-surface-variant font-medium">4-5 часов</td>
                      <td className="p-5 text-right font-extrabold text-secondary">2000 ₽</td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => openBookingModal('tour', 'gusinka')}
                          className="bg-primary hover:bg-secondary text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          Book
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto flex items-center gap-2 mt-4 text-xs text-on-surface-variant font-medium px-4"
            >
              <Info size={14} className="text-secondary" />
              <span>Все цены включают в себя спасательные жилеты, весло, лиш и краткий курс безопасности перед заездом.</span>
            </motion.div>
          </section>

          {/* GIFT CERTIFICATE SECTION */}
          <section className="py-24 px-4 md:px-16 max-w-7xl mx-auto overflow-hidden" id="gift-certificate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Image / Visual */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-secondary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-[200px]">redeem</span>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-3xl text-river-deep">card_giftcard</span>
                    </div>
                    <h3 className="font-headline font-extrabold text-2xl text-river-deep">
                      Подарочный сертификат DU-SUP
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Идеальный подарок для тех, кто любит приключения. Подарите незабываемые эмоции на воде!
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Действует 3 месяца
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Любая услуга
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Pricing & Options */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="inline-block px-4 py-1 bg-accent/20 text-river-deep rounded-full font-semibold text-xs uppercase tracking-widest font-label-md">
                    ПОДАРОК, КОТОРЫЙ ЗАПОМИНАЕТСЯ
                  </div>
                  <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep">
                    Подарочный сертификат
                  </h2>
                  <div className="h-1 w-20 bg-accent rounded" />
                </div>

                <p className="text-base text-on-surface-variant leading-relaxed">
                  Подарите близким возможность почувствовать реку. Сертификат действителен на любую из наших услуг — сплавы, прокат, йогу или сапмаран.
                </p>

                {/* Amount options */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-river-deep uppercase tracking-wider">На сумму:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="bg-white p-4 rounded-xl border-2 border-outline-variant/30 hover:border-accent hover:shadow-lg transition-all text-center group cursor-pointer">
                      <p className="text-2xl font-extrabold text-river-deep group-hover:text-accent transition-colors">1000 ₽</p>
                      <p className="text-[10px] text-on-surface-variant font-semibold uppercase mt-1">Прокат</p>
                    </button>
                    <button className="bg-white p-4 rounded-xl border-2 border-accent shadow-md text-center group cursor-pointer">
                      <p className="text-2xl font-extrabold text-accent">2000 ₽</p>
                      <p className="text-[10px] text-river-deep font-bold uppercase mt-1">Популярный</p>
                    </button>
                    <button className="bg-white p-4 rounded-xl border-2 border-outline-variant/30 hover:border-accent hover:shadow-lg transition-all text-center group cursor-pointer">
                      <p className="text-2xl font-extrabold text-river-deep group-hover:text-accent transition-colors">3000 ₽</p>
                      <p className="text-[10px] text-on-surface-variant font-semibold uppercase mt-1">Сплав</p>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => {
                      setPreselectedService(null);
                      setIsBookingOpen(true);
                    }}
                    className="flex-1 bg-accent hover:bg-yellow-400 text-river-deep py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">shopping_cart</span>
                    КУПИТЬ СЕРТИФИКАТ
                  </button>
                  <a
                    href="https://wa.me/79000000000"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    УТОЧНИТЬ В WHATSAPP
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQS & TESTIMONIALS */}
          <FAQSection />

          {/* SAFETY RULES SECTION */}
          <section className="py-24 bg-gradient-to-b from-white to-[#F5F7F5] px-4 md:px-16 overflow-hidden animate-fade-in" id="safety">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-3xl mx-auto mb-16 space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full font-semibold text-xs uppercase tracking-widest font-label-md">
                  <ShieldCheck size={14} className="text-primary animate-pulse" />
                  Безопасность на воде
                </div>
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep">
                  Правила Безопасности DU-SUP
                </h2>
                <div className="h-1 w-20 bg-secondary rounded mx-auto" />
                <p className="text-on-surface-variant text-sm md:text-base">
                  Мы заботимся о том, чтобы ваш отдых на воде в Дюртюлях был не только ярким и незабываемым, но и на 100% безопасным. Все участники проходят обязательный инструктаж.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Rule 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.0 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-outline-variant/15 flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <LifeBuoy size={24} />
                    </div>
                    <h3 className="font-headline font-bold text-lg text-river-deep">Спасательный жилет</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Выдается абсолютно бесплатно каждому гостю. Жилет должен быть застегнут и отрегулирован по фигуре на протяжении всего времени нахождения на воде.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Обязательно для всех
                  </div>
                </motion.div>

                {/* Rule 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-outline-variant/15 flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                      <Waves size={24} />
                    </div>
                    <h3 className="font-headline font-bold text-lg text-river-deep">Страховочный лиш</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Витой или прямой лиш крепится к вашей ноге и сапборду. В случае падения в воду доска не уплывет по течению Агидели и всегда послужит вам надежным плавсредством.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Крепится на голень
                  </div>
                </motion.div>

                {/* Rule 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-outline-variant/15 flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-sky-500/10 text-sky-600 rounded-xl flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                      <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-headline font-bold text-lg text-river-deep">Погодный контроль</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Мы тщательно мониторим погодные условия и скорость ветра. При сильном ветре (более 7 м/с), грозе или сильном тумане выходы на воду приостанавливаются или переносятся.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center gap-2 text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    Проверка прогноза
                  </div>
                </motion.div>

                {/* Rule 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-outline-variant/15 flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                      <Users size={24} />
                    </div>
                    <h3 className="font-headline font-bold text-lg text-river-deep">Инструктаж и гиды</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Каждый сплав проходит под контролем квалифицированных сертифицированных инструкторов. Новичков обучаем базовой технике гребли на месте.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center gap-2 text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Сопровождение
                  </div>
                </motion.div>
              </div>

              {/* Quick Warning / Trust Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12 bg-river-deep text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Anchor size={22} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-base md:text-lg">Есть вопросы по правилам или хотите уточнить детали?</h4>
                    <p className="text-xs text-white/70 mt-1">Наши менеджеры всегда на связи и ответят на любые вопросы по безопасности вашего маршрута.</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/79000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-accent hover:bg-yellow-400 text-river-deep px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shrink-0 transition-transform hover:scale-[1.02] text-center"
                >
                  ЗАДАТЬ ВОПРОС
                </a>
              </motion.div>
            </div>
          </section>
          </div>

          {/* FOOTER */}
          <footer className="relative text-mist-white py-16 overflow-hidden">
            {/* Background video */}
            <video
              autoPlay
              muted
              playsInline
              ref={footerVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/footer-video.mp4"
              onEnded={() => setFooterVideoEnded(true)}
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/55" />
            {/* Content — either footer columns or ending overlay */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {showEnding ? (
                  <motion.div
                    key="ending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="w-24 h-24 mb-8"
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" rx="24" fill="#088395" />
                        <path d="M20 62 C 35 69, 45 55, 60 62 C 75 69, 80 62, 80 62" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20 76 C 35 83, 45 69, 60 76 C 75 83, 80 76, 80 76" stroke="white" strokeWidth="4.5" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M42 22 C 42 16, 58 16, 58 22 L 52 58 C 52 61, 48 61, 48 58 Z" fill="#FACC15" />
                        <line x1="30" y1="24" x2="70" y2="54" stroke="#FACC15" strokeWidth="4" strokeLinecap="round" />
                        <path d="M68 52 L 74 61 C 76 63, 72 66, 69 64 L 64 56 Z" fill="#FACC15" stroke="#FACC15" strokeWidth="1" />
                      </svg>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >
                      <h3 className="font-headline font-extrabold text-5xl md:text-6xl text-white tracking-tight mb-2">
                        DU-SUP
                      </h3>
                      <p className="text-sm md:text-base uppercase tracking-[0.35em] text-white/50 font-semibold mb-8">
                        Agidel River
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent mb-8"
                    />
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.0 }}
                      className="text-xl md:text-2xl text-white/80 font-medium italic max-w-lg leading-relaxed"
                    >
                      Почувствуй реку. Стань частью течения.
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="columns"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-4 md:px-16 max-w-7xl mx-auto">
                      {/* Col 1 */}
                      <div className="space-y-4">
                        <div className="font-headline font-extrabold text-2xl text-secondary">DU-SUP</div>
                        <p className="text-sm text-mist-white/70 leading-relaxed">
                          Ваш надежный проводник в мир водных прогулок и захватывающих сплавов по Белой реке в Дюртюлях. Дарим эмоции и гарантируем безопасность.
                        </p>
                        <div className="flex gap-4 pt-2">
                          <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors text-white">
                            <span className="material-symbols-outlined text-sm">public</span>
                          </a>
                          <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors text-white">
                            <span className="material-symbols-outlined text-sm">chat</span>
                          </a>
                          <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors text-white">
                            <span className="material-symbols-outlined text-sm">alternate_email</span>
                          </a>
                        </div>
                      </div>

                      {/* Col 2 */}
                      <div className="space-y-4">
                        <h5 className="font-headline font-bold text-base text-secondary">Навигация</h5>
                        <ul className="space-y-2.5 text-sm text-mist-white/80">
                          <li><a href="#services" className="hover:text-white transition-colors">Наши услуги</a></li>
                          <li><a href="#tours" className="hover:text-white transition-colors">Сплавы по Агидели</a></li>
                          <li><a href="#rental" className="hover:text-white transition-colors">Прокат оборудования</a></li>
                          <li><a href="#yoga" className="hover:text-white transition-colors">Йога на воде</a></li>
                        </ul>
                      </div>

                      {/* Col 3 */}
                      <div className="space-y-4">
                        <h5 className="font-headline font-bold text-base text-secondary">Полезное</h5>
                        <ul className="space-y-2.5 text-sm text-mist-white/80">
                          <li><a href="#about" className="hover:text-white transition-colors">О нас</a></li>
                          <li><a href="#faq" className="hover:text-white transition-colors">Вопросы и ответы</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Правила безопасности на воде</a></li>
                        </ul>
                      </div>

                      {/* Col 4 */}
                      <div className="space-y-4">
                        <h5 className="font-headline font-bold text-base text-secondary">Контакты</h5>
                        <p className="text-sm text-mist-white/80 leading-relaxed">
                          Республика Башкортостан, г. Дюртюли, Городской пляж «Котлован»
                        </p>
                        <div className="pt-2 text-lg font-bold text-white">+7 (900) 000-00-00</div>
                        <a
                          href="https://wa.me/79000000000"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full bg-accent hover:bg-yellow-400 text-river-deep text-center py-3 rounded-lg font-bold text-xs uppercase tracking-wider block transition-transform hover:scale-[1.01] cursor-pointer"
                        >
                          Связаться в WhatsApp
                        </a>
                      </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 text-center text-xs text-mist-white/40">
                      © 2026 DU-SUP Agidel River Adventures. В партнерстве с DilyaYoga. Все права защищены.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </footer>
        </>
      )}

      {/* FLOATING BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="back-to-top-btn"
            initial={{ opacity: 0, y: 25, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.85 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHoveredBackToTop(true)}
            onMouseLeave={() => setIsHoveredBackToTop(false)}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-secondary text-white shadow-2xl hover:shadow-primary/35 rounded-full px-4 py-3 sm:px-5 sm:py-3.5 flex items-center gap-2 group cursor-pointer border border-white/10 transition-colors duration-300 font-sans"
            aria-label="Наверх"
          >
            <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {isHoveredBackToTop ? (
                  <motion.div
                    key="rocket-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center text-white"
                  >
                    <Rocket size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="arrow-icon"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex items-center justify-center text-white"
                  >
                    <ArrowUp size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest font-mono">
              Наверх
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* RENTAL / TOUR BOOKING MODAL */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={handleCreateBooking}
        preselectedService={preselectedService}
        initialPromo={appliedPromo}
        initialDiscount={appliedDiscount}
      />
    </div>
  );
}
