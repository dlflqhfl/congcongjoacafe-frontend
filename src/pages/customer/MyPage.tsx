import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Ticket, 
  Gift, 
  Settings,
  ChevronRight,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const MyPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('로그아웃되었습니다');
    navigate('/');
  };

  const menuItems = [
    {
      icon: ShoppingBag,
      label: '주문 내역',
      description: '지난 주문 내역을 확인해보세요',
      link: '/mypage/orders'
    },
    {
      icon: Ticket,
      label: '쿠폰함',
      description: '사용 가능한 쿠폰을 확인해보세요',
      link: '/mypage/coupons'
    },
    {
      icon: Gift,
      label: '선물하기',
      description: '소중한 사람에게 마음을 전하세요',
      link: '/mypage/gifts'
    },
    {
      icon: Settings,
      label: '설정',
      description: '알림 및 개인정보 설정을 관리하세요',
      link: '/mypage/settings'
    }
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{user.name}님</h2>
              <p className="text-white/80">{user.level} 회원</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-white/80 text-sm mb-1">사용 가능한 포인트</p>
              <p className="text-xl font-bold">{user.point?.toLocaleString() || 0} P</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-white/80 text-sm mb-1">다음 등급까지</p>
              <p className="text-xl font-bold">3,500 P</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">결제 수단</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium">신한카드 1234</p>
                <p className="text-sm text-gray-500">기본 결제 수단</p>
              </div>
            </div>
            <Link
              to="/mypage/payment"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={item.link}
                className="flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mr-4 p-3 bg-primary/10 rounded-xl">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPage;