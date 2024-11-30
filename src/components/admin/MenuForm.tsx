import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Crown, Plus, ImageIcon } from 'lucide-react';
import { MenuItem } from '../../types';
import toast from 'react-hot-toast';
import axios from 'axios';

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  menu?: MenuItem | null;
}

interface ImageFile {
  url: string;
  isMain: boolean;
  alt?: string;
  file?: File;
}

const MenuForm: React.FC<MenuFormProps> = ({ isOpen, onClose, menu }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = window.innerWidth < 768;
  const [allergyInfo, setAllergyInfo] = useState({
    milk: false,
    soy: false,
    egg: false,
    wheat: false,
  });

  const [nutrition, setNutrition] = useState({
    one: '',
    calories: '',
    carbo: '',
    protein: '',
    fat: '',
    sodium: '',
    caffeine: '',
    sugar: ''
  });

  useEffect(() => {
    if (menu) {
      setImages(menu.images.map(img => ({ 
        url: img.url,
        isMain: img.isMain,
        alt: img.alt,
        file: undefined })));
      setAllergyInfo({
        milk: menu.allergyInfo?.milk || false,
        soy: menu.allergyInfo?.soy || false,
        egg: menu.allergyInfo?.egg || false,
        wheat: menu.allergyInfo?.wheat || false,
      });
      setNutrition({
        one: menu.nutrition?.one ? menu.nutrition.one.toString() : '',
        calories: menu.nutrition?.calories ? menu.nutrition.calories.toString() : '',
        carbo: menu.nutrition?.carbo ? menu.nutrition.carbo.toString() : '',
        protein: menu.nutrition?.protein ? menu.nutrition.protein.toString() : '',
        fat: menu.nutrition?.fat ? menu.nutrition.fat.toString() : '',
        sodium: menu.nutrition?.sodium ? menu.nutrition.sodium.toString() : '',
        caffeine: menu.nutrition?.caffeine ? menu.nutrition.caffeine.toString() : '',
        sugar: menu.nutrition?.sugar ? menu.nutrition.sugar.toString() : ''
      });
    }
  }, [menu]);

  const handleNutritionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNutrition(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAllergyInfo(prev => ({ ...prev, [name]: checked }));
  };

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
          setImages(prev => [...prev, { 
            url: e.target!.result as string, 
            isMain: prev.length === 0,
            file: file 
          }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSetMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })));
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the main image, set the first remaining image as main
      if (prev[index].isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const api = axios.create({
    baseURL: '/admin',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validate form data
    const mnName = formData.get('name') as string;
    const mnPrice = parseFloat(formData.get('price') as string);
    const mnCate = formData.get('category') as string;
    const mnSize = formData.get('size') as string;
    const mnDetail = formData.get('description') as string;
    const mnStatus = formData.get('status') as string;
    
    if (!mnName || !mnPrice || !mnCate || !mnSize || !mnStatus) {
      toast.error('필수 항목을 입력해주세요');
      return;
    }

    if (images.length === 0) {
      toast.error('최소 1개의 이미지를 등록해주세요');
      return;
    }

    // Create nutrition object
  const nutritions = {
    nOne: parseFloat(nutrition.one.toString()) || 0,
    nCal: parseFloat(nutrition.calories.toString()) || 0,
    nCarbo: parseFloat(nutrition.carbo.toString()) || 0,
    nProtein: parseFloat(nutrition.protein.toString()) || 0,
    nFat: parseFloat(nutrition.fat.toString()) || 0,
    nSalt: parseFloat(nutrition.sodium.toString()) || 0,
    nCaffeine: parseFloat(nutrition.caffeine.toString()) || 0,
    nSugar: parseFloat(nutrition.sugar.toString()) || 0
  };

  // Get allergy info
  const allergies = {
    aMilk: allergyInfo.milk ? 'TRUE' : 'FALSE',
    aSoy: allergyInfo.soy ? 'TRUE' : 'FALSE',
    aEgg: allergyInfo.egg ? 'TRUE' : 'FALSE',
    aWheat: allergyInfo.wheat ? 'TRUE' : 'FALSE'
  };

    console.log('Nutrition Object:', nutritions);
    console.log('Allergy Object:', allergies);
    
    const data = new FormData();
    data.append('menu', new Blob([JSON.stringify({ mnName, mnPrice, mnCate, mnSize, mnDetail, mnStatus })], { type: "application/json" }));
    data.append('nutrition', new Blob([JSON.stringify(nutritions)], { type: "application/json" }));
    data.append('allergy', new Blob([JSON.stringify(allergies)], { type: "application/json" }));
    images.forEach((img, index) => {
      if (img.file) {
        data.append('images', img.file);
      }
      data.append('main', new Blob([JSON.stringify(images.map(img => img.isMain))], { type: "application/json" }));
    });

    // FormData 객체 출력
    for (let [key, value] of data.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      if (menu) {
        // Update existing menu
        await axios.put(`/modifiMenu/${menu.id}`, data);
        toast.success('메뉴가 수정되었습니다');
      } else {
        // Create new menu
        await api.post('/regMenu', data);
        toast.success('메뉴가 등록되었습니다');
      }
      onClose();
    } catch (error) {
      toast.error('메뉴 등록 중 오류가 발생했습니다');
    }
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
                ? 'fixed bottom-0 w-full max-h-[90vh]'
                : 'relative w-full max-w-3xl max-h-[80vh] mx-4'
            } bg-white rounded-t-3xl sm:rounded-2xl p-6 overflow-y-auto`}
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

            <form onSubmit={handleSubmit} className="space-y-8">
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
                            className={`w-full aspect-square object-cover rounded-lg ${
                              img.isMain ? 'ring-2 ring-primary' : ''
                            }`}
                          />
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(index)}
                              className={`p-1.5 rounded-full group-hover:opacity-100 ${
                                img.isMain 
                                  ? 'bg-primary text-white opacity-100' 
                                  : 'bg-white/90 text-gray-600 hover:bg-primary hover:text-white opacity-0'
                              } transition-all duration-200`}
                            >
                              <Crown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1.5 bg-red-500 text-white rounded-full opacity-0 
                                       group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {img.isMain && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white 
                                         text-xs rounded-full flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              대표
                            </div>
                          )}
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
                    <option value="COFFEE">커피</option>
                    <option value="NONCOFFEE">논커피</option>
                    <option value="DESERT">디저트</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    사이즈
                  </label>
                  <select
                    name="size"
                    defaultValue={menu?.size}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                             focus:ring-primary focus:border-primary"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
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

                  

              {/* Nutrition Info */}
              <div>
                <h3 className="text-lg font-medium mb-4">영양 성분</h3>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      1회 제공량 (ml)
                    </label>
                    <input
                      type="number"
                      name="one"
                      value={nutrition.one}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      칼로리 (kcal)
                    </label>
                    <input
                      type="number"
                      name="calories"
                      value={nutrition.calories}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      탄수화물 (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="carbo"
                      value={nutrition.carbo}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      단백질 (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="protein"
                      value={nutrition.protein}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      지방 (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="fat"
                      value={nutrition.fat}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      나트륨 (mg)
                    </label>
                    <input
                      type="number"
                      name="sodium"
                      value={nutrition.sodium}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      카페인 (mg)
                    </label>
                    <input
                      type="number"
                      name="caffeine"
                      value={nutrition.caffeine}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 w-100">
                      당류 (g)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="sugar"
                      value={nutrition.sugar}
                      onChange={handleNutritionChange}
                      className="mt-1 block w-100 rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Allergy Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  알레르기 정보
                </label>
                <div className="space-y-2">
                  {[
                    { label: '우유', name: 'milk' },
                    { label: '대두', name: 'soy' },
                    { label: '계란', name: 'egg' },
                    { label: '밀', name: 'wheat' },
                  ].map((allergy) => (
                    <label key={allergy.name} className="flex items-center">
                      <input
                        type="checkbox"
                        name={allergy.name}
                        checked={allergyInfo[allergy.name as keyof typeof allergyInfo]}
                        onChange={handleAllergyChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2">{allergy.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="TRUE"
                      defaultChecked={menu?.status === true}
                      className="rounded border-gray-300 text-primary 
                               focus:ring-primary"
                    />
                    <span className="ml-2">판매</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="FALSE"
                      defaultChecked={menu?.status === false}
                      className="rounded border-gray-300 text-primary 
                               focus:ring-primary"
                    />
                    <span className="ml-2">미판매</span>
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

export default MenuForm;