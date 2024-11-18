import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Store } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useStoreStore } from '../../store/storeStore';
import { stores } from '../../data/storeData';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'store' | 'system';
  timestamp: Date;
}

interface ChatButtonProps {
  isOpen?: boolean;
  onClose?: () => void;
  storeId?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ isOpen: propIsOpen, onClose, storeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const { isAuthenticated } = useAuthStore();
  const { selectedStoreId } = useStoreStore();
  const navigate = useNavigate();

  const currentStoreId = storeId || selectedStoreId;
  const selectedStore = stores.find(store => store.id === currentStoreId);

  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  // 채팅방이 열릴 때 초기 메시지 설정
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: '1',
          text: selectedStore 
            ? `안녕하세요! ${selectedStore.name}입니다. 무엇을 도와드릴까요?`
            : '안녕하세요! 콩콩조아 고객센터입니다. 무엇을 도와드릴까요?',
          sender: selectedStore ? 'store' : 'system',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, selectedStore]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('로그인이 필요한 서비스입니다');
      handleClose();
      navigate('/login');
      return;
    }

    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: selectedStore
            ? '잠시만 기다려주세요. 매장에서 확인 후 답변드리겠습니다.'
            : '고객센터 상담원이 곧 답변드리겠습니다.',
          sender: selectedStore ? 'store' : 'system',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  return (
    <>
      {!propIsOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-xl z-40"
          >
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {selectedStore ? (
                    <Store className="w-5 h-5 text-primary mr-2" />
                  ) : (
                    <MessageCircle className="w-5 h-5 text-primary mr-2" />
                  )}
                  <h3 className="font-semibold">
                    {selectedStore ? selectedStore.name : '고객센터'}
                  </h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {selectedStore && (
                <div className="mt-2 text-sm text-gray-500">
                  {selectedStore.address}
                </div>
              )}
            </div>

            <div className="h-96 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white'
                          : msg.sender === 'store'
                          ? 'bg-gray-100'
                          : 'bg-yellow-50'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`${selectedStore ? '매장에' : '고객센터에'} 문의하실 내용을 입력하세요...`}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatButton;