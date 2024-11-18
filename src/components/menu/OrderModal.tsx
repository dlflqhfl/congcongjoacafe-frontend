import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ChevronDown } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useStoreStore } from '../../store/storeStore';
import { useAuthStore } from '../../store/authStore';
import StoreSelector from '../store/StoreSelector';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type = _default.defaults.animations.numbers.type;

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, menu }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Tall');
  const [selectedTemp, setSelectedTemp] = useState('HOT');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [orderType, setOrderType] = useState<'cart' | 'direct' | null>(null);
  const [expandedSection, setExpandedSection] = useState<'size' | 'temperature' | 'extras' | null>(
    'size'
  );

  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore(state => state.addToCart);
  const { selectedStoreId } = useStoreStore();
  const navigate = useNavigate();

  const isMobile = window.innerWidth < 768;

  const sizes = menu.options?.sizes || [];
  const temperatures = menu.options?.temperatures || [];
  const extras = menu.options?.extras || [];

  const calculateTotalPrice = () => {
    const sizePrice = sizes.find(s => s.id === selectedSize)?.price || 0;
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = extras.find(e => e.id === extraId);
      return total + (extra?.price || 0);
    }, 0);
    return (menu.price + sizePrice + extrasPrice) * quantity;
  };

  const handleAction = (type: 'cart' | 'direct') => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다');
      onClose();
      navigate('/login');
      return;
    }

    if (!selectedStoreId) {
      setOrderType(type);
      setIsStoreSelectorOpen(true);
      return;
    }

    if (type === 'cart') {
      addToCartItem();
    } else {
      navigate('/order');
      onClose();
    }
  };

  const addToCartItem = () => {
    const cartItem = {
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      category: menu.category,
      quantity,
      size: selectedSize,
      temperature: selectedTemp,
      extras: selectedExtras,
      totalPrice: calculateTotalPrice()
    };

    addToCart(cartItem);
    toast.success('장바구니에 추가되었습니다');
    onClose();
  };

  const toggleSection = (section: 'size' | 'temperature' | 'extras') => {
    if (isMobile) {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

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
          <motion.div
            key="modal-content"
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`${
              isMobile
                ? 'fixed bottom-0 w-full'
                : 'relative w-full max-w-2xl mx-4'
            } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
            onClick={e => e.stopPropagation()}
          >
            {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-h-[80vh] overflow-y-auto">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={menu.images[0].url}
                  alt={menu.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{menu.name}</h3>
                  <p className="text-gray-600">{menu.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                {menu.type === 'beverage' && sizes.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('size')}
                      className="w-full flex justify-between items-center mb-3"
                    >
                      <h4 className="font-medium">사이즈</h4>
                      {isMobile && (
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            expandedSection === 'size' ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {(!isMobile || expandedSection === 'size') && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {sizes.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size.id)}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              selectedSize === size.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200'
                            }`}
                          >
                            <p className="text-sm font-medium">{size.name}</p>
                            <p className="text-xs text-gray-500">
                              {size.volume}
                            </p>
                            <p className="text-xs text-gray-500">
                              {size.price > 0 ? `+${size.price}` : size.price}원
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {menu.type === 'beverage' && temperatures.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('temperature')}
                      className="w-full flex justify-between items-center mb-3"
                    >
                      <h4 className="font-medium">온도</h4>
                      {isMobile && (
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            expandedSection === 'temperature' ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {(!isMobile || expandedSection === 'temperature') && (
                      <div className="grid grid-cols-2 gap-4">
                        {temperatures.map((temp) => (
                          <button
                            key={temp.id}
                            onClick={() => setSelectedTemp(temp.id)}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              selectedTemp === temp.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={temp.image}
                              alt={temp.name}
                              className="w-6 h-6 mx-auto mb-2"
                            />
                            <span>{temp.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {extras.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('extras')}
                      className="w-full flex justify-between items-center mb-3"
                    >
                      <h4 className="font-medium">퍼스널 옵션</h4>
                      {isMobile && (
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            expandedSection === 'extras' ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {(!isMobile || expandedSection === 'extras') && (
                      <div className="space-y-2">
                        {extras.map((extra) => (
                          <button
                            key={extra.id}
                            onClick={() => {
                              setSelectedExtras(prev =>
                                prev.includes(extra.id)
                                  ? prev.filter(id => id !== extra.id)
                                  : [...prev, extra.id]
                              );
                            }}
                            className={`w-full p-4 rounded-lg border-2 transition-colors ${
                              selectedExtras.includes(extra.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{extra.name}</span>
                              <span className="text-sm text-gray-500">+{extra.price}원</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity Selection */}
                <div>
                  <h4 className="font-medium mb-3">수량</h4>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-lg border-2 border-gray-200"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-lg border-2 border-gray-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">총 결제금액</span>
                  <span className="text-xl font-bold text-primary">
                    {calculateTotalPrice().toLocaleString()}원
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction('cart')}
                    className="flex-1 flex items-center justify-center py-4 bg-primary/10 text-primary rounded-xl font-medium"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    장바구니
                  </button>
                  <button
                    onClick={() => handleAction('direct')}
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-medium"
                  >
                    바로 구매
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence>
        {isStoreSelectorOpen && (
          <motion.div
            key="store-selector-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setIsStoreSelectorOpen(false)}
          >
            <motion.div
              key="store-selector-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 w-full bg-white rounded-t-3xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-bold mb-6">매장 선택</h2>
              <StoreSelector
                isOpen={isStoreSelectorOpen}
                onClose={() => setIsStoreSelectorOpen(false)}
                onSelect={(storeId) => {
                  if (orderType === 'cart') {
                    addToCartItem();
                  } else {
                    navigate('/order');
                  }
                  setIsStoreSelectorOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default OrderModal;