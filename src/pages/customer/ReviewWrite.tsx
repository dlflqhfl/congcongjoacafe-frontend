import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewWrite = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<Array<{ url: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);

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
    if (images.length + files.length > 5) {
      toast.error('최대 5장까지 업로드할 수 있습니다');
      return;
    }

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
          setImages(prev => [...prev, { url: e.target!.result as string }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('리뷰 내용을 입력해주세요');
      return;
    }

    try {
      // API call would go here
      toast.success('리뷰가 등록되었습니다');
      navigate(`/mypage/orders/${orderId}`);
    } catch (error) {
      toast.error('리뷰 등록에 실패했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={`/mypage/orders/${orderId}`}
          className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          주문 상세로 돌아가기
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h1 className="text-2xl font-bold mb-8">리뷰 작성</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                별점
              </label>
              <div className="flex space-x-1">
                {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 relative group"
                  >
                    <div className="relative">
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoveredRating ?? rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                      {star % 1 !== 0 && (
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ width: '50%' }}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoveredRating ?? rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 
                                   text-xs bg-gray-900 text-white px-2 py-1 rounded opacity-0 
                                   group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {star}점
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                리뷰 내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-lg border-gray-300 shadow-sm 
                         focus:ring-primary focus:border-primary"
                placeholder="메뉴의 맛, 포장 상태, 매장 서비스 등 솔직한 리뷰를 남겨주세요."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사진 첨부
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
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img.url}
                          alt={`리뷰 이미지 ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white 
                                   rounded-full opacity-0 group-hover:opacity-100 
                                   transition-opacity duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center aspect-square 
                                 border-2 border-dashed border-gray-300 rounded-lg 
                                 cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-6 h-6 text-gray-400" />
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

            <div className="flex justify-end space-x-3">
              <Link
                to={`/mypage/orders/${orderId}`}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                취소
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                리뷰 등록
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewWrite;