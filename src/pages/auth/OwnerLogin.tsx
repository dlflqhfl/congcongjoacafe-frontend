import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Store, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useOwnerStore } from '../../store/ownerStore';

const publicApi = axios.create({
  baseURL: 'http://localhost:9090/api/public/owner',
});

const loginSchema = z.object({
  sName: z.string().min(1, '매장을 선택해주세요'),
  sCode: z.string().min(1, '매장 코드를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginForm = z.infer<typeof loginSchema>;

const OwnerLogin = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<any[]>([]);
  const { setStore, setFirstLogin } = useOwnerStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await publicApi.get('/stores');
        setStores(response.data.data);
      } catch (error) {
        console.error('에러:', error);
      }
    };
    fetchStores();
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      sName: '',
      sCode: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);

      const selectedStore = stores.find(store => store.sname === data.sName);

      if (selectedStore) {
        const response = await publicApi.post('/login', {
          sName: data.sName,
          sCode: data.sCode,
          password: data.password,
        });


        if (response.data.resultCode === 'USER_LOGIN_SUCCESS') {
          console.log('로그인 성공:', response.data);

          setStore(selectedStore.id, selectedStore.sname);
          const isFirstLogin = response.data.data.isFirstLogin || false;

          setFirstLogin(isFirstLogin);

          if (isFirstLogin) {
            navigate('/owner/setup');
          } else {
            navigate('/owner');
          }

          toast.success(response.data.msg || '로그인되었습니다');
        } else {
          console.error('로그인 실패 메시지:', response.data.msg);
          toast.error(response.data.msg || '로그인에 실패했습니다');
        }
      } else {
        toast.error('선택한 매장을 찾을 수 없습니다.');
      }
    } catch (error) {
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
        <Toaster />
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
                    {...register('sName')}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="">매장을 선택하세요</option>
                  {stores.map(store => (
                      <option key={store.sname} value={store.sname}>
                        {store.sname}
                      </option>
                  ))}
                </select>
                {errors.sName && (
                    <p className="mt-1 text-sm text-red-600">{errors.sName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  매장 코드
                </label>
                <div className="mt-1 relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                      {...register('sCode')}
                      placeholder="CONG-123456"
                      className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                {errors.sCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.sCode.message}</p>
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