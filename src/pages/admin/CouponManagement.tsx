import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Ticket, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CouponRule {
  id: string;
  name: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_MENU';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  maxCount?: number;
  status: number;
}

const CouponManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponRule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = window.innerWidth < 768;

  // 실제로는 API를 통해 쿠폰 목록을 가져옴
  const coupons: CouponRule[] = [
    {
      id: 'CPR1',
      name: '신규 가입 쿠폰',
      code: 'WELCOME2024',
      type: 'FIXED',
      value: 3000,
      minOrderAmount: 10000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      maxCount: 1000,
      status: 1
    }
  ];

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const couponData = {
      name: formData.get('name'),
      code: formData.get('code') || generateRandomCode(),
      type: formData.get('type'),
      value: formData.get('value'),
      minOrderAmount: formData.get('minOrderAmount'),
      maxDiscount: formData.get('maxDiscount'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      maxCount: formData.get('maxCount')
    };

    // API call would go here
    toast.success(selectedCoupon ? '쿠폰이 수정되었습니다' : '쿠폰이 등록되었습니다');
    setIsFormOpen(false);
  };

  const handleDeleteCoupon = (id: string) => {
    // API call would go here
    toast.success('쿠폰이 삭제되었습니다');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('쿠폰 코드가 복사되었습니다');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">쿠폰 관리</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedCoupon(null);
            setIsFormOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          쿠폰 등록
        </motion.button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="쿠폰명 또는 코드로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                쿠폰 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                할인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                사용 기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {coupon.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-mono">{coupon.code}</span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {coupon.type === 'FIXED' && `${coupon.value.toLocaleString()}원`}
                    {coupon.type === 'PERCENTAGE' && `${coupon.value}%`}
                    {coupon.type === 'FREE_MENU' && '무료 메뉴'}
                  </div>
                  {coupon.minOrderAmount && (
                    <div className="text-sm text-gray-500">
                      최소 주문금액: {coupon.minOrderAmount.toLocaleString()}원
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {coupon.startDate} ~ {coupon.endDate}
                  </div>
                  {coupon.maxCount && (
                    <div className="text-sm text-gray-500">
                      최대 발급 수량: {coupon.maxCount.toLocaleString()}장
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    coupon.status === 1
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {coupon.status === 1 ? '사용 가능' : '사용 중지'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setIsFormOpen(true);
                    }}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coupon Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              className={`${
                isMobile
                  ? 'fixed bottom-0 w-full'
                  : 'relative w-full max-w-2xl mx-4'
              } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
              onClick={e => e.stopPropagation()}
            >
              {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {selectedCoupon ? '쿠폰 수정' : '쿠폰 등록'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    쿠폰명
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={selectedCoupon?.name}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                             focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    쿠폰 코드
                  </label>
                  <div className="mt-1 flex space-x-2">
                    <input
                      name="code"
                      type="text"
                      defaultValue={selectedCoupon?.code}
                      placeholder="비워두면 자동 생성됩니다"
                      className="block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const codeInput = document.querySelector('input[name="code"]') as HTMLInputElement;
                        if (codeInput) {
                          codeInput.value = generateRandomCode();
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                    >
                      생성
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      할인 유형
                    </label>
                    <select
                      name="type"
                      defaultValue={selectedCoupon?.type || 'FIXED'}
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    >
                      <option value="FIXED">정액 할인</option>
                      <option value="PERCENTAGE">정률 할인</option>
                      <option value="FREE_MENU">무료 메뉴</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      할인 값
                    </label>
                    <input
                      name="value"
                      type="number"
                      defaultValue={selectedCoupon?.value}
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      최소 주문금액
                    </label>
                    <input
                      name="minOrderAmount"
                      type="number"
                      defaultValue={selectedCoupon?.minOrderAmount}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      최대 할인금액
                    </label>
                    <input
                      name="maxDiscount"
                      type="number"
                      defaultValue={selectedCoupon?.maxDiscount}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      시작일
                    </label>
                    <input
                      name="startDate"
                      type="date"
                      defaultValue={selectedCoupon?.startDate}
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      종료일
                    </label>
                    <input
                      name="endDate"
                      type="date"
                      defaultValue={selectedCoupon?.endDate}
                      required
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      최대 발급 수량
                    </label>
                    <input
                      name="maxCount"
                      type="number"
                      defaultValue={selectedCoupon?.maxCount}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                               focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    {selectedCoupon ? '수정' : '등록'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponManagement;