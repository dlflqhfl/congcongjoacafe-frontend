import axios from 'axios';

axios.defaults.withCredentials = true;

const API_BASE_URL = process.env.API_BASE_URL;

// 역할별 Axios 인스턴스 생성
const userAxios = axios.create({ baseURL: `${API_BASE_URL}/user` });
const ownerAxios = axios.create({ baseURL: `${API_BASE_URL}/owner` });
const adminAxios = axios.create({ baseURL: `${API_BASE_URL}/admin` });

// refreshAccessToken 함수 정의
async function refreshAccessToken() {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            // 필요한 파라미터가 있다면 추가
        });

        const newAccessToken = response.data.accessToken;
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        userAxios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        ownerAxios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        adminAxios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    } catch (error) {
        console.error('Failed to refresh access token', error);
        // 적절한 에러처리 (예: 로그아웃 처리, 사용자에게 재로그인 요청 등)
    }
}

// 공통 인터셉터 함수
const setInterceptors = (axiosInstance: any) => {
    axiosInstance.interceptors.request.use(
        async (config: any) => {
            if (!axios.defaults.headers.common['Authorization']) {
                console.log("Access token이 사라짐, Refresh token으로 재발급 시도");
                await refreshAccessToken();
            }
            return config;
        },
        (error: any) => Promise.reject(error)
    );
};

// 각 Axios 인스턴스에 인터셉터 설정 적용
[userAxios, ownerAxios, adminAxios].forEach(setInterceptors);

export { userAxios, ownerAxios, adminAxios };