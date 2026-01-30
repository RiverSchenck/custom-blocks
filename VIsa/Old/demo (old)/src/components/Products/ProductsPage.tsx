import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Typography } from 'antd';
import { useState, useEffect } from 'react';

import { useProducts } from '../../hooks/useProducts';
import { useRelations } from '../../hooks/useRelations';
import { type Product, type ProductInsert, type ProductUpdate } from '../../lib/types';

import { ProductForm } from './ProductForm';
import { ProductRelations } from './ProductRelations';
import { ProductsTable } from './ProductsTable';

const { Title } = Typography;

export const ProductsPage = () => {
    const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
    const { fetchProductElements } = useRelations();
    const [formOpen, setFormOpen] = useState(false);
    const [relationsOpen, setRelationsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>();
    const [elementCounts, setElementCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadCounts = async () => {
            const counts: Record<string, number> = {};
            for (const product of products) {
                const elementIds = await fetchProductElements(product.id);
                counts[product.id] = elementIds.length;
            }
            setElementCounts(counts);
        };
        if (products.length > 0) {
            loadCounts().catch(() => {});
        }
    }, [products, fetchProductElements]);

    const handleCreate = () => {
        setEditingProduct(undefined);
        setFormOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormOpen(true);
    };

    const handleManageRelations = (product: Product) => {
        setEditingProduct(product);
        setRelationsOpen(true);
    };

    const handleSubmit = async (values: ProductInsert | ProductUpdate) => {
        if (editingProduct) {
            await updateProduct(editingProduct.id, values as ProductUpdate);
        } else {
            await createProduct(values as ProductInsert);
        }
        setFormOpen(false);
        setEditingProduct(undefined);
    };

    const handleDelete = async (id: string) => {
        await deleteProduct(id);
    };

    const handleRelationsSuccess = () => {
        // Reload element counts
        const loadCounts = async () => {
            const counts: Record<string, number> = {};
            for (const product of products) {
                const elementIds = await fetchProductElements(product.id);
                counts[product.id] = elementIds.length;
            }
            setElementCounts(counts);
        };
        loadCounts().catch(() => {});
    };

    return (
        <div>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={2}>Products</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        Create Product
                    </Button>
                </div>

                <ProductsTable
                    products={products}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onManageRelations={handleManageRelations}
                    elementCounts={elementCounts}
                />
            </Card>

            <ProductForm
                open={formOpen}
                product={editingProduct}
                onCancel={() => {
                    setFormOpen(false);
                    setEditingProduct(undefined);
                }}
                onSubmit={handleSubmit}
            />

            {editingProduct && (
                <ProductRelations
                    open={relationsOpen}
                    product={editingProduct}
                    onCancel={() => {
                        setRelationsOpen(false);
                        setEditingProduct(undefined);
                    }}
                    onSuccess={handleRelationsSuccess}
                />
            )}
        </div>
    );
};
