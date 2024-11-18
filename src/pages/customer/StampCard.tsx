import { motion } from 'framer-motion';
import { Coffee, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const StampCard = () => {
  // Dummy data - replace with API call
  const stamps = {
    total: 8,
    required: 12,
    history: [
      { id: 1, date: '2024-03-15', menu: '아메리카노' },
      { id: 2, date: '2024-03-14', menu: '카페라떼' },
      // ... more stamp history
    ]
  };

  const handleExchangeStamps = () => {
    if (stamps.total >= stamps.required) {
      toast.success('스탬프가 쿠폰으로 교환되었습니다!');
    } else {
      toast.error(`스탬프가 부족합니다. ${stamps.required - stamps.total}개 더 모아주세요.`);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-8">스탬프 카드</h1>

        {/* Stamp Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">나의 스탬프</h2>
            <div className="text-primary font-medium">
              {stamps.total} / {stamps.required}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {Array.from({ length: stamps.required }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-full border-2 ${
                  index < stamps.total
                    ? 'bg-primary/10 border-primary'
                    : 'border-gray-200'
                } flex items-center justify-center`}
              >
                <Coffee
                  className={`w-6 h-6 ${
                    index < stamps.total ? 'text-primary' : 'text-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleExchangeStamps}
            className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 ${
              stamps.total >= stamps.required
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>쿠폰으로 교환하기</span>
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            {stamps.required}개 모으면 아메리카노 무료 쿠폰으로 교환할 수 있어요!
          </p>
        </motion.div>

        {/* Stamp History */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">적립 내역</h2>
            <div className="space-y-4">
              {stamps.history.map((stamp) => (
                <div
                  key={stamp.id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium">{stamp.menu}</p>
                    <p className="text-sm text-gray-500">{stamp.date}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampCard;