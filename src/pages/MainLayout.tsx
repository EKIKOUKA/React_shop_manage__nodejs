import React from 'react';
import { Layout, Menu, Popconfirm, Button, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCartOutlined, AppstoreOutlined, UserOutlined, OrderedListOutlined, ShopOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import systemLogo from "../assets/vite.svg"
import "../index.scss"
const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
const menuItems: MenuItem[] = [
    {
        key: 'user',
        label: 'ユーザー管理',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: 'users', label: 'ユーザーリスト', icon: <UserOutlined />
            }
        ]
    },
    {
        key: 'good',
        label: '商品管理',
        icon: <ShopOutlined />,
        children: [
            { key: 'goods', label: '商品リスト', icon: <ShoppingCartOutlined /> }
        ]
    },
    {
        key: 'order',
        label: '注文管理',
        icon: <UnorderedListOutlined />,
        children: [
            { key: 'orders', label: '注文リスト', icon: <OrderedListOutlined /> }
        ]
    }
];

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    let userAvatar: string | null = null;
    try {
        userAvatar = JSON.parse(localStorage.getItem("userInfo")!)?.avatar || null;
    } catch {
        userAvatar = null;
    }

    const handleSignout = () => {
        localStorage.removeItem("userInfo")
        localStorage.removeItem("token")
        navigate('/')
    }
    const DropMenuItems: MenuProps['items'] = [
        {
            label: (
                <Popconfirm title="サインアウト?" cancelText="キャンセル" okText="確定" onConfirm={() => handleSignout()}>
                    <Button type="primary" danger onClick={() => handleSignout}>サインアウト</Button>
                </Popconfirm>
            ),
            key: '0'
        },
        {
            label: (
                <Button type="primary" onClick={() => navigate('/TOTP_Setting')}>
                    TOTP_Setting
                </Button>
            ),
            key: '1'
        }
    ];

    return (
        <>
            <div className={"header"}>
                <div onClick={() => navigate('/')} className="system-name">
                    <img src={systemLogo} className="logo" />
                    <span>ショップ管理システム</span>
                </div>
                <div className={"user-logo"}>
                    { !userAvatar &&
                        <div onClick={() => navigate('/login')}>登録</div>
                    }
                    { userAvatar &&
                        <Dropdown menu={{ items: DropMenuItems }} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                <img src={userAvatar} />
                            </a>
                        </Dropdown>
                    }
                </div>
            </div>
            <Layout className="main-content">
                <Sider>
                    <Menu
                        theme="dark"
                        mode="inline"
                        className="sider-menu"
                        selectedKeys={[location.pathname.replace('/', '')]}
                        defaultOpenKeys={['user', 'good', 'order']}
                        onClick={({ key }) => navigate(`/${key}`)}
                        items={menuItems}
                    />
                </Sider>
                <Layout>
                    <Content className="layout-content">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default MainLayout;