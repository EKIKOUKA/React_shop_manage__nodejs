import React, { useEffect, useState } from 'react';
import { Popover, Button, Input, message } from 'antd';
import type { GetProps } from 'antd';
import {useNavigate} from "react-router-dom";
type OTPProps = GetProps<typeof Input.OTP>;
import request from "../request"
import "../index.scss"

interface dataType {
    imageData: string;
    secret: string;
}

const TOTP_Setting = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<dataType | null>(null);
    const [code, setCode] = useState<string | null>("");
    const [messageApi, contextHolder] = message.useMessage();
    let userId = JSON.parse(localStorage.getItem("userInfo")!)?.userId || ""

    useEffect(() => {
        request("generate-secret", {
            userId
        }).then(res => {
            setData(res.data);
        })
    }, [])

    const TOTP_commit = () => {
        request("verify-setup-totp", {
            userId,
            token: code
        }).then(res => {
            if (res.success) {
                messageApi.success(res.message);
                setTimeout(() => {
                    navigate('/')
                }, 1500)
            } else {
                messageApi.error(res.message);
            }
        })
    }
    const onChange: OTPProps['onChange'] = code => {
        setCode(code);
    };
    const sharedProps: OTPProps = {
        onChange
    };

    return (
        (data &&
            <div className="totp-setting-wrapper">
                {contextHolder}
                <h1>二要素認証</h1>
                <div className="totp-setting-container">
                    <h3>認証アプリ</h3>
                    <p>アップルのパスワード、1Password、Authy、Microsoft Authenticatorなどの認証アプリやブラウザ拡張機能は、サインイン時に求められた際にあなたの身元を確認するための第二の要素として使用されるワンタイムパスワードを生成します。</p>
                    <div><strong>QRコードをスキャンしてください</strong></div>
                    <div>認証アプリまたはブラウザ拡張機能を使用してスキャンしてください。</div>
                    <div className="bar-code">
                        <img src={data.imageData} style={{width: "100%"}}/>
                    </div>
                    <Popover content={
                        <div>
                            <ol>
                                <li>認証アプリを開き、メニューから「Manually add account」を選択します。</li>
                                <li>「Enter account name」に完全なEメールアドレスを入力します。</li>
                                <li>「Enter your key」に以下のキーを入力します。</li>
                                <li><strong>{data.secret}</strong></li>
                                <li>キータイプを「Time based」に設定します。</li>
                                <li>「Add」をタップします。</li>
                            </ol>
                        </div>
                    } title="バーコードをスキャンできませんか？" trigger="click">
                        <Button type="link">バーコードをスキャンできませんか？</Button>
                    </Popover>
                    <p>ワンタイムパスワードを入力します。 バーコードをスキャンしたら、アプリによって生成されたワンタイムパスワードを入力します。</p>
                    <Input.OTP {...sharedProps} />
                    <div className="commit-btn"><Button type="primary" onClick={TOTP_commit}>ワンタイムパスワードを確認して</Button></div>
                </div>
            </div>
        )
    )
}

export default TOTP_Setting;