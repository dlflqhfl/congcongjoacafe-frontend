import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const storeAuthSchema = z.object({
  storeCode: z.string().length(8, '매장 코드는 8자리여야 합니다'),
  authCode: z.string().length(6, '인증 코드는 6자리여야 합니다'),
  managerName: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  managerPhone: z.string().regex(/^01[0-9]-\d{4}-\d{4}$/, '올바른 전화번호 형식을 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type StoreAuthForm = z.infer<typeof storeAuthSchema>;

const StoreAuth = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<StoreAuthForm>({
    resolver: zodResolver(storeAuthSchema)
  });

  const onSubmit = async (data: StoreAuthForm) => {
    try {
      // API call would go here
      toast.success('매장 계정이 생성되었습니다!');
    } catch (error) {
      toast.error('계정 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <img src="/logo.png" alt="콩콩조아" className="mx-auto h-16 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          매장 계정 등록
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          본사에서 발급받은 매장 코드와 인증 코드를 입력해주세요
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
                매장 코드
              </label>
              <input
                {...register('storeCode')}
                placeholder="12345678"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.storeCode && (
                <p className="mt-1 text-sm text-red-600">{errors.storeCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                인증 코드
              </label>
              <input
                {...register('authCode')}
                placeholder="123456"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.authCode && (
                <p className="mt-1 text-sm text-red-600">{errors.authCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                점장 이름
              </label>
              <input
                {...register('managerName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.managerName && (
                <p className="mt-1 text-sm text-red-600">{errors.managerName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                점장 연락처
              </label>
              <input
                {...register('managerPhone')}
                placeholder="01x-xxxx-xxxx"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.managerPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.managerPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                {...register('email')}
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                {...register('password')}
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                계정 생성하기
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreAuth;