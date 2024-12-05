import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Toaster} from "react-hot-toast";
import {BrowserRouter} from "react-router-dom";
import React from 'react';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Toaster/>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)
