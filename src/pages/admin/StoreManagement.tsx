import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Store, MapPin, Phone, Copy, Mail, Search } from 'lucide-react';
import StoreInfoModal from '../../components/admin/StoreInfoModal';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

interface StoreCredentials {
  storeCode: string;
  initialPassword: string;
}

interface StoreRegistrationForm {
  name: string;
  email: string;
  storeCode?: string; 
  initialPassword?: string;
  
}

const StoreManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [storeCredentials, setStoreCredentials] = useState<StoreCredentials | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [formData, setFormData] = useState<StoreRegistrationForm>({ name: '', email: '' });
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = window.innerWidth < 768;

  // 실제로는 API를 통해 매장 목록을 가져옴
  const stores = [
    {
      id: 'store1',
      name: '강남점',
      address: '서울시 강남구 테헤란로 123',
      addressDetail: '2층',
      region: '서울시 강남구',
      phone: '02-1234-5678',
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
    }
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({ ...prev, name }));
  };

  const handleCheckNameDuplicate = async () => {
    const isDuplicate = await checkStoreNameDuplicate(formData.name);
    if (isDuplicate) {
      setNameError('사용가능한 매장명입니다.');
    } else {
      setNameError('이미 사용중인 매장명입니다.');
    }
  };

  const checkStoreNameDuplicate = async (storeName: string) => {
    try {
      const response = await api.get('/checkStoreName', {
        params: { storeName }
      });
      if (response.status === 200 && response.data.resultCode === "OK") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error in checkStoreNameDuplicate:", error);
      return false;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));

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

  // axios 인스턴스 생성 및 baseURL 설정
  const api = axios.create({
    baseURL: '/admin',
    headers: {
        'Content-Type': 'application/json',
    },
  });

  const generateStoreCode = async () => {
    let storeCode;
    let isDuplicate = true;
    // 매장 코드는 'CONG-' 접두사와 6자리 숫자로 구성
    while(isDuplicate){
      storeCode = `CONG-${Math.floor(100000 + Math.random() * 900000)}`;
      // 중복된 매장 코드가 있는지 확인
      try {
        // 중복된 매장 코드가 있는지 확인
        const response = await api.get(`/checkStoreCode`, {
            params: { storeCode }
        });
        console.log("백엔드 다녀옴", response);
        if (response.status === 200 && response.data.resultCode === "OK") {
            isDuplicate = false;
        }
      } catch (error) {
          console.error("Error in generateStoreCode:", error);
          throw error; // 에러 발생 시 루프를 중단하고 에러를 던집니다.
      }
    }

    return storeCode;
  };

  const generateInitialPassword = () => {
    // 초기 비밀번호는 8자리 랜덤 문자열
    return Math.random().toString(36).slice(-8).toUpperCase();
  };

  const handleFormSubmit = async () => {

    // Generate store code and initial password
    const storeCode = await generateStoreCode();
    const initialPassword = generateInitialPassword();

    // Update formData with generated credentials
    setFormData({ ...formData, storeCode, initialPassword });

    setIsConfirmModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    const { storeCode, initialPassword, name, email } = formData;

    try {
        const response = await api.post('/regStore', {
            storeCode,
            name,
            email,
            initialPassword,
        });

        if (response.status === 200 && response.data.resultCode === "OK") {
            toast.success('매장이 등록되었습니다. 점주에게 이메일이 발송됩니다.');

        } else {
            toast.error('매장 등록에 실패했습니다.');
        }
    } catch (error) {
        console.error(error);
        toast.error('매장 등록 중 오류가 발생했습니다.');
    } finally {
        setIsConfirmModalOpen(false);
        setIsFormOpen(false);
    }
};

  const handleCopyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('클립보드에 복사되었습니다');
  };

  const handleViewStoreInfo = (store: any) => {
    setSelectedStore(store);
    setIsInfoModalOpen(true);
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">매장 관리</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          신규 매장 등록
        </motion.button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="매장명 또는 주소로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Store List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Store className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg font-semibold">{store.name}</h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                운영중
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{store.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">{store.phone}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => handleViewStoreInfo(store)}
                className="px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                정보 보기
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Registration Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsFormOpen(false)}
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
              
              <h2 className="text-xl font-bold mb-6">신규 매장 등록</h2>
              
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    매장명
                  </label>
                  <div className="flex items-center space-x-2 w-full">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                              focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleCheckNameDuplicate}
                    className="w-20 px-2 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                  >
                    중복체크
                  </button>
                  </div>
                  {nameError && <p className="text-red-500">{nameError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    점주 이메일
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm 
                             focus:ring-primary focus:border-primary"
                  />
                  {emailError && <p className="text-red-500">{emailError}</p>}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                    disabled={nameError !== '사용가능한 매장명입니다.'}
                  >
                    등록
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
            onClick={() => setIsConfirmModalOpen(false)}
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
              
              <h2 className="text-xl font-bold mb-4">매장 등록 확인</h2>
              
              <div className="space-y-4">
                <p>다음 정보로 매장을 등록하시겠습니까?</p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">매장 코드:</span> {formData.storeCode}</p>
                  <p><span className="font-medium">매장명:</span> {formData.name}</p>
                  <p><span className="font-medium">이메일:</span> {formData.email}</p>
                </div>

                <p className="text-sm text-gray-500">
                  * 매장 코드와 초기 비밀번호가 생성되어 입력하신 이메일로 전송됩니다.
                </p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmRegistration}
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credentials Modal */}
      <AnimatePresence>
        {storeCredentials && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center"
            onClick={() => setStoreCredentials(null)}
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
              
              <h2 className="text-xl font-bold mb-6">매장 등록 완료</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">매장 코드</p>
                    <p className="font-medium">{storeCredentials.storeCode}</p>
                  </div>
                  <button
                    onClick={() => handleCopyCredentials(storeCredentials.storeCode)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Copy className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">초기 비밀번호</p>
                    <p className="font-medium">{storeCredentials.initialPassword}</p>
                  </div>
                  <button
                    onClick={() => handleCopyCredentials(storeCredentials.initialPassword)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Copy className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="flex items-center text-primary">
                  <Mail className="w-5 h-5 mr-2" />
                  <p className="text-sm">입력하신 이메일로 접속 정보가 발송되었습니다.</p>
                </div>
              </div>

              <button
                onClick={() => setStoreCredentials(null)}
                className="w-full mt-6 px-4 py-2 bg-primary text-white rounded-lg"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Store Info Modal */}
      {selectedStore && (
        <StoreInfoModal
          isOpen={isInfoModalOpen}
          onClose={() => setIsInfoModalOpen(false)}
          store={selectedStore}
        />
      )}
    </div>
  );
};

export default StoreManagement;