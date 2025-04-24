import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // React Query 관련 import
import { initializeAxiosInterceptors } from './api/axiosInterceptor.tsx';

const queryClient = new QueryClient();
initializeAxiosInterceptors();

createRoot(document.getElementById('root')!).render(
        <QueryClientProvider client={queryClient}> {/* QueryClientProvider로 전체 감싸기 */}
            <Toaster />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </QueryClientProvider>
);