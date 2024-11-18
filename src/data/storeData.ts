export interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  image: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  businessHours: string;
  facilities: string[];
  menus: string[]; // 해당 매장에서 제공하는 메뉴 ID 목록
}

export const stores: Store[] = [
  {
    id: 'store-1',
    name: '콩콩조아 강남점',
    address: '서울시 강남구 테헤란로 123',
    distance: '0.5km',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
    rating: 4.8,
    reviewCount: 2134,
    isOpen: true,
    businessHours: '09:00 - 22:00',
    facilities: ['주차', '와이파이', '배달'],
    menus: ['coffee-1', 'coffee-2', 'non-coffee-1']
  },
  {
    id: 'store-2',
    name: '콩콩조아 역삼점',
    address: '서울시 강남구 역삼로 456',
    distance: '1.2km',
    image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
    rating: 4.7,
    reviewCount: 1856,
    isOpen: true,
    businessHours: '08:00 - 21:00',
    facilities: ['와이파이', '배달'],
    menus: ['coffee-2', 'dessert-1', 'dessert-2']
  },
];