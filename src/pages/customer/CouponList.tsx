import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Gift, Plus } from 'lucide-react';
import { Coupon } from '../../types';
import toast from 'react-hot-toast';

const CouponList = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Dummy data - replace with API call
  const coupons: Coupon[] = [
    {
      id: 'CPN1',
      code: 'WELCOME2024',
      name: '신규 가입 축하 쿠폰',
      description: '첫 주문 시 사용 가능한 3,000원 할인 쿠폰',
      type: 'FIXED',
      value: 3000,
      minOrderAmount: 10000,
      expiresAt: '2024-12-31T23:59:59Z',
      used: false
    }
  ];

  const handleRegisterCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error('쿠폰 코드를 입력해주세요');
      return;
    }
    // API call would go here
    toast.success('쿠폰이 등록되었습니다');
    setCouponCode('');
    setIsRegisterOpen(false);
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">쿠폰함</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            쿠폰 등록
          </motion.button>
        </div>

        <div className="space-y-4">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white p-6 rounded-2xl shadow-lg ${
                isExpired(coupon.expiresAt) ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Ticket className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">{coupon.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{coupon.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(coupon.expiresAt).toLocaleDateString()} 까지
                  </div>
                  {coupon.minOrderAmount && (
                    <p className="text-sm text-gray-500 mt-1">
                      {coupon.minOrderAmount.toLocaleString()}원 이상 주문 시 사용 가능
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {coupon.type === 'FIXED' && `${coupon.value.toLocaleString()}원`}
                    {coupon.type === 'PERCENTAGE' && `${coupon.value}%`}
                    {coupon.type === 'FREE_MENU' && '무료 메뉴'}
                  </div>
                  <div className="text-sm text-gray-500">
                    쿠폰 코드: {coupon.code}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coupon Register Modal */}
        {isRegisterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsRegisterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white w-full max-w-md m-4 p-6 rounded-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-6">쿠폰 등록</h2>
              <form onSubmit={handleRegisterCoupon}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    쿠폰 코드
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="쿠폰 코드를 입력하세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    등록
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CouponList;