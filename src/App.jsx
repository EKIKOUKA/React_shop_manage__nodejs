import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import MainLayout from './pages/MainLayout.jsx';
import Goods from './pages/Goods.jsx';
// import Orders from './pages/Orders';
// import Users from './pages/Users';
import 'antd/dist/reset.css';
// import './App.css';

function App() {

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
                <Route path="goods" element={<Goods />} />
                {/*<Route path="orders" element={<Orders />} />*/}
                {/*<Route path="users" element={<Users />} />*/}
            </Route>
        </Routes>
    );
}

export default App;
