// Mock incoming bookings shown in the tailor dashboard.
// In production these would be real customers booking the tailor's shop.

export type TailorBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'ready'
  | 'delivered'
  | 'declined'
  | 'cancelled';

export type TailorBooking = {
  id: string;
  customerName: string;
  customerInitials: string;
  customerImage: string;
  service: string;
  servicePrice: number;
  visitType: 'in_store' | 'home_visit';
  date: string;
  time: string;
  notes?: string;
  status: TailorBookingStatus;
  receivedAt: string;
  area?: string;
};

export const incomingBookings: TailorBooking[] = [
  {
    id: 'tb1',
    customerName: 'Fatima Al-Sabah',
    customerInitials: 'FA',
    customerImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    service: 'Bridal Abaya',
    servicePrice: 250,
    visitType: 'in_store',
    date: 'Oct 22, 2025',
    time: '5:00 PM',
    notes:
      'Prefer dark plum colour with crystal work on cuffs. Wedding is in 4 weeks.',
    status: 'pending',
    receivedAt: '2 hours ago',
  },
  {
    id: 'tb2',
    customerName: 'Mariam Al-Otaibi',
    customerInitials: 'MO',
    customerImage:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    service: 'Designer Abaya',
    servicePrice: 95,
    visitType: 'home_visit',
    date: 'Oct 23, 2025',
    time: '11:00 AM',
    notes: 'Please bring fabric samples, I live in Salmiya block 12.',
    status: 'pending',
    receivedAt: '5 hours ago',
    area: 'Salmiya',
  },
  {
    id: 'tb3',
    customerName: 'Aisha Al-Mutawa',
    customerInitials: 'AM',
    customerImage:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
    service: 'Classic Abaya',
    servicePrice: 45,
    visitType: 'in_store',
    date: 'Oct 18, 2025',
    time: '4:30 PM',
    notes: 'For Eid, simple cut, no embroidery.',
    status: 'confirmed',
    receivedAt: 'Yesterday',
  },
  {
    id: 'tb4',
    customerName: 'Noura Al-Khalifa',
    customerInitials: 'NK',
    customerImage:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    service: 'Designer Abaya',
    servicePrice: 95,
    visitType: 'in_store',
    date: 'Oct 14, 2025',
    time: '6:00 PM',
    notes: 'Embroidery in gold thread.',
    status: 'in_progress',
    receivedAt: '3 days ago',
  },
  {
    id: 'tb5',
    customerName: 'Layla Al-Saleh',
    customerInitials: 'LS',
    customerImage:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    service: 'Alterations',
    servicePrice: 10,
    visitType: 'in_store',
    date: 'Oct 10, 2025',
    time: '2:00 PM',
    notes: 'Hem two abayas.',
    status: 'ready',
    receivedAt: '5 days ago',
  },
  {
    id: 'tb6',
    customerName: 'Bashayer Al-Rashid',
    customerInitials: 'BR',
    customerImage:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    service: 'Bridal Abaya',
    servicePrice: 250,
    visitType: 'home_visit',
    date: 'Sep 28, 2025',
    time: '7:00 PM',
    notes: '',
    status: 'delivered',
    receivedAt: '2 weeks ago',
    area: 'Hawally',
  },
];
