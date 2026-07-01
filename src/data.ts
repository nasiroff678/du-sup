/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tour, RentalOption, QuizQuestion } from './types';

export const TOURS: Tour[] = [
  {
    id: 'gusinka',
    title: 'Маршрут «Туринка»',
    distance: '~20 км',
    duration: '4-5 часов',
    price: 2000,
    description: 'Путешествие сквозь тихий лес с остановкой на необитаемом острове Туринка. Идеально для любителей дикой природы.',
    imageUrl: '/gusinka.png',
    features: [
      'Полный комплект оборудования (премиум SUP-борд, весло, лиш)',
      'Трансфер до точки старта',
      'Опытный инструктор и фото сопровождение',
      'Спасательный жилет и гермомешок для вещей'
    ]
  },
  {
    id: 'golden_sands',
    title: 'Маршрут «Золотые пески»',
    distance: '~22 км',
    duration: '4-5 часов',
    price: 2000,
    description: 'Высокие живописные берега Агидели, проход под величественным мостом и отдых на легендарном пляже «Золотые пески».',
    imageUrl: '/peski.png',
    features: [
      'Сытный фирменный перекус и горячий чай включены',
      'Страховка каждого участника',
      'Трансфер обратно в Дюртюли',
      'Обучение технике гребли перед стартом'
    ]
  }
];

export const RENTALS: RentalOption[] = [
  {
    id: 'sup_rental',
    name: 'Прокат сапбордов',
    location: 'Городской пляж «Котлован»',
    description: 'Идеальный вариант для тех, кто хочет освежиться после рабочего дня или просто насладиться спокойной водой в черте города.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD3hGxKdJZJ_OrCaRLnw-XQ_TNVTTu5N883nQAx66zJh782SXofGfykb-OJGOymPC6gJXgfNLxWDkC73z2wt289FQ12jTkaX_RAyy9AeDXmlVWJvFuB7crjYERFWj7maauz2qXTJbVicOjnE7pXfln-c6BOGSFPcSIZqHU0rjHj4jVWL9EVTzP-KwTEGLDmxV6slobp9D9lUTJSvsb2jTR94iZI8-f9jqR72NUSelCh8PGrFd0ear2FZp9xzCb-9p3ppsKT203M5FG',
    durationOptions: [
      { duration: '30 минут', price: 300 },
      { duration: '1 час', price: 500 }
    ]
  },
  {
    id: 'supmaran_rental',
    name: 'Сапмаран (семейный)',
    location: 'Городской пляж «Котлован»',
    description: 'Уникальный гибрид, объединяющий устойчивость катамарана и маневренность сапборда. Идеально для отдыха с детьми.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj660e83wBMWkT60pVrbr7Rvpel67luDmMPVzhoZ7ikgldk6hzpkyLKLXWWA0TTo7KHDAPnBmHe_S6di7AhwGcYa52rJeT0xDPMeKT8dy7v-39N_ZNqZUA-IGW484qyqBTrKVStKsSAdUaQM8Q-1FdPLL_iN7Pn65hG3LbEh3Jf8Xfdl2yBkoGO0FtbJsfaPVy3FK0m5mRp7SY1WSzWYc_X8uXEbJUwnJpSPjzZXCtTG1aPqsDeuwUEr56IVMbpw3OmpDRi0bdglpT',
    badge: 'NEW 2024',
    maxCapacity: '2 взрослых + 2 ребенка',
    durationOptions: [
      { duration: '30 минут', price: 1000 },
      { duration: '1 час', price: 2000 }
    ]
  },
  {
    id: 'yoga_water',
    name: 'Йога на воде DilyaYoga',
    location: 'Городской пляж «Котлован»',
    description: 'Коллаборация с DilyaYoga. Практика балансирования на воде задействует мышцы-стабилизаторы, а мягкий шелест волн дарит покой.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk0hAANOURosuydsls1Qd00JuRAdBGxXJ5iyFCcFhk5uMts4iCqMmeR-ZgZQ5FWqEbgm3KDFqJldSXIRvW5yvZBV_GqTHi9duiNsE5TQ-6zA36NAA5ZSc0PHIP_ahRzVFNGW50-TKMXLB7p5x8-BjhshFlGb5muD1QTF421jiX5igjfK4jZRjjts1Fx1dmkQf5SL2Q8w679Sh17X7s1tIrOAW8-8fa9yoyAjiQfamVPgSq3mBPb5q3-l9fVSDlOW-q1L02K2RFA-Nj',
    badge: 'DilyaYoga',
    durationOptions: [
      { duration: '1.5 часа', price: 800 }
    ]
  }
];

