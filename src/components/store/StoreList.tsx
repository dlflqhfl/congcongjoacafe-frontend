import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Search, Heart, Compass } from 'lucide-react';
import { stores } from '../../data/storeData';
import { useStoreStore } from '../../store/storeStore';
import { useAuthStore } from '../../store/authStore';
import { useGeolocation } from '../../hooks/useGeolocation';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const StoreList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'all' | 'favorites'>('all');
  const { latitude, longitude } = useGeolocation();
  const { favoriteStores, toggleFavoriteStore } = useStoreStore();
  const { isAuthenticated } = useAuthStore();

  const handleAutoMatch = () => {
    if (!latitude || !longitude) {
      toast.error('위치 정보를 가져올 수 없습니다');
      return;
    }

    const nearestStore = stores[0];
    if (nearestStore) {
      toast.success(`가장 가까운 매장 "${nearestStore.name}"을(를) 찾았습니다`);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, storeId: string) => {
    e.preventDefault();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-4">
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

      {filteredStores.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {view === 'favorites'
              ? '즐겨찾기한 매장이 없습니다'
              : '검색 결과가 없습니다'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Link to={`/store/${store.id}`} key={store.id}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden relative"
              >
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => handleToggleFavorite(e, store.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    favoriteStores.includes(store.id)
                      ? 'bg-red-50 text-red-500'
                      : 'bg-white/80 text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favoriteStores.includes(store.id) ? 'fill-current' : ''
                    }`}
                  />
                </button>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{store.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      store.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {store.isOpen ? '영업중' : '영업종료'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
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
                    <div className="mt-4 flex flex-wrap gap-2">
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
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;