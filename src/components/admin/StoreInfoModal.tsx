import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Clock, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: any;
}

const StoreInfoModal: React.FC<StoreInfoModalProps> = ({ isOpen, onClose, store }) => {
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const handleResetPassword = () => {
    const newPassword = Math.random().toString(36).slice(-8).toUpperCase();
    // API call would go here to reset password and send email
    toast.success('비밀번호가 초기화되었습니다. 이메일로 전송됩니다.');
  };

  const content = (
    <div className="space-y-8">
      {/* Images */}
      <div>
        <h2 className="text-lg font-semibold mb-4">매장 이미지</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {store.images.map((img: any, index: number) => (
            <div key={index} className="relative">
              <img
                src={img.url}
                alt={`매장 이미지 ${index + 1}`}
                className={`w-full aspect-square object-cover rounded-lg ${
                  img.isMain ? 'ring-2 ring-primary' : ''
                }`}
              />
              {img.isMain && (
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
            <p className="mt-1">{store.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">대표자명</label>
            <p className="mt-1">{store.ceo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">전화번호</label>
            <p className="mt-1">{store.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">운영 상태</label>
            <p className="mt-1">{store.status === 1 ? '영업중' : '휴업중'}</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h2 className="text-lg font-semibold mb-4">주소</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">주소</label>
            <p className="mt-1">{store.address}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상세주소</label>
            <p className="mt-1">{store.addressDetail}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">행정구역</label>
            <p className="mt-1">{store.region}</p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <h2 className="text-lg font-semibold mb-4">영업시간</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">시작 시간</label>
            <p className="mt-1">{store.businessHours.start}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">종료 시간</label>
            <p className="mt-1">{store.businessHours.end}</p>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div>
        <h2 className="text-lg font-semibold mb-4">편의시설</h2>
        <div className="flex flex-wrap gap-2">
          {store.takeout && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              포장 가능
            </span>
          )}
          {store.parking && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              주차 가능
            </span>
          )}
          {store.wifi && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              와이파이
            </span>
          )}
          {store.delivery && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              배달 가능
            </span>
          )}
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
          <div>
            <label className="block text-sm font-medium text-gray-500">매장 특이사항</label>
            <p className="mt-1">{store.notes}</p>
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
          onClick={() => setIsEditNameOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          매장명 변경
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

          {/* Name Edit Modal */}
          <AnimatePresence>
            {isEditNameOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
                onClick={() => setIsEditNameOpen(false)}
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
                  
                  <h3 className="text-lg font-bold mb-6">매장명 변경</h3>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const newName = formData.get('name') as string;
                    
                    if (!newName.trim()) {
                      toast.error('매장명을 입력해주세요');
                      return;
                    }

                    // API call would go here
                    toast.success('매장명이 변경되었습니다');
                    setIsEditNameOpen(false);
                  }} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        새 매장명
                      </label>
                      <input
                        name="name"
                        type="text"
                        defaultValue={store.name}
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                                 focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditNameOpen(false)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg"
                      >
                        변경
                      </button>
                    </div>
                  </form>
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