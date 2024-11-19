import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <ShoppingBag className="w-6 h-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold">장바구니</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  장바구니가 비어있습니다
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.menuItem.id}-${item.selectedSize?.id}`}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.menuItem.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.selectedSize?.name && `${item.selectedSize.name} / `}
                            {item.selectedOptions.map(o => o.name).join(', ')}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.menuItem.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-medium">
                          {item.totalPrice.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">총 결제금액</span>
                  <span className="text-xl font-bold text-primary">
                    {getTotalPrice().toLocaleString()}원
                  </span>
                </div>
                <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  주문하기
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Cart;