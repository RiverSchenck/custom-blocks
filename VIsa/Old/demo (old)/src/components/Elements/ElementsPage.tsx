import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { useState, useEffect } from 'react';

import { useElements } from '../../hooks/useElements';
import { useRelations } from '../../hooks/useRelations';
import { type Element, type ElementInsert, type ElementUpdate } from '../../lib/types';

import { ElementForm } from './ElementForm';
import { ElementRelations } from './ElementRelations';
import { ElementsTable } from './ElementsTable';

const { Title } = Typography;

export const ElementsPage = () => {
    const { elements, loading, createElement, updateElement, deleteElement } = useElements();
    const { fetchProductsUsingElement } = useRelations();
    const [formOpen, setFormOpen] = useState(false);
    const [relationsOpen, setRelationsOpen] = useState(false);
    const [editingElement, setEditingElement] = useState<Element | undefined>();
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadCounts = async () => {
            const counts: Record<string, number> = {};
            for (const element of elements) {
                const productIds = await fetchProductsUsingElement(element.id);
                counts[element.id] = productIds.length;
            }
            setProductCounts(counts);
        };
        if (elements.length > 0) {
            loadCounts().catch(() => {});
        }
    }, [elements, fetchProductsUsingElement]);

    const handleCreate = () => {
        setEditingElement(undefined);
        setFormOpen(true);
    };

    const handleEdit = (element: Element) => {
        setEditingElement(element);
        setFormOpen(true);
    };

    const handleManageRelations = (element: Element) => {
        setEditingElement(element);
        setRelationsOpen(true);
    };

    const handleSubmit = async (values: ElementInsert | ElementUpdate) => {
        if (editingElement) {
            await updateElement(editingElement.id, values as ElementUpdate);
        } else {
            await createElement(values as ElementInsert);
        }
        setFormOpen(false);
        setEditingElement(undefined);
    };

    const handleDelete = async (id: string) => {
        await deleteElement(id);
    };

    const handleRelationsSuccess = () => {
        // Reload product counts
        const loadCounts = async () => {
            const counts: Record<string, number> = {};
            for (const element of elements) {
                const productIds = await fetchProductsUsingElement(element.id);
                counts[element.id] = productIds.length;
            }
            setProductCounts(counts);
        };
        loadCounts().catch(() => {});
    };

    return (
        <div>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={2}>Elements</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Create Element
                    </Button>
                </div>

                <ElementsTable
                    elements={elements}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onManageRelations={handleManageRelations}
                    productCounts={productCounts}
                />
            </Card>

            <ElementForm
                open={formOpen}
                element={editingElement}
                onCancel={() => {
                    setFormOpen(false);
                    setEditingElement(undefined);
                }}
                onSubmit={handleSubmit}
            />

            {editingElement && (
                <ElementRelations
                    open={relationsOpen}
                    element={editingElement}
                    onCancel={() => {
                        setRelationsOpen(false);
                        setEditingElement(undefined);
                    }}
                    onSuccess={handleRelationsSuccess}
                />
            )}
        </div>
    );
};
