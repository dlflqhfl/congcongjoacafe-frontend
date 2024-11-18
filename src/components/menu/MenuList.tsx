import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { menuData } from '../../data/menuData';
import MenuItem from './MenuItem';
import { useStoreStore } from '../../store/storeStore';
import { useCartStore } from '../../store/cartStore';
import StoreSelector from '../store/StoreSelector';
import { stores } from '../../data/storeData';

const MenuList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const { selectedStoreId } = useStoreStore();
  const { selectedStoreId: cartStoreId } = useCartStore();
  const isMobile = window.innerWidth < 768;

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'coffee', name: '커피' },
    { id: 'non-coffee', name: '논커피' },
    { id: 'dessert', name: '디저트' },
  ];

  const selectedStore = stores.find(store => store.id === (selectedStoreId || cartStoreId));

  // Filter menus based on store and category
  const filteredMenu = menuData
    .filter(item => {
      if (!selectedStore) return true; // Show all menus if no store is selected
      return selectedStore.menus.includes(item.id);
    })
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Store Selection Bar */}
      <div className="bg-white rounded-xl shadow-md mb-6 p-4">
        <div 
          onClick={() => setIsStoreSelectorOpen(true)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-primary mr-2" />
            {selectedStore ? (
              <div>
                <div className="font-medium">{selectedStore.name}</div>
                <div className="text-sm text-gray-500">{selectedStore.address}</div>
              </div>
            ) : (
              <div className="text-gray-500">주문할 매장을 선택해주세요</div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <motion.div 
        layout 
        className={`grid ${
          isMobile 
            ? 'grid-cols-1 gap-4' 
            : 'grid-cols-2 lg:grid-cols-3 gap-6'
        }`}
      >
        <AnimatePresence>
          {filteredMenu.map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Store Selector Modal */}
      <AnimatePresence>
        {isStoreSelectorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsStoreSelectorOpen(false)}
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`${
                isMobile
                  ? 'fixed bottom-0 w-full'
                  : 'fixed top-1/2 left-1/2 !transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl'
              } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
              onClick={e => e.stopPropagation()}
            >
              {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
              <h2 className="text-xl font-bold mb-6">매장 선택</h2>
              <StoreSelector
                isOpen={isStoreSelectorOpen}
                onClose={() => setIsStoreSelectorOpen(false)}
                onSelect={(storeId) => {
                  useStoreStore.getState().setSelectedStore(storeId);
                  useCartStore.getState().setSelectedStore(storeId);
                  setIsStoreSelectorOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuList;