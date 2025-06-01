import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: 100, textAlign: 'center' }}>
            <h1>登入頁面（可選）</h1>
            <Button type="primary" onClick={() => navigate('/')}>
                直接進入主頁
            </Button>
        </div>
    );
};

export default Login;