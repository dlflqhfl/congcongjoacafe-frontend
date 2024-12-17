import axios, { AxiosInstance } from 'axios';
import { useOwnerAuthStore } from "../store/ownerAuthStore";
import {jwtDecode} from 'jwt-decode';

// 전역 설정
axios.defaults.withCredentials = true;

// API 베이스 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 역할별 Axios 인스턴스 생성 함수
const createAxiosInstance = (basePath: string): AxiosInstance => {
    return axios.create({
        baseURL: `${API_BASE_URL}/${basePath}`,
        withCredentials: true,
    });
};

// 역할별 Axios 인스턴스
export const userAxios = createAxiosInstance('user');
export const ownerAxios = createAxiosInstance('owner');
export const adminAxios = createAxiosInstance('admin');

// 공통 유틸리티 함수: Access Token 가져오기
const getAccessTokenForRole = (role: string): string | null => {
    switch (role) {
        /*case 'user':
            return useUserAuthStore.getState().accessToken;*/
        case 'owner':
            return useOwnerAuthStore.getState().accessToken;
        /*case 'admin':
            return useAdminAuthStore.getState().accessToken;*/
        default:
            return null;
    }
};

// 공통 유틸리티 함수: Access Token 저장하기
const setAccessTokenForRole = (role: string, token: string): void => {
    switch (role) {
        /*case 'user':
            useUserAuthStore.setState({ accessToken: token });
            break;*/
        case 'owner':
            useOwnerAuthStore.setState({ accessToken: token });
            break;
        /*case 'admin':
            useAdminAuthStore.setState({ accessToken: token });
            break;*/
        default:
            break;
    }

    const tokenHeader = `Bearer ${token}`;

    // 역할별 Axios 인스턴스에 Authorization 헤더 설정
    switch (role) {
        case 'user':
            userAxios.defaults.headers.common['Authorization'] = tokenHeader;
            break;
        case 'owner':
            ownerAxios.defaults.headers.common['Authorization'] = tokenHeader;
            break;
        case 'admin':
            adminAxios.defaults.headers.common['Authorization'] = tokenHeader;
            break;
        default:
            break;
    }
};

// 공통 유틸리티 함수: 토큰 만료 여부 확인
const isTokenExpiredOrAboutToExpire = (token: string): boolean => {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime + 5 * 60; // 만료 5분 전 기준
};

// Access Token 갱신 함수
const refreshAccessToken = async (role: string): Promise<void> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
            headers: {
                Authorization: `Bearer ${getAccessTokenForRole(role)}`, // 기존 토큰으로 갱신 요청
            },
        });
        const newAccessToken = response.data.data.accessToken;
        setAccessTokenForRole(role, newAccessToken); // 새 Access Token 저장 및 헤더 업데이트
    } catch (error) {
        console.error(`Failed to refresh token for role: ${role}`, error);
        // 필요한 경우 추가 에러 처리 (예: 로그아웃, 알림 표시)
    }
};

// Access Token 갱신이 필요한 경우 처리
const refreshAccessTokenIfNecessary = async (role: string): Promise<void> => {
    const accessToken = getAccessTokenForRole(role);
    if (!accessToken || isTokenExpiredOrAboutToExpire(accessToken)) {
        await refreshAccessToken(role);
    }
};

// Axios 인터셉터 등록 함수
const setInterceptors = (axiosInstance: AxiosInstance, role: string): void => {
    console.log(`Setting interceptors for role: ${role}`);

    // Request 인터셉터: 모든 요청 전에 실행
    axiosInstance.interceptors.request.use(
        async (config) => {
            await refreshAccessTokenIfNecessary(role); // 토큰 갱신이 필요하면 갱신
            const accessToken = getAccessTokenForRole(role); // 최신 토큰 가져오기
            if (accessToken) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${accessToken}`; // Authorization 헤더 설정
            }
            return config;
        },
        (error) => {
            console.error('Request interceptor error:', error);
            return Promise.reject(error);
        }
    );

    // Response 인터셉터: 응답 후 처리
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error(`[${role}] Response interceptor error:`, error.response?.data || error.message);

            // 401 에러 발생 시 처리
            if (error.response?.status === 401) {
                console.warn(`[${role}] Authentication failed.`);
                // 로그아웃 또는 재인증 로직 추가
            }

            return Promise.reject(error);
        }
    );
};

// 초기화 함수: 모든 Axios 인스턴스에 인터셉터 등록
export const initializeAxiosInterceptors = (): void => {
    setInterceptors(userAxios, 'user');
    setInterceptors(ownerAxios, 'owner');
    setInterceptors(adminAxios, 'admin');
};