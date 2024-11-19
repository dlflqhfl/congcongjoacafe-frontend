import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Calendar, DollarSign, TrendingUp, TrendingDown, Filter } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OwnerSales = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const salesData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '매출',
        data: [1200000, 1900000, 1500000, 2500000, 2200000, 3000000],
        borderColor: '#2C5F2D',
        tension: 0.4,
      },
    ],
  };

  const menuSalesData = [
    { name: '아메리카노', count: 1234, amount: 6170000 },
    { name: '카페라떼', count: 890, amount: 4895000 },
    { name: '바닐라라떼', count: 756, amount: 4158000 },
  ];

  const stats = [
    {
      title: '이번 달 매출',
      value: '₩3,000,000',
      change: '+12%',
      trend: 'up',
    },
    {
      title: '지난 달 매출',
      value: '₩2,200,000',
      change: '+5%',
      trend: 'up',
    },
    {
      title: '올해 총 매출',
      value: '₩12,300,000',
      change: '+15%',
      trend: 'up',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">매출 관리</h1>
        <div className="flex space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="day">일별</option>
            <option value="week">주별</option>
            <option value="month">월별</option>
            <option value="year">연별</option>
          </select>
          <button 
            onClick={() => setIsDatePickerOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            기간 설정
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">매출 추이</h2>
          <Line data={salesData} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4">메뉴별 매출</h2>
          <div className="space-y-4">
            {menuSalesData.map((menu, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{menu.name}</p>
                  <p className="text-sm text-gray-500">{menu.count}잔</p>
                </div>
                <p className="font-medium">{menu.amount.toLocaleString()}원</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Date Range Picker Modal */}
      <AnimatePresence>
        {isDatePickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsDatePickerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">기간 설정</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      // Handle date range selection
                      setIsDatePickerOpen(false);
                      toast.success('기간이 설정되었습니다');
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    적용
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerSales;