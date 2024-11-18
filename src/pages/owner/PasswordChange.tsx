import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MobileSheet from '../../components/common/MobileSheet';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '영문, 숫자, 특수문자를 포함해야 합니다'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

const PasswordChange = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  
  const { register, handleSubmit, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordForm) => {
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('비밀번호가 변경되었습니다');
      navigate('/owner/store');
    } catch (error) {
      toast.error('비밀번호 변경에 실패했습니다');
    }
  };

  const content = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          현재 비밀번호
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            {...register('currentPassword')}
            className="block w-full rounded-lg border-gray-300 shadow-sm 
                     focus:ring-primary focus:border-primary pr-10"
          />
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        {errors.currentPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          새 비밀번호
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            {...register('newPassword')}
            className="block w-full rounded-lg border-gray-300 shadow-sm 
                     focus:ring-primary focus:border-primary pr-10"
          />
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          새 비밀번호 확인
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            {...register('confirmPassword')}
            className="block w-full rounded-lg border-gray-300 shadow-sm 
                     focus:ring-primary focus:border-primary pr-10"
          />
          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/owner/store')}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          변경
        </button>
      </div>
    </form>
  );

  return isMobile ? (
    <MobileSheet
      isOpen={true}
      onClose={() => navigate('/owner/store')}
      title="비밀번호 변경"
      showCloseButton={true}
    >
      {content}
    </MobileSheet>
  ) : (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-8">비밀번호 변경</h1>
        {content}
      </div>
    </div>
  );
};

export default PasswordChange;