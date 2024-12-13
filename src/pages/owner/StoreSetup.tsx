import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Crown, Plus } from 'lucide-react';

import toast from 'react-hot-toast';
import MobileSheet from '../../components/common/MobileSheet';
import {useOwnerAuthStore} from "../../store/ownerAuthStore.ts";
import {ownerAxios} from "../../api/axiosInterceptor.tsx";

const storeSchema = z.object({
    sName: z.string().min(1, '매장명을 입력하세요') ,
    ceo: z.string().min(1, '대표자명을 입력해주세요'),
    phone: z.string().regex(/^\d{2,3}-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
    postCode: z
      .string()
      .min(1, '우표번호를 입력해 주세요')
      .regex(/^\d{5}$/, '우편번호는 5자리 숫자여야 합니다.'),
    address: z.string().min(1, '우편번호를 입력해주세요'),
    addressDetail: z.string().min(1, '주소를 입력해주세요'),
    xAxis: z.string().optional(),
    yAxis: z.string().optional(),
    businessHours: z.object({
    start: z.string().min(1, '영업 시작 시간을 선택해주세요'),
    end: z.string().min(1, '영업 종료 시간을 선택해주세요')
  }),
    driveThru: z.boolean(),
    parking: z.boolean(),
    wifi: z.boolean(),
    storeUse: z.boolean(),
    directions: z.string().optional(),
});

type StoreForm = z.infer<typeof storeSchema>;

const StoreSetup = () => {
  const [images, setImages] = useState<Array<{ file: File; isMain: boolean }>>([]);  const [isDragging, setIsDragging] = useState(false);
  const isMobile = window.innerWidth < 768;
  const sName = useOwnerAuthStore(state => state.sName);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      sName: sName ?? '',
      driveThru: false,
      parking: false,
      wifi: false,
      storeUse: false,
      businessHours: {
        start: '09:00',
        end: '22:00'
      }
    }
  });

  const handleAddressClick = () => {
    window.kakao.maps.load(function() {
      new window.daum.Postcode({
        oncomplete: function(data) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(data.address, function(results, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const geocodeResult = results[0];
              console.log('Coordinates:', geocodeResult.x, geocodeResult.y);

              // 폼 필드 업데이트
              setValue('postCode', data.zonecode);
              setValue('address', data.address);
              setValue('xAxis', geocodeResult.x);
              setValue('yAxis', geocodeResult.y);
            } else {
              console.error('주소로부터 좌표를 불러오지 못했습니다.', status);
            }
          });
        }
      }).open();
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error('JPG, PNG, WEBP 형식만 지원합니다');
        return false;
      }

      if (file.size > maxSize) {
        toast.error('파일 크기는 5MB 이하여야 합니다');
        return false;
      }

      return true;
    });

    setImages(prev => {
      const newImages = validFiles.map(file => ({
        file: file,
        isMain: false // 기본적으로는 대표 이미지가 아님
      }));

      // 기존 이미지와 합치는 과정에서 대표 이미지가 없다면, 추가할 이미지 중 첫 번째 이미지를 대표로 설정
      if (!prev.some(image => image.isMain) && newImages.length > 0) {
        newImages[0].isMain = true;
      }

      return [...prev, ...newImages];
    });
  };

  const handleSetMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })));
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (prev[index].isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const formatDateToCustomString = (date: Date, timeString: string): string => {
    const [hour, minute] = timeString.split(':').map(Number);

    // Date 객체의 시간 설정
    const dateTime = new Date(date);
    dateTime.setHours(hour, minute, 0, 0);

    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    const seconds = String(dateTime.getSeconds()).padStart(2, '0');

    // 형식에 맞게 포맷
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  //등록 함수
  const onSubmit = async (data: StoreForm) => {
    try {
      if (images.length === 0) {
        toast.error('최소 1개의 매장 이미지를 등록해주세요');
        return;
      }

      console.log(data.businessHours.start);
      console.log(data.businessHours.end);
      const date = new Date();



      const storeDTO = {
        s_name: data.sName,
        ceo: data.ceo,
        s_phone: data.phone,
        s_address: {
          postCode: data.postCode,
          street: data.address,
          detail: data.addressDetail,
        },
        x_axis: data.xAxis,
        y_axis: data.yAxis,
        s_start_end: {
          start: formatDateToCustomString(date, data.businessHours.start),
          end: formatDateToCustomString(date, data.businessHours.end),
        },
      s_drive_thru: data.driveThru ? 'TRUE' : 'FALSE',
        s_park: data.parking ? 'TRUE' : 'FALSE',
        s_wifi: data.wifi ? 'TRUE' : 'FALSE',
        s_store_use: data.storeUse ? 'TRUE' : 'FALSE',
        directions: data.directions || null,
      };

      const formData = new FormData();

      formData.append('store', new Blob([JSON.stringify(storeDTO)], { type: 'application/json' }));


      images.forEach(({ file, isMain }, index) => {
        formData.append('images', file);
        if (isMain) {
          formData.append('mainImageIndex', index.toString());
        }
      });

      // Console 로그로 JSON 및 FormData를 점검
      console.log(JSON.stringify(storeDTO)); // JSON 객체 점검
      console.log([...formData.entries()]); // FormData 내용 점검
      const response = await ownerAxios.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log(response + "응답결과");

      /*await new Promise(resolve => setTimeout(resolve, 1000));
      useOwnerAuthStore.getState().setIsFirstLogin(false);

      toast.success('매장 정보가 등록되었습니다');
      navigate('/owner');*/
    } catch (error) {
      toast.error('매장 정보 등록에 실패했습니다');
    }
  };

  const addressContent = (
      <div className="h-full">
        <div id="address-search-container" className="h-full"></div>
      </div>
  );

  const content = (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            매장 이미지
          </label>
          <div
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
          >
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileInput}
                id="image-upload"
            />

            {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                            src={URL.createObjectURL(img.file)}
                            alt={`매장 이미지 ${index + 1}`}
                            className={`w-full aspect-square object-cover rounded-lg ${img.isMain ? 'ring-2 ring-primary' : ''}`}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                              type="button"
                              onClick={() => handleSetMainImage(index)}
                              className={`p-1.5 rounded-full group-hover:opacity-100 ${img.isMain ? 'bg-primary text-white opacity-100' : 'bg-white/90 text-gray-600 hover:bg-primary hover:text-white opacity-0'} transition-all duration-200`}
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                          <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {img.isMain && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white text-xs rounded-full flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              대표
                            </div>
                        )}
                      </div>
                  ))}
                  {images.length < 5 && (
                      <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Plus className="w-6 h-6 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">추가</span>
                      </label>
                  )}
                </div>
            ) : (
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center py-12 cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    이미지를 드래그하거나 클릭하여 업로드
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG, WEBP (최대 5MB)
                  </p>
                </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              매장명
            </label>
            <input
                {...register('sName')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary bg-gray-100 cursor-not-allowed"
                defaultValue={sName ?? ''}
                disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              대표자명
            </label>
            <input
                {...register('ceo')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.ceo && (
                <p className="mt-1 text-sm text-red-600">{errors.ceo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              전화번호
            </label>
            <input
                {...register('phone')}
                placeholder="02-1234-5678"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              우편 번호
            </label>
            <div className="mt-1 flex">
              <input
                  {...register('postCode')}
                  className="flex-1 rounded-l-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              />
              <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-r-lg shadow-sm border-l-0 border-gray-300 focus:ring-primary focus:border-primary"
                  onClick={handleAddressClick}
              >
                우편번호 찾기
              </button>
            </div>
            {errors.postCode && (
                <p className="mt-1 text-sm text-red-600">{errors.postCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              주소
            </label>
            <input
                {...register('address')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              상세주소
            </label>
            <input
                id="detailAddress"
                {...register('addressDetail')}
                placeholder="예: 콩콩조아 강남점"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.addressDetail && (
                <p className="mt-1 text-sm text-red-600">{errors.addressDetail.message}</p>
            )}
          </div>
          <div>
            <input
                {...register('xAxis')}
                className="hidden"
            />
          </div>
          <div>
            <input
                {...register('yAxis')}
                className={"hidden"}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            영업시간
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">시작 시간</label>
              <input
                  type="time"
                  {...register('businessHours.start')}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              />
              {errors.businessHours?.start && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessHours.start.message}
                  </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600">종료 시간</label>
              <input
                  type="time"
                  {...register('businessHours.end')}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              />
              {errors.businessHours?.end && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessHours.end.message}
                  </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            편의시설
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('driveThru')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2">드라이브 스루</span>
            </label>
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('parking')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2">주차 가능</span>
            </label>
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('wifi')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2">와이파이</span>
            </label>
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('storeUse')}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2">매장이용 가능</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              찾아오시는 길
            </label>
            <textarea
                {...register('directions')}
                rows={3}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                placeholder="예: 2번 출구에서 도보 5분"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg">
            등록
          </button>
        </div>
      </form>
  );

  return (
      <>
        {isMobile ? (
            <MobileSheet
                isOpen={true}
                onClose={() => {}}
                title="매장 정보 등록"
                showCloseButton={false}
            >
              {content}
            </MobileSheet>
        ) : (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h1 className="text-2xl font-bold mb-8">매장 정보 등록</h1>
                {content}
              </div>
            </div>
        )}

        {isMobile && (
            <MobileSheet
                isOpen={isAddressSheetOpen}
                onClose={() => setIsAddressSheetOpen(false)}
                title="주소 검색"
            >
              {addressContent}
            </MobileSheet>
        )}
      </>
  );
};

export default StoreSetup;