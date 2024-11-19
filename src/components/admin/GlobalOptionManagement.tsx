import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { MenuOption } from '../../types';
import toast from 'react-hot-toast';

interface GlobalOptionManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalOptionManagement: React.FC<GlobalOptionManagementProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

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

  const handleEditOption = (option: MenuOption) => {
    setSelectedOption(option);
    setIsFormOpen(true);
  };

  const handleDeleteOption = (optionId: string) => {
    // API call would go here
    toast.success('옵션이 삭제되었습니다');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const option: MenuOption = {
      id: selectedOption?.id || String(Date.now()),
      name: formData.get('name') as string,
      price: parseInt(formData.get('price') as string),
      volume: formData.get('volume') as string,
      available: true
    };

    if (selectedOption?.id) {
      toast.success('옵션이 수정되었습니다');
    } else {
      toast.success('옵션이 추가되었습니다');
    }

    setIsFormOpen(false);
  };

  const renderOptionList = (title: string, options: MenuOption[]) => (
    <div>
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg"
          >
            <div>
              <p className="font-medium">{option.name}</p>
              <p className="text-sm text-gray-500">
                {option.price > 0 ? `+${option.price.toLocaleString()}원` : 
                 option.price < 0 ? `${option.price.toLocaleString()}원` : '추가 비용 없음'}
                {option.volume && ` · ${option.volume}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditOption(option)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Edit2 className="w-4 h-4 text-primary" />
              </button>
              <button
                onClick={() => handleDeleteOption(option.id)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMainContent = () => (
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
        <h2 className="text-xl font-bold">전체 옵션 관리</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-8">
        {renderOptionList('사이즈', globalOptions.sizes)}
        {renderOptionList('퍼스널 옵션', globalOptions.extras)}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => {
            setSelectedOption(null);
            setIsFormOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          옵션 추가
        </button>
      </div>
    </motion.div>
  );

  const renderFormContent = () => (
    <motion.div
      initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
      animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
      exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
      className={`${
        isMobile
          ? 'fixed bottom-0 w-full'
          : 'relative w-full max-w-md mx-4'
      } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
      onClick={e => e.stopPropagation()}
    >
      {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
      
      <h3 className="text-lg font-bold mb-6">
        {selectedOption ? '옵션 수정' : '옵션 추가'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            옵션명
          </label>
          <input
            name="name"
            type="text"
            defaultValue={selectedOption?.name}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                     focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            가격
          </label>
          <input
            name="price"
            type="number"
            defaultValue={selectedOption?.price}
            required
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                     focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            용량
          </label>
          <input
            name="volume"
            type="text"
            defaultValue={selectedOption?.volume}
            placeholder="예: 355ml"
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                     focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            {selectedOption ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {isFormOpen ? renderFormContent() : renderMainContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalOptionManagement;