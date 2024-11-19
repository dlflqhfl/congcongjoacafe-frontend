import { motion } from 'framer-motion';
import { 
  Bell, 
  CreditCard, 
  Lock, 
  Mail, 
  Phone, 
  User,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {useState} from "react";

const Settings = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    order: true,
    marketing: false,
    event: true
  });

  const handleLogout = () => {
    logout();
    toast.success('로그아웃되었습니다');
    navigate('/');
  };

  const settingsSections = [
    {
      title: '계정 설정',
      items: [
        {
          icon: User,
          label: '프로필 정보',
          value: user?.name,
          onClick: () => toast.success('프로필 수정 모달이 열립니다')
        },
        {
          icon: Mail,
          label: '이메일',
          value: user?.email
        },
        {
          icon: Phone,
          label: '전화번호',
          value: user?.phone
        },
        {
          icon: Lock,
          label: '비밀번호 변경',
          onClick: () => navigate('/forgot-password')
        }
      ]
    },
    {
      title: '결제 설정',
      items: [
        {
          icon: CreditCard,
          label: '결제 수단 관리',
          onClick: () => navigate('/mypage/payment')
        }
      ]
    },
    {
      title: '알림 설정',
      items: [
        {
          icon: Bell,
          label: '주문 알림',
          toggle: true,
          checked: notifications.order,
          onChange: () => setNotifications(prev => ({ ...prev, order: !prev.order }))
        },
        {
          icon: Bell,
          label: '마케팅 알림',
          toggle: true,
          checked: notifications.marketing,
          onChange: () => setNotifications(prev => ({ ...prev, marketing: !prev.marketing }))
        },
        {
          icon: Bell,
          label: '이벤트 알림',
          toggle: true,
          checked: notifications.event,
          onChange: () => setNotifications(prev => ({ ...prev, event: !prev.event }))
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">설정</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-primary"
          >
            <LogOut className="w-5 h-5 mr-2" />
            로그아웃
          </button>
        </div>

        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={`flex items-center justify-between ${
                        item.onClick ? 'cursor-pointer hover:bg-gray-50' : ''
                      } -mx-6 px-6 py-2`}
                      onClick={item.onClick}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium">{item.label}</p>
                          {item.value && (
                            <p className="text-sm text-gray-500">{item.value}</p>
                          )}
                        </div>
                      </div>
                      {item.toggle ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={item.checked}
                            onChange={item.onChange}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                                      peer-focus:ring-primary/20 rounded-full peer 
                                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                                      after:h-5 after:w-5 after:transition-all peer-checked:bg-primary">
                          </div>
                        </label>
                      ) : item.onClick && (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;