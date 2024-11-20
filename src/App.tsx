import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import OwnerLayout from './components/layout/OwnerLayout';
import Navbar from './components/layout/Navbar';
import AdminDashboard from './pages/admin/Dashboard';
import StoreManagement from './pages/admin/StoreManagement';
import MenuManagement from './pages/admin/MenuManagement';
import UserManagement from './pages/admin/UserManagement';
import CouponManagement from './pages/admin/CouponManagement';
import AdminSettings from './pages/admin/Settings';
import Home from './pages/Home';
import Menu from './pages/Menu';
import MenuDetail from './pages/MenuDetail';
import Cart from './pages/Cart';
import Order from './pages/Order';
import OrderComplete from './pages/OrderComplete';
import Login from './pages/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import StoreAuth from './pages/auth/StoreAuth';
import OwnerLogin from './pages/auth/OwnerLogin';
import AdminLogin from './pages/auth/AdminLogin';
import Stores from './pages/Stores';
import StoreDetail from './pages/StoreDetail';
import Membership from './pages/Membership';
import MyPage from "./pages/customer/MyPage.tsx";
import ChatButton from "./components/chat/ChatButton.tsx";
import OrderHistory from "./pages/customer/OrderHistory.tsx";
import OrderDetail from "./pages/customer/OrderDetail.tsx";
import Settings from "./pages/customer/Settings.tsx";
import ReviewWrite from "./pages/customer/ReviewWrite.tsx";
import StampCard from "./pages/customer/StampCard.tsx";
import CouponList from "./pages/customer/CouponList.tsx";
import OwnerSettings from "./pages/owner/OwnerSettings.tsx";
import StoreSetup from "./pages/owner/StoreSetup.tsx";
import OwnerInquiries from "./pages/owner/Inquiries.tsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.tsx";
import OwnerMenus from "./pages/owner/Menus.tsx";
import OwnerOrders from "./pages/owner/Orders.tsx";
import OwnerSales from "./pages/owner/Sales.tsx";
import StoreEdit from "./pages/owner/StoreEdit.tsx";
import PasswordChange from "./pages/owner/PasswordChange.tsx";
import StoreSettings from "./pages/owner/StoreSettings.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<MenuDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/complete" element={<OrderComplete />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/store/:id" element={<StoreDetail />} />
          <Route path="/membership" element={<Membership />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/store-auth" element={<StoreAuth />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Customer Routes */}
        <Route path="/mypage" element={<><Navbar /><MyPage /><ChatButton /></>} />
        <Route path="/mypage/orders" element={<><Navbar /><OrderHistory /><ChatButton /></>} />
        <Route path="/mypage/orders/:id" element={<><Navbar /><OrderDetail /><ChatButton /></>} />
        <Route path="/mypage/stamp" element={<><Navbar /><StampCard /><ChatButton /></>} />
        <Route path="/mypage/coupons" element={<><Navbar /><CouponList /><ChatButton /></>} />
        <Route path="/mypage/settings" element={<><Navbar /><Settings /><ChatButton /></>} />
        <Route path="/review/write/:orderId" element={<><Navbar /><ReviewWrite /><ChatButton /></>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="stores" element={<StoreManagement />} />
          <Route path="menus" element={<MenuManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="coupons" element={<CouponManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Owner Routes */}
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<OwnerDashboard/>} />
          <Route path="store" element={<StoreSettings/>} />
          <Route path="menus" element={<OwnerMenus />} />
          <Route path="orders" element={<OwnerOrders/>} />
          <Route path="sales" element={<OwnerSales/>} />
          <Route path="inquiries" element={<OwnerInquiries />} />
          <Route path="edit" element={<StoreEdit/>} />
          <Route path="settings" element={<OwnerSettings/>} />
          <Route path="setup" element={<StoreSetup/>} />
          <Route path="password" element={<PasswordChange/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;