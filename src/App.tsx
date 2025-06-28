import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import  { Spin } from "antd";
import RequireAuth from './component/RequireAuth';
import MainLayout from './pages/MainLayout';
const Login = lazy(() => import('./pages/Login'));
const TOTP_Secure = lazy(() => import('./pages/TOTP_Secure'));
const Home = lazy(() => import('./pages/Home'));
const Users = lazy(() => import ('./pages/Users'));
const Goods = lazy(() => import('./pages/Goods'));
const Orders = lazy(() => import('./pages/Orders'));
const TOTP_Setting = lazy(() => import('./pages/TOTP_Setting'));
import 'antd/dist/reset.css';

const App: React.FC = () => {

    return (
        <Suspense fallback={
            <Spin className={"loading-spin"} tip="読み込み中...">
                <div></div>
            </Spin>
        }>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/TOTP_Secure" element={
                    <RequireAuth>
                        <TOTP_Secure />
                    </RequireAuth>
                } />
                <Route path="/" element={<MainLayout />}>
                    <Route index element={
                        <RequireAuth>
                            <Home />
                        </RequireAuth>
                    } />
                    <Route path="users" element={
                        <RequireAuth>
                            <Users />
                        </RequireAuth>
                    } />
                    <Route path="goods" element={
                        <RequireAuth>
                            <Goods />
                        </RequireAuth>
                    } />
                    <Route path="orders" element={
                        <RequireAuth>
                            <Orders />
                        </RequireAuth>
                    } />
                    <Route path="TOTP_Setting" element={
                        <RequireAuth>
                            <TOTP_Setting />
                        </RequireAuth>
                    } />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;