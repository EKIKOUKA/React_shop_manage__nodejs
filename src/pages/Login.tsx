import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from "../request";
import "../index.scss"

const Login = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values: { username: string, password: string }) => {
        console.log('Success:', values);
        request("login", {
            username: values.username,
            password: values.password
        }).then(res => {
            if (!res.success) {
                messageApi.open({
                    type: 'error',
                    content: 'アカンウトかパウワードが間違った！',
                });
            } else {
                localStorage.setItem("userInfo", JSON.stringify({
                    userId: res?.userInfo.userId,
                    username: res?.userInfo.username,
                    user_email: res?.userInfo.user_email,
                    avatar: res?.userInfo.avatar,
                }));
                messageApi.open({
                    type: 'success',
                    content: 'ログイン成功！',
                });
                if (res?.userInfo?.totp_secret) {
                    setTimeout(() => {
                        navigate('/TOTP_Secure')
                    }, 1200)
                } else {
                    localStorage.setItem('token', res?.userInfo.token);
                    setTimeout(() => {
                        navigate('/')
                    }, 1200)
                }
            }
        });
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            {contextHolder}
            <div className="login-container">
                <h1>ショップ管理システム</h1>
                <Form
                    className={"login-form"}
                    name="basic"
                    layout="vertical"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{
                        remember: true,
                        username: 'test@yahoo.com',
                        password: '123456',
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="true"
                >
                    <Form.Item
                        label="アカンウト"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="アカンウト" />
                    </Form.Item>
                    <Form.Item
                        label="パウワード"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="パウワード" />
                    </Form.Item>
                    <Form.Item className={"signin-btn"} label={null}>
                        <Button type="primary" htmlType="submit">
                            登録
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;