import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Coffee,
  ShoppingBag,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Store
} from 'lucide-react';
import { useOwnerStore } from '../../store/ownerStore';
import toast from 'react-hot-toast';
import {useEffect, useState} from "react";

const OwnerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isFirstLogin, storeName, clearStore } = useOwnerStore();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    // 첫 로그인이면서 setup 페이지가 아닌 경우에만 setup으로 리다이렉트
  /*  if (isFirstLogin && location.pathname !== '/owner/setup') {
      navigate('/owner/setup');
      return;
    }*/

    // 첫 로그인이 아닌데 setup 페이지에 접근하려고 하면 메인으로 리다이렉트
    if (!isFirstLogin && location.pathname === '/owner/setup') {
      navigate('/owner');
    }
  }, [isFirstLogin, location.pathname, navigate]);

  const handleLogout = () => {
    clearStore();
    toast.success('로그아웃되었습니다');
    navigate('/owner/login');
  };

  const menuItems = [
    { icon: Coffee, label: '메뉴 관리', path: '/owner/menus' },
    { icon: ShoppingBag, label: '주문 관리', path: '/owner/orders' },
    { icon: BarChart2, label: '매출 관리', path: '/owner/sales' },
    { icon: MessageSquare, label: '문의 관리', path: '/owner/inquiries' },
    { icon: Store, label: '매장 관리', path: '/owner/store' },
    { icon: Settings, label: '설정', path: '/owner/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
              <Link to="/owner" className="flex items-center space-x-3">
                <img src="/logo.png" alt="콩콩조아" className="h-8" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl">점주 페이지</span>
                  {storeName && (
                    <span className="text-sm text-gray-500">{storeName}</span>
                  )}
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-primary"
              >
                <LogOut className="h-5 w-5 mr-2" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Mobile Menu */}
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="px-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </motion.div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-lg">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;