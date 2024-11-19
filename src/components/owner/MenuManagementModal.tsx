import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Upload, ImageIcon } from 'lucide-react';
import { MenuItem } from '../../types';
import toast from 'react-hot-toast';

interface MenuManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem | null;
}

const MenuManagementModal: React.FC<MenuManagementModalProps> = ({ isOpen, onClose, menu }) => {
  const [images, setImages] = useState<Array<{ url: string; isMain: boolean }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = window.innerWidth < 768;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        toast.error('JPG, PNG, WEBP 형식만 지원합니다');
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error('파일 크기는 5MB 이하여야 합니다');
        return false;
      }
      
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, { url: e.target!.result as string, isMain: prev.length === 0 }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validate form data
    const name = formData.get('name') as string;
    const price = parseInt(formData.get('price') as string);
    
    if (!name || !price) {
      toast.error('필수 항목을 입력해주세요');
      return;
    }

    if (images.length === 0) {
      toast.error('최소 1개의 이미지를 등록해주세요');
      return;
    }

    // Here you would typically send the data to your backend
    toast.success(menu ? '메뉴가 수정되었습니다' : '메뉴가 등록되었습니다');
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
                ? 'fixed inset-0 top-[5%]'
                : 'relative w-full max-w-2xl mx-4'
            } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
            onClick={e => e.stopPropagation()}
          >
            {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {menu ? '메뉴 수정' : '신규 메뉴 등록'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메뉴 이미지
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                    id="image-upload"
                  />
                  
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.url}
                            alt={`메뉴 이미지 ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImages(prev => prev.filter((_, i) => i !== index));
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/50 text-white 
                                     rounded-full opacity-0 group-hover:opacity-100 
                                     transition-opacity duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center aspect-square 
                                   border-2 border-dashed border-gray-300 rounded-lg 
                                   cursor-pointer hover:bg-gray-50"
                        >
                          <Plus className="w-6 h-6 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">추가</span>
                        </label>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center py-12 cursor-pointer"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        이미지를 드래그하거나 클릭하여 업로드
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG, WEBP (최대 5MB)
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    메뉴명 (한글)
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={menu?.name}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                             focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    메뉴명 (영문)
                  </label>
                  <input
                    type="text"
                    name="nameEng"
                    defaultValue={menu?.nameEng}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                             focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    기본 가격
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={menu?.price}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                             focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    카테고리
                  </label>
                  <select
                    name="category"
                    defaultValue={menu?.category}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                             focus:ring-primary focus:border-primary"
                  >
                    <option value="coffee">커피</option>
                    <option value="non-coffee">논커피</option>
                    <option value="dessert">디저트</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  name="description"
                  defaultValue={menu?.description}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                           focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isNew"
                      defaultChecked={menu?.isNew}
                      className="rounded border-gray-300 text-primary 
                               focus:ring-primary"
                    />
                    <span className="ml-2">신메뉴</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRecommended"
                      defaultChecked={menu?.isRecommended}
                      className="rounded border-gray-300 text-primary 
                               focus:ring-primary"
                    />
                    <span className="ml-2">추천메뉴</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      defaultChecked={menu?.isBestSeller}
                      className="rounded border-gray-300 text-primary 
                               focus:ring-primary"
                    />
                    <span className="ml-2">베스트셀러</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  {menu ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MenuManagementModal;