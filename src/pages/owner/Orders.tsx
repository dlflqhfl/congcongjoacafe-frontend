import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Check, X } from 'lucide-react';

const OwnerOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      customer: '김민수',
      items: ['아메리카노', '카페라떼'],
      total: 8500,
      status: 'pending',
      time: '5분 전',
    },
    {
      id: 'ORD-002',
      customer: '이영희',
      items: ['바닐라라떼', '티라미수'],
      total: 12000,
      status: 'preparing',
      time: '15분 전',
    },
    {
      id: 'ORD-003',
      customer: '박지성',
      items: ['아이스티', '치즈케이크'],
      total: 10500,
      status: 'completed',
      time: '30분 전',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">대기중</span>;
      case 'preparing':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">준비중</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">완료</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'all' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'pending' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            대기중
          </button>
          <button
            onClick={() => setFilterStatus('preparing')}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === 'preparing' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            준비중
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="주문번호 또는 고객명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">주문 #{order.id}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">{order.customer}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{order.time}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="text-gray-600">{item}</div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <p className="font-semibold">총 {order.total.toLocaleString()}원</p>
              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <>
                    <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg">
                      <Check className="w-4 h-4 mr-2" />
                      승인
                    </button>
                    <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg">
                      <X className="w-4 h-4 mr-2" />
                      거절
                    </button>
                  </>
                )}
                {order.status === 'preparing' && (
                  <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg">
                    <Check className="w-4 h-4 mr-2" />
                    완료
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OwnerOrders;