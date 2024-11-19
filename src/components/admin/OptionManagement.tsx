import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { MenuItem, MenuOption } from '../../types';
import toast from 'react-hot-toast';

interface OptionManagementProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem | null;
}

const OptionManagement: React.FC<OptionManagementProps> = ({ isOpen, onClose, menu }) => {
  const [selectedOption, setSelectedOption] = useState<MenuOption | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddOption = () => {
    setSelectedOption(null);
    setIsFormOpen(true);
  };

  const handleEditOption = (option: MenuOption, type: string) => {
    setSelectedOption(option);
    setIsFormOpen(true);
  };

  const handleDeleteOption = (optionId: string, type: string) => {
    toast.success('옵션이 삭제되었습니다');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const option: MenuOption = {
      id: selectedOption?.id || String(Date.now()),
      name: formData.get('name') as string,
      price: parseInt(formData.get('price') as string, 10),
      available: true,
      volume: formData.get('volume') as string,
      ratio: parseFloat(formData.get('ratio') as string)
    };

    if (selectedOption?.id) {
      toast.success('옵션이 수정되었습니다');
    } else {
      toast.success('옵션이 추가되었습니다');
    }

    setIsFormOpen(false);
  };

  const renderOptionList = (type: 'size' | 'temperature' | 'extra', options?: MenuOption[]) => {
    if (!options || options.length === 0) return <p className="text-sm text-gray-500">옵션이 없습니다.</p>;

    return (
      <div className="space-y-2">
        {options.map(option => (
          <div key={option.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
            <div>
              <p className="font-medium">{option.name}</p>
              <p className="text-sm text-gray-500">
                {option.price > 0 ? `+${option.price.toLocaleString()}원` : 
                 option.price < 0 ? `${option.price.toLocaleString()}원` : '추가 비용 없음'}
                {option.volume && ` · ${option.volume}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEditOption(option, type)} className="p-1 hover:bg-gray-100 rounded">
                <Edit2 className="w-4 h-4 text-primary" />
              </button>
              <button onClick={() => handleDeleteOption(option.id, type)} className="p-1 hover:bg-gray-100 rounded">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 h-[90vh] bg-white rounded-t-3xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {menu ? `${menu.name} 옵션 관리` : '전체 옵션 관리'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-end mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddOption}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                옵션 추가
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menu?.type === 'beverage' && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium mb-4">사이즈</h3>
                    {renderOptionList('size', menu.options?.sizes)}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium mb-4">온도</h3>
                    {renderOptionList('temperature', menu.options?.temperatures)}
                  </div>
                </>
              )}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium mb-4">추가 옵션</h3>
                {renderOptionList('extra', menu?.options?.extras)}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60]"
                onClick={() => setIsFormOpen(false)}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                           w-full max-w-md bg-white rounded-2xl p-6"
                  onClick={e => e.stopPropagation()}
                >
                  <h3 className="text-lg font-bold mb-4">
                    {selectedOption ? '옵션 수정' : '옵션 추가'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        옵션명
                      </label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={selectedOption?.name}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                 focus:border-primary focus:ring-primary"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                 focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        옵션 타입
                      </label>
                      <select
                        name="type"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                 focus:border-primary focus:ring-primary"
                      >
                        {menu?.type === 'beverage' && (
                          <>
                            <option value="size">사이즈</option>
                            <option value="temperature">온도</option>
                          </>
                        )}
                        <option value="extra">추가 옵션</option>
                      </select>
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                 focus:border-primary focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        비율
                      </label>
                      <input
                        name="ratio"
                        type="number"
                        step="0.1"
                        defaultValue={selectedOption?.ratio}
                        placeholder="예: 1.0"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                 focus:border-primary focus:ring-primary"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        기본 사이즈(Tall) 대비 영양성분 비율
                      </p>
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
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptionManagement;