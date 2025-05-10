import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MenuItem, MenuOption } from '../../types';
import toast from 'react-hot-toast';
import axios from 'axios';

interface MenuOptionManagementProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem;
  globalOptions: MenuOption[];
}

const MenuOptionManagement: React.FC<MenuOptionManagementProps> = ({
  isOpen,
  onClose,
  menu,
  globalOptions
}) => {
  const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchSelectedOptions = async () => {
      try {
        const response = await axios.get(`/api/admin/menuOptionList`, {
          params: { mnId: menu.id }
        });
        console.log(response.data);
        const selectedOptionIds = response.data.data.map((option: any) => option.opIdx);
        const selectedOptions = globalOptions.filter(option => selectedOptionIds.includes(option.id));
        setSelectedOptions(selectedOptions);
      } catch (error) {
        console.error('선택된 옵션을 가져오는 중 오류가 발생했습니다:', error);
        toast.error('선택된 옵션을 가져오는 중 오류가 발생했습니다.');
      }
    };

    if (isOpen) {
      fetchSelectedOptions();
    }
  }, [isOpen, menu.id, globalOptions]);

  const handleToggleOption = (option: MenuOption) => {
    setSelectedOptions(prev => {
      const isSelected = prev.some(o => o.id === option.id);
      if (isSelected) {
        return prev.filter(o => o.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSave = async () => {
    try {
      const selectedOptionIds = selectedOptions.map(option => option.id);
      await axios.post('/api/admin/regMenuOption', {
        mnId: menu.id,
        opId: selectedOptionIds
      });
      toast.success('메뉴 옵션이 저장되었습니다');
      onClose();
    } catch (error) {
      toast.error('메뉴 옵션 저장 중 오류가 발생했습니다');
    }
  };

  const renderOptionList = (title: string, options: MenuOption[]) => (
    <div>
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedOptions.some(o => o.id === option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleToggleOption(option)}
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
              {renderOptionList('퍼스널 옵션', globalOptions)}
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