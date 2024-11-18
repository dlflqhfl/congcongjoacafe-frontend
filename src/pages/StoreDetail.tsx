import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart,
  Phone,
  ArrowLeft,
  Coffee,
  MessageSquare,
  Navigation
} from 'lucide-react';
import { stores } from '../data/storeData';
import { menuData } from '../data/menuData';
import { useStoreStore } from '../store/storeStore';
import { useAuthStore } from '../store/authStore';
import ChatButton from '../components/chat/ChatButton';
import toast from 'react-hot-toast';
import {useState} from "react";

const StoreDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'menu' | 'info' | 'review'>('menu');
  const { favoriteStores, toggleFavoriteStore } = useStoreStore();
  const { isAuthenticated } = useAuthStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const store = stores.find(s => s.id === id);
  const storeMenus = menuData.filter(menu => 
    store?.menus.includes(menu.id)
  );

  if (!store) {
    return (
      <div className="min-h-screen bg-beige-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>매장을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다');
      return;
    }
    toggleFavoriteStore(store.id);
    toast.success(
      favoriteStores.includes(store.id)
        ? '즐겨찾기가 해제되었습니다'
        : '즐겨찾기에 추가되었습니다'
    );
  };

  const handleNavigation = () => {
    // 실제로는 네이티브 지도 앱으로 연결
    toast.success('지도 앱으로 이동합니다');
  };

  const handleChat = () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다');
      return;
    }
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="relative h-[300px]">
        <img 
          src={store.image} 
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <Link
            to="/stores"
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              favoriteStores.includes(store.id)
                ? 'bg-red-50 text-red-500'
                : 'bg-white/80 text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                favoriteStores.includes(store.id) ? 'fill-current' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{store.name}</h1>
              <div className="flex items-center text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>{store.rating}</span>
                <span className="mx-1">·</span>
                <span>리뷰 {store.reviewCount}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              store.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {store.isOpen ? '영업중' : '영업종료'}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={handleNavigation}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              길찾기
            </button>
            <button
              onClick={handleChat}
              className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              문의하기
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {[
                { id: 'menu', label: '메뉴', icon: Coffee },
                { id: 'info', label: '매장 정보', icon: MapPin },
                { id: 'review', label: '리뷰', icon: MessageSquare }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 relative ${
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
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
          <div>
            {activeTab === 'menu' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storeMenus.map((menu) => (
                  <Link 
                    key={menu.id}
                    to={`/menu/${menu.id}`}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={menu.image}
                      alt={menu.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="font-medium">{menu.name}</h3>
                      <p className="text-sm text-gray-500">{menu.description}</p>
                      <p className="text-primary font-medium mt-1">
                        {menu.price.toLocaleString()}원
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">기본 정보</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2" />
                      <span>{store.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{store.businessHours}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">편의 시설</h3>
                  <div className="flex flex-wrap gap-2">
                    {store.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="border-b pb-4">
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
                      매장이 깔끔하고 직원분들도 친절하세요. 커피 맛있어요!
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ChatButton isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} storeId={store.id} />
    </div>
  );
};

export default StoreDetail;