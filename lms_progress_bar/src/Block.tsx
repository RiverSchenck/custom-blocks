import { useEffect, useState, type FC } from 'react';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { Progress, List, Typography, Card, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import style from './style.module.css';

const STORAGE_KEY = 'frontify_lms_progress';

type ProgressItem = {
    id: string;
    name: string;
    completed: boolean;
    link: string;
};

export const AnExampleBlock: FC<BlockProps> = () => {
    const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
    const completedCount = progressItems.filter((item) => item.completed).length;
    const totalCount = progressItems.length;
    const progressPercent = totalCount ? (completedCount / totalCount) * 100 : 0;

    useEffect(() => {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
            setProgressItems(JSON.parse(storedItems) as ProgressItem[]);
        }
    }, []);

    return (
        <Card className={style.container} title="Learning Progress" bordered={false}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Ant Design Progress Bar with increased thickness */}
                <Progress percent={progressPercent} status="active" strokeColor="#1890ff" strokeWidth={18} showInfo={false} />
                
                {/* Display progress summary */}
                <Typography.Text strong style={{ fontSize: '16px', textAlign: 'center', display: 'block' }}>
                    {completedCount}/{totalCount} Tasks Completed
                </Typography.Text>

                {/* Task List */}
                <List
                    itemLayout="horizontal"
                    dataSource={progressItems}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <Typography.Link href={item.link} target="_blank" rel="noopener noreferrer">
                                        {item.name}
                                    </Typography.Link>
                                }
                                avatar={
                                    item.completed ? 
                                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} /> : 
                                        <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '18px' }} />
                                }
                            />
                        </List.Item>
                    )}
                />
            </Space>
        </Card>
    );
};
