import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  ChevronRight,
  Star,
  MessageSquare,
  Receipt,
  Clock
} from 'lucide-react';
import { Order } from '../../types';
import {useState} from "react";

const OrderHistory = () => {
  const [period, setPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  // Dummy data - replace with API call
  const orders: Order[] = [
    {
      id: 'ORD123',
      userId: 'user1',
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
      status: 'COMPLETED',
      usedPoint: 0,
      earnedPoint: 90,
      createdAt: '2024-03-15T10:30:00Z',
      completedAt: '2024-03-15T10:45:00Z'
    }
  ];

  const periodOptions = [
    { value: '1m', label: '1개월' },
    { value: '3m', label: '3개월' },
    { value: '6m', label: '6개월' },
    { value: '1y', label: '1년' }
  ];

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return '주문 접수';
      case 'CONFIRMED': return '주문 승인';
      case 'PREPARING': return '제조 중';
      case 'COMPLETED': return '완료';
      case 'CANCELLED': return '취소';
      default: return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-50';
      case 'PREPARING': return 'text-indigo-600 bg-indigo-50';
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">주문 내역</h1>
          <div className="flex space-x-2">
            {periodOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value as any)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  period === option.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
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
                <Link
                  to={`/mypage/orders/${order.id}`}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>

              <div className="space-y-2 mb-4">
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

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {order.earnedPoint > 0 && `${order.earnedPoint}P 적립`}
                </div>
                <p className="font-bold text-lg">
                  {order.totalPrice.toLocaleString()}원
                </p>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
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
                  <button className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg">
                    <Clock className="w-4 h-4 mr-1" />
                    주문 취소
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;