import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verificationEmail, setVerificationEmail } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!verificationEmail) {
      navigate('/register');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [verificationEmail, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/[0-9]/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setCode(newCode);
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      // API call to resend verification code
      setTimeLeft(180);
      toast.success('인증 코드가 재발송되었습니다');
    } catch (error) {
      toast.error('인증 코드 재발송에 실패했습니다');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('인증 코드 6자리를 모두 입력해주세요');
      return;
    }

    try {
      // API call to verify code
      toast.success('이메일 인증이 완료되었습니다');
      setVerificationEmail(null);
      navigate('/login');
    } catch (error) {
      toast.error('잘못된 인증 코드입니다');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-beige-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          이메일 인증
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {verificationEmail}으로 전송된<br />
          6자리 인증 코드를 입력해주세요
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg
                           focus:ring-2 focus:ring-primary focus:border-primary"
                />
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-sm">
                <span className="text-gray-500">남은 시간: </span>
                <span className={`font-medium ${
                  timeLeft < 60 ? 'text-red-500' : 'text-gray-900'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || timeLeft > 0}
                className="text-sm text-primary hover:text-primary/80 disabled:text-gray-400"
              >
                인증 코드 재발송
              </button>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent
                       rounded-lg shadow-sm text-sm font-medium text-white bg-primary 
                       hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-primary"
            >
              인증하기
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;