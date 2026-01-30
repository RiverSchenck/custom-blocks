import { GlobalOutlined, AppstoreOutlined, BlockOutlined, FileTextOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { type FC } from 'react';

const { Sider } = Layout;

type SidebarProps = {
    selectedKey: string;
    onSelect: (key: string) => void;
};

export const Sidebar: FC<SidebarProps> = ({ selectedKey, onSelect }) => {
    const menuItems = [
        {
            key: 'regions',
            icon: <GlobalOutlined />,
            label: 'Regions',
        },
        {
            key: 'products',
            icon: <AppstoreOutlined />,
            label: 'Products',
        },
        {
            key: 'elements',
            icon: <BlockOutlined />,
            label: 'Elements',
        },
        {
            key: 'rules',
            icon: <FileTextOutlined />,
            label: 'Rules',
        },
    ];

    return (
        <Sider width={200} style={{ minHeight: '100vh' }}>
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
                onClick={({ key }) => onSelect(key)}
            />
        </Sider>
    );
};
