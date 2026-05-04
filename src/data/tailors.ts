export type Tailor = {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  area: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  startingPrice: number;
  image: string;
  coverImage: string;
  verified: boolean;
  yearsExperience: number;
  description: string;
  services: { id: string; name: string; price: number; duration: string }[];
  gallery: string[];
  reviews: { id: string; user: string; rating: number; comment: string; date: string }[];
  openingHours: string;
  phone: string;
  distance: number;
  tags: string[];
  homeVisit: boolean;
  delivery: boolean;
  profileViews?: number;
};

export const categories = [
  { id: '1', name: 'Abaya', nameAr: 'عباية', icon: 'woman-outline', color: '#7C2D5C' },
  { id: '2', name: 'Dresses', nameAr: 'فساتين', icon: 'flower-outline', color: '#BE185D' },
  { id: '3', name: 'Suits', nameAr: 'بدلات', icon: 'briefcase-outline', color: '#1E3A8A' },
  { id: '4', name: 'Bridal Couture', nameAr: 'فساتين زفاف', icon: 'heart-outline', color: '#9D174D' },
  { id: '5', name: 'Ramadan & Eid', nameAr: 'رمضان والعيد', icon: 'moon-outline', color: '#0F766E' },
  { id: '6', name: 'Alterations', nameAr: 'تعديلات', icon: 'cut-outline', color: '#854D0E' },
];

export const areas = [
  'Salmiya', 'Hawally', 'Kuwait City', 'Jabriya', 'Salwa',
  'Mishref', 'Farwaniya', 'Al Jahra', 'Mahboula', 'Fahaheel',
];

