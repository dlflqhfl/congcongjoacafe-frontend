export interface MenuItem {
  id: string;
  name: string;
  nameEng: string;
  description: string;
  price: number;
  category: string;
  type: 'beverage' | 'food';
  available: boolean;
  images: Array<{
    url: string;
    isMain: boolean;
    alt?: string;
  }>;
  isNew: boolean;
  isRecommended: boolean;
  isBestSeller: boolean;
  options?: {
    sizes?: Array<{
      id: string;
      name: string;
      price: number;
      volume: string;
      available: boolean;
    }>;
    temperatures?: Array<{
      id: string;
      name: string;
      price: number;
      available: boolean;
      image: string;
    }>;
    extras?: Array<{
      id: string;
      name: string;
      price: number;
      available: boolean;
    }>;
  };
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    sodium: number;
    caffeine: number;
    sugar: number;
  };
  allergyInfo?: string[];
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  size: string;
  temperature: string;
  extras: string[];
  totalPrice: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  businessHours: string;
  status: 'OPEN' | 'CLOSED';
  rating: number;
  reviewCount: number;
  distance?: string;
  facilities: string[];
  menus: string[];
  image: string;
  isOpen: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'CUSTOMER' | 'OWNER' | 'ADMIN';
  point: number;
  level: 'Green' | 'Gold' | 'Diamond';
  createdAt: string;
  verified: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_MENU';
  value: number;
  minOrderAmount?: number;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  items: Array<{
    menuId: string;
    name: string;
    quantity: number;
    options: {
      size?: string;
      temperature?: string;
      extras?: string[];
    };
    price: number;
  }>;
  totalPrice: number;
  paymentMethod: 'CARD' | 'KAKAO_PAY';
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
  usedPoint: number;
  earnedPoint: number;
  couponId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  orderId: string;
  storeId: string;
  menuIds: string[];
  rating: number;
  content: string;
  images?: Array<{
    url: string;
    alt?: string;
  }>;
  reply?: {
    content: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface MenuOption {
  id: string;
  name: string;
  price: number;
  volume?: string;
  image?: string;
  ratio?: number;
  available: boolean;
}