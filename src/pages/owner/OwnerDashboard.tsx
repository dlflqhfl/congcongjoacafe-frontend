import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ShoppingBag, DollarSign, Package, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const dailyOrdersData = {
    labels: ['9시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시', '18시'],
    datasets: [
      {
        label: '주문 수',
        data: [5, 8, 12, 15, 20, 18, 15, 10, 12, 8],
        backgroundColor: '#2C5F2D',
      },
    ],
  };

  const stats = [
    {
      title: '오늘의 주문',
      value: '48',
      icon: ShoppingBag,
      status: '대기중: 3',
    },
    {
      title: '오늘의 매출',
      value: '₩850,000',
      icon: DollarSign,
      status: '+12.5%',
    },
    {
      title: '재고 현황',
      value: '15/18',
      icon: Package,
      status: '부족: 3',
    },
    {
      title: '고객 문의',
      value: '12',
      icon: MessageSquare,
      status: '미답변: 2',
    },
  ];

  return (
    <div className={`${isMobile ? 'h-[calc(100vh-4rem)]' : ''} overflow-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">콩콩조아 강남점</h1>
            <p className="text-gray-500">영업중 · 09:00 - 22:00</p>
          </div>
          {!isMobile && (
            <div className="flex space-x-4">
              <button className="btn-primary">
                영업 상태 변경
              </button>
              <button className="btn-primary">
                메뉴 관리
              </button>
            </div>
          )}
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
                  <p className="text-sm text-primary mt-2">{stat.status}</p>
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
            <h2 className="text-lg font-semibold mb-4">시간대별 주문</h2>
            <Bar data={dailyOrdersData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4">실시간 주문</h2>
            <div className="space-y-4">
              {[
                { id: 1, time: '5분 전', items: '아메리카노 외 2개', status: 'pending' },
                { id: 2, time: '12분 전', items: '카페라떼 외 1개', status: 'preparing' },
                { id: 3, time: '18분 전', items: '바닐라라떼', status: 'completed' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-400' :
                        order.status === 'preparing' ? 'bg-blue-400' :
                        'bg-green-400'
                      }`} />
                      <p className="font-medium">주문 #{order.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{order.items}</p>
                    <p className="text-xs text-gray-400">{order.time}</p>
                  </div>
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <button className="px-3 py-1 bg-primary text-white rounded-md">승인</button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-md">거절</button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button className="px-3 py-1 bg-green-500 text-white rounded-md">완료</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <div className="flex space-x-4">
              <button className="flex-1 py-3 bg-primary text-white rounded-lg">
                영업 상태 변경
              </button>
              <button className="flex-1 py-3 bg-primary text-white rounded-lg">
                메뉴 관리
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;