export const tailors: Tailor[] = [
  {
    id: '1',
    name: 'Noor Abaya House',
    nameAr: 'دار نور للعبايات',
    specialty: 'Designer Abayas',
    area: 'Hawally',
    rating: 4.9,
    reviewCount: 567,
    priceRange: 'KD 30 - 200',
    startingPrice: 30,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1623580905752-9caa4f0e3e7d?w=800&q=80',
    verified: true,
    yearsExperience: 12,
    description: 'Contemporary abaya designs with traditional elegance. Custom embroidery and crystal work available.',
    services: [
      { id: 's1', name: 'Classic Abaya', price: 45, duration: '5 days' },
      { id: 's2', name: 'Designer Abaya', price: 95, duration: '10 days' },
      { id: 's3', name: 'Bridal Abaya', price: 250, duration: '21 days' },
      { id: 's4', name: 'Alterations', price: 10, duration: '3 days' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1623580905752-9caa4f0e3e7d?w=600&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
      'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=600&q=80',
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    ],
    reviews: [
      { id: 'r1', user: 'Fatima K.', rating: 5, comment: 'Stunning bridal abaya, exceeded expectations!', date: '1 week ago' },
      { id: 'r2', user: 'Mariam S.', rating: 5, comment: 'Beautiful work and very professional staff.', date: '3 weeks ago' },
      { id: 'r3', user: 'Aisha N.', rating: 5, comment: 'The embroidery is exquisite. Will return!', date: '1 month ago' },
    ],
    openingHours: '10:00 AM - 11:00 PM',
    phone: '+965 9999 5678',
    distance: 4.1,
    tags: ['Designer', 'Embroidery', 'Bridal'],
    homeVisit: true,
    delivery: true,
    profileViews: 2483,
  },
  {
    id: '2',
    name: 'Lujain Couture',
    nameAr: 'لجين كوتور',
    specialty: 'Wedding & Evening',
    area: 'Salwa',
    rating: 4.9,
    reviewCount: 256,
    priceRange: 'KD 80 - 800',
    startingPrice: 80,
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
    verified: true,
    yearsExperience: 15,
    description: 'Luxury bridal and evening wear with hand-beaded couture pieces. By appointment only.',
    services: [
      { id: 's1', name: 'Evening Gown', price: 150, duration: '14 days' },
      { id: 's2', name: 'Wedding Dress', price: 600, duration: '45 days' },
      { id: 's3', name: 'Custom Couture', price: 400, duration: '30 days' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80',
      'https://images.unsplash.com/photo-1605086275953-9b5e6e9e6cc1?w=600&q=80',
      'https://images.unsplash.com/photo-1525257831700-e23ade4761fc?w=600&q=80',
      'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=600&q=80',
      'https://images.unsplash.com/photo-1546961342-1531b85ed94f?w=600&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    ],
    reviews: [
      { id: 'r1', user: 'Sara A.', rating: 5, comment: 'My dream wedding dress came to life!', date: '3 days ago' },
      { id: 'r2', user: 'Layla H.', rating: 5, comment: 'Pure artistry. Worth the wait.', date: '2 weeks ago' },
    ],
    openingHours: 'By Appointment',
    phone: '+965 9999 7890',
    distance: 5.2,
    tags: ['Luxury', 'Couture', 'Bridal'],
    homeVisit: true,
    delivery: false,
    profileViews: 1820,
  },
  {
    id: '3',
    name: 'Dana Atelier',
    nameAr: 'أتيليه دانة',
    specialty: 'Modern Dresses',
    area: 'Salmiya',
    rating: 4.8,
    reviewCount: 312,
    priceRange: 'KD 40 - 180',
    startingPrice: 40,
    image: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80',
    verified: true,
    yearsExperience: 9,
    description: 'Contemporary dress design studio. Specializing in cocktail, day, and occasion wear with European tailoring.',
    services: [
      { id: 's1', name: 'Day Dress', price: 60, duration: '7 days' },
      { id: 's2', name: 'Cocktail Dress', price: 110, duration: '10 days' },
      { id: 's3', name: 'Occasion Gown', price: 180, duration: '14 days' },
      { id: 's4', name: 'Alterations', price: 12, duration: '3 days' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
      'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    ],
    reviews: [
      { id: 'r1', user: 'Hessa M.', rating: 5, comment: 'Modern, elegant, perfectly fitted.', date: '5 days ago' },
      { id: 'r2', user: 'Reem A.', rating: 5, comment: 'Love the European cuts!', date: '2 weeks ago' },
    ],
    openingHours: '11:00 AM - 10:00 PM',
    phone: '+965 9999 2345',
    distance: 2.3,
    tags: ['Modern', 'European', 'Occasion'],
    homeVisit: false,
    delivery: true,
    profileViews: 1542,
  },
  {
    id: '4',
    name: 'Maryam Fashion House',
    nameAr: 'دار مريم للأزياء',
    specialty: 'Ramadan & Eid Wear',
    area: 'Jabriya',
    rating: 4.7,
    reviewCount: 423,
    priceRange: 'KD 25 - 120',
    startingPrice: 25,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
    verified: true,
    yearsExperience: 14,
    description: 'Festive jalabiyas and Eid wear with traditional Khaleeji embroidery. Family-run for three generations.',
    services: [
      { id: 's1', name: 'Jalabiya', price: 35, duration: '4 days' },
      { id: 's2', name: 'Eid Kaftan', price: 65, duration: '7 days' },
      { id: 's3', name: 'Embroidered Set', price: 120, duration: '10 days' },
      { id: 's4', name: 'Alterations', price: 8, duration: '2 days' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80',
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
      'https://images.unsplash.com/photo-1623580905752-9caa4f0e3e7d?w=600&q=80',
    ],
    reviews: [
      { id: 'r1', user: 'Noura K.', rating: 5, comment: 'My family\'s tailor for years. Always reliable.', date: '1 week ago' },
      { id: 'r2', user: 'Bashayer N.', rating: 4, comment: 'Beautiful Eid kaftan, fair prices.', date: '1 month ago' },
    ],
    openingHours: '9:00 AM - 11:00 PM',
    phone: '+965 9999 3456',
    distance: 3.5,
    tags: ['Traditional', 'Express', 'Khaleeji'],
    homeVisit: true,
    delivery: true,
    profileViews: 2105,
  },
  {
    id: '5',
    name: 'Atelier Yasmine',
    nameAr: 'أتيليه ياسمين',
    specialty: 'Tailored Suits',
    area: 'Kuwait City',
    rating: 4.8,
    reviewCount: 189,
    priceRange: 'KD 90 - 320',
    startingPrice: 90,
    image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    verified: true,
    yearsExperience: 11,
    description: 'Sharp, feminine tailoring for power dressing. Imported wools and silks from Italy.',
    services: [
      { id: 's1', name: 'Blazer', price: 110, duration: '10 days' },
      { id: 's2', name: 'Trouser Suit', price: 220, duration: '14 days' },
      { id: 's3', name: 'Skirt Suit', price: 200, duration: '14 days' },
      { id: 's4', name: 'Tailored Shirt', price: 35, duration: '5 days' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
      'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80',
    ],
    reviews: [
      { id: 'r1', user: 'Dalal R.', rating: 5, comment: 'Best work suits I have ever owned.', date: '5 days ago' },
      { id: 'r2', user: 'Hanan A.', rating: 4, comment: 'Excellent quality and fit.', date: '2 weeks ago' },
    ],
    openingHours: '10:00 AM - 9:00 PM',
    phone: '+965 9999 9012',
    distance: 6.8,
    tags: ['Premium', 'Italian Fabric', 'Bespoke'],
    homeVisit: false,
    delivery: true,
    profileViews: 980,
  },
  {
    id: '6',
    name: 'Threads of Joud',
    nameAr: 'خيوط جود',
    specialty: 'Contemporary Fusion',
    area: 'Mishref',
    rating: 4.6,
    reviewCount: 134,
    priceRange: 'KD 30 - 150',
    startingPrice: 30,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=800&q=80',
    verified: false,
    yearsExperience: 6,
    description: 'Young, modern atelier mixing Khaleeji heritage with contemporary cuts. Loved by Gen Z brides.',
    services: [
      { id: 's1', name: 'Casual Dress', price: 45, duration: '5 days' },
      { id: 's2', name: 'Modern Abaya', price: 80, duration: '7 days' },
      { id: 's3', name: 'Fusion Outfit', price: 130, duration: '10 days' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&q=80',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    ],
    reviews: [
      { id: 'r1', user: 'Farah M.', rating: 5, comment: 'Fresh designs, great service.', date: '1 week ago' },
      { id: 'r2', user: 'Ghala J.', rating: 4, comment: 'Trendy place, modern vibe.', date: '3 weeks ago' },
    ],
    openingHours: '11:00 AM - 10:00 PM',
    phone: '+965 9999 4567',
    distance: 7.4,
    tags: ['Modern', 'Trendy', 'Affordable'],
    homeVisit: true,
    delivery: true,
    profileViews: 712,
  },
];

export type Booking = {
  id: string;
  tailorId: string;
  tailorName: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'upcoming' | 'in_progress' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  price: number;
  image: string;
  pickupDate?: string;
  visitType: 'in_store' | 'home_visit';
};

export const bookings: Booking[] = [
  {
    id: 'b1',
    tailorId: '1',
    tailorName: 'Noor Abaya House',
    service: 'Designer Abaya',
    date: 'Oct 15, 2025',
    time: '4:30 PM',
    status: 'in_progress',
    price: 95,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
    pickupDate: 'Oct 22, 2025',
    visitType: 'in_store',
  },
  {
    id: 'b2',
    tailorId: '2',
    tailorName: 'Lujain Couture',
    service: 'Evening Gown',
    date: 'Oct 18, 2025',
    time: '11:00 AM',
    status: 'upcoming',
    price: 150,
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80',
    visitType: 'home_visit',
  },
  {
    id: 'b3',
    tailorId: '4',
    tailorName: 'Maryam Fashion House',
    service: 'Eid Kaftan',
    date: 'Sep 28, 2025',
    time: '6:00 PM',
    status: 'completed',
    price: 65,
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&q=80',
    visitType: 'in_store',
  },
  {
    id: 'b4',
    tailorId: '3',
    tailorName: 'Dana Atelier',
    service: 'Cocktail Dress',
    date: 'Sep 12, 2025',
    time: '2:00 PM',
    status: 'delivered',
    price: 110,
    image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=400&q=80',
    visitType: 'home_visit',
  },
];

export type RecentWork = {
  id: string;
  tailorId: string;
  tailorName: string;
  image: string;
  caption: string;
  likes: number;
  category: string;
};

export const recentWork: RecentWork[] = [
  { id: 'w1', tailorId: '2', tailorName: 'Lujain Couture', image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=80', caption: 'Hand-beaded bridal gown', likes: 412, category: 'Bridal' },
  { id: 'w2', tailorId: '1', tailorName: 'Noor Abaya House', image: 'https://images.unsplash.com/photo-1623580905752-9caa4f0e3e7d?w=600&q=80', caption: 'Crystal embroidered abaya', likes: 287, category: 'Abaya' },
  { id: 'w3', tailorId: '3', tailorName: 'Dana Atelier', image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80', caption: 'Emerald cocktail dress', likes: 198, category: 'Dresses' },
  { id: 'w4', tailorId: '5', tailorName: 'Atelier Yasmine', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', caption: 'Tailored trouser suit', likes: 156, category: 'Suits' },
  { id: 'w5', tailorId: '4', tailorName: 'Maryam Fashion House', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80', caption: 'Festive Eid kaftan', likes: 234, category: 'Eid' },
  { id: 'w6', tailorId: '6', tailorName: 'Threads of Joud', image: 'https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=600&q=80', caption: 'Modern fusion abaya', likes: 142, category: 'Modern' },
];
