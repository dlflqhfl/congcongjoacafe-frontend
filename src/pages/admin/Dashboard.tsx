import React from 'react';
import { motion } from 'framer-motion';
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
import { Store, Coffee, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const salesData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '매출',
        data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000],
        borderColor: '#2C5F2D',
        tension: 0.4,
      },
    ],
  };

  const stats = [
    {
      title: '총 매장 수',
      value: '32',
      icon: Store,
      change: '+2',
      changeType: 'increase',
    },
    {
      title: '이번 달 매출',
      value: '₩30,000,000',
      icon: DollarSign,
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: '신규 회원',
      value: '245',
      icon: Users,
      change: '+18%',
      changeType: 'increase',
    },
    {
      title: '인기 메뉴',
      value: '아메리카노',
      icon: Coffee,
      change: '2,341잔',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/stores')}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Store className="w-5 h-5 mr-2" />
            매장 관리
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/menus')}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Coffee className="w-5 h-5 mr-2" />
            메뉴 관리
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4">매출 추이</h2>
          <Line data={salesData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4">신규 매장 신청</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">콩콩조아 {index + 1}호점</p>
                  <p className="text-sm text-gray-500">서울시 강남구</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-primary text-white rounded-md">승인</button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-md">거절</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;