import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, Coffee, AlertCircle } from 'lucide-react';
import { menuData } from '../data/menuData';
import OrderModal from '../components/menu/OrderModal';
import ImageGallery from '../components/menu/ImageGallery';

const MenuDetail: React.FC = () => {
  const { id } = useParams();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'nutrition' | 'review' | 'description'>('description');
  const [selectedSize, setSelectedSize] = useState('Tall');
  const [isNutritionSheetOpen, setIsNutritionSheetOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'HOT' | 'ICED'>('HOT');

  const menu = menuData.find(item => item.id === id);
  const isMobile = window.innerWidth < 768;

  if (!menu) {
    return (
      <div className="min-h-screen bg-beige-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>메뉴를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const menuImages = menu.images || [{ url: menu.image, isMain: true }];

  const tabs = [
    { id: 'description', label: '상세 정보' },
    { id: 'nutrition', label: '영양 성분' },
    { id: 'review', label: '리뷰' }
  ];

  const calculateNutrition = (baseNutrition: typeof menu.nutrition, size: string) => {
    const ratios = {
      Short: 0.8,
      Tall: 1,
      Grande: 1.3,
      Venti: 1.6
    };
    const ratio = ratios[size as keyof typeof ratios];
    
    return {
      calories: Math.round(baseNutrition.calories * ratio),
      protein: Math.round(baseNutrition.protein * ratio * 10) / 10,
      fat: Math.round(baseNutrition.fat * ratio * 10) / 10,
      sodium: Math.round(baseNutrition.sodium * ratio),
      caffeine: Math.round(baseNutrition.caffeine * ratio),
      sugar: Math.round(baseNutrition.sugar * ratio * 10) / 10
    };
  };

  const NutritionInfo = ({ size }: { size: string }) => {
    const nutrition = calculateNutrition(menu.nutrition, size);
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">칼로리</p>
            <p className="font-medium">{nutrition.calories}kcal</p>
          </div>
          <div>
            <p className="text-gray-500">단백질</p>
            <p className="font-medium">{nutrition.protein}g</p>
          </div>
          <div>
            <p className="text-gray-500">포화지방</p>
            <p className="font-medium">{nutrition.fat}g</p>
          </div>
          <div>
            <p className="text-gray-500">나트륨</p>
            <p className="font-medium">{nutrition.sodium}mg</p>
          </div>
          <div>
            <p className="text-gray-500">당류</p>
            <p className="font-medium">{nutrition.sugar}g</p>
          </div>
          <div>
            <p className="text-gray-500">카페인</p>
            <p className="font-medium">{nutrition.caffeine}mg</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/menu" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          메뉴로 돌아가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ImageGallery images={menuImages} />

          {/* Content Section */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{menu.name}</h1>
                <p className="text-lg text-gray-600 mt-1">{menu.nameEng}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {menu.price.toLocaleString()}원
                </p>
                {menu.isNew && (
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-full mt-2">
                    NEW
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-6">{menu.description}</p>

            {/* Temperature Selection */}
            {menu.type === 'beverage' && (
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setSelectedType('HOT')}
                  className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                    selectedType === 'HOT'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  HOT
                </button>
                <button
                  onClick={() => setSelectedType('ICED')}
                  className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                    selectedType === 'ICED'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  ICED
                </button>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === 'nutrition' && isMobile) {
                        setIsNutritionSheetOpen(true);
                      }
                    }}
                    className={`py-4 relative ${
                      activeTab === tab.id
                        ? 'text-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-[300px]"
              >
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Coffee className="w-5 h-5 mr-2" />
                      <span>프리미엄 원두 사용</span>
                    </div>
                    {menu.allergyInfo && menu.allergyInfo.length > 0 && (
                      <div className="flex items-start text-gray-600">
                        <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">알레르기 정보</p>
                          <p className="text-sm">{menu.allergyInfo.join(', ')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'nutrition' && !isMobile && (
                  <div>
                    <div className="flex space-x-4 mb-6">
                      {['Short', 'Tall', 'Grande', 'Venti'].map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                            selectedSize === size
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200'
                          }`}
                        >
                          <p className="font-medium">{size}</p>
                          <p className="text-sm text-gray-500">
                            {menu.options?.sizes?.find(s => s.id === size)?.volume}
                          </p>
                        </button>
                      ))}
                    </div>
                    <NutritionInfo size={selectedSize} />
                  </div>
                )}

                {activeTab === 'review' && (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                            <div className="ml-3">
                              <p className="font-medium">사용자{index + 1}</p>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < 4 ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">2024.03.15</span>
                        </div>
                        <p className="text-gray-600">
                          맛있어요! 다음에도 또 주문할게요.
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-primary text-white py-4 rounded-xl font-medium
                         shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 
                         transition-all duration-300 hover:-translate-y-1"
              >
                주문하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nutrition Sheet */}
      <AnimatePresence>
        {isNutritionSheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsNutritionSheetOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-bold mb-6">영양 성분 정보</h2>
              
              <div className="flex space-x-4 mb-6 overflow-x-auto">
                {['Short', 'Tall', 'Grande', 'Venti'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-shrink-0 p-4 rounded-lg border-2 transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <p className="font-medium">{size}</p>
                    <p className="text-sm text-gray-500">
                      {menu.options?.sizes?.find(s => s.id === size)?.volume}
                    </p>
                  </button>
                ))}
              </div>

              <NutritionInfo size={selectedSize} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        menu={menu}
        selectedType={selectedType}
      />
    </div>
  );
};

export default MenuDetail;