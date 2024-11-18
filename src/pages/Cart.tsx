import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, MapPin } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useStoreStore } from '../store/storeStore';
import StoreSelector from '../components/store/StoreSelector';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const { selectedStoreId } = useStoreStore();
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const handleCheckout = () => {
    if (!selectedStoreId) {
      setIsStoreSelectorOpen(true);
      return;
    }
    navigate('/order');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-beige-50 pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h2>
          <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-primary text-white rounded-lg"
          >
            메뉴 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">장바구니</h1>

        <div className="space-y-6">
          {/* Store Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <button
              onClick={() => setIsStoreSelectorOpen(true)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-2" />
                <span>
                  {selectedStoreId ? '매장 변경하기' : '주문할 매장을 선택해주세요'}
                </span>
              </div>
              <span className="text-primary">선택</span>
            </button>
          </motion.div>

          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg space-y-4"
          >
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.size} / {item.temperature}
                    {item.extras.length > 0 && ` / ${item.extras.join(', ')}`}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-md hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.totalPrice.toLocaleString()}원</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">총 결제금액</span>
              <span className="text-xl font-bold text-primary">
                {getTotalPrice().toLocaleString()}원
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-primary text-white rounded-xl font-medium"
            >
              주문하기
            </button>
          </motion.div>
        </div>
      </div>

      {/* Store Selector */}
      <StoreSelector
        isOpen={isStoreSelectorOpen}
        onClose={() => setIsStoreSelectorOpen(false)}
        onSelect={(storeId) => {
          useStoreStore.getState().setSelectedStore(storeId);
          setIsStoreSelectorOpen(false);
          navigate('/order');
        }}
      />
    </div>
  );
};

export default Cart;