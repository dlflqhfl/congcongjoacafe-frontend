"use client"

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown } from 'lucide-react';
import { MenuItem } from '@/types';
import {dummyMenu} from "@/data/dummy-data.ts";

interface MenuDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem | null;
}

const MenuDetails: React.FC<MenuDetailsProps> = ({ isOpen, onClose, menu }) => {
  const isMobile = window.innerWidth < 768;

  const displayMenu = menu || dummyMenu;

  return (
      <AnimatePresence>
        {isOpen && (
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
                  <h2 className="text-xl font-bold">메뉴 상세 정보</h2>
                  <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Image Gallery */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">메뉴 이미지</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {displayMenu.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                              src={img.url}
                              alt={`메뉴 이미지 ${index + 1}`}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">메뉴명 (한글)</h3>
                    <p className="mt-1">{displayMenu.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">기본 가격</h3>
                    <p className="mt-1">{displayMenu.price}원</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">카테고리</h3>
                    <p className="mt-1">{displayMenu.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">사이즈</h3>
                    <p className="mt-1">{displayMenu.size}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700">설명</h3>
                  <p className="mt-1">{displayMenu.description}</p>
                </div>

                {/* Nutrition Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">영양 성분</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">1회 제공량 (ml)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.one || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">칼로리 (kcal)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.calories || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">탄수화물 (g)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.carbo || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">단백질 (g)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.protein || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">지방 (g)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.fat || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">나트륨 (mg)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.sodium || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">카페인 (mg)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.caffeine || 0}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">당류 (g)</h4>
                      <p className="mt-1">{displayMenu.nutrition?.sugar || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Allergy Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">알레르기 정보</h3>
                  <div className="flex flex-wrap gap-2">
                    {displayMenu.allergyInfo?.milk && <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">우유</span>}
                    {displayMenu.allergyInfo?.soy && <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">대두</span>}
                    {displayMenu.allergyInfo?.egg && <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">계란</span>}
                    {displayMenu.allergyInfo?.wheat && <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">밀</span>}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-lg font-medium mb-2">상태</h3>
                  <p className={`px-2 py-1 rounded-full inline-block text-sm ${
                      displayMenu.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {displayMenu.status ? '판매 중' : '미판매'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
  );
};

export default MenuDetails;

