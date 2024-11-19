import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Search, Heart, Compass } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { stores } from '../../data/storeData';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import toast from 'react-hot-toast';

interface StoreSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (storeId: string) => void;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  const { latitude, longitude, error, loading } = useGeolocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'all' | 'favorites'>('all');
  const { isAuthenticated } = useAuthStore();
  const { favoriteStores, toggleFavoriteStore } = useStoreStore();

  const handleAutoMatch = () => {
    if (!latitude || !longitude) {
      toast.error('위치 정보를 가져올 수 없습니다');
      return;
    }

    const nearestStore = stores[0]; // 실제로는 위치 기반 정렬 필요
    if (nearestStore) {
      onSelect(nearestStore.id);
      toast.success(`가장 가까운 매장 "${nearestStore.name}"이(가) 선택되었습니다`);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, storeId: string) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다');
      return;
    }

    toggleFavoriteStore(storeId);
    toast.success(
      favoriteStores.includes(storeId)
        ? '즐겨찾기가 해제되었습니다'
        : '즐겨찾기에 추가되었습니다'
    );
  };

  const filteredStores = stores.filter(store =>
    (view === 'favorites' ? favoriteStores.includes(store.id) : true) &&
    (searchTerm
      ? store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
      : true)
  );

  return (
    <div className="h-full">
      <div className="mb-6 space-y-4">
        {/* Search and Auto-match */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="매장명 또는 주소로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAutoMatch}
            className="px-4 py-3 bg-primary text-white rounded-lg flex items-center"
          >
            <Compass className="w-5 h-5" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView('all')}
            className={`flex-1 py-2 rounded-lg font-medium ${
              view === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            전체 매장
          </button>
          <button
            onClick={() => setView('favorites')}
            className={`flex-1 py-2 rounded-lg font-medium ${
              view === 'favorites'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            즐겨찾기
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">현재 위치를 확인하고 있습니다...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            다시 시도
          </button>
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {view === 'favorites'
              ? '즐겨찾기한 매장이 없습니다'
              : '검색 결과가 없습니다'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStores.map((store) => (
            <motion.div
              key={store.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(store.id)}
              className="w-full bg-white p-4 rounded-xl shadow-sm text-left relative cursor-pointer"
            >
              <button
                onClick={(e) => handleToggleFavorite(e, store.id)}
                className={`absolute top-4 right-4 p-2 rounded-full ${
                  favoriteStores.includes(store.id)
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-50 text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    favoriteStores.includes(store.id) ? 'fill-current' : ''
                  }`}
                />
              </button>

              <div className="flex justify-between items-start mb-2 pr-12">
                <h3 className="font-medium">{store.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  store.isOpen 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {store.isOpen ? '영업중' : '영업종료'}
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{store.address}</span>
                  <span className="ml-2 text-primary">{store.distance}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{store.businessHours}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>{store.rating} ({store.reviewCount})</span>
                </div>
              </div>

              {store.facilities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {store.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreSelector;