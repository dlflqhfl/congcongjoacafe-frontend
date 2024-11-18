import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SocialLogin from '../components/auth/SocialLogin';
import EmailLogin from '../components/auth/EmailLogin';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-beige-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <img 
          src="/logo.png" 
          alt="콩콩조아" 
          className="mx-auto h-16 w-auto animate-float"
        />
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          환영합니다
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          콩콩조아에서 특별한 혜택을 만나보세요
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <EmailLogin />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <SocialLogin />
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-primary hover:text-primary/80"
              >
                회원가입
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/owner/login"
                className="flex justify-center py-2.5 px-4 rounded-xl border-2 border-primary
                         text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                점주 로그인
              </Link>
              <Link
                to="/admin/login"
                className="flex justify-center py-2.5 px-4 rounded-xl border-2 border-primary
                         text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                관리자 로그인
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;