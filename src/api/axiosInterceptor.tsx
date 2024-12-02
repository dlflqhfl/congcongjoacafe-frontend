import axios from 'axios';
import { useOwnerAuthStore } from "../store/ownerAuthStore.ts";
import {jwtDecode} from "jwt-decode";
axios.defaults.withCredentials = true;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 각 역할별 Axios 인스턴스 생성
const userAxios = axios.create({ baseURL: `${API_BASE_URL}/user` });
const ownerAxios = axios.create({ baseURL: `${API_BASE_URL}/owner` });
const adminAxios = axios.create({ baseURL: `${API_BASE_URL}/admin` });

// 특정 역할의 상태에서 액세스 토큰을 반환하는 함수
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

// 특정 역할의 상태에 액세스 토큰을 설정하고 Axios 인스턴스에 설정하는 함수
const setAccessTokenForRole = (role: string, token: string) => {
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
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (role === 'user') userAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (role === 'owner') ownerAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (role === 'admin') adminAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// 만료된 액세스 토큰을 새로 고치는 함수
async function refreshAccessToken(role: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            // 필요한 파라미터 추가
        });
        const newAccessToken = response.data.accessToken;
        setAccessTokenForRole(role, newAccessToken);
    } catch (error) {
        console.error(`Failed to refresh access token for ${role}`, error);
        // 추가적인 에러 처리 로직
    }
}

// 주어진 토큰이 만료되었거나 만료 직전인지 확인하는 함수
const isTokenExpiredOrAboutToExpire = (token: string): boolean => {
    const { exp } = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return exp < currentTime + 5 * 60; // 5분 이내 만료 예정 시 갱신
};

// 필요에 따라 액세스 토큰을 새로 고치는 함수
const refreshAccessTokenIfNecessary = async (role: string) => {
    const accessToken = getAccessTokenForRole(role);
    if (!accessToken || isTokenExpiredOrAboutToExpire(accessToken)) {
        await refreshAccessToken(role);
    }
};

// Axios 인스턴스에 요청을 가로채서 토큰을 새로 고치는 인터셉터 설정 함수
const setInterceptors = (axiosInstance: any, role: string) => {
    axiosInstance.interceptors.request.use(
        async (config: any) => {
            await refreshAccessTokenIfNecessary(role);
            return config;
        },
        (error: any) => Promise.reject(error)
    );
};

// 각 Axios 인스턴스에 인터셉터 설정 적용
setInterceptors(userAxios, 'user');
setInterceptors(ownerAxios, 'owner');
setInterceptors(adminAxios, 'admin');

export { userAxios, ownerAxios, adminAxios };