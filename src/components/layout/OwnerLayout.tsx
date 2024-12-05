import {Link, useNavigate, Outlet, useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
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
import toast from 'react-hot-toast';
import {useEffect, useRef, useState} from "react";
import useCheckTokenExpiry from "../../hooks/useCheckTokenExpiry.ts";
import {useOwnerAuthStore} from "../../store/ownerAuthStore.ts";
import axios from "axios";


const OwnerLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const hasShownToast = useRef(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const api = axios.create({baseURL: `${API_BASE_URL}/owner`});
    const clearAuth = useOwnerAuthStore((state) => state.clearAuth);



    const { isLoggedIn, isFirstLogin } = useOwnerAuthStore();
    const sName = useOwnerAuthStore((state) => state.sName);
    const isMobile = window.innerWidth < 768;

    // 페이지 접근 상태 검증 우선
    useEffect(() => {
        if (!hasShownToast.current) {
            // 로그인하지 않은 상태에서 /owner/login 외의 페이지 접근 시 차단
            if (!isLoggedIn && location.pathname !== "/owner/login") {
                navigate("/owner/login");
                toast.error("올바르지 않은 접근입니다");
                hasShownToast.current = true;
            }

            // 추가 첫 로그인 관련 접근 제어
            else if (!isFirstLogin && location.pathname === "/owner/setup") {
                navigate("/");
                toast.error("올바르지 않은 접근입니다");
                hasShownToast.current = true;
            }

            else if (isFirstLogin && location.pathname !== "/owner/setup") {
                navigate("/owner/setup");
                toast.error("매장 등록을 먼저 진행해 주십시오.");
            }
        }
    }, [isLoggedIn, isFirstLogin, location.pathname, navigate]);

    // 세션 만료 검사 훅 사용
    useCheckTokenExpiry();

    // 일반 로그아웃 함수 (알림 포함)
    const handleLogout = async () => {
        try {
            await api.post('/logout', null, { withCredentials: true });
            clearAuth();
            localStorage.removeItem('ownerAuth');

            toast.success('로그아웃되었습니다');
            navigate('/');
        } catch (error) {
            console.error('로그아웃 처리 중 오류 발생:', error);
            toast.error('로그아웃 실패. 다시 시도해주세요.');
        }
    };

    const menuItems = [
        {icon: Coffee, label: '메뉴 관리', path: '/owner/menus'},
        {icon: ShoppingBag, label: '주문 관리', path: '/owner/orders'},
        {icon: BarChart2, label: '매출 관리', path: '/owner/sales'},
        {icon: MessageSquare, label: '문의 관리', path: '/owner/inquiries'},
        {icon: Store, label: '매장 관리', path: '/owner/store'},
        {icon: Settings, label: '설정', path: '/owner/settings'},
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
                                <MenuIcon className="h-6 w-6"/>
                            </button>
                            <Link to="/owner" className="flex items-center space-x-3">
                                <img src="/logo.png" alt="콩콩조아" className="h-8"/>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl">{sName}님</span>
                                        <span className="text-sm text-gray-500">환영합니다</span>
                                </div>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-600 hover:text-primary"
                            >
                                <LogOut className="h-5 w-5 mr-2"/>
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
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/50 z-50 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{x: '-100%'}}
                            animate={{x: 0}}
                            exit={{x: '-100%'}}
                            transition={{type: 'spring', damping: 25, stiffness: 300}}
                            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-end p-4">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="h-6 w-6"/>
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
                                                <item.icon className="h-5 w-5"/>
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
                                        <item.icon className="h-5 w-5"/>
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
                        <Outlet/>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;