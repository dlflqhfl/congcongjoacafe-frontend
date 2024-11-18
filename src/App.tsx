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
          <Route index element={<AdminDashboard />} />
          <Route path="store" element={<StoreManagement />} />
          <Route path="menus" element={<MenuManagement />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;