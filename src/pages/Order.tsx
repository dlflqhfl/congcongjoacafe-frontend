import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CreditCard, Wallet, Gift, ChevronRight, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {useState} from "react";

const orderSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().regex(/^01[0-9]-\d{4}-\d{4}$/, '올바른 전화번호 형식을 입력해주세요'),
  request: z.string().optional(),
  paymentMethod: z.enum(['card', 'kakao']),
  usePoint: z.boolean().default(false),
  pointAmount: z.number().min(0).max(10000).optional(),
  useCoupon: z.boolean().default(false),
  couponId: z.string().optional()
});

type OrderForm = z.infer<typeof orderSchema>;

const Order = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isCouponSelectOpen, setIsCouponSelectOpen] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: user?.name || '',
      paymentMethod: 'card',
      usePoint: false,
      pointAmount: 0,
      useCoupon: false
    }
  });

  // Dummy coupons - replace with API call
  const availableCoupons = [
    {
      id: 'CPN1',
      name: '신규 가입 쿠폰',
      type: 'FIXED' as const,
      value: 3000,
      minOrderAmount: 10000
    }
  ];

  const paymentMethod = watch('paymentMethod');
  const usePoint = watch('usePoint');
  const pointAmount = watch('pointAmount') || 0;
  const useCoupon = watch('useCoupon');
  const selectedCouponId = watch('couponId');

  const selectedCoupon = availableCoupons.find(c => c.id === selectedCouponId);
  const totalPrice = getTotalPrice();
  const discountAmount = selectedCoupon?.type === 'FIXED' ? selectedCoupon.value : 0;
  const finalPrice = totalPrice - pointAmount - discountAmount;

  const handleSelectCoupon = (couponId: string) => {
    setValue('couponId', couponId);
    setValue('useCoupon', true);
    setIsCouponSelectOpen(false);
  };

  const handlePayment = async (data: OrderForm) => {
    try {
      // Simulate payment processing
      toast.loading('결제를 처리중입니다...', { duration: 2000 });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderId = `ORDER_${Date.now()}`;
      
      toast.success('결제가 완료되었습니다!');
      clearCart();
      navigate('/order/complete', { 
        state: { 
          orderId,
          amount: finalPrice 
        } 
      });
    } catch (error) {
      toast.error('결제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">주문하기</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">주문 상품</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.size} / {item.temperature}
                    {item.extras.length > 0 && ` / ${item.extras.join(', ')}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{item.totalPrice.toLocaleString()}원</p>
                  <p className="text-sm text-gray-500">{item.quantity}개</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(handlePayment)} className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">주문자 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이름</label>
                <input
                  {...register('name')}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">연락처</label>
                <input
                  {...register('phone')}
                  placeholder="01x-xxxx-xxxx"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">요청사항</label>
                <textarea
                  {...register('request')}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">할인 적용</h2>
            
            {/* Point Usage */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('usePoint')}
                    id="usePoint"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="usePoint" className="ml-2 block text-sm text-gray-700">
                    포인트 사용
                  </label>
                </div>
                <p className="text-sm text-gray-500">보유 포인트: {user?.point?.toLocaleString() || 0}P</p>
              </div>

              {usePoint && (
                <div>
                  <input
                    type="number"
                    {...register('pointAmount', { valueAsNumber: true })}
                    max={user?.point || 0}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    최대 {user?.point?.toLocaleString() || 0}P까지 사용 가능합니다.
                  </p>
                </div>
              )}
            </div>

            {/* Coupon Usage */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('useCoupon')}
                    id="useCoupon"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="useCoupon" className="ml-2 block text-sm text-gray-700">
                    쿠폰 사용
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCouponSelectOpen(true)}
                  className="text-primary text-sm hover:underline"
                >
                  사용 가능한 쿠폰 {availableCoupons.length}장
                </button>
              </div>

              {useCoupon && selectedCoupon && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedCoupon.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedCoupon.type === 'FIXED' && 
                          `${selectedCoupon.value.toLocaleString()}원 할인`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setValue('couponId', undefined);
                        setValue('useCoupon', false);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      해제
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">결제 수단</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${
                paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="card"
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 mr-2" />
                <span>카드 결제</span>
              </label>

              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${
                paymentMethod === 'kakao' ? 'border-primary bg-primary/5' : 'border-gray-200'
              }`}>
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="kakao"
                  className="sr-only"
                />
                <Wallet className="w-5 h-5 mr-2" />
                <span>카카오페이</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">결제 금액</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">주문 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              {usePoint && pointAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">포인트 사용</span>
                  <span className="text-red-500">-{pointAmount.toLocaleString()}P</span>
                </div>
              )}
              {useCoupon && selectedCoupon && (
                <div className="flex justify-between">
                  <span className="text-gray-600">쿠폰 할인</span>
                  <span className="text-red-500">
                    -{selectedCoupon.value.toLocaleString()}원
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-medium">최종 결제 금액</span>
                <span className="text-xl font-bold text-primary">
                  {finalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-primary text-white rounded-xl font-medium"
          >
            {finalPrice.toLocaleString()}원 결제하기
          </motion.button>
        </form>

        {/* Coupon Select Modal */}
        <AnimatePresence>
          {isCouponSelectOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsCouponSelectOpen(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl p-6"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-6">사용 가능한 쿠폰</h2>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {availableCoupons.map((coupon) => (
                    <button
                      key={coupon.id}
                      onClick={() => handleSelectCoupon(coupon.id)}
                      className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{coupon.name}</p>
                          <p className="text-sm text-gray-500">
                            {coupon.type === 'FIXED' && 
                              `${coupon.value.toLocaleString()}원 할인`}
                          </p>
                          {coupon.minOrderAmount && (
                            <p className="text-xs text-gray-500">
                              {coupon.minOrderAmount.toLocaleString()}원 이상 주문 시
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Order;