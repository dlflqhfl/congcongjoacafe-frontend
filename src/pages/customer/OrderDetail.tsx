
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  MapPin,
  Receipt,
  Star,
  MessageSquare,
  Clock,
  Calendar,
  CreditCard
} from 'lucide-react';
import ChatButton from '../../components/chat/ChatButton';
import { stores } from '../../data/storeData';
import toast from 'react-hot-toast';
import {useState} from "react";

const OrderDetail = () => {
  const { id } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Dummy order data - replace with API call
  const order = {
    id: 'ORD123',
    storeId: 'store1',
    items: [
      {
        menuId: 'menu1',
        name: '아메리카노',
        quantity: 2,
        options: {
          size: 'Tall',
          temperature: 'HOT'
        },
        price: 4500
      }
    ],
    totalPrice: 9000,
    paymentMethod: 'CARD',
    cardInfo: '신한카드 1234',
    status: 'COMPLETED',
    usedPoint: 0,
    earnedPoint: 90,
    createdAt: '2024-03-15T10:30:00Z',
    completedAt: '2024-03-15T10:45:00Z'
  };

  const store = stores.find(s => s.id === order.storeId);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return '주문 접수';
      case 'CONFIRMED': return '주문 승인';
      case 'PREPARING': return '제조 중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-50';
      case 'PREPARING': return 'text-indigo-600 bg-indigo-50';
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleDownloadReceipt = () => {
    toast.success('영수증이 다운로드됩니다');
  };

  const handleCancelOrder = () => {
    toast.success('주문이 취소되었습니다');
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/mypage/orders"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          주문 내역으로 돌아가기
        </Link>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-1 rounded-full text-sm ${
                  getStatusColor(order.status)
                }`}>
                  {getStatusText(order.status)}
                </span>
                <span className="text-sm text-gray-500">
                  주문번호: {order.id}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                <Receipt className="w-4 h-4 mr-1" />
                영수증
              </button>
              {order.status === 'COMPLETED' && (
                <Link
                  to={`/review/write/${order.id}`}
                  className="flex items-center px-3 py-2 bg-primary text-white rounded-lg"
                >
                  <Star className="w-4 h-4 mr-1" />
                  리뷰 작성
                </Link>
              )}
              {['PENDING', 'CONFIRMED'].includes(order.status) && (
                <button
                  onClick={handleCancelOrder}
                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  주문 취소
                </button>
              )}
            </div>
          </div>

          {/* Store Info */}
          {store && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-3" />
                <div>
                  <p className="font-medium">{store.name}</p>
                  <p className="text-sm text-gray-500">{store.address}</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">주문 내역</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.options.size} / {item.options.temperature}
                    {item.quantity > 1 && ` × ${item.quantity}`}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-primary mr-3" />
                <p className="font-medium">{order.cardInfo}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>주문 금액</span>
                <span>{order.totalPrice.toLocaleString()}원</span>
              </div>
              {order.usedPoint > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>포인트 사용</span>
                  <span className="text-red-500">
                    -{order.usedPoint.toLocaleString()}P
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>적립 포인트</span>
                <span className="text-primary">
                  +{order.earnedPoint.toLocaleString()}P
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                <span>최종 결제 금액</span>
                <span>{(order.totalPrice - order.usedPoint).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ChatButton
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        storeId={store?.id}
      />
    </div>
  );
};

export default OrderDetail;