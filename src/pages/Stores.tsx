import React from 'react';
import { motion } from 'framer-motion';
import StoreList from '../components/store/StoreList';
import { useGeolocation } from '../hooks/useGeolocation';

const Stores: React.FC = () => {
  const { loading, error } = useGeolocation();

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            가까운 매장 찾기
          </h1>
          <p className="text-gray-600">
            {loading ? '현재 위치를 확인하고 있습니다...' :
             error ? '위치 정보를 가져올 수 없습니다.' :
             '현재 위치를 기준으로 가까운 매장을 찾아드립니다.'}
          </p>
        </motion.div>

        <StoreList />
      </div>
    </div>
  );
};

export default Stores;