import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OwnerAuthStore {
    accessToken: string | null;
    tokenExpiryTime: number | null; // 만료 시간 기록
    isFirstLogin: boolean;
    sName: string | null;
    isLoggedIn: boolean; // 로그인 상태 추가
    setAccessToken: (token: string, expiryTime: number) => void; // 만료 시간을 받도록 수정
    setIsFirstLogin: (isFirst: boolean) => void;
    setSName: (sName: string) => void;
    clearAuth: () => void;
    isTokenExpired: () => boolean; // 만료 확인
}

export const useOwnerAuthStore = create<OwnerAuthStore>()(
    persist(
        (set, get) => ({
            accessToken: null,
            tokenExpiryTime: null,
            isFirstLogin: false,
            sName: null,
            isLoggedIn: false, // 초기 로그인 상태
            setAccessToken: (token, expiryTime) => set({
                accessToken: token,
                tokenExpiryTime: expiryTime,
                isLoggedIn: true // 토큰이 설정될 때 로그인 상태로 전환
            }),
            setIsFirstLogin: (isFirst) => set({ isFirstLogin: isFirst }),
            setSName: (sName) => set({ sName }),
            clearAuth: () => set({
                accessToken: null,
                tokenExpiryTime: null,
                isFirstLogin: false,
                sName: null,
                isLoggedIn: false // 로그아웃 시 로그인 상태 설정
            }),
            isTokenExpired: () => {
                const expiryTime = get().tokenExpiryTime;
                return expiryTime ? Date.now() > expiryTime : true;
            },
        }),
        {
            name: 'ownerAuth',
        }
    )
);