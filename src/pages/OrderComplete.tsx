import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Coffee, ChevronRight } from 'lucide-react';

const OrderComplete = () => {
  const location = useLocation();
  const { orderId, amount } = location.state || {};

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다!</h1>
          <p className="text-gray-600 mb-6">
            주문하신 음료가 준비되면 알림으로 알려드리겠습니다.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">주문 번호</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">결제 금액</span>
              <span className="font-medium">{amount?.toLocaleString()}원</span>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/mypage/orders"
              className="flex items-center justify-between w-full p-4 bg-primary/5 rounded-lg text-primary"
            >
              <div className="flex items-center">
                <Coffee className="w-5 h-5 mr-2" />
                <span>주문 내역 보기</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Link>

            <Link
              to="/"
              className="inline-block w-full py-4 bg-primary text-white rounded-lg font-medium"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderComplete;