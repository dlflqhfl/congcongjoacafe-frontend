import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Gift, Star, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const Membership = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-beige-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">로그인이 필요한 서비스입니다</h2>
          <p className="text-gray-600 mb-8">콩콩조아 멤버십 혜택을 이용하시려면 로그인해주세요.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 멤버십 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white mb-12"
        >
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{user?.name}님</h2>
              <p className="text-white/80">Green Level</p>
            </div>
            <div className="text-right">
              <p className="text-sm mb-1">사용 가능한 포인트</p>
              <p className="text-2xl font-bold">1,500 P</p>
            </div>
          </div>
          <div className="mt-6 flex items-center">
            <div className="flex-1 bg-white/20 h-2 rounded-full">
              <div className="w-[30%] bg-white h-full rounded-full" />
            </div>
            <span className="ml-4 text-sm">다음 레벨까지 3,500P</span>
          </div>
        </motion.div>

        {/* 혜택 안내 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Coffee, title: '음료 무료 쿠폰', desc: '12잔 주문시 1잔 무료' },
            { icon: Gift, title: '생일 혜택', desc: '생일 무료 음료 쿠폰 증정' },
            { icon: Star, title: '등급별 혜택', desc: '등급에 따른 추가 적립' },
            { icon: CreditCard, title: '결제 적립', desc: '결제 금액의 3% 적립' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* 등급 안내 */}
        <h2 className="text-2xl font-bold mb-6">등급별 혜택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { level: 'Green', points: '0 ~ 5,000P', benefit: '기본 적립 3%' },
            { level: 'Gold', points: '5,000 ~ 10,000P', benefit: '추가 적립 2%' },
            { level: 'Diamond', points: '10,000P ~', benefit: '추가 적립 5%' },
          ].map((grade, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">{grade.level}</h3>
              <div className="space-y-2 text-sm">
                <p>포인트 구간: {grade.points}</p>
                <p>혜택: {grade.benefit}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Membership;