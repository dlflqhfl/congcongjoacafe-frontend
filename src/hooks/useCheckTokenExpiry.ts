import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwnerAuthStore } from '../store/ownerAuthStore.ts';
import toast from "react-hot-toast";

const useCheckTokenExpiry = () => {
    const isTokenExpired = useOwnerAuthStore((state) => state.isTokenExpired);
    const navigate = useNavigate();
    const hasNavigated = useRef(false);

    const checkExpiryAndNavigate = useCallback(() => {
        if (isTokenExpired() && !hasNavigated.current) {
            toast.error("세션이 만료되었습니다. 다시 로그인 해 주십시오");
            navigate('/');
            hasNavigated.current = true;
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
        }, 60000);  // 60초마다 검사

        return () => {
            events.forEach((event) => window.removeEventListener(event, handleUserActivity));
            clearInterval(interval);
        };
    }, [checkExpiryAndNavigate]);
};

export default useCheckTokenExpiry;