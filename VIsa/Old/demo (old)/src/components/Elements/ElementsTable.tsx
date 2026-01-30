import { EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { type FC } from 'react';

import { type Element } from '../../lib/types';

type ElementsTableProps = {
    elements: Element[];
    loading?: boolean;
    onEdit: (element: Element) => void;
    onDelete: (id: string) => void;
    onManageRelations: (element: Element) => void;
    productCounts?: Record<string, number>;
};

export const ElementsTable: FC<ElementsTableProps> = ({
    elements,
    loading = false,
    onEdit,
    onDelete,
    onManageRelations,
    productCounts = {},
}) => {
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
            title: 'Used in Products',
            key: 'products',
            render: (_: any, record: Element) => <Tag>{productCounts[record.id] || 0} products</Tag>,
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
            render: (_: any, record: Element) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" icon={<LinkOutlined />} onClick={() => onManageRelations(record)}>
                        Relations
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this element?"
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

    return (
        <Table columns={columns} dataSource={elements} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    );
};
