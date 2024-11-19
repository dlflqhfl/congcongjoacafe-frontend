import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Users, Coffee, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    // 멤버십 설정
    membershipEnabled: true,
    pointRate: 1, // 구매금액 1%
    minimumPointUse: 1000,
    
    // 매장 승인 설정
    autoApproveStores: false,
    requireBusinessLicense: true,
    
    // 메뉴 관리 설정
    allowCustomMenus: false,
    requireMenuApproval: true,
    
    // 알림 설정
    systemNotifications: true,
    emailNotifications: true
  });

  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('설정이 저장되었습니다.');
  };

  const settingsSections = [
    {
      title: '멤버십 정책 설정',
      icon: Users,
      settings: [
        {
          id: 'membershipEnabled',
          label: '멤버십 시스템 활성화',
          type: 'toggle',
          value: settings.membershipEnabled
        },
        {
          id: 'pointRate',
          label: '포인트 적립률 (%)',
          type: 'number',
          value: settings.pointRate
        },
        {
          id: 'minimumPointUse',
          label: '최소 포인트 사용 금액',
          type: 'number',
          value: settings.minimumPointUse
        }
      ]
    },
    {
      title: '매장 승인 정책',
      icon: Store,
      settings: [
        {
          id: 'autoApproveStores',
          label: '자동 매장 승인',
          type: 'toggle',
          value: settings.autoApproveStores
        },
        {
          id: 'requireBusinessLicense',
          label: '사업자등록증 필수',
          type: 'toggle',
          value: settings.requireBusinessLicense
        }
      ]
    },
    {
      title: '메뉴 관리 정책',
      icon: Coffee,
      settings: [
        {
          id: 'allowCustomMenus',
          label: '매장별 커스텀 메뉴 허용',
          type: 'toggle',
          value: settings.allowCustomMenus
        },
        {
          id: 'requireMenuApproval',
          label: '신규 메뉴 승인 필요',
          type: 'toggle',
          value: settings.requireMenuApproval
        }
      ]
    },
    {
      title: '시스템 알림 설정',
      icon: Bell,
      settings: [
        {
          id: 'systemNotifications',
          label: '시스템 알림',
          type: 'toggle',
          value: settings.systemNotifications
        },
        {
          id: 'emailNotifications',
          label: '이메일 알림',
          type: 'toggle',
          value: settings.emailNotifications
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">관리자 설정</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center mb-6">
              <div className="p-2 bg-primary/10 rounded-lg mr-3">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-gray-600">{setting.label}</span>
                  {setting.type === 'toggle' ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  ) : (
                    <input
                      type="number"
                      value={setting.value as number}
                      onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
                      className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Settings;