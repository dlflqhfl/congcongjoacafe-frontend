import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, Crown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOwnerStore } from '../../store/ownerStore';
import toast from 'react-hot-toast';
import MobileSheet from '../../components/common/MobileSheet';
import axios from "axios";

const ownerApi =  axios.create({
  baseURL: 'http://localhost:9090/api/owner',
  withCredentials: true,
});

const storeSchema = z.object({
  name: z.string().min(1, '매장명을 입력해주세요'),
  phone: z.string().regex(/^\d{2,3}\d{3,4}\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().min(1, '상세주소를 입력해주세요'),
  region: z.string().min(1, '행정구역을 입력해주세요'),
  businessHours: z.object({
    start: z.string().min(1, '영업 시작 시간을 선택해주세요'),
    end: z.string().min(1, '영업 종료 시간을 선택해주세요')
  }),
  takeout: z.boolean(),
  parking: z.boolean(),
  wifi: z.boolean(),
  delivery: z.boolean(),
  directions: z.string().optional(),
  notes: z.string().optional(),
  ceo: z.string().min(1, '대표자명을 입력해주세요'),
  status: z.number().min(0).max(1)
});

type StoreForm = z.infer<typeof storeSchema>;

const StoreSetup = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<Array<{ url: string; isMain: boolean }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { setFirstLogin } = useOwnerStore();
  const isMobile = window.innerWidth < 768;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      status: 1,
      takeout: false,
      parking: false,
      wifi: false,
      delivery: false,
      businessHours: {
        start: '09:00',
        end: '22:00'
      }
    }
  });

  /*useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ownerApi.get('/getStoreName');
        setValue('name', response.data.name);
      } catch (error) {
        toast.error('매장명 정보를 가져오는데 실패했습니다.');
      }
    };
    fetchData();
  }, [setValue]);*/

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
      const maxSize = 5 * 1024 * 1024; // 5MB

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

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, {
            url: e.target!.result as string,
            isMain: prev.length === 0
          }]);
        }
      };
      reader.readAsDataURL(file);
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
      // If we removed the main image, set the first remaining image as main
      if (prev[index].isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const onSubmit = async (data: StoreForm) => {
    try {
      if (images.length === 0) {
        toast.error('최소 1개의 매장 이미지를 등록해주세요');
        return;
      }

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 매장 정보 등록 성공 후 firstLogin 상태를 false로 변경
      setFirstLogin(false);

      toast.success('매장 정보가 등록되었습니다');
      navigate('/owner');
    } catch (error) {
      toast.error('매장 정보 등록에 실패했습니다');
    }
  };

  const content = (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            매장 이미지
          </label>
          <div
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
              }`}
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
                            src={img.url}
                            alt={`매장 이미지 ${index + 1}`}
                            className={`w-full aspect-square object-cover rounded-lg ${
                                img.isMain ? 'ring-2 ring-primary' : ''
                            }`}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <button
                              type="button"
                              onClick={() => handleSetMainImage(index)}
                              className={`p-1.5 rounded-full group-hover:opacity-100 ${
                                  img.isMain
                                      ? 'bg-primary text-white opacity-100'
                                      : 'bg-white/90 text-gray-600 hover:bg-primary hover:text-white opacity-0'
                              } transition-all duration-200`}
                          >
                            <Crown className="w-4 h-4" />
                          </button>
                          <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-1.5 bg-red-500 text-white rounded-full opacity-0
                               group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {img.isMain && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 text-white
                                 text-xs rounded-full flex items-center">
                              <Crown className="w-3 h-3 mr-1" />
                              대표
                            </div>
                        )}
                      </div>
                  ))}
                  {images.length < 5 && (
                      <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center aspect-square
                           border-2 border-dashed border-gray-300 rounded-lg 
                           cursor-pointer hover:bg-gray-50"
                      >
                        <Plus className="w-6 h-6 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">추가</span>
                      </label>
                  )}
                </div>
            ) : (
                <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center py-12 cursor-pointer"
                >
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

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              매장명
            </label>
            <input
                {...register('name')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            />
            {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              대표자명
            </label>
            <input
                {...register('ceo')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                     focus:ring-primary focus:border-primary"
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                     focus:ring-primary focus:border-primary"
            />
            {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              운영 상태
            </label>
            <select
                {...register('status', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                     focus:ring-primary focus:border-primary"
            >
              <option value={1}>영업중</option>
              <option value={0}>휴업중</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              주소
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                  {...register('address')}
                  className="flex-1 rounded-lg border-gray-300 shadow-sm
                       focus:ring-primary focus:border-primary"
              />
              <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                주소 찾기
              </button>
            </div>
            {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              상세주소
            </label>
            <input
                {...register('addressDetail')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                     focus:ring-primary focus:border-primary"
            />
            {errors.addressDetail && (
                <p className="mt-1 text-sm text-red-600">{errors.addressDetail.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              행정구역
            </label>
            <input
                {...register('region')}
                placeholder="예: 서울시 강남구"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                     focus:ring-primary focus:border-primary"
            />
            {errors.region && (
                <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
            )}
          </div>
        </div>

        {/* Business Hours */}
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                       focus:ring-primary focus:border-primary"
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
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                       focus:ring-primary focus:border-primary"
              />
              {errors.businessHours?.end && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.businessHours.end.message}
                  </p>
              )}
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            편의시설
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('takeout')}
                  className="rounded border-gray-300 text-primary
                       focus:ring-primary"
              />
              <span className="ml-2">포장 가능</span>
            </label>
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('parking')}
                  className="rounded border-gray-300 text-primary
                       focus:ring-primary"
              />
              <span className="ml-2">주차 가능</span>
            </label>
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('wifi')}
                  className="rounded border-gray-300 text-primary
                       focus:ring-primary"
              />
              <span className="ml-2">와이파이</span>
            </label>
            <label className="flex items-center">
              <input
                  type="checkbox"
                  {...register('delivery')}
                  className="rounded border-gray-300 text-primary
                       focus:ring-primary"
              />
              <span className="ml-2">배달 가능</span>
            </label>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              찾아오시는 길
            </label>
            <textarea
                {...register('directions')}
                rows={3}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                     focus:ring-primary focus:border-primary"
                placeholder="예: 2번 출구에서 도보 5분"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              매장 특이사항
            </label>
            <textarea
                {...register('notes')}
                rows={3}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                     focus:ring-primary focus:border-primary"
                placeholder="예: 노트북 사용 가능"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            등록
          </button>
        </div>
      </form>
  );

  return isMobile ? (
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
  );
};

export default StoreSetup;