import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Clock, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: any;
}

const StoreInfoModal: React.FC<StoreInfoModalProps> = ({ isOpen, onClose, store }) => {
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const isMobile = window.innerWidth < 768;

  // 시간 형식 변환 함수
const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const handleResetPassword = () => {
  setIsResetPasswordModalOpen(true);
};

const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const email = e.target.value;
  setEmail(email);

  if (!isValidEmail(email)) {
    setEmailError('유효한 이메일 주소를 입력하세요.');
  } else {
    setEmailError('');
  }
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const api = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleSendResetEmail = async () => {
  try {
    const response = await api.post('/resetPassword', { email, storeId: store.id });
    if (response.status === 200 && response.data.resultCode === "OK"){
    toast.success('이메일로 초기화된 비밀번호가 발송되었습니다.');}
    setIsResetPasswordModalOpen(false);
  } catch (error) {
    toast.error('비밀번호 초기화 중 오류가 발생했습니다.');
    console.error(error);
  }
};

  const content = (
    <div className="space-y-8">
      {/* Images */}
      <div>
        <h2 className="text-lg font-semibold mb-4">매장 이미지</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {store.images
            .sort((a: any, b: any) => (b.isMain === 'TRUE' ? 1 : -1))
            .map((img: any, index: number) => (
            <div key={index} className="relative">
              <img
                src={img.url}
                alt={img.iName}
                className={`w-full aspect-square object-cover rounded-lg ${
                  img.isMain === 'TRUE' ? 'ring-2 ring-primary' : ''
                }`}
              />
              {img.isMain === 'TRUE' && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white 
                             text-xs rounded-full flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  대표
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500">매장명</label>
            <p className="mt-1">{store.sName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">대표자명</label>
            <p className="mt-1">{store.ceo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">전화번호</label>
            <p className="mt-1">{store.sPhone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">운영 상태</label>
            <p className="mt-1"> {store.sStatus === 'OPEN' ? '운영중' :
                store.sStatus === 'CLOSED' ? '폐점' :
                '등록요청'}</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h2 className="text-lg font-semibold mb-4">주소</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">주소</label>
            <p className="mt-1">{store.sAddress.street}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상세주소</label>
            <p className="mt-1">{store.sAddress.detail}</p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <h2 className="text-lg font-semibold mb-4">영업시간</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">시작 시간</label>
            <p className="mt-1">{formatTime(store.sStartEnd.start)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">종료 시간</label>
            <p className="mt-1">{formatTime(store.sStartEnd.end)}</p>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div>
        <h2 className="text-lg font-semibold mb-4">편의시설</h2>
        <div className="flex flex-wrap gap-9">
          <div>
            <label className="block text-base font-medium text-gray-500">매장이용 가능여부</label>
            <p className="mt-1 text-sm text-center pl-1">
              {store.sStoreUse === 'TRUE' ? '매장 이용 가능' : '포장만 가능'}
            </p>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-500">와이파이 여부</label>
            <p className="mt-1 text-sm text-center pl-1">
              {store.sWifi === 'TRUE' ? '와이파이 가능' : '와이파이 불가'}
            </p>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-500">주차 여부</label>
            <p className="mt-1 text-sm text-center pl-1">
              {store.sPark === 'TRUE' ? '주차 가능' : '주차 불가'}
            </p>
          </div>
          <div>
            <label className="block text-base font-medium text-gray-500">Drive-Thru 여부</label>
            <p className="mt-1 text-sm text-center pl-1">
              {store.sDriveThru === 'TRUE' ? 'DriveThru 가능' : 'DriveThru 불가'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div>
        <h2 className="text-lg font-semibold mb-4">추가 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">찾아오시는 길</label>
            <p className="mt-1">{store.directions}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleResetPassword}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          비밀번호 초기화
        </button>
        <button
          onClick={() => onClose()}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          닫기
        </button>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`${
                isMobile
                  ? 'fixed bottom-0 w-full max-h-[90vh]'
                  : 'relative w-full max-w-3xl max-h-[80vh] mx-4'
              } bg-white rounded-t-3xl sm:rounded-2xl p-6 overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">매장 정보</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {content}
            </motion.div>
          </motion.div>

          {/* Reset Password Modal */}
          <AnimatePresence>
          {isResetPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsResetPasswordModalOpen(false)}
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
              className={`${
                isMobile
                  ? 'fixed bottom-0 w-full'
                  : 'relative w-full max-w-md mx-4'
              } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
              onClick={e => e.stopPropagation()}
            >
              {isMobile && <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />}
              <h2 className="text-xl font-bold mb-4">비밀번호 초기화</h2>
              <div className="space-y-4">
                <p>점주 이메일 주소</p>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="이메일 주소를 입력해주세요"
                />
                {emailError && <p className="text-red-500">{emailError}</p>}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleSendResetEmail}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  발송
                </button>
                <button
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoreInfoModal;