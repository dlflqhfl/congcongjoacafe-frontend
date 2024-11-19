import { motion } from 'framer-motion';
import { Store, Bell, Coffee, Truck, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileSheet from '../../components/common/MobileSheet';
import toast from 'react-hot-toast';

const OwnerSettings = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const menuItems = [
    {
      icon: Store,
      label: '매장 운영 시간',
      description: '매장 운영 시간을 설정합니다',
      onClick: () => toast.success('준비중인 기능입니다')
    },
    {
      icon: Coffee,
      label: '주문 설정',
      description: '주문 자동 승인, 최소 주문 금액을 설정합니다',
      onClick: () => toast.success('준비중인 기능입니다')
    },
    {
      icon: Truck,
      label: '배달 설정',
      description: '배달 반경을 설정합니다',
      onClick: () => toast.success('준비중인 기능입니다')
    },
    {
      icon: Bell,
      label: '알림 설정',
      description: '주문, 리뷰 등의 알림을 설정합니다',
      onClick: () => toast.success('준비중인 기능입니다')
    },
    {
      icon: Lock,
      label: '비밀번호 변경',
      description: '계정 보안을 위해 비밀번호를 변경합니다',
      onClick: () => navigate('/owner/password')
    }
  ];

  const content = (
    <div className="space-y-6">
      {menuItems.map((item) => (
        <motion.button
          key={item.label}
          onClick={item.onClick}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl 
                   hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{item.label}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.button>
      ))}
    </div>
  );

  return isMobile ? (
    <MobileSheet
      isOpen={true}
      onClose={() => window.history.back()}
      title="설정"
      showCloseButton={true}
    >
      {content}
    </MobileSheet>
  ) : (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-8">설정</h1>
        {content}
      </div>
    </div>
  );
};

export default OwnerSettings;