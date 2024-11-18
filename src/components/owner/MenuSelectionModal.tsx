import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus } from 'lucide-react';
import { menuData } from '../../data/menuData';
import toast from 'react-hot-toast';

interface MenuSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuSelectionModal: React.FC<MenuSelectionModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const isMobile = window.innerWidth < 768;

  // 실제로는 API를 통해 관리자가 등록한 전체 메뉴 중 해당 매장에 없는 메뉴만 가져와야 함
  const availableMenus = menuData.filter(menu => !menu.storeId);

  const filteredMenus = availableMenus.filter(menu =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    menu.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleMenu = (menuId: string) => {
    setSelectedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleAddMenus = () => {
    if (selectedMenus.length === 0) {
      toast.error('메뉴를 선택해주세요');
      return;
    }

    // API call would go here
    toast.success('선택한 메뉴가 추가되었습니다');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`${
              isMobile
                ? 'fixed inset-x-0 bottom-0 max-h-[90vh]'
                : 'relative w-full max-w-2xl mx-4'
            } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
            onClick={e => e.stopPropagation()}
          >
            {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">메뉴 추가</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
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

            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMenus.map((menu) => (
                  <motion.div
                    key={menu.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative bg-white border-2 rounded-xl overflow-hidden cursor-pointer ${
                      selectedMenus.includes(menu.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleToggleMenu(menu.id)}
                  >
                    <div className="flex">
                      <img
                        src={menu.images[0].url}
                        alt={menu.name}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <h3 className="font-medium">{menu.name}</h3>
                        <p className="text-sm text-gray-500">{menu.nameEng}</p>
                        <p className="text-sm text-primary mt-1">
                          {menu.price.toLocaleString()}원
                        </p>
                      </div>
                      {selectedMenus.includes(menu.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleAddMenus}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                {selectedMenus.length}개 메뉴 추가
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuSelectionModal;