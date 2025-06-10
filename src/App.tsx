import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import  { Spin } from "antd";
import RequireAuth from './component/RequireAuth';
import MainLayout from './pages/MainLayout';
const Login = lazy(() => import('./pages/Login'));

const Goods = lazy(() => import('./pages/Goods'));
const Home = lazy(() => import('./pages/Home'));
// import Orders from './pages/Orders';
// import Users from './pages/Users';
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
                <Route path="/" element={<MainLayout />}>
                    <Route index element={
                        <RequireAuth>
                            <Home />
                        </RequireAuth>
                    } />
                    <Route path="goods" element={
                        <RequireAuth>
                            <Goods />
                        </RequireAuth>
                    } />
                    {/*<Route path="orders" element={<Orders />} />*/}
                    {/*<Route path="users" element={<Users />} />*/}
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;