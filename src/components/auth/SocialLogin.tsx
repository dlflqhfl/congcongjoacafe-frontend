import React from 'react';
import { motion } from 'framer-motion';

const SocialLogin: React.FC = () => {
  const socialButtons = [
    { 
      name: 'Naver',
      bg: 'bg-[#03C75A]',
      hover: 'hover:bg-[#02B150]',
      textColor: 'text-white'
    },
    { 
      name: 'Kakao', 
      bg: 'bg-[#FEE500]',
      hover: 'hover:bg-[#FDD835]',
      textColor: 'text-[#3C1E1E]'
    },
    { 
      name: 'Google',
      bg: 'bg-white',
      hover: 'hover:bg-gray-50',
      textColor: 'text-gray-700',
      border: 'border-2 border-gray-200'
    }
  ];

  return (
    <div className="space-y-3">
      {socialButtons.map((button) => (
        <motion.button
          key={button.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full ${button.bg} ${button.hover} ${button.textColor} 
                     ${button.border || ''} font-medium py-3 rounded-xl shadow-sm 
                     transition-all duration-300`}
        >
          {button.name}로 계속하기
        </motion.button>
      ))}
    </div>
  );
};

export default SocialLogin;