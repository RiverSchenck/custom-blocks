import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Space, Popconfirm } from 'antd';
import { type FC } from 'react';

import { type Region } from '../../lib/types';

type RegionsTableProps = {
    regions: Region[];
    loading?: boolean;
    onEdit: (region: Region) => void;
    onDelete: (id: string) => void;
};

export const RegionsTable: FC<RegionsTableProps> = ({ regions, loading = false, onEdit, onDelete }) => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Identifier',
            dataIndex: 'identifier',
            key: 'identifier',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string | null) => text || '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Region) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this region?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={regions} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />;
};
