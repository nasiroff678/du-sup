/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Trash2,
  Calendar,
  DollarSign,
  PlusCircle,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Booking } from '../types';

interface AdminPanelProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
  onClose: () => void;
}

export default function AdminPanel({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onClose
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Stats calculation
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const completedBookings = bookings.filter((b) => b.status === 'completed').length;

  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Filters
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerPhone.includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-background min-h-screen pt-24 pb-16 px-4 md:px-16 max-w-7xl mx-auto space-y-8">
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <span className="text-xs font-semibold text-secondary uppercase tracking-widest font-label-md">Панель Управления</span>
          <h2 className="text-3xl font-extrabold text-river-deep font-headline-lg">Заявки и Аналитика DU-SUP</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-outline-variant text-river-deep hover:bg-surface-container font-label-md transition-all cursor-pointer"
          >
            Вернуться на сайт
          </button>
        </div>
      </div>

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stat 1: Total Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-semibold font-label-md">Общая выручка</span>
            <div className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-river-deep">{totalRevenue} ₽</p>
            <p className="text-[11px] text-on-surface-variant mt-1">Без учета отмененных</p>
          </div>
        </div>

        {/* Stat 2: Total Bookings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-semibold font-label-md">Всего заявок</span>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-river-deep">{totalBookings} шт.</p>
            <p className="text-[11px] text-on-surface-variant mt-1">Всех статусов</p>
          </div>
        </div>

        {/* Stat 3: Pending */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-semibold font-label-md">Новые (Ожидают)</span>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-secondary">{pendingBookings} шт.</p>
            <p className="text-[11px] text-on-surface-variant mt-1">Требуют подтверждения</p>
          </div>
        </div>

        {/* Stat 4: Confirmed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-semibold font-label-md">Подтверждены</span>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-blue-500">{confirmedBookings} шт.</p>
            <p className="text-[11px] text-on-surface-variant mt-1">В ожидании даты</p>
          </div>
        </div>

        {/* Stat 5: Completed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-xs font-semibold font-label-md">Выполнено</span>
            <div className="p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-extrabold text-[#25D366]">{completedBookings} шт.</p>
            <p className="text-[11px] text-on-surface-variant mt-1">Успешные сплавы</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/20 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Поиск по имени, телефону, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-outline-variant pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-on-surface-variant" />
          <span className="text-xs font-semibold text-on-surface-variant font-label-md">Фильтр по статусу:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-outline-variant text-xs py-1.5 focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="all">Все заявки</option>
            <option value="pending">Ожидают подтверждения</option>
            <option value="confirmed">Подтверждены</option>
            <option value="completed">Завершены</option>
            <option value="cancelled">Отменены</option>
          </select>
        </div>
      </div>

      {/* Bookings Table/Grid */}
      <div className="bg-white rounded-2xl shadow-md border border-outline-variant/20 overflow-hidden">
        {filteredBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-river-deep font-headline-md text-xs uppercase tracking-wider">
                  <th className="p-4">Бронь / Гость</th>
                  <th className="p-4">Услуга</th>
                  <th className="p-4">Дата и Время</th>
                  <th className="p-4">Параметры</th>
                  <th className="p-4">Итого</th>
                  <th className="p-4">Статус</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors text-sm"
                  >
                    {/* ID & Customer */}
                    <td className="p-4">
                      <div className="font-bold text-river-deep">{booking.id}</div>
                      <div className="font-semibold text-on-surface-variant">{booking.customerName}</div>
                      <div className="text-xs text-on-surface-variant">{booking.customerPhone}</div>
                    </td>

                    {/* Service */}
                    <td className="p-4">
                      <span className="font-medium text-river-deep block max-w-[180px] truncate">
                        {booking.serviceName}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-secondary px-1.5 py-0.5 bg-secondary/10 rounded font-label-md">
                        {booking.serviceType === 'tour'
                          ? 'Сплав'
                          : booking.serviceType === 'rental'
                          ? 'Прокат'
                          : 'Йога'}
                      </span>
                    </td>

                    {/* Date/Time */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-river-deep">
                        <Calendar size={12} />
                        {booking.date}
                      </div>
                      <div className="text-xs text-on-surface-variant font-medium mt-0.5">{booking.timeSlot}</div>
                    </td>

                    {/* Quantity & Promo */}
                    <td className="p-4">
                      <div>{booking.quantity} шт.</div>
                      {booking.discountCode ? (
                        <span className="text-[10px] text-green-600 font-bold block">
                          🎟️ {booking.discountCode}
                        </span>
                      ) : (
                        <span className="text-xs text-on-surface-variant">-</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-bold text-river-deep">{booking.totalPrice} ₽</td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'pending'
                            ? 'bg-secondary/10 text-secondary border border-secondary/20'
                            : booking.status === 'confirmed'
                            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            : booking.status === 'completed'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}
                      >
                        {booking.status === 'pending' && 'Новый'}
                        {booking.status === 'confirmed' && 'Подтвержден'}
                        {booking.status === 'completed' && 'Завершен'}
                        {booking.status === 'cancelled' && 'Отменен'}
                      </span>
                      {booking.notes && (
                        <div className="text-[11px] text-on-surface-variant mt-1 max-w-[150px] truncate italic">
                          "{booking.notes}"
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-md transition-colors cursor-pointer text-xs font-bold"
                            title="Подтвердить"
                          >
                            Подтвердить
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'completed')}
                            className="bg-[#25D366] hover:bg-opacity-95 text-white p-1.5 rounded-md transition-colors cursor-pointer text-xs font-bold"
                            title="Завершить"
                          >
                            Завершить
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md transition-colors cursor-pointer text-xs font-bold"
                            title="Отменить"
                          >
                            Отмена
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Вы уверены, что хотите удалить эту бронь?')) {
                              onDeleteBooking(booking.id);
                            }
                          }}
                          className="bg-surface-container hover:bg-red-100 text-red-600 p-1.5 rounded-md transition-colors cursor-pointer"
                          title="Удалить"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-on-surface-variant flex flex-col items-center justify-center space-y-3">
            <AlertCircle size={40} className="text-on-surface-variant opacity-60" />
            <p className="text-base font-semibold">Заявок не найдено</p>
            <p className="text-xs">Попробуйте изменить поисковый запрос или фильтр по статусу.</p>
          </div>
        )}
      </div>
    </div>
  );
}
