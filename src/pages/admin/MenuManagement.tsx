import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Settings } from 'lucide-react';
import { menuData } from '../../data/menuData';
import MenuForm from '../../components/admin/MenuForm';
import GlobalOptionManagement from '../../components/admin/GlobalOptionManagement';
import MenuOptionManagement from '../../components/admin/MenuOptionManagement';
import toast from 'react-hot-toast';

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [isGlobalOptionOpen, setIsGlobalOptionOpen] = useState(false);
  const [isMenuOptionOpen, setIsMenuOptionOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // 실제로는 API를 통해 전체 옵션 목록을 가져옴
  const globalOptions = {
    sizes: [
      { id: 'size1', name: 'Short', price: -500, volume: '237ml', available: true },
      { id: 'size2', name: 'Tall', price: 0, volume: '355ml', available: true },
      { id: 'size3', name: 'Grande', price: 500, volume: '473ml', available: true }
    ],
    extras: [
      { id: 'extra1', name: '샷 추가', price: 500, available: true },
      { id: 'extra2', name: '시럽 추가', price: 300, available: true },
      { id: 'extra3', name: '휘핑크림', price: 500, available: true }
    ]
  };

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setIsMenuFormOpen(true);
  };

  const handleEditMenu = (menu) => {
    setSelectedMenu(menu);
    setIsMenuFormOpen(true);
  };

  const handleManageOptions = (menu) => {
    setSelectedMenu(menu);
    setIsMenuOptionOpen(true);
  };

  const handleDeleteMenu = (id: string) => {
    toast.success('메뉴가 삭제되었습니다');
  };

  const filteredMenus = menuData.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">메뉴 관리</h1>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsGlobalOptionOpen(true)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
          >
            <Settings className="w-5 h-5 mr-2" />
            옵션 관리
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddMenu}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            신규 메뉴 등록
          </motion.button>
        </div>
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
                기본 가격
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
                    onClick={() => handleEditMenu(menu)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
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

      <MenuForm
        isOpen={isMenuFormOpen}
        onClose={() => setIsMenuFormOpen(false)}
        menu={selectedMenu}
      />

      <GlobalOptionManagement
        isOpen={isGlobalOptionOpen}
        onClose={() => setIsGlobalOptionOpen(false)}
      />

      {selectedMenu && (
        <MenuOptionManagement
          isOpen={isMenuOptionOpen}
          onClose={() => setIsMenuOptionOpen(false)}
          menu={selectedMenu}
          globalOptions={globalOptions}
        />
      )}
    </div>
  );
};

export default MenuManagement;