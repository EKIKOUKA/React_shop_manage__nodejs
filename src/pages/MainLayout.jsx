import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    ShoppingCartOutlined,
    OrderedListOutlined,
    UserOutlined, MailOutlined, AppstoreOutlined, SettingOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

// [
//     { key: 'goods', label: '商品管理', icon: <ShoppingCartOutlined /> },
//     { key: 'orders', label: '訂單管理', icon: <OrderedListOutlined /> },
//     { key: 'users', label: '用戶管理', icon: <UserOutlined /> },
// ];
const menuItems = [
    {
        key: 'sub1',
        label: 'ユーザー管理',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: 'g1',
                label: 'ユーザーリスト',
            }
        ],
    },
    {
        key: 'sub2',
        label: '権限管理',
        icon: <AppstoreOutlined />,
        children: [
            { key: '5', label: 'Option 5' },
        ],
    },
    {
        key: 'sub3',
        label: '商品管理',
        icon: <AppstoreOutlined />,
        children: [
            { key: 'goods', label: '商品リスト', icon: <ShoppingCartOutlined /> },
        ],
    },
    {
        key: 'sub4',
        label: '注文管理',
        icon: <AppstoreOutlined />,
        children: [
            { key: '5', label: '注文リスト' },
        ],
    }
];

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname.replace('/', '')]}
                    onClick={({ key }) => navigate(`/${key}`)}
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '16px' }}>
                    <Outlet /> {/* 子頁面顯示區 */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;