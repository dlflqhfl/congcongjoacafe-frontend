import { Link, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  Coffee, 
  Users, 
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Ticket
} from 'lucide-react';
import {useState} from "react";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    { icon: Store, label: '매장 관리', path: '/admin/stores' },
    { icon: Coffee, label: '메뉴 관리', path: '/admin/menus' },
    { icon: Users, label: '회원 관리', path: '/admin/users' },
    { icon: Ticket, label: '쿠폰 관리', path: '/admin/coupons' },
    { icon: Settings, label: '설정', path: '/admin/settings' },
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
              <Link to="/admin" className="flex items-center space-x-3">
                <img src="/logo.png" alt="콩콩조아" className="h-8" />
                <span className="font-bold text-xl">관리자 페이지</span>
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
        {isMobile && (
          <AnimatePresence>
            {isMobileMenuOpen && (
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
          </AnimatePresence>
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

export default AdminLayout;