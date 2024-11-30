import { create } from 'zustand';

interface OwnerAuthStore {
    accessToken: string | null;
    tokenExpiryTime: number | null; // 만료 시간 추가
    isFirstLogin: boolean;
    sName : string | null;
    setAccessToken: (token: string, expiryTime: number) => void; // 만료 시간을 받도록 수정
    setIsFirstLogin: (isFirst: boolean) => void;
    setSName: (sName: string) => void;
    clearAuth: () => void;
    isTokenExpired: () => boolean; // 만료 확인 함수 추가
}

export const useOwnerAuthStore = create<OwnerAuthStore>((set, get) => ({
    accessToken: null,
    tokenExpiryTime: null,
    isFirstLogin: false,
    sName: null,
    setAccessToken: (token, expiryTime) => set({ accessToken: token, tokenExpiryTime: expiryTime }),
    setIsFirstLogin: (isFirst) => set({ isFirstLogin: isFirst }),
    setSName: (sName) => set({ sName }),
    clearAuth: () => set({ accessToken: null, tokenExpiryTime: null, isFirstLogin: false, sName: null }),
    isTokenExpired: () => {
        const expiryTime = get().tokenExpiryTime;
        return expiryTime ? Date.now() > expiryTime : true;
    },
}));