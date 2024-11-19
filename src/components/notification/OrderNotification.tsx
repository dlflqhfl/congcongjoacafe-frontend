import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ChevronRight, MapPin, Coffee } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderStatus {
  id: string;
  status: 'PENDING' | 'PREPARING' | 'COMPLETED';
  timestamp: string;
  store: {
    name: string;
    address: string;
  };
  items: Array<{
    name: string;
    options: {
      size?: string;
      temperature?: string;
      extras?: string[];
    };
    quantity: number;
  }>;
}

interface OrderNotificationProps {
  orderId: string;
  onClose: () => void;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({ orderId, onClose }) => {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({
    id: orderId,
    status: 'PENDING',
    timestamp: new Date().toISOString(),
    store: {
      name: '송파NC점',
      address: '서울특별시 송파구 중대로 66'
    },
    items: [
      {
        name: '아메리카노',
        options: {
          size: 'Tall',
          temperature: 'ICE',
          extras: ['샷 추가']
        },
        quantity: 1
      }
    ]
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrderStatus(prev => ({
        ...prev,
        status: prev.status === 'PENDING' ? 'PREPARING' : 'COMPLETED'
      }));
      toast.success('주문 상태가 업데이트되었습니다');
    } catch (error) {
      toast.error('상태 업데이트에 실패했습니다');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusText = (status: OrderStatus['status']) => {
    switch (status) {
      case 'PENDING': return '주문 접수';
      case 'PREPARING': return '제조 중';
      case 'COMPLETED': return '제조 완료';
    }
  };

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">주문 번호: {orderStatus.id}</h3>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-gray-100 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(orderStatus.status)}`}>
            {getStatusText(orderStatus.status)}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(orderStatus.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium">{orderStatus.store.name}</p>
            <p className="text-sm text-gray-500">{orderStatus.store.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Coffee className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            {orderStatus.items.map((item, index) => (
              <div key={index}>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.options.size} / {item.options.temperature}
                  {item.options.extras && item.options.extras.length > 0 && 
                    ` / ${item.options.extras.join(', ')}`}
                  {item.quantity > 1 && ` × ${item.quantity}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 flex justify-between items-center">
        <span className="text-sm text-gray-500">주문 상세 보기</span>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default OrderNotification;