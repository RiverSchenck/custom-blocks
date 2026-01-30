import { Layout } from 'antd';
import { type FC, type ReactNode } from 'react';

import { Sidebar } from './Sidebar';

const { Content } = Layout;

type AppLayoutProps = {
    selectedKey: string;
    onMenuSelect: (key: string) => void;
    children: ReactNode;
};

export const AppLayout: FC<AppLayoutProps> = ({ selectedKey, onMenuSelect, children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar selectedKey={selectedKey} onSelect={onMenuSelect} />
            <Layout>
                <Content style={{ margin: '24px', padding: '24px', background: '#fff' }}>{children}</Content>
            </Layout>
        </Layout>
    );
};
