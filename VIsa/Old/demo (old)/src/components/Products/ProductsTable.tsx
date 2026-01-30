import { EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { type FC } from 'react';

import { type Product } from '../../lib/types';

type ProductsTableProps = {
    products: Product[];
    loading?: boolean;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onManageRelations: (product: Product) => void;
    elementCounts?: Record<string, number>;
};

export const ProductsTable: FC<ProductsTableProps> = ({
    products,
    loading = false,
    onEdit,
    onDelete,
    onManageRelations,
    elementCounts = {},
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
            title: 'Elements',
            key: 'elements',
            render: (_: any, record: Product) => <Tag>{elementCounts[record.id] || 0} elements</Tag>,
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
            render: (_: any, record: Product) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                    <Button type="link" icon={<LinkOutlined />} onClick={() => onManageRelations(record)}>
                        Relations
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this product?"
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
        <Table columns={columns} dataSource={products} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
    );
};