export const GALLERY_IMAGES = [
  {
    id: '1',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLTlHprHS_TG4G1C_otkWryvd20x7LZuL-AQ-Y5REXO7_rTC1w4iw9pBTkN6WVz9265pKywybZ5mg_neUtZLetDV2U0HF9y9veU8YxaDzJxAaudR9WmPLardk_Mlg7nPvTlv0bvHx4oPsE0u6oQ0GBvP8AQHKA4k6gdojxBGU_fl3zUtjHUl_ABlp1h9V41wb1Z9mLUvRvPT-oV1Ux-_KDRbmycwH3sIvwjsyqs7s93oP9baYW5mHwHBciQbC2UiZQ67M5E-OTC-sT',
    alt: 'Веселая компания на сапбордах'
  },
  {
    id: '2',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO0qpWVt9H6-uoaUw17eqIZA5i_WjuY_bh7x63GxTUqfNhKkq3njJAB10mgGs-RRBVPVTcikxjtP89kIuQkFEvZA7kdwoBhDc7EpSM1UlI6ozk9DiTIiSYb2uR9wFoM6n95rOUgqMThGoRDlWXAAJuZI3KX0zXvr8abpf3tLcI-vOmweoSM26qoPNkRz-ilbbAeXol9lGk3UyDh3kcBRVeTqvR1WdbovscLyIxjJAmhxuNZMjtY-vX-BKOl6DYdjefGNuLjRHp0Jpa',
    alt: 'Романтический закат на реке Агидель'
  },
  {
    id: '3',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWaRzYhr7zpBwriRutlSvJIxGDDJQE7TVDHG59u8X368RyN78svunE1WIQxtJXTQwURxsQj-r6AwIMMpIRqwCyDJ2sw-MUxfT6rwdLYXp1FXHNmzcsUXTeY1D0hw7AGyIDzuRkmWnfT9jdcreESW4YyHKHiCJidOmhxbqhi_9pUxCLiZ-M5loMPMGmTBZC_R_VWS91emBdBKf8yHFiIO92SnGI8DETDyhPUlejCc_Gs3JykVL8Ss2bm0SgwQVYbAv9HVwNZu6e6hBb',
    alt: 'Геометрия сапбордов с высоты птичьего полета'
  },
  {
    id: '4',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB4x92PxNWcwxMy5MVnDDZMkk_LI-WlOv55nBPKoBlLcZdc3UyleCamagyNFld-qtegulK7qAqEEVIJ0ThFIrnzEL2lzxRDadh1DGPjHie6sb2lffUePXueLgSbgmivE10talo4tFRb5weuGv8cOVGNGpK5OPpcVoxE6X-V7KotCSAfyjBpn12oEYWZC6NFSunqdnkr-QnCQG6emc4lOvZKU1qFdJIYou2xeo-pOfWtSiGsrdTnyYaci66JdDviTdo-e-LdHSeAY6M',
    alt: 'Эмоции гребца крупным планом'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: 'Каков ваш опыт катания на SUP-борде?',
    options: [
      { text: 'Никогда не пробовал(а), хочу научиться', value: 'beginner', icon: 'surfing' },
      { text: 'Катался(ась) пару раз на спокойной воде', value: 'medium', icon: 'waves' },
      { text: 'Уверенно стою на доске, ищу приключений', value: 'pro', icon: 'bolt' }
    ]
  },
  {
    id: 2,
    text: 'С кем вы планируете отдохнуть?',
    options: [
      { text: 'Один / Одна', value: 'solo', icon: 'person' },
      { text: 'С любимым человеком (романтика)', value: 'couple', icon: 'favorite' },
      { text: 'С семьей и детьми', value: 'family', icon: 'family_restroom' },
      { text: 'Веселой компанией друзей', value: 'friends', icon: 'groups' }
    ]
  },
  {
    id: 3,
    text: 'Что для вас главное в водном приключении?',
    options: [
      { text: 'Релакс, тишина и единение с природой', value: 'relax', icon: 'spa' },
      { text: 'Красивые пейзажи и крутые фото', value: 'photo', icon: 'photo_camera' },
      { text: 'Активная гребля, спорт и выносливость', value: 'sport', icon: 'fitness_center' },
      { text: 'Просто весело провести время', value: 'fun', icon: 'mood' }
    ]
  }
];

export const FAQS = [
  {
    question: 'Нужен ли опыт для сплава?',
    answer: 'Нет, 90% наших гостей встают на сап впервые. Перед каждым выходом на воду мы проводим подробный инструктаж на суше и сопровождаем вас на протяжении всего маршрута.'
  },
  {
    question: 'Что взять с собой на сплав?',
    answer: 'Рекомендуем взять сменную одежду, купальник/плавки, головной убор (кепку или панаму), солнцезащитные очки с ремешком, солнцезащитный крем и бутылочку питьевой воды. Мы предоставим водонепроницаемый гермомешок для вашего телефона и ценных вещей.'
  },
  {
    question: 'Безопасно ли это? Нужно ли уметь плавать?',
    answer: 'Это абсолютно безопасно. Мы выдаем каждому участнику сертифицированный спасательный жилет соответствующего размера, а доска крепится к вашей ноге специальным страховочным лишем. Наличие жилета гарантирует безопасность даже тем, кто не умеет плавать. Рядом всегда находится опытный инструктор.'
  },
  {
    question: 'Можно ли взять с собой детей?',
    answer: 'Конечно! Для семейного отдыха у нас есть уникальный Сапмаран — устойчивый катамаран на базе двух сапов, который практически невозможно перевернуть. Дети также могут плыть на одной доске с родителем (у нас есть детские спасжилеты).'
  },
  {
    question: 'Что происходит в случае плохой погоды?',
    answer: 'В случае сильного дождя, шквалистого ветра или грозы мы переносим бронирование на удобную для вас дату или делаем полный возврат средств. Легкий летний грибной дождик сплаву не помеха!'
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: 'Артур Г.',
    city: 'Дюртюли',
    rating: 5,
    text: 'Это было незабываемо! Сплав по маршруту «Золотые пески» открыл для меня Агидель с другой стороны. Организация на высшем уровне, инструктор супер позитивный, а фотки получились просто космические!',
    date: '15 июня 2026'
  },
  {
    id: 2,
    name: 'Мария С.',
    city: 'Уфа',
    rating: 5,
    text: 'Брали сапмаран с детьми на Котловане. Очень устойчивая штука! Младший сидел посередине, играл с водой, а мы с мужем спокойно гребли. Идеально для отдыха всей семьей. Спасибо DU-SUP за эмоции!',
    date: '22 июня 2026'
  },
  {
    id: 3,
    name: 'Динара К.',
    city: 'Дюртюли',
    rating: 5,
    text: 'Была на занятии по йоге на воде с Дилей. Это невероятное ощущение баланса и умиротворения, когда тело тянется к небу, а под тобой колышется теплая река. Всем советую попробовать хотя бы раз!',
    date: '25 июня 2026'
  }
];
