import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { useState } from 'react';

import { useRegions } from '../../hooks/useRegions';
import { type Region, type RegionInsert, type RegionUpdate } from '../../lib/types';

import { RegionForm } from './RegionForm';
import { RegionsTable } from './RegionsTable';

const { Title } = Typography;

export const RegionsPage = () => {
    const { regions, loading, createRegion, updateRegion, deleteRegion } = useRegions();
    const [formOpen, setFormOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | undefined>();

    const handleCreate = () => {
        setEditingRegion(undefined);
        setFormOpen(true);
    };

    const handleEdit = (region: Region) => {
        setEditingRegion(region);
        setFormOpen(true);
    };

    const handleSubmit = async (values: RegionInsert | RegionUpdate) => {
        if (editingRegion) {
            await updateRegion(editingRegion.id, values as RegionUpdate);
        } else {
            await createRegion(values as RegionInsert);
        }
        setFormOpen(false);
        setEditingRegion(undefined);
    };

    const handleDelete = async (id: string) => {
        await deleteRegion(id);
    };

    return (
        <div>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={2}>Regions</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Create Region
                    </Button>
                </div>

                <RegionsTable regions={regions} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
            </Card>

            <RegionForm
                open={formOpen}
                region={editingRegion}
                onCancel={() => {
                    setFormOpen(false);
                    setEditingRegion(undefined);
                }}
                onSubmit={handleSubmit}
            />
        </div>
    );
};
