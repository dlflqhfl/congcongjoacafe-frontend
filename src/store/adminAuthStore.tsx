import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminAuthStore {
    accessToken: string | null;
    tokenExpiryTime: number | null; // 만료 시간 기록
    isLoggedIn: boolean;
    setAccessToken: (token: string, expiryTime: number) => void; // 만료 시간을 받도록 수정
    clearAuth: () => void;
    isTokenExpired: () => boolean; // 만료 확인
}

export const useAdminAuthStore = create<AdminAuthStore>()(
    persist(
        (set, get) => ({
            accessToken: null,
            tokenExpiryTime: null,
            isLoggedIn: false,
            username: null, // 초기값 추가
            setAccessToken: (token, expiryTime) => set({
                accessToken: token,
                tokenExpiryTime: expiryTime,
                isLoggedIn: true
            }),
            clearAuth: () => set({
                accessToken: null,
                tokenExpiryTime: null,
                isLoggedIn: false,
            }),
            isTokenExpired: () => {
                const expiryTime = get().tokenExpiryTime;
                return expiryTime ? Date.now() > expiryTime : true;
            },
        }),
        {
            name: 'adminAuth',
            partialize: (state) => ({
                accessToken: state.accessToken,
                tokenExpiryTime: state.tokenExpiryTime,
                isLoggedIn: state.isLoggedIn,
            }),
        }
    )
);