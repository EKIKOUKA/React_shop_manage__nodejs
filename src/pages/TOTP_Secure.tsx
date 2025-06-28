import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from "../request";
import "../index.scss"

const TOTP_Secure = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = (values: { code: string }) => {
        let userId = JSON.parse(localStorage.getItem("userInfo")!)?.userId || null
        request("verify-login-totp", {
            userId: userId,
            token: values.code
        }).then(res => {
            if (!res.success) {
                messageApi.open({
                    type: 'error',
                    content: res.message,
                });
            } else {
                localStorage.setItem('token', res?.token);
                messageApi.open({
                    type: 'success',
                    content: res.message,
                });
                setTimeout(() => {
                    navigate('/')
                }, 1200)
            }
        })
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {contextHolder}
            <div className="totp-code-container">
                <h1>2 段階認証</h1>
                <p>
                    セキュリティを強化するために、Authenticatorアプリで生成されたワンタイムパスワード (OTP) を入力してください。
                </p>
                <Form
                    className={"login-form"}
                    name="basic"
                    layout="vertical"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{
                        remember: true
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="true"
                >
                    <Form.Item
                        label="ワンタイムパスワード:"
                        name="code"
                        className={"code-label"}
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input type="tel" autoComplete="on" name="otpCode" placeholder="ワンタイムパスワード" />
                    </Form.Item>
                    <Form.Item className={"submit-btn"} label={null}>
                        <Button type="primary" htmlType="submit">ログイン</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default TOTP_Secure;