import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {Link, useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from "react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {useAdminAuthStore} from "@/store/adminAuthStore.tsx";

const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginForm = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });
  const [isLoading, setIsLoading] = useState(false);
  const {setAccessToken, clearAuth} = useAdminAuthStore();


  const publicApi = axios.create({
    baseURL: 'http://localhost:9090/api/public/admin',
    withCredentials: true
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);

      // 로그인 요청을 위한 API 호출
      const response = await publicApi.post('/login', {
        username: data.username,
        password: data.password,
      });
      console.log(response.data)

      if (response.data.resultCode === 'USER_LOGIN_SUCCESS') {
        console.log('관리자 로그인 성공:', response.data);

        const newAccessToken = response.data.data.accessToken;

        const decodedToken: { exp: number } = jwtDecode(newAccessToken);
        const expiryTime = decodedToken.exp * 1000; // 밀리초 단위로 변환
        setAccessToken(newAccessToken, expiryTime); // 토큰 저장
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`; // 기본 헤더에 토큰 추가

        // 성공 메시지 및 페이지 이동
        toast.success(response.data.msg || '관리자로 로그인되었습니다');
        navigate('/admin');
      } else {
        console.error('로그인 실패 메시지:', response.data.msg);
        toast.error(response.data.msg || '로그인에 실패했습니다');
      }
    } catch (error) {
      // 오류 처리
      if (axios.isAxiosError(error) && error.response) {
        console.error('로그인 중 에러 발생:', error.response.data);
        if (error.response.status === 401) {
          toast.error('잘못된 자격 증명 또는 인증 실패');
        } else {
          toast.error(`오류가 발생했습니다: ${error.response.status}`);
        }
      } else {
        console.error('로그인 중 에러 발생:', error);
        toast.error('로그인에 실패했습니다');
      }
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
          관리자 로그인
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
                아이디
              </label>
              <input
                {...register('username')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
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
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;