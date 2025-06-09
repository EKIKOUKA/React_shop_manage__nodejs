import React from 'react';
import { Layout, Menu, Popconfirm } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCartOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import systemLogo from "../assets/vite.svg"
const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
const items: MenuItem[] = [
    {
        key: 'sub1',
        label: 'ユーザー管理',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: 'users',
                label: 'ユーザーリスト'
            }
        ]
    },
    {
        key: 'sub2',
        label: '権限管理',
        icon: <AppstoreOutlined />,
        children: [
            { key: '5', label: '権限リスト' }
        ]
    },
    {
        key: 'sub3',
        label: '商品管理',
        icon: <AppstoreOutlined />,
        children: [
            { key: 'goods', label: '商品リスト', icon: <ShoppingCartOutlined /> }
        ]
    },
    {
        key: 'sub4',
        label: '注文管理',
        icon: <AppstoreOutlined />,
        children: [
            { key: 'orders', label: '注文リスト' }
        ]
    }
];

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let userName: string | null = null;
    try {
        userName = JSON.parse(localStorage.getItem("userInfo")!)?.username || null;
    } catch {
        userName = null;
    }

    const handleSignout = () => {
        localStorage.removeItem("userInfo")
        navigate('/')
    }

    return (
        <>
            <div style={{ backgroundColor: '#000', height: '5vh', lineHeight: '5vh', display: 'flex', justifyContent: 'space-between'}} className={"header"}>
                <div onClick={() => navigate('/')} className="system-name" style={{margin: '0 10px 0 20px', cursor: 'pointer'}}>
                    <img src={systemLogo} className="logo" />
                    <span style={{color: '#FFF', marginLeft: '10px'}}>ショップ管理システム</span>
                </div>
                <div style={{color: '#FFF', marginRight: '15px', textDecoration: "underline", cursor: "pointer" }} className={"logo"}>
                    { !userName &&
                        <div onClick={() => navigate('/login')}>登録</div>
                    }
                    { userName &&
                        <Popconfirm title="サインアウト?" cancelText="キャンセル" okText="確定" onConfirm={() => handleSignout()}>
                            {userName}
                        </Popconfirm>
                    }
                </div>
            </div>
            <Layout style={{ minHeight: '95vh' }}>
                <Sider>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[location.pathname.replace('/', '')]}
                        onClick={({ key }) => navigate(`/${key}`)}
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Content style={{ margin: '16px' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default MainLayout;