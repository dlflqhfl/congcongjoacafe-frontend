import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Trash2, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {useState} from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'making' | 'complete' | 'event';
  orderId?: string;
  read: boolean;
}

export default function NotificationButton() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '주문 완료',
      message: '아메리카노 외 2건이 주문 완료되었습니다.',
      time: '방금 전',
      type: 'order',
      orderId: 'ORD123',
      read: false
    },
    {
      id: '2',
      title: '제조 시작',
      message: '주문하신 음료 제조가 시작되었습니다.',
      time: '5분 전',
      type: 'making',
      orderId: 'ORD123',
      read: false
    },
    {
      id: '3',
      title: '제조 완료',
      message: '주문하신 음료가 준비되었습니다.',
      time: '10분 전',
      type: 'complete',
      orderId: 'ORD123',
      read: true
    }
  ]);

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('알림이 삭제되었습니다');
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    toast.success('모든 알림이 삭제되었습니다');
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.orderId) {
      navigate(`/mypage/orders/${notification.orderId}`);
    }
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isAuthenticated) return null;

  return (
      <div className="relative">
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-primary/10"
        >
          <Bell className="h-6 w-6 text-primary" />
          {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
              <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', duration: 0.3 }}
                  className="fixed inset-x-0 top-16 mx-auto sm:absolute sm:left-0 sm:left-auto sm:top-full mt-2 w-full sm:w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">알림</h3>
                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[calc(100vh-8rem)] sm:max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        알림이 없습니다
                      </div>
                  ) : (
                      notifications.map((notification) => (
                          <div
                              key={notification.id}
                              className="relative group"
                          >
                            <div
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                    !notification.read ? 'bg-primary/5' : ''
                                }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 mr-2">
                                  <h4 className="font-medium text-sm">{notification.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">{notification.time}</span>
                              </div>
                              {notification.orderId && (
                                  <div className="flex items-center justify-end mt-2 text-xs text-primary">
                                    <span>주문 상세 보기</span>
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </div>
                              )}
                            </div>
                            <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1
                               bg-white rounded-full shadow opacity-0 group-hover:opacity-100
                               transition-opacity duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                      ))
                  )}
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}