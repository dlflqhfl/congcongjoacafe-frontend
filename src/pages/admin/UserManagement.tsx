import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Member {
  id: number;
  gidx: number;
  gname: string;
  mname: string;
  memail: string;
  mphone: string;
  mbirth: string;
  mdate: string;
  mstatus: string;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [members, setMembers] = useState<Member[]>([]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/admin/memberList'); // API 엔드포인트를 적절히 변경하세요
      const data: Member[] = response.data.data;
      setMembers(data);
    } catch (error) {
      console.error('회원 데이터를 가져오는 중 오류가 발생했습니다:', error);
      toast.error('회원 데이터를 가져오는 중 오류가 발생했습니다');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearchTerm = (member.mname && member.mname.includes(searchTerm)) || 
                              (member.memail && member.memail.includes(searchTerm)) || 
                              (member.mphone && member.mphone.includes(searchTerm));
    const matchesGrade = selectedGrade === 'ALL' || member.gname === selectedGrade;
    return matchesSearchTerm && matchesGrade;
  });

  const grades = ['ALL', '씨앗', '새싹', '콩'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
      </div>

      <div className="mb-6">
        <div className="relative flex items-center space-x-4">
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="이름, 이메일, 전화번호로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회원이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                생년월일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회원등급
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.mname}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {member.memail}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {member.mphone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {new Date(member.mbirth).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\.$/, '')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {member.gname}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(member.mdate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\.$/, '')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    member.mstatus === 'TRUE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.mstatus === 'TRUE' ? '가입' : '탈퇴'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;