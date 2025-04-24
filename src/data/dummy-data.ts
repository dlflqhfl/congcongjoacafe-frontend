import {MenuItem} from "@/types";

export const dummyMenu: MenuItem = {
    id: 1,
    name: '아메리카노',
    price: 4500,
    category: 'COFFEE',
    size: 'M',
    description: '깊고 풍부한 맛의 에스프레소와 뜨거운 물을 섞어 만든 커피',
    images: [
        { url: '/placeholder.svg?height=300&width=300', iName: 'americano-main', isMain: true, alt: '아메리카노 메인 이미지' },
        { url: '/placeholder.svg?height=300&width=300', iName: 'americano-2', isMain: false, alt: '아메리카노 이미지 2' },
        { url: '/placeholder.svg?height=300&width=300', iName: 'americano-3', isMain: false, alt: '아메리카노 이미지 3' },
    ],
    nutrition: {
        one: 355,
        calories: 15,
        carbo: 0,
        protein: 1,
        fat: 0,
        sodium: 5,
        caffeine: 150,
        sugar: 0,
    },
    allergyInfo: {
        milk: false,
        soy: false,
        egg: false,
        wheat: false,
    },
    status: true,
};

