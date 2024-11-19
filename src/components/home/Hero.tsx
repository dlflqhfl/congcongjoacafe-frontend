import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[600px] bg-gradient-to-r from-[#2C5F2D]/10 to-[#FFD700]/10">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              당신의 일상에
              <span className="block text-primary mt-2">특별한 커피 한잔</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              콩콩조아에서 제공하는 프리미엄 원두로 만든 
              특별한 커피를 만나보세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-8 py-3 bg-primary text-white rounded-full font-medium
                           shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 
                           transition-all duration-300"
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  메뉴 보기
                </motion.button>
              </Link>
              <Link to="/stores">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-8 py-3 bg-white text-primary rounded-full font-medium
                           border-2 border-primary hover:bg-primary hover:text-white
                           transition-all duration-300"
                >
                  매장 찾기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[400px]">
              <motion.img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
                alt="커피"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-primary mb-2">프리미엄 원두</h3>
                  <p className="text-gray-600">최상급 아라비카 100%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;