import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {useOwnerAuthStore} from '../store/ownerAuthStore.ts';
import toast from "react-hot-toast";

const useCheckTokenExpiry = () => {
    const isTokenExpired = useOwnerAuthStore((state) => state.isTokenExpired);
    const navigate = useNavigate();
    const hasNavigated = useRef(false);

    const checkExpiryAndNavigate = useCallback(() => {
        // 토큰 만료 및 아직 네비게이션이 일어나지 않았으면
        if (isTokenExpired() && !hasNavigated.current) {
            toast.error("세션이 만료되었습니다. 다시 로그인 해 주십시오");
            navigate('/');
            hasNavigated.current = true; // 네비게이션 상태 갱신
        }
    }, [isTokenExpired, navigate]);

    useEffect(() => {
        const handleUserActivity = () => {
            checkExpiryAndNavigate();
        };

        const events = ['mousedown', 'mousemove', 'keydown', 'click', 'scroll'];
        events.forEach((event) => window.addEventListener(event, handleUserActivity));

        const interval = setInterval(() => {
            checkExpiryAndNavigate();
        }, 60 * 10 * 10 * 10);

        return () => {
            events.forEach((event) => window.removeEventListener(event, handleUserActivity));
            clearInterval(interval);
        };
    }, [checkExpiryAndNavigate]);
};

export default useCheckTokenExpiry;