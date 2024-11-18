export const menuData = [
  {
    id: '1',
    name: '콩콩 시그니처 아메리카노',
    nameEng: 'CongCong Signature Americano',
    description: '콩콩조아만의 특별한 블렌딩 원두로 추출한 아메리카노',
    price: 4500,
    category: 'coffee',
    type: 'beverage',
    available: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c',
        isMain: true,
        alt: '시그니처 아메리카노 정면'
      },
      {
        url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2',
        isMain: false,
        alt: '시그니처 아메리카노 위'
      },
      {
        url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
        isMain: false,
        alt: '시그니처 아메리카노 각도'
      }
    ],
    isNew: false,
    isRecommended: true,
    isBestSeller: true,
    options: {
      sizes: [
        { id: 'Short', name: 'Short', price: -500, volume: '237ml', available: true },
        { id: 'Tall', name: 'Tall', price: 0, volume: '355ml', available: true },
        { id: 'Grande', name: 'Grande', price: 500, volume: '473ml', available: true },
        { id: 'Venti', name: 'Venti', price: 1000, volume: '591ml', available: true }
      ],
      temperatures: [
        { id: 'HOT', name: 'HOT', price: 0, available: true, image: '/images/hot-icon.png' },
        { id: 'ICED', name: 'ICED', price: 0, available: true, image: '/images/iced-icon.png' }
      ],
      extras: [
        { id: 'shot', name: '샷 추가', price: 500, available: true },
        { id: 'syrup', name: '시럽 추가', price: 300, available: true }
      ]
    },
    nutrition: {
      calories: 5,
      protein: 0,
      fat: 0,
      sodium: 5,
      caffeine: 150,
      sugar: 0
    }
  },
  {
    id: '2',
    name: '바닐라 라떼',
    nameEng: 'Vanilla Latte',
    description: '부드러운 우유와 바닐라 시럽의 조화로운 맛',
    price: 5500,
    category: 'coffee',
    type: 'beverage',
    available: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592318951566-70f6f0ac3c87',
        isMain: true,
        alt: '바닐라 라떼 정면'
      },
      {
        url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
        isMain: false,
        alt: '바닐라 라떼 위'
      },
      {
        url: 'https://images.unsplash.com/photo-1585494156145-1c60a4fe952b',
        isMain: false,
        alt: '바닐라 라떼 각도'
      }
    ],
    isNew: true,
    isRecommended: false,
    isBestSeller: false,
    options: {
      sizes: [
        { id: 'Short', name: 'Short', price: -500, volume: '237ml', available: true },
        { id: 'Tall', name: 'Tall', price: 0, volume: '355ml', available: true },
        { id: 'Grande', name: 'Grande', price: 500, volume: '473ml', available: true },
        { id: 'Venti', name: 'Venti', price: 1000, volume: '591ml', available: true }
      ],
      temperatures: [
        { id: 'HOT', name: 'HOT', price: 0, available: true, image: '/images/hot-icon.png' },
        { id: 'ICED', name: 'ICED', price: 0, available: true, image: '/images/iced-icon.png' }
      ],
      extras: [
        { id: 'shot', name: '샷 추가', price: 500, available: true },
        { id: 'syrup', name: '시럽 추가', price: 300, available: true },
        { id: 'whipping', name: '휘핑크림', price: 500, available: true }
      ]
    },
    nutrition: {
      calories: 180,
      protein: 6,
      fat: 4,
      sodium: 150,
      caffeine: 75,
      sugar: 28
    },
    allergyInfo: ['우유']
  },
  {
    id: '3',
    name: '티라미수',
    nameEng: 'Tiramisu',
    description: '에스프레소를 적신 부드러운 케이크와 마스카포네 크림',
    price: 6500,
    category: 'dessert',
    type: 'food',
    available: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
        isMain: true,
        alt: '티라미수 정면'
      },
      {
        url: 'https://images.unsplash.com/photo-1586040140378-b5634cb4c8fc',
        isMain: false,
        alt: '티라미수 위'
      },
      {
        url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
        isMain: false,
        alt: '티라미수 단면'
      }
    ],
    isNew: false,
    isRecommended: true,
    isBestSeller: true,
    options: {
      extras: [
        { id: 'whipping', name: '휘핑크림 추가', price: 500, available: true }
      ]
    },
    nutrition: {
      calories: 350,
      protein: 6,
      fat: 18,
      sodium: 180,
      caffeine: 30,
      sugar: 28
    },
    allergyInfo: ['우유', '계란']
  }
];