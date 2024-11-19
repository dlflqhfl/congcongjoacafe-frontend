import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';
import { X } from 'lucide-react';

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const MobileSheet: React.FC<MobileSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  showCloseButton = true
}) => {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // 드래그 거리가 200px 이상이면 닫기
    if (info.offset.y > 200) {
      onClose();
    } else {
      // 원래 위치로 돌아가기
      controls.start({ y: 0 });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={controls}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 h-[98vh] bg-white rounded-t-3xl z-50 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div 
              className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
            />
            
            <div className="flex justify-between items-center px-6 py-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-7 h-7" />
                </button>
              )}
            </div>

            <motion.div 
              className="px-6 pb-6 h-[calc(98vh-5rem)] overflow-y-auto"
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSheet;