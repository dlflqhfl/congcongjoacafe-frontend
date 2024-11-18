import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerInquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Dummy data - replace with API call
  const chats = [
    {
      id: '1',
      user: '김민수',
      lastMessage: '메뉴 관련 문의드립니다.',
      time: '5분 전',
      unread: true
    },
    {
      id: '2',
      user: '이영희',
      lastMessage: '영업시간이 어떻게 되나요?',
      time: '30분 전',
      unread: false
    }
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    toast.success('메시지가 전송되었습니다');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">문의 관리</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Chat List */}
          <div className="border-r">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="divide-y">
              {chats.map((chat) => (
                <motion.button
                  key={chat.id}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 text-left ${
                    selectedChat === chat.id ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{chat.user}</p>
                        <p className="text-sm text-gray-500">{chat.lastMessage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{chat.time}</p>
                      {chat.unread && (
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-span-2 h-[calc(100vh-16rem)]">
            {selectedChat ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        {chats.find(c => c.id === selectedChat)?.user}
                      </p>
                      <p className="text-sm text-gray-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        최근 접속: 방금 전
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {/* Messages will go here */}
                </div>

                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={() => handleSendMessage('test')}
                      className="px-4 py-2 bg-primary text-white rounded-lg"
                    >
                      전송
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <p>채팅을 선택해주세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerInquiries;