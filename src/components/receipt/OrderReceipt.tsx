import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Order } from '../../types';

interface OrderReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ isOpen, onClose, order }) => {
  const handleDownload = () => {
    // Here you would implement the actual receipt download logic
    console.log('Downloading receipt...');
  };

  const isMobile = window.innerWidth < 768;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-md rounded-2xl p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">영수증</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="border-t border-b py-6 space-y-6">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-lg font-bold">콩콩조아</h3>
                <p className="text-sm text-gray-500">사업자등록번호: 123-45-67890</p>
                <p className="text-sm text-gray-500">
                  주문번호: {order.id}
                </p>
                <p className="text-sm text-gray-500">
                  주문일시: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <p>{item.name}</p>
                      <p className="text-gray-500">
                        {item.options.size} / {item.options.temperature}
                        {item.quantity > 1 && ` × ${item.quantity}`}
                      </p>
                    </div>
                    <p>{(item.price * item.quantity).toLocaleString()}원</p>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>주문 금액</span>
                  <span>{order.totalPrice.toLocaleString()}원</span>
                </div>
                {order.usedPoint > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>포인트 사용</span>
                    <span className="text-red-500">
                      -{order.usedPoint.toLocaleString()}P
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>적립 포인트</span>
                  <span className="text-primary">
                    +{order.earnedPoint.toLocaleString()}P
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>최종 결제 금액</span>
                  <span>
                    {(order.totalPrice - order.usedPoint).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="text-center text-sm">
                <p>
                  {order.paymentMethod === 'CARD' ? '카드 결제' : '카카오페이'}
                </p>
                <p className="text-gray-500">
                  승인번호: ****-****-****
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full mt-6 py-3 bg-primary text-white rounded-lg 
                       flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>영수증 다운로드</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderReceipt;