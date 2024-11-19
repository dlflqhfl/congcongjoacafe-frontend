import React from 'react';
import { Routes, Route } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">주문 내역</h2>
          <p className="text-gray-600">최근 주문: 5건</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">포인트</h2>
          <p className="text-[#2C5F2D] font-semibold">1,500P</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">쿠폰</h2>
          <p className="text-[#2C5F2D] font-semibold">사용 가능: 3장</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;