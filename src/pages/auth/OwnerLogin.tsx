import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {Link, useNavigate} from 'react-router-dom';
import { Store, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOwnerStore } from '../../store/ownerStore';

const loginSchema = z.object({
  storeName: z.string().min(1, '매장명을 선택해주세요'),
  storeCode: z.string().min(1, '매장 코드를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginForm = z.infer<typeof loginSchema>;

const OwnerLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { setStore, setFirstLogin } = useOwnerStore();

  // 실제로는 API를 통해 가져올 매장 목록
  const stores = [
    { id: 'store1', name: '강남점', code: 'CONG-123456' },
    { id: 'store2', name: '역삼점', code: 'CONG-234567' },
  ];

  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const selectedStoreName = watch('storeName');
  const selectedStore = stores.find(store => store.name === selectedStoreName);

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      
      // 선택된 매장의 코드와 입력된 코드가 일치하는지 확인
      if (!selectedStore || selectedStore.code !== data.storeCode) {
        toast.error('매장 코드가 일치하지 않습니다');
        return;
      }

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 매장 정보 저장
      setStore(selectedStore.id, selectedStore.name);

      // 최초 로그인 여부 확인 (실제로는 API 응답으로 확인)
      const isFirstLogin = true;
      setFirstLogin(isFirstLogin);

      if (isFirstLogin) {
        navigate('/owner/setup');
      } else {
        navigate('/owner');
      }
      
      toast.success('로그인되었습니다');
    } catch (error) {
      toast.error('로그인에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Link to="/">
          <img src="/logo.png" alt="콩콩조아" className="mx-auto h-16 w-auto" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          점주 로그인
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          관리자로부터 받은 매장 코드로 로그인하세요
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                매장 선택
              </label>
              <select
                {...register('storeName')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">매장을 선택하세요</option>
                {stores.map(store => (
                  <option key={store.id} value={store.name}>
                    {store.name}
                  </option>
                ))}
              </select>
              {errors.storeName && (
                <p className="mt-1 text-sm text-red-600">{errors.storeName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                매장 코드
              </label>
              <div className="mt-1 relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('storeCode')}
                  placeholder="CONG-123456"
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              {errors.storeCode && (
                <p className="mt-1 text-sm text-red-600">{errors.storeCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password')}
                  type="password"
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                       shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default OwnerLogin;