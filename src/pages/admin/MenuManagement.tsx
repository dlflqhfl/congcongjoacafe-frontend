import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Settings } from 'lucide-react';
import MenuForm from '../../components/admin/MenuForm';
import GlobalOptionManagement from '../../components/admin/GlobalOptionManagement';
import MenuOptionManagement from '../../components/admin/MenuOptionManagement';
import toast from 'react-hot-toast';
import { MenuItem, MenuOption } from '@/types';
import {adminAxios} from "@/api/axiosInterceptor.tsx";

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [isGlobalOptionOpen, setIsGlobalOptionOpen] = useState(false);
  const [isMenuOptionOpen, setIsMenuOptionOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [menus, setMenus] =  useState<MenuItem[]>([]);
  const [globalOptions, setGlobalOptions] = useState<MenuOption[]>([]);
  const s3BaseUrl = 'https://congcongjoa.s3.ap-northeast-2.amazonaws.com/menu/';

  const categories = ['ALL', 'COFFEE', 'NONCOFFEE', 'DESERT'];

  const fetchMenus = async () => {
    try {
      const response = await adminAxios.get('/menuList'); // API 엔드포인트를 적절히 변경하세요
      console.log(response.data.data);
      const data: MenuItem[] = Array.isArray(response.data.data) ? response.data.data.map((menu: any) => ({
        id: menu.id,
        name: menu.mnName,
        description: menu.mnDetail,
        price: menu.mnPrice,
        category: menu.mnCate,
        size: menu.mnSize,
        status: menu.mnStatus,
        images: menu.images.map((image: any) => ({
          url: `${s3BaseUrl}${image.iName}`,
          iName: image.iName,
        })),
        options: menu.menuOption,
        nutrition: {
          one: menu.nutrition.nOne,
          calories: menu.nutrition.nCal,
          carbo: menu.nutrition.nCarbo,
          protein: menu.nutrition.nProtein,
          fat: menu.nutrition.nFat,
          sodium: menu.nutrition.nSalt,
          caffeine: menu.nutrition.nCaffeine,
          sugar: menu.nutrition.nSugar,
        },
        allergyInfo: {
          milk: menu.allergy.aMilk === 'TRUE', 
          soy: menu.allergy.aSoy === 'TRUE',
          egg: menu.allergy.aEgg === 'TRUE',
          wheat: menu.allergy.aWheat === 'TRUE',
        },
      })) : [];
      setMenus(data);
    } catch (error) {
      console.error('메뉴 데이터를 가져오는 중 오류가 발생했습니다:', error);
      toast.error('메뉴 데이터를 가져오는 중 오류가 발생했습니다');
    }
  };

  useEffect(() => {
    fetchMenus().then(() => {});
  }, []);

  const fetchGlobalOptions = async () => {
    try {
      const response = await adminAxios.get('/optionList');
      console.log(response.data);
      const data: MenuOption[] = Array.isArray(response.data.data) ? response.data.data.map((option: any) => ({
        id: option.id,
        name: option.opName,
        price: option.opPrice,
        status: option.opStatus,
      })) : [];
      setGlobalOptions(data);
    } catch (error) {
      console.error('옵션 리스트를 가져오는 데 실패했습니다:', error);
      toast.error('옵션 리스트를 가져오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchGlobalOptions().then(() => {});
  }, []);


  const handleAddMenu = () => {
    setSelectedMenu(null);
    setIsMenuFormOpen(true);
  };

  const handleEditMenu = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsMenuFormOpen(true);
  };

  const handleManageOptions = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsMenuOptionOpen(true);
  };

  const handleDeleteMenu = async (id: number) => {
    try {
      await adminAxios.delete(`/deleteMenu/${id}`);
      setMenus(menus.map(menu => menu.id === id ? { ...menu, status: false } : menu));
      toast.success('메뉴가 미판매 상태로 변경되었습니다');
    } catch (error) {
      console.error('메뉴 상태 변경 중 오류가 발생했습니다', error);
      toast.error('메뉴 상태 변경 중 오류가 발생했습니다');
    }
  };

  const filteredMenus = menus.filter(menu => {
    const matchesSearchTerm = menu.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || menu.category === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

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
        <div className="relative flex items-center space-x-4">
          <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="메뉴명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          </div>
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
                사이즈
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
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                    {menu.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {menu.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {menu.price.toLocaleString()}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    menu.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {menu.status ? '판매중' : '미판매'}
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
        onClose={() => {
          setIsMenuFormOpen(false);
          fetchMenus().then(() => {});
        }}
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