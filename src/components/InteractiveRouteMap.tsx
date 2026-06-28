/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  MapPin,
  Clock,
  Compass as CompassIcon,
  Tent,
  Anchor,
  Trees,
  Flag,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  Info,
  Layers,
  ArrowRight,
  Droplet,
  Eye,
  Camera,
  Coffee,
  Waves
} from 'lucide-react';

// Define Route interfaces
interface Waypoint {
  id: string;
  name: string;
  distance: string;
  timeOffset: string;
  description: string;
  x: number;
  y: number;
  iconType: 'start' | 'camp' | 'scenery' | 'bridge' | 'finish' | 'beach' | 'yoga';
  activity: string;
}

interface RouteData {
  id: string;
  title: string;
  distance: string;
  duration: string;
  difficulty: 'Для всех' | 'Средний' | 'Расслабленный';
  difficultyColor: string;
  description: string;
  fullPath: string; // SVG path
  animationPoints: { x: number; y: number }[];
  waypoints: Waypoint[];
  accentColor: string;
  bgColor: string;
  packingList: string[];
}

const ROUTES: Record<string, RouteData> = {
  gusinka: {
    id: 'gusinka',
    title: 'Маршрут «Туринка»',
    distance: '20 км',
    duration: '4-5 часов',
    difficulty: 'Для всех',
    difficultyColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    description: 'Увлекательное и медитативное путешествие по верхнему течению Агидели. Проходит через густые прибрежные леса с остановкой на знаменитом диком острове «Туринка», где гнездятся дикие птицы.',
    fullPath: 'M 50,120 C 120,90 180,100 230,150 C 290,170 340,150 400,120 C 460,130 520,160 590,200 C 640,230 670,250 670,270',
    animationPoints: [
      { x: 50, y: 120 },
      { x: 85, y: 105 },
      { x: 120, y: 95 },
      { x: 155, y: 98 },
      { x: 190, y: 110 },
      { x: 220, y: 135 },
      { x: 250, y: 155 },
      { x: 280, y: 165 },
      { x: 310, y: 160 },
      { x: 340, y: 150 }, // Island
      { x: 370, y: 135 },
      { x: 400, y: 125 },
      { x: 430, y: 125 },
      { x: 460, y: 130 },
      { x: 490, y: 145 },
      { x: 520, y: 160 },
      { x: 555, y: 180 },
      { x: 590, y: 200 }, // Bridge
      { x: 620, y: 215 },
      { x: 645, y: 235 },
      { x: 660, y: 255 },
      { x: 670, y: 270 }  // Finish Beach
    ],
    accentColor: '#FF6B35', // Orange
    bgColor: 'bg-[#FFF8F5]',
    packingList: ['Солнцезащитный крем', 'Головной убор', 'Бутылка воды 1л', 'Запасной комплект сухой одежды'],
    waypoints: [
      {
        id: 'g-start',
        name: 'Старт: с. Старый Артаул',
        distance: '0 км',
        timeOffset: '0:00',
        description: 'Сбор группы, выдача снаряжения, сухой инструктаж по безопасности и обучение базовым гребкам.',
        x: 50,
        y: 120,
        iconType: 'start',
        activity: 'Подбор жилетов и регулировка весел'
      },
      {
        id: 'g-island',
        name: 'Остров «Туринка»',
        distance: '10 км',
        timeOffset: '2:00',
        description: 'Необитаемый зеленый остров посреди реки. Делаем часовую остановку на обед: походный чай из самовара на травах, фирменные сэндвичи и отдых на песчаной косе.',
        x: 340,
        y: 150,
        iconType: 'camp',
        activity: 'Горячий обед, чай из самовара и купание'
      },
      {
        id: 'g-forest',
        name: 'Залив Курья и Дикий лес',
        distance: '15 км',
        timeOffset: '3:30',
        description: 'Участок реки с тихим, спокойным течением и зеркальной водой. Здесь раскинулась пойма с вековыми дубами и гнездовьями серых цапель.',
        x: 490,
        y: 145,
        iconType: 'scenery',
        activity: 'Наблюдение за цаплями и красивые фото на зеркальной воде'
      },
      {
        id: 'g-finish',
        name: 'Финиш: Пляж «Котлован»',
        distance: '20 км',
        timeOffset: '4:30',
        description: 'Причаливание у городского пляжа в Дюртюлях. Сбор снаряжения, финальное групповое фото и обратный трансфер в город.',
        x: 670,
        y: 270,
        iconType: 'finish',
        activity: 'Сладкий арбуз на финише и получение фотоархива'
      }
    ]
  },
  golden_sands: {
    id: 'golden_sands',
    title: 'Маршрут «Золотые пески»',
    distance: '22 км',
    duration: '4-5 часов',
    difficulty: 'Средний',
    difficultyColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    description: 'Динамичный и панорамный маршрут. Проплывем под монументальным Дюртюлинским мостом, минуем городской пляж и направимся к невероятным песчаным дюнам «Золотых песков».',
    fullPath: 'M 460,100 C 520,120 590,200 640,230 C 680,260 690,320 650,360 C 590,390 480,410 380,415',
    animationPoints: [
      { x: 460, y: 100 },
      { x: 490, y: 110 },
      { x: 520, y: 120 },
      { x: 555, y: 155 },
      { x: 590, y: 200 }, // Bridge
      { x: 620, y: 215 },
      { x: 640, y: 230 },
      { x: 660, y: 250 },
      { x: 675, y: 270 }, // Kotlovan Beach
      { x: 685, y: 295 },
      { x: 680, y: 320 },
      { x: 665, y: 345 },
      { x: 645, y: 365 }, // High cliffs
      { x: 615, y: 378 },
      { x: 580, y: 390 },
      { x: 545, y: 398 },
      { x: 510, y: 405 },
      { x: 475, y: 410 },
      { x: 440, y: 412 },
      { x: 410, y: 414 },
      { x: 380, y: 415 }  // Golden Sands Finish
    ],
    accentColor: '#FF6B35',
    bgColor: 'bg-[#FFFBF5]',
    packingList: ['Солнцезащитные очки с ремешком', 'Ветровка (на случай ветра)', 'Сменный комплект одежды', 'Бутылка воды 1л'],
    waypoints: [
      {
        id: 's-start',
        name: 'Старт: с. Иванаево',
        distance: '0 км',
        timeOffset: '0:00',
        description: 'Точка старта на песчаном пологом берегу. Инструктаж по правильной технике гребли стоя и разминка.',
        x: 460,
        y: 100,
        iconType: 'start',
        activity: 'Разминка, сухой инструктаж и выход на воду'
      },
      {
        id: 's-bridge',
        name: 'Дюртюлинский Мост',
        distance: '5 км',
        timeOffset: '1:00',
        description: 'Величественный мост через Агидель. Проход под его опорами дарит незабываемые эмоции и отличную акустику для песен!',
        x: 590,
        y: 200,
        iconType: 'bridge',
        activity: 'Фотосессия с нижнего ракурса под гигантскими арками моста'
      },
      {
        id: 's-transit',
        name: 'Пляж «Котлован»',
        distance: '12 км',
        timeOffset: '2:30',
        description: 'Транзитная точка. Проходим вдоль городского пляжа, приветствуем зрителей с воды и устраиваем короткий технический перерыв.',
        x: 675,
        y: 270,
        iconType: 'beach',
        activity: 'Пить чай и восстановить силы'
      },
      {
        id: 's-cliffs',
        name: 'Высокие кручи Агидели',
        distance: '18 км',
        timeOffset: '3:45',
        description: 'Потрясающие ландшафты с высокими крутыми берегами красной глины и известняка. Место силы с захватывающими дух панорамами.',
        x: 645,
        y: 365,
        iconType: 'scenery',
        activity: 'Панорамные снимки берегов с высоты сапборда'
      },
      {
        id: 's-finish',
        name: 'Финиш: «Золотые пески»',
        distance: '22 км',
        timeOffset: '4:45',
        description: 'Легендарный дикий пляж с чистейшим золотистым песком и мелководьем. Отдыхаем, загораем на теплых дюнах и уезжаем на трансфере.',
        x: 380,
        y: 415,
        iconType: 'finish',
        activity: 'Отдых на пляже, пикник у костра и трансфер назад'
      }
    ]
  },
  kotlovan: {
    id: 'kotlovan',
    title: 'Зона проката: Пляж «Котлован»',
    distance: 'Локальный',
    duration: '30 мин - 1.5 ч',
    difficulty: 'Расслабленный',
    difficultyColor: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    description: 'Спокойная, тихая закрытая акватория городского пляжа «Котлован» в Дюртюлях. Идеально для катания на сапбордах, семейных сапмаранах и проведения утренних практик йоги на воде.',
    fullPath: 'M 670,270 A 30,30 0 1,1 669.9,270 Z',
    animationPoints: [
      { x: 670, y: 270 },
      { x: 685, y: 255 },
      { x: 700, y: 270 },
      { x: 685, y: 285 },
      { x: 670, y: 270 }
    ],
    accentColor: '#38BDF8',
    bgColor: 'bg-[#F0F9FF]',
    packingList: ['Купальник / плавки', 'Полотенце', 'Солнцезащитные очки', 'Хорошее настроение!'],
    waypoints: [
      {
        id: 'k-center',
        name: 'Станция DU-SUP Котлован',
        distance: '0 км',
        timeOffset: '0:00',
        description: 'Наша уютная пляжная станция. Здесь вы можете взять в аренду сапборды и сверх-устойчивые сапмараны, а также записаться на йогу.',
        x: 670,
        y: 270,
        iconType: 'beach',
        activity: 'Оформление проката, примерка жилетов, инструктаж'
      },
      {
        id: 'k-yoga',
        name: 'Зона SUP-йоги DilyaYoga',
        distance: 'Водный класс',
        timeOffset: 'Вс/Сб 8:00',
        description: 'Участок тихой глади воды, защищенный от ветра, где проходят расслабляющие занятия йогой на воде под руководством Дили.',
        x: 710,
        y: 290,
        iconType: 'yoga',
        activity: 'Практики асан, медитация на воде и дыхание'
      }
    ]
  }
};

export default function InteractiveRouteMap({ onBook }: { onBook: (type: 'tour' | 'rental' | 'yoga', id: string) => void }) {
  const [activeRouteId, setActiveRouteId] = useState<string>('gusinka');
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  
  // Simulation states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simIndex, setSimIndex] = useState<number>(0);
  const [simProgress, setSimProgress] = useState<number>(0);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  const activeRoute = ROUTES[activeRouteId];

  // Reset simulation when route changes
  useEffect(() => {
    stopSimulation();
    setSimIndex(0);
    setSimProgress(0);
    setSelectedWaypoint(activeRoute.waypoints[0]);
  }, [activeRouteId]);

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    const points = activeRoute.animationPoints;
    let index = simIndex >= points.length - 1 ? 0 : simIndex;
    
    simulationInterval.current = setInterval(() => {
      index++;
      if (index >= points.length) {
        clearInterval(simulationInterval.current!);
        setIsSimulating(false);
        setSimIndex(0);
        setSimProgress(100);
        // Select final waypoint
        setSelectedWaypoint(activeRoute.waypoints[activeRoute.waypoints.length - 1]);
        return;
      }
      
      setSimIndex(index);
      const progress = Math.round((index / (points.length - 1)) * 100);
      setSimProgress(progress);

      // Automatically select nearest waypoint as simulation moves
      const currentPos = points[index];
      let nearest: Waypoint | null = null;
      let minDist = 99999;
      
      activeRoute.waypoints.forEach(wp => {
        const dx = wp.x - currentPos.x;
        const dy = wp.y - currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          nearest = wp;
        }
      });
      
      if (nearest && minDist < 30) {
        setSelectedWaypoint(nearest);
      }
    }, 450); // Simulation step speed
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setSimIndex(0);
    setSimProgress(0);
    setSelectedWaypoint(activeRoute.waypoints[0]);
  };

  const handleWaypointClick = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    // Find index of animation point nearest to waypoint to snap simulation
    let nearestIndex = 0;
    let minDist = 99999;
    activeRoute.animationPoints.forEach((pt, idx) => {
      const dx = pt.x - wp.x;
      const dy = pt.y - wp.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearestIndex = idx;
      }
    });
    setSimIndex(nearestIndex);
    setSimProgress(Math.round((nearestIndex / (activeRoute.animationPoints.length - 1)) * 100));
  };

  // Get coordinate of current boat/board position
  const currentPos = activeRoute.animationPoints[simIndex] || activeRoute.animationPoints[0];

  // Helper to render icons based on type
  const renderWaypointIcon = (type: string, size = 16) => {
    switch (type) {
      case 'start':
        return <Play size={size} className="text-emerald-500 fill-emerald-500" />;
      case 'camp':
        return <Tent size={size} className="text-amber-500" />;
      case 'scenery':
        return <Eye size={size} className="text-secondary" />;
      case 'bridge':
        return <CompassIcon size={size} className="text-indigo-500" />;
      case 'yoga':
        return <Waves size={size} className="text-sky-500 animate-pulse" />;
      case 'finish':
        return <Flag size={size} className="text-rose-500 fill-rose-100" />;
      default:
        return <MapPin size={size} className="text-primary" />;
    }
  };

  return (
    <section className="py-20 bg-mist-white border-t border-b border-outline-variant/20 overflow-hidden" id="routes-map">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 space-y-3"
        >
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-label-md flex items-center justify-center gap-1.5">
            <Compass className="animate-spin-slow text-secondary" size={14} />
            Интерактивный путеводитель
          </span>
          <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-river-deep">
            Карта маршрутов DU-SUP
          </h2>
          <div className="h-1 w-20 bg-secondary rounded mx-auto" />
          <p className="text-on-surface-variant text-sm md:text-base">
            Исследуйте ключевые точки стоянок, оцените протяженность пути по руслу Агидели и загляните в дикие природные уголки до старта!
          </p>
        </motion.div>

        {/* Map tabs switcher */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveRouteId('gusinka')}
            className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
              activeRouteId === 'gusinka'
                ? 'bg-river-deep text-white border-river-deep shadow-md scale-[1.02]'
                : 'bg-white text-river-deep border-outline-variant/50 hover:bg-surface-container-low'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35] animate-ping" />
            Маршрут «Туринка» (20 км)
          </button>
          <button
            onClick={() => setActiveRouteId('golden_sands')}
            className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
              activeRouteId === 'golden_sands'
                ? 'bg-river-deep text-white border-river-deep shadow-md scale-[1.02]'
                : 'bg-white text-river-deep border-outline-variant/50 hover:bg-surface-container-low'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />
            Маршрут «Золотые пески» (22 км)
          </button>
          <button
            onClick={() => setActiveRouteId('kotlovan')}
            className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
              activeRouteId === 'kotlovan'
                ? 'bg-river-deep text-white border-river-deep shadow-md scale-[1.02]'
                : 'bg-white text-river-deep border-outline-variant/50 hover:bg-surface-container-low'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            Прокат на Котловане (Локальный)
          </button>
        </motion.div>

        {/* main interactive widget box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-3xl overflow-hidden border border-outline-variant/35 shadow-xl grid grid-cols-1 lg:grid-cols-12"
        >
          
          {/* LEFT/TOP: THE MAP CANVAS (Col-span 7) */}
          <div className="lg:col-span-7 bg-[#EBF3F5] relative p-4 sm:p-6 flex flex-col justify-between min-h-[380px] sm:min-h-[460px] border-b lg:border-b-0 lg:border-r border-outline-variant/20">
            
            {/* Map Top Widgets */}
            <div className="flex justify-between items-center z-10 pointer-events-none">
              {/* Scale bar / Compass decoration */}
              <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-outline-variant/30 text-[10px] font-semibold text-river-deep flex items-center gap-2 shadow-sm">
                <CompassIcon size={12} className="text-secondary animate-spin-slow" />
                <span className="tracking-widest">АГИДЕЛЬ • ДЮРТЮЛИ</span>
              </div>

              {/* Water Speed Indicator */}
              <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-outline-variant/30 text-[10px] font-semibold text-river-deep flex items-center gap-1.5 shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                <span>Течение: ~3.5 км/ч</span>
              </div>
            </div>

            {/* THE VECTOR MAP CANVAS */}
            <div className="absolute inset-0 z-0 flex items-center justify-center p-4">
              <svg
                viewBox="0 0 800 450"
                className="w-full h-full max-h-[400px] select-none filter drop-shadow-sm"
              >
                {/* Definitions for beautiful shadows & gradients */}
                <defs>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0B4250" />
                    <stop offset="50%" stopColor="#125E72" />
                    <stop offset="100%" stopColor="#258AA4" />
                  </linearGradient>
                  
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFA658" stopOpacity="0.8" />
                  </linearGradient>
                  
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Landmass Background (Stylized topo lines / details) */}
                <rect width="800" height="450" rx="20" fill="#EBF3F5" />
                
                {/* Topographical subtle contour rings */}
                <path d="M-50,80 Q200,40 280,10" fill="none" stroke="#DCE8EB" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M100,400 Q250,370 300,470" fill="none" stroke="#DCE8EB" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M500,60 Q620,10 750,90" fill="none" stroke="#DCE8EB" strokeWidth="2" strokeDasharray="5,5" />
                <path d="M680,330 Q750,400 850,360" fill="none" stroke="#DCE8EB" strokeWidth="2" strokeDasharray="5,5" />

                {/* Forest Areas (Green decorative shapes) */}
                <g fill="#DBEAEB" opacity="0.85">
                  {/* North Forest */}
                  <path d="M100,50 Q120,40 140,50 T180,45 T220,55 T200,80 T150,90 Z" />
                  <path d="M430,70 Q450,60 480,70 T520,65 T510,95 T460,90 T420,80 Z" />
                  {/* South Forest */}
                  <path d="M180,380 Q210,390 230,370 T280,390 T320,380 T260,420 T190,410 Z" />
                  <path d="M500,280 Q520,290 540,280 T580,290 T560,320 T510,310 Z" />
                </g>

                {/* Island "Gusinka" (Beautiful green element inside upper river bend) */}
                <g transform="translate(315, 140)">
                  <motion.path
                    d="M 10,15 C 30,5 60,5 75,18 C 90,30 85,45 65,48 C 45,50 20,45 10,35 C 5,30 5,20 10,15 Z"
                    fill="#C2E5D3"
                    stroke="#8ED4B1"
                    strokeWidth="3"
                    whileHover={{ scale: 1.05 }}
                    className="cursor-pointer"
                    onClick={() => {
                      if (activeRouteId === 'gusinka') {
                        const wp = activeRoute.waypoints.find(w => w.id === 'g-island');
                        if (wp) handleWaypointClick(wp);
                      }
                    }}
                  />
                  {/* Little tree icons or text on Island */}
                  <text x="42" y="32" fontSize="9" fill="#2E7D52" fontWeight="extrabold" fontFamily="sans-serif" textAnchor="middle">О. ТУРИНКА</text>
                  <circle cx="18" cy="22" r="2" fill="#2E7D52" opacity="0.6" />
                  <circle cx="25" cy="28" r="1.5" fill="#2E7D52" opacity="0.6" />
                  <circle cx="68" cy="25" r="2" fill="#2E7D52" opacity="0.6" />
                </g>

                {/* Sands dunes representation for "Золотые пески" */}
                <g transform="translate(270, 395)" opacity="0.9">
                  <path d="M10,15 Q30,5 60,10 T100,5 T140,15" fill="none" stroke="#E3D0A2" strokeWidth="2" />
                  <path d="M5,22 Q35,12 70,18 T125,12" fill="none" stroke="#E3D0A2" strokeWidth="1.5" />
                  <text x="75" y="10" fontSize="8" fill="#A88B46" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">ЗОЛОТЫЕ ПЕСКИ</text>
                </g>

                {/* THE AGIDEL RIVER BED WAY (Thick soft blue base) */}
                {/* Winding river flow path */}
                <path
                  d="M 30,120 C 120,90 180,100 230,150 C 290,170 340,150 400,120 C 460,130 520,160 590,200 C 640,230 680,260 680,280 C 680,320 650,360 590,390 C 480,410 380,415 260,400"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="32"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />

                {/* River water fine center-flow lines (animates flow direction) */}
                <path
                  d="M 30,120 C 120,90 180,100 230,150 C 290,170 340,150 400,120 C 460,130 520,160 590,200 C 640,230 680,260 680,280 C 680,320 650,360 590,390 C 480,410 380,415 260,400"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="15,40"
                  className="animate-flow"
                  opacity="0.4"
                  style={{ animation: 'flow 4s linear infinite' }}
                />

                {/* Durtuli Bridge Graphic Over the River */}
                <g transform="translate(560, 160) rotate(18)">
                  {/* Bridge structure */}
                  <line x1="10" y1="0" x2="10" y2="70" stroke="#78909C" strokeWidth="6" />
                  <line x1="6" y1="0" x2="6" y2="70" stroke="#CFD8DC" strokeWidth="2" />
                  <line x1="14" y1="0" x2="14" y2="70" stroke="#CFD8DC" strokeWidth="2" />
                  {/* Bridge pillars */}
                  <rect x="5" y="10" width="10" height="6" rx="1" fill="#455A64" />
                  <rect x="5" y="30" width="10" height="6" rx="1" fill="#455A64" />
                  <rect x="5" y="50" width="10" height="6" rx="1" fill="#455A64" />
                  <text x="35" y="35" fontSize="8" fill="#455A64" fontWeight="bold" transform="rotate(-18)" opacity="0.8">МОСТ ДЮРТЮЛИ</text>
                </g>

                {/* INACTIVE ROUTE LINES (Slight greyed guide paths) */}
                {Object.values(ROUTES).map((route) => {
                  if (route.id === activeRouteId) return null;
                  return (
                    <path
                      key={`guide-${route.id}`}
                      d={route.fullPath}
                      fill="none"
                      stroke="#A0B3B5"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="6,8"
                      opacity="0.5"
                    />
                  );
                })}

                {/* ACTIVE SELECTED ROUTE LINE (Glow overlay & crawler animation) */}
                <motion.path
                  key={`active-path-${activeRouteId}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  d={activeRoute.fullPath}
                  fill="none"
                  stroke={activeRoute.accentColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  opacity="0.95"
                />

                {/* Active route dashed flow overlay */}
                <path
                  d={activeRoute.fullPath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="10,12"
                  className="animate-flow"
                  style={{ animationDuration: '1.2s' }}
                />

                {/* LOCAL RENTAL RADIUS GLOW (If rental selected, draw a ripple circle) */}
                {activeRouteId === 'kotlovan' && (
                  <g>
                    <motion.circle
                      cx="670"
                      cy="270"
                      r="45"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle
                      cx="670"
                      cy="270"
                      r="35"
                      fill="#38BDF8"
                      fillOpacity="0.1"
                      animate={{ scale: [0.95, 1.05, 0.95] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </g>
                )}

                {/* RENDERING INTERACTIVE WAYPOINTS */}
                {activeRoute.waypoints.map((wp, idx) => {
                  const isSelected = selectedWaypoint?.id === wp.id;
                  
                  return (
                    <g key={wp.id} className="cursor-pointer">
                      
                      {/* Pulse circle for waypoints */}
                      <motion.circle
                        cx={wp.x}
                        cy={wp.y}
                        r={isSelected ? 18 : 12}
                        fill={activeRoute.accentColor}
                        fillOpacity={isSelected ? 0.25 : 0.15}
                        animate={{ r: isSelected ? [16, 22, 16] : [11, 14, 11] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Main Node Point */}
                      <motion.circle
                        cx={wp.x}
                        cy={wp.y}
                        r={isSelected ? 11 : 8}
                        fill="#FFFFFF"
                        stroke={isSelected ? activeRoute.accentColor : '#0F4C5C'}
                        strokeWidth={isSelected ? 4 : 2.5}
                        shadow-md="true"
                        whileHover={{ scale: 1.3 }}
                        onClick={() => handleWaypointClick(wp)}
                      />

                      {/* Micro icon index or letter inside node */}
                      <text
                        x={wp.x}
                        y={wp.y + 3}
                        fontSize={isSelected ? "9" : "7"}
                        fontWeight="extrabold"
                        fill="#0F4C5C"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                        className="pointer-events-none"
                        onClick={() => handleWaypointClick(wp)}
                      >
                        {idx + 1}
                      </text>

                      {/* Floating Text Label */}
                      <g transform={`translate(${wp.x}, ${wp.y - 18})`}>
                        {/* Background badge for selected label */}
                        {isSelected && (
                          <motion.rect
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            x="-50"
                            y="-14"
                            width="100"
                            height="16"
                            rx="4"
                            fill="#0F4C5C"
                            className="shadow-md"
                          />
                        )}
                        <text
                          fontSize={isSelected ? "8" : "7.5"}
                          fontWeight="extrabold"
                          fill={isSelected ? '#FFFFFF' : '#0F4C5C'}
                          textAnchor="middle"
                          fontFamily="sans-serif"
                          className="font-headline"
                        >
                          {wp.name.split(':')[0]} {/* Shortened name */}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* ANIMATED SUP BOARDER (A boat/board icon that moves along coordinates during simulation) */}
                <AnimatePresence>
                  {simProgress > 0 && simProgress < 100 && (
                    <motion.g
                      key="sup-boarder"
                      animate={{ x: currentPos.x, y: currentPos.y }}
                      transition={{ duration: 0.45, ease: 'linear' }}
                      className="filter drop-shadow-md pointer-events-none"
                    >
                      {/* Ripple effect under the board */}
                      <motion.circle
                        r="12"
                        fill="none"
                        stroke="#FF6B35"
                        strokeWidth="1.5"
                        animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                      />
                      
                      {/* Stylized board shape (oval vector) */}
                      <path
                        d="M -3,-12 C -3,-12 0,-18 3,-12 C 4,-7 4,7 3,12 C 1,16 -1,16 -3,12 C -4,7 -4,-7 -3,-12 Z"
                        fill="#FF6B35"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        transform="rotate(45)" // Slight default angle
                      />

                      {/* Small driver dot */}
                      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />

                      {/* Paddle paddle representation */}
                      <line x1="-7" y1="-3" x2="7" y2="3" stroke="#FFFFFF" strokeWidth="1" />
                      <rect x="-8" y="-4" width="2" height="1" rx="0.5" fill="#FFFFFF" />
                      <rect x="6" y="3" width="2" height="1" rx="0.5" fill="#FFFFFF" />
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
            </div>

            {/* Map Simulator Controllers Box at bottom */}
            <div className="z-10 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-outline-variant/30 shadow-md max-w-sm w-full mt-auto flex flex-col gap-3 self-center sm:self-start">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-river-deep flex items-center gap-1.5 uppercase tracking-wider font-headline">
                  <Waves size={14} className="text-secondary animate-pulse" />
                  Симулятор SUP-сплава
                </span>
                <span className="text-[10px] font-mono text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-full">
                  {simProgress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-secondary h-full rounded-full"
                  animate={{ width: `${simProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-2">
                {!isSimulating ? (
                  <button
                    onClick={startSimulation}
                    className="flex-1 bg-secondary hover:bg-secondary-container text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={12} fill="#fff" />
                    {simProgress === 100 || simProgress === 0 ? 'Запустить доску' : 'Продолжить'}
                  </button>
                ) : (
                  <button
                    onClick={stopSimulation}
                    className="flex-1 bg-river-deep hover:bg-opacity-95 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pause size={12} fill="#fff" />
                    Пауза
                  </button>
                )}

                <button
                  onClick={resetSimulation}
                  disabled={simProgress === 0 && !isSimulating}
                  className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-on-surface p-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Сбросить маршрут"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              <p className="text-[10px] text-on-surface-variant/80 italic leading-snug">
                {isSimulating 
                  ? 'SUP-борд движется по течению Агидели. Нажмите на паузу или выберите любую точку на карте.' 
                  : 'Запустите симуляцию, чтобы увидеть виртуальное движение сапборда по точкам маршрута.'}
              </p>
            </div>
          </div>

          {/* RIGHT/BOTTOM: DYNAMIC SIDE PANEL (Col-span 5) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Upper half: Route Info */}
            <div className="space-y-5">
              
              {/* Badge & Title */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${activeRoute.difficultyColor}`}>
                    Сложность: {activeRoute.difficulty}
                  </span>
                  
                  <div className="flex items-center gap-2 text-xs font-bold text-river-deep">
                    <CompassIcon size={14} className="text-secondary animate-pulse" />
                    <span>{activeRoute.distance}</span>
                  </div>
                </div>

                <h3 className="font-headline font-extrabold text-2xl text-river-deep">
                  {activeRoute.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {activeRoute.description}
              </p>

              {/* Packing list helper */}
              <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/20 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-river-deep flex items-center gap-1.5">
                  <Info size={12} className="text-secondary" />
                  Что взять с собой:
                </h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {activeRoute.packingList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <span className="w-1 h-1 rounded-full bg-secondary" />
                      <span className="truncate" title={item}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Waypoints timeline list */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-river-deep uppercase tracking-wider font-headline">
                  Ключевые отметки ({activeRoute.waypoints.length})
                </h4>

                <div className="space-y-2.5 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/40">
                  {activeRoute.waypoints.map((wp, idx) => {
                    const isSelected = selectedWaypoint?.id === wp.id;
                    return (
                      <div
                        key={wp.id}
                        onClick={() => handleWaypointClick(wp)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-surface-container border-secondary/30 shadow-sm translate-x-1'
                            : 'bg-transparent border-transparent hover:bg-surface-container-low/40'
                        }`}
                      >
                        {/* Number bullet */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-secondary text-white' : 'bg-white border-2 border-outline-variant text-river-deep'
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className={`text-xs font-bold truncate ${isSelected ? 'text-secondary' : 'text-river-deep'}`}>
                              {wp.name}
                            </h5>
                            <span className="text-[10px] font-mono text-on-surface-variant/70 whitespace-nowrap">
                              {wp.distance !== '0 км' ? wp.distance : wp.timeOffset}
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                            {wp.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lower half: Selected Point Rich card & Action Button */}
            <div className="space-y-4 pt-4 border-t border-outline-variant/20">
              
              {/* Detailed Waypoint Spotlight Card */}
              {selectedWaypoint && (
                <motion.div
                  key={selectedWaypoint.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container p-4 rounded-2xl border border-secondary/20 relative overflow-hidden space-y-2"
                >
                  {/* Decorative faint background icon */}
                  <div className="absolute right-2 bottom-0 opacity-[0.03] text-river-deep pointer-events-none scale-150">
                    {renderWaypointIcon(selectedWaypoint.iconType, 120)}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      {renderWaypointIcon(selectedWaypoint.iconType, 16)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-river-deep">
                        {selectedWaypoint.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-on-surface-variant/80">
                        <span>Отметка: {selectedWaypoint.distance}</span>
                        <span>•</span>
                        <span>Время: {selectedWaypoint.timeOffset}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {selectedWaypoint.description}
                  </p>

                  <div className="bg-white/65 rounded-lg p-2 flex items-center gap-1.5 text-[10px] text-river-deep font-semibold">
                    <Sparkles size={11} className="text-secondary animate-pulse" />
                    <span>В программе: {selectedWaypoint.activity}</span>
                  </div>
                </motion.div>
              )}

              {/* Action Booking Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (activeRouteId === 'kotlovan') {
                      onBook('rental', 'sup_rental');
                    } else {
                      onBook('tour', activeRouteId);
                    }
                  }}
                  className="flex-1 bg-secondary hover:bg-secondary-container text-white py-3 px-5 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Anchor size={14} />
                  Забронировать это направление
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Decorative key details bottom banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-river-deep/5 text-river-deep flex items-center justify-center flex-shrink-0">
              <CompassIcon size={18} />
            </div>
            <div>
              <h5 className="font-headline font-bold text-xs text-river-deep uppercase tracking-wider">Опытные инструкторы</h5>
              <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                Гид плывет рядом, показывает лучшие траектории, делает профессиональные фотографии и готов помочь в любую секунду.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-river-deep/5 text-river-deep flex items-center justify-center flex-shrink-0">
              <Tent size={18} />
            </div>
            <div>
              <h5 className="font-headline font-bold text-xs text-river-deep uppercase tracking-wider">Качественный инвентарь</h5>
              <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                Используем премиальные широкие и устойчивые SUP-борды, надежные весла, сертифицированные жилеты и сухие гермомешки.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-river-deep/5 text-river-deep flex items-center justify-center flex-shrink-0">
              <Waves size={18} />
            </div>
            <div>
              <h5 className="font-headline font-bold text-xs text-river-deep uppercase tracking-wider">Безопасность превыше всего</h5>
              <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                Обязательный спасательный жилет по размеру для каждого (включая детские размеры) и страховочный лиш, крепящийся к ноге.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
