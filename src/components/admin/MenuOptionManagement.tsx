import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MenuItem, MenuOption } from '../../types';
import toast from 'react-hot-toast';

interface MenuOptionManagementProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem;
  globalOptions: {
    sizes: MenuOption[];
    extras: MenuOption[];
  };
}

const MenuOptionManagement: React.FC<MenuOptionManagementProps> = ({
  isOpen,
  onClose,
  menu,
  globalOptions
}) => {
  const [selectedOptions, setSelectedOptions] = useState({
    sizes: menu.options?.sizes || [],
    extras: menu.options?.extras || []
  });
  const isMobile = window.innerWidth < 768;

  const handleToggleOption = (option: MenuOption, type: 'sizes' | 'extras') => {
    setSelectedOptions(prev => {
      const isSelected = prev[type].some(o => o.id === option.id);
      return {
        ...prev,
        [type]: isSelected
          ? prev[type].filter(o => o.id !== option.id)
          : [...prev[type], option]
      };
    });
  };

  const handleSave = () => {
    // API call would go here
    toast.success('메뉴 옵션이 저장되었습니다');
    onClose();
  };

  const renderOptionList = (title: string, options: MenuOption[], type: 'sizes' | 'extras') => (
    <div>
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedOptions[type].some(o => o.id === option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleToggleOption(option, type)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-white border-2 border-transparent'
              }`}
            >
              <div>
                <p className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                  {option.name}
                </p>
                <p className="text-sm text-gray-500">
                  {option.price > 0 ? `+${option.price.toLocaleString()}원` : 
                   option.price < 0 ? `${option.price.toLocaleString()}원` : '추가 비용 없음'}
                  {option.volume && ` · ${option.volume}`}
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                isSelected 
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {isSelected && (
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

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
            className={`${
              isMobile
                ? 'fixed bottom-0 w-full'
                : 'relative w-full max-w-2xl mx-4'
            } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
            onClick={e => e.stopPropagation()}
          >
            {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">{menu.name}</h2>
                <p className="text-sm text-gray-500">메뉴 옵션 관리</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {menu.type === 'beverage' && (
                renderOptionList('사이즈', globalOptions.sizes, 'sizes')
              )}
              {renderOptionList('퍼스널 옵션', globalOptions.extras, 'extras')}
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                저장
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuOptionManagement;