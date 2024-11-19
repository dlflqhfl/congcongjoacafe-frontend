import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { MenuItem, MenuOption } from '../../types';
import toast from 'react-hot-toast';

interface OptionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuItem | null;
}

interface OptionForm {
  id?: string;
  name: string;
  price: number;
  type: 'size' | 'temperature' | 'extra';
  volume?: string;
  image?: string;
  ratio?: number;
}

const OptionManagementModal: React.FC<OptionManagementModalProps> = ({
  isOpen,
  onClose,
  menu
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionForm | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  // ... (나머지 핸들러 함수들은 동일)

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
                ? 'fixed inset-x-0 bottom-0 max-h-[90vh]'
                : 'relative w-full max-w-2xl mx-4'
            } bg-white rounded-t-3xl sm:rounded-2xl p-6 overflow-y-auto`}
            onClick={e => e.stopPropagation()}
          >
            {/* ... (나머지 모달 내용은 동일) */}
          </motion.div>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
                onClick={() => setIsFormOpen(false)}
              >
                <motion.div
                  initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
                  animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
                  exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className={`${
                    isMobile
                      ? 'fixed inset-x-0 bottom-0 max-h-[90vh]'
                      : 'relative w-full max-w-md mx-4'
                  } bg-white rounded-t-3xl sm:rounded-2xl p-6`}
                  onClick={e => e.stopPropagation()}
                >
                  {/* ... (나머지 폼 내용은 동일) */}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptionManagementModal;