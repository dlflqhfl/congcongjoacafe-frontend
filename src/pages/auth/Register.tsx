import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const registerSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, '영문, 숫자, 특수문자를 포함해야 합니다'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^01[0-9]-\d{4}-\d{4}$/, '올바른 전화번호 형식을 입력해주세요'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});


const checkEmailDuplicate = async (email: string) => {
  try {
    const response = await fetch(`http://localhost:9090/user/register/duplicate?email=${encodeURIComponent(email)}`);
    console.log(response);
    // 응답이 실패했을 경우 예외 처리
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 응답 데이터를 JSON으로 변환
    const isDuplicate = await response.json();
    console.log("Email duplicate check result:", isDuplicate);
    return isDuplicate;
  } catch (error) {
    console.error('Error checking email duplicate:', error);
    return false; // 에러 발생 시 기본값 false 반환
  }
};



type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { setVerificationEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      // API call would go here to register user
      
      console.log("쿠쿠루");

      // 이메일 중복 확인
      const isDuplicate = await checkEmailDuplicate(data.email);
      if (isDuplicate) {
        setError("email", { type: "manual", message: "이미 사용 중인 이메일입니다" });
        return;
      }

      // API 호출로 회원가입 처리
      setVerificationEmail(data.email);
      navigate('/verify-email');
      toast.success('인증 메일이 발송되었습니다');
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다');
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
        <img src="/logo.png" alt="콩콩조아" className="mx-auto h-16 w-auto" />
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          회원가입
        </h2>
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
                이름
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('name')}
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                전화번호
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('phone')}
                  placeholder="01x-xxxx-xxxx"
                  className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                         shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '처리중...' : '가입하기'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  이미 계정이 있으신가요?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                로그인하기
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;