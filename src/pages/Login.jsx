import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from "../request.jsx";

const Login = () => {
    const navigate = useNavigate();

    const onFinish = values => {
        console.log('Success:', values);
        request("login", {
            username: values.username,
            password: values.password
        }).then(res => {
            console.log("request res: ", res);

        });
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ padding: 100, textAlign: 'center' }}>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: "120px auto" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="true"
            >
                <Form.Item
                    label="アカンウト"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="パウワード"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        登録
                    </Button>
                </Form.Item>
            </Form>
            <Button type="primary" onClick={() => navigate('/')}>
                登録せずホームページへ行って
            </Button>
        </div>
    );
};

export default Login;