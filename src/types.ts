/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tour {
  id: string;
  title: string;
  distance: string;
  duration: string;
  price: number;
  description: string;
  imageUrl: string;
  features: string[];
}

export interface RentalOption {
  id: string;
  name: string;
  location: string;
  durationOptions: {
    duration: string;
    price: number;
  }[];
  description: string;
  imageUrl: string;
  badge?: string;
  maxCapacity?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceType: 'tour' | 'rental' | 'yoga';
  serviceName: string;
  date: string;
  timeSlot: string;
  quantity: number;
  totalPrice: number;
  discountCode?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  isActive: boolean;
  description: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    value: string;
    icon: string;
  }[];
}
