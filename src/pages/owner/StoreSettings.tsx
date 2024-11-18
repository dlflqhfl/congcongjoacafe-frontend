import { motion } from 'framer-motion';
import { Edit2, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileSheet from '../../components/common/MobileSheet';

const StoreSettings = () => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  // 실제로는 API를 통해 기존 매장 정보를 가져옴
  const storeInfo = {
    name: '강남점',
    phone: '02-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    addressDetail: '2층',
    region: '서울시 강남구',
    businessHours: {
      start: '09:00',
      end: '22:00'
    },
    takeout: true,
    parking: true,
    wifi: true,
    delivery: false,
    directions: '2번 출구에서 도보 5분',
    notes: '노트북 사용 가능',
    ceo: '홍길동',
    status: 1,
    images: [
      { url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24', isMain: true },
      { url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8', isMain: false }
    ]
  };

  const handleEdit = () => {
    navigate('/owner/store/edit');
  };

  const content = (
    <div className="space-y-8">
      {/* Images */}
      <div>
        <h2 className="text-lg font-semibold mb-4">매장 이미지</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {storeInfo.images.map((img, index) => (
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
            <p className="mt-1">{storeInfo.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">대표자명</label>
            <p className="mt-1">{storeInfo.ceo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">전화번호</label>
            <p className="mt-1">{storeInfo.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">운영 상태</label>
            <p className="mt-1">{storeInfo.status === 1 ? '영업중' : '휴업중'}</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h2 className="text-lg font-semibold mb-4">주소</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">주소</label>
            <p className="mt-1">{storeInfo.address}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">상세주소</label>
            <p className="mt-1">{storeInfo.addressDetail}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">행정구역</label>
            <p className="mt-1">{storeInfo.region}</p>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <h2 className="text-lg font-semibold mb-4">영업시간</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">시작 시간</label>
            <p className="mt-1">{storeInfo.businessHours.start}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">종료 시간</label>
            <p className="mt-1">{storeInfo.businessHours.end}</p>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div>
        <h2 className="text-lg font-semibold mb-4">편의시설</h2>
        <div className="flex flex-wrap gap-2">
          {storeInfo.takeout && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              포장 가능
            </span>
          )}
          {storeInfo.parking && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              주차 가능
            </span>
          )}
          {storeInfo.wifi && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              와이파이
            </span>
          )}
          {storeInfo.delivery && (
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
            <p className="mt-1">{storeInfo.directions}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">매장 특이사항</label>
            <p className="mt-1">{storeInfo.notes}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleEdit}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
        >
          <Edit2 className="w-5 h-5 mr-2" />
          수정
        </button>
      </div>
    </div>
  );

  return isMobile ? (
    <MobileSheet
      isOpen={true}
      onClose={() => window.history.back()}
      title="매장 정보"
      showCloseButton={true}
    >
      {content}
    </MobileSheet>
  ) : (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-8">매장 정보</h1>
        {content}
      </div>
    </div>
  );
};

export default StoreSettings;