import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Settings, Plus } from 'lucide-react';
import { menuData } from '../../data/menuData';
import OptionManagementModal from '../../components/owner/OptionManagementModal';
import MenuSelectionModal from '../../components/owner/MenuSelectionModal';
import { MenuItem } from '../../types';
import toast from 'react-hot-toast';

const OwnerMenus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [isMenuSelectionOpen, setIsMenuSelectionOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const isMobile = window.innerWidth < 768;

  // 예시 메뉴 데이터
  const storeMenus = [
    {
      id: 'signature-americano',
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
          alt: '시그니처 아메리카노'
        }
      ],
      isNew: false,
      isRecommended: true,
      isBestSeller: true,
      storeId: 'store1'
    },
    {
      id: 'vanilla-latte',
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
          alt: '바닐라 라떼'
        }
      ],
      isNew: true,
      isRecommended: false,
      isBestSeller: false,
      storeId: 'store1'
    },
    {
      id: 'tiramisu',
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
          alt: '티라미수'
        }
      ],
      isNew: false,
      isRecommended: true,
      isBestSeller: true,
      storeId: 'store1'
    }
  ];

  const handleManageOptions = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsOptionModalOpen(true);
  };

  const handleDeleteMenu = (id: string) => {
    toast.success('메뉴가 삭제되었습니다');
  };

  const filteredMenus = storeMenus.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">메뉴 관리</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuSelectionOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          메뉴 추가
        </motion.button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="메뉴명 또는 카테고리로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {isMobile ? (
        // Mobile view - Card layout
        <div className="grid grid-cols-1 gap-4">
          {filteredMenus.map((menu) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="flex">
                <img
                  src={menu.images[0].url}
                  alt={menu.name}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{menu.name}</h3>
                      <p className="text-sm text-gray-500">{menu.nameEng}</p>
                      <p className="text-sm text-primary mt-1">
                        {menu.price.toLocaleString()}원
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleManageOptions(menu)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Settings className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(menu.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Desktop view - Table layout
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  메뉴
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMenus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={menu.images[0].url}
                        alt={menu.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                        <div className="text-sm text-gray-500">{menu.nameEng}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                      {menu.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {menu.price.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      menu.isNew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {menu.isNew ? 'NEW' : '판매중'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleManageOptions(menu)}
                      className="text-gray-600 hover:text-primary mr-3"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMenu(menu.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OptionManagementModal
        isOpen={isOptionModalOpen}
        onClose={() => setIsOptionModalOpen(false)}
        menu={selectedMenu}
      />

      <MenuSelectionModal
        isOpen={isMenuSelectionOpen}
        onClose={() => setIsMenuSelectionOpen(false)}
      />
    </div>
  );
};

export default OwnerMenus;