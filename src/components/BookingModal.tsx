/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Users, Tag, Phone, User, Check, ShieldCheck, Ticket, CalendarCheck2 } from 'lucide-react';
import { TOURS, RENTALS } from '../data';
import { Booking, Coupon, Tour, RentalOption } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: Booking) => void;
  preselectedService?: {
    type: 'tour' | 'rental' | 'yoga';
    id: string;
  } | null;
  initialPromo?: string;
  initialDiscount?: number;
}

export default function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  preselectedService,
  initialPromo = '',
  initialDiscount = 0
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Form, 2: Ticket Confirmation
  const [serviceType, setServiceType] = useState<'tour' | 'rental' | 'yoga'>('tour');
  const [serviceId, setServiceId] = useState<string>('');
  const [durationIndex, setDurationIndex] = useState<number>(0); // For rentals with multiple duration options
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');
  const [promoSuccess, setPromoSuccess] = useState<string>('');
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Initialize form with preselected values
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPromoError('');
      setPromoSuccess('');

      if (initialPromo) {
        setPromoCode(initialPromo);
        setDiscountPercent(initialDiscount);
        setPromoSuccess(`Применен промокод ${initialPromo} на скидку ${initialDiscount}%!`);
      } else {
        setPromoCode('');
        setDiscountPercent(0);
      }

      if (preselectedService) {
        setServiceType(preselectedService.type);
        setServiceId(preselectedService.id);
      } else {
        setServiceType('tour');
        setServiceId(TOURS[0].id);
      }

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTimeSlot('10:00');
    }
  }, [isOpen, preselectedService, initialPromo, initialDiscount]);

  // Adjust options based on service selection
  const selectedService =
    serviceType === 'tour'
      ? TOURS.find((t) => t.id === serviceId)
      : RENTALS.find((r) => r.id === serviceId);

  // Default price calculation
  const getBasePrice = () => {
    if (!selectedService) return 0;
    if ('price' in selectedService) {
      return selectedService.price;
    } else {
      const option = selectedService.durationOptions[durationIndex];
      return option ? option.price : 0;
    }
  };

  const basePrice = getBasePrice();
  const totalPriceBeforeDiscount = basePrice * quantity;
  const discountAmount = totalPriceBeforeDiscount * (discountPercent / 100);
  const finalPrice = totalPriceBeforeDiscount - discountAmount;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'DUSUP20') {
      setDiscountPercent(20);
      setPromoSuccess('Промокод применен успешно! Скидка 20% добавлена.');
    } else if (code === 'WIFI2026') {
      setDiscountPercent(10);
      setPromoSuccess('Промокод применен успешно! Скидка 10% добавлена.');
    } else if (code === 'DILYAYOGA') {
      setDiscountPercent(15);
      setPromoSuccess('Промокод DilyaYoga применен! Скидка 15%.');
    } else {
      setPromoError('Неверный или устаревший промокод.');
      setDiscountPercent(0);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Пожалуйста, заполните ваши имя и телефон.');
      return;
    }

    let serviceName = 'Услуга';
    if (selectedService) {
      if (serviceType === 'tour') {
        serviceName = (selectedService as Tour).title;
      } else {
        const rental = selectedService as RentalOption;
        const durationText = rental.durationOptions[durationIndex] 
          ? ` (${rental.durationOptions[durationIndex].duration})` 
          : '';
        serviceName = `${rental.name}${durationText}`;
      }
    }

    const booking: Booking = {
      id: 'DS-' + Math.floor(100000 + Math.random() * 900000),
      customerName,
      customerPhone,
      serviceType,
      serviceName,
      date,
      timeSlot,
      quantity,
      totalPrice: finalPrice,
      discountCode: discountPercent > 0 ? promoCode.toUpperCase() : undefined,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString()
    };

    onSubmit(booking);
    setCreatedBooking(booking);
    setStep(2);
  };

  const getWhatsAppLink = (booking: Booking) => {
    const text = `Привет! Забронировал сплав/прокат в DU-SUP:
📝 Номер брони: ${booking.id}
👤 Имя: ${booking.customerName}
📞 Телефон: ${booking.customerPhone}
🛶 Услуга: ${booking.serviceName}
📅 Дата: ${booking.date}
⏰ Время: ${booking.timeSlot}
👥 Количество: ${booking.quantity} чел.
💰 Итоговая стоимость: ${booking.totalPrice} ₽

Прошу подтвердить бронирование! 😊`;
    return `https://wa.me/79000000000?text=${encodeURIComponent(text)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white text-on-surface rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden z-10 border border-outline-variant/30 flex flex-col"
      >
        {/* Header */}
        <div className="bg-primary text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">surfing</span>
            <h3 className="font-headline-md font-bold text-lg md:text-xl text-white">
              {step === 1 ? 'Онлайн-бронирование' : 'Бронь подтверждена'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="booking-form"
              onSubmit={handleFormSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 space-y-5 flex-1 max-h-[80vh] overflow-y-auto"
            >
              {/* Service Type Selection Toggle */}
              <div className="grid grid-cols-3 gap-2 bg-surface-container p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setServiceType('tour');
                    setServiceId(TOURS[0].id);
                  }}
                  className={`py-2 rounded-md font-label-md text-xs text-center transition-all cursor-pointer ${
                    serviceType === 'tour'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Сплавы
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServiceType('rental');
                    setServiceId(RENTALS[0].id);
                  }}
                  className={`py-2 rounded-md font-label-md text-xs text-center transition-all cursor-pointer ${
                    serviceType === 'rental' && serviceId === 'sup_rental'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Сапборды
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServiceType('yoga');
                    setServiceId('yoga_water');
                  }}
                  className={`py-2 rounded-md font-label-md text-xs text-center transition-all cursor-pointer ${
                    serviceType === 'yoga' || (serviceType === 'rental' && serviceId === 'yoga_water')
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Йога / Сапмаран
                </button>
              </div>

              {/* Specific Item Select Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant font-label-md">Выберите вариант:</label>
                <select
                  value={serviceId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setServiceId(id);
                    if (id === 'yoga_water') {
                      setServiceType('yoga');
                    } else if (id === 'sup_rental' || id === 'supmaran_rental') {
                      setServiceType('rental');
                    } else {
                      setServiceType('tour');
                    }
                    setDurationIndex(0);
                  }}
                  className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <optgroup label="Сплавы по Агидели">
                    {TOURS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.price} ₽)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Аренда и услуги">
                    {RENTALS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Sub-duration selection for rentals with options */}
              {serviceType === 'rental' && selectedService && 'durationOptions' in selectedService && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant font-label-md">Длительность проката:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedService.durationOptions.map((opt, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setDurationIndex(idx)}
                        className={`py-2 px-3 border rounded-lg text-sm transition-all cursor-pointer ${
                          durationIndex === idx
                            ? 'bg-secondary/10 border-secondary text-secondary font-semibold'
                            : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {opt.duration} • {opt.price} ₽
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Row: Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant font-label-md flex items-center gap-1">
                    <Calendar size={14} className="text-river-deep" /> Дата:
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant font-label-md flex items-center gap-1">
                    <Clock size={14} className="text-river-deep" /> Время:
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="10:00">10:00 (Утро)</option>
                    <option value="12:00">12:00 (Полдень)</option>
                    <option value="14:00">14:00 (День)</option>
                    <option value="16:00">16:00 (Вечер)</option>
                    <option value="18:00">18:00 (Закат)</option>
                  </select>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant font-label-md flex items-center gap-1">
                  <Users size={14} className="text-river-deep" /> Количество человек / сапов:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center text-lg hover:bg-surface-container cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center text-lg hover:bg-surface-container cursor-pointer transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs text-on-surface-variant italic">Максимум 10 мест в одной заявке</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4 pt-2 border-t border-outline-variant/30">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant font-label-md flex items-center gap-1">
                    <User size={14} className="text-river-deep" /> Ваше имя:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например, Александр"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant font-label-md flex items-center gap-1">
                    <Phone size={14} className="text-river-deep" /> Номер телефона:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (999) 999-99-99"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant font-label-md">Особые пожелания (необязательно):</label>
                  <textarea
                    placeholder="Например: Плыву с ребенком, нужен детский жилет"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Promo code field */}
              <div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
                <label className="text-xs font-semibold text-on-surface-variant font-label-md flex items-center gap-1">
                  <Tag size={14} className="text-river-deep" /> Промокод или скидка:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Введите промокод (например, DUSUP20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="rounded-lg border border-outline-variant px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary uppercase flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Применить
                  </button>
                </div>
                {promoError && <p className="text-xs text-error font-medium">{promoError}</p>}
                {promoSuccess && <p className="text-xs text-[#25D366] font-medium flex items-center gap-1">
                  <Check size={12} /> {promoSuccess}
                </p>}
              </div>

              {/* Price Calculation details */}
              <div className="bg-surface-container p-4 rounded-xl space-y-2 mt-4">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Стоимость ({quantity} шт.):</span>
                  <span>{totalPriceBeforeDiscount} ₽</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-xs text-secondary font-semibold">
                    <span>Скидка ({discountPercent}%):</span>
                    <span>-{discountAmount} ₽</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30 font-bold text-river-deep">
                  <span className="text-sm">Итого к оплате:</span>
                  <div className="text-right">
                    {discountPercent > 0 && (
                      <span className="text-xs text-on-surface-variant line-through mr-2 font-normal">
                        {totalPriceBeforeDiscount} ₽
                      </span>
                    )}
                    <span className="text-xl text-secondary">{finalPrice} ₽</span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary-container text-white py-4 rounded-xl font-headline-md font-bold hover:scale-[1.02] transition-transform shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <CalendarCheck2 size={20} />
                Оформить бронирование
              </button>

              <p className="text-center text-[11px] text-on-surface-variant opacity-70">
                Оплата производится при подтверждении заказа администратором на реке.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="booking-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 space-y-6 flex-1 text-center"
            >
              <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#25D366]/30">
                <ShieldCheck size={36} />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-river-deep font-headline-md">Заявка отправлена!</h4>
                <p className="text-sm text-on-surface-variant">
                  Мы создали вашу бронь. Теперь отправьте квитанцию нашему менеджеру в WhatsApp, чтобы окончательно зарезервировать ваши доски.
                </p>
              </div>

              {/* Boarding pass/Ticket component */}
              <div className="relative border border-outline-variant/40 rounded-2xl overflow-hidden bg-surface shadow-md">
                {/* Boarding pass top */}
                <div className="bg-river-deep text-white p-4 text-left relative overflow-hidden">
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-headline-md font-bold tracking-tight text-sm">DU-SUP TICKET</span>
                    <span className="font-mono text-xs font-semibold bg-white/20 px-2 py-0.5 rounded text-secondary">
                      {createdBooking?.id}
                    </span>
                  </div>
                  <div className="mt-4 relative z-10">
                    <p className="text-[10px] uppercase text-white/60 tracking-wider font-semibold font-label-md">Услуга</p>
                    <h5 className="font-headline-md font-bold text-base leading-tight">
                      {createdBooking?.serviceName}
                    </h5>
                  </div>
                </div>

                {/* Ticket serrated cut effect */}
                <div className="flex justify-between items-center h-4 relative -my-2 bg-transparent z-10">
                  <div className="w-4 h-4 rounded-full bg-white -ml-2 border border-outline-variant/40" />
                  <div className="border-t border-dashed border-outline-variant/50 flex-1 mx-2" />
                  <div className="w-4 h-4 rounded-full bg-white -mr-2 border border-outline-variant/40" />
                </div>

                {/* Boarding pass bottom */}
                <div className="p-4 bg-white text-left space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold font-label-md">Гость</p>
                      <p className="font-semibold text-xs truncate">{createdBooking?.customerName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold font-label-md">Телефон</p>
                      <p className="font-semibold text-xs truncate">{createdBooking?.customerPhone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold font-label-md">Дата</p>
                      <p className="font-semibold text-xs">{createdBooking?.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold font-label-md">Время</p>
                      <p className="font-semibold text-xs">{createdBooking?.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold font-label-md">Кол-во</p>
                      <p className="font-semibold text-xs">{createdBooking?.quantity} шт.</p>
                    </div>
                  </div>

                  {createdBooking?.notes && (
                    <div className="pt-2 border-t border-outline-variant/20">
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold font-label-md">Пожелания</p>
                      <p className="text-[11px] italic text-on-surface-variant line-clamp-2">
                        "{createdBooking.notes}"
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold font-label-md">Итого</p>
                      <p className="font-extrabold text-lg text-secondary">{createdBooking?.totalPrice} ₽</p>
                    </div>
                    <div className="flex flex-col items-center">
                      {/* Fake barcode simulation */}
                      <div className="flex gap-0.5 items-center h-6 justify-center">
                        <div className="w-0.5 h-full bg-black" />
                        <div className="w-1 h-full bg-black" />
                        <div className="w-0.5 h-full bg-black" />
                        <div className="w-1.5 h-full bg-black" />
                        <div className="w-0.5 h-full bg-black" />
                        <div className="w-0.5 h-full bg-black" />
                        <div className="w-1 h-full bg-black" />
                        <div className="w-0.5 h-full bg-black" />
                        <div className="w-2 h-full bg-black" />
                        <div className="w-0.5 h-full bg-black" />
                      </div>
                      <span className="text-[9px] font-mono text-on-surface-variant">DU-SUP ADVENTURE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Link button */}
              <div className="space-y-3 pt-2">
                {createdBooking && (
                  <a
                    href={getWhatsAppLink(createdBooking)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] hover:bg-opacity-90 text-white py-3.5 rounded-xl font-label-md font-bold shadow-md hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    Отправить в WhatsApp
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="w-full bg-surface-container hover:bg-surface-container-high text-river-deep py-3 rounded-xl font-label-md font-semibold transition-all cursor-pointer"
                >
                  Вернуться на сайт
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
