'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ProfileModalProps {
    isOpen: boolean
    onClose: () => void
    user?: {
        name: string
        email: string
        phone: string
        image?: string
    }
}

export default function Component({ isOpen, onClose, user = {
    name: '테스트 사용자',
    email: 'dlffqhfl11@naver.com',
    phone: '010-1234-5678'
} }: ProfileModalProps) {
    const [isMobile, setIsMobile] = useState(false)
    const [formData, setFormData] = useState({
        name: user.name,
        phone: user.phone
    })
    const [previewImage, setPreviewImage] = useState<string | null>(user.image || null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        onClose()
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const modalVariants = {
        desktop: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 }
        },
        mobile: {
            initial: { opacity: 0, y: '100%' },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: '100%' }
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/25 z-50 flex items-end sm:items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={isMobile ? modalVariants.mobile.initial : modalVariants.desktop.initial}
                    animate={isMobile ? modalVariants.mobile.animate : modalVariants.desktop.animate}
                    exit={isMobile ? modalVariants.mobile.exit : modalVariants.desktop.exit}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full sm:w-[28rem] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-[#F4F4F4]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">프로필 정보</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#FAF7F2] rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="flex justify-center">
                            <div className="relative">
                                <input
                                    type="file"
                                    id="profileImage"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                <label htmlFor="profileImage" className="cursor-pointer">
                                    <div className="w-24 h-24 rounded-full bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-3xl text-gray-400">
                        {user.name.charAt(0)}
                      </span>
                                        )}
                                    </div>
                                </label>
                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 p-2 bg-[#2B5B3F] text-white rounded-full shadow-lg hover:bg-[#234B33] transition-colors"
                                    onClick={() => document.getElementById('profileImage')?.click()}
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    이름
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5B3F]/20 focus:border-[#2B5B3F]"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-[#FAF7F2] text-gray-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    전화번호
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B5B3F]/20 focus:border-[#2B5B3F]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 hover:bg-[#FAF7F2] rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#2B5B3F] text-white rounded-lg hover:bg-[#234B33] transition-colors"
                            >
                                저장
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}