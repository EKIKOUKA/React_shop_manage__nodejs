import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from "../request.jsx";

const Login = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = values => {
        console.log('Success:', values);
        request("login", {
            username: values.username,
            password: values.password
        }).then(res => {
            console.log("request res: ", res);
            if (!res.success) {
                console.log("error request res: ", res);
                messageApi.open({
                    type: 'error',
                    content: 'アカンウトかパウワードが間違った！',
                });
            } else {
                console.log("success request res: ", res);
                localStorage.setItem("userInfo", JSON.stringify({
                    username: res?.userInfo.username,
                    user_email: res?.userInfo.user_email,
                }));
                console.log(JSON.parse(localStorage.getItem("userInfo")))
                messageApi.open({
                    type: 'success',
                    content: 'ログイン成功！',
                });
                setTimeout(() => {
                    navigate('/')
                }, 1200)
            }
        });
    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ padding: 100, textAlign: 'center' }}>
            {contextHolder}
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: "120px auto" }}
                initialValues={{
                    remember: true,
                    username: 'i@zce.me',
                    password: '$2a$08$09nUxs.9czzXc4JZJTOdteeXSd/mxZVg96AhqciGbTMB6cfbGUWC2',
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