import { Modal, Tabs, Select, Button, Typography } from 'antd';
import { useState, useEffect, type FC } from 'react';

import { useProducts } from '../../hooks/useProducts';
import { useRegions } from '../../hooks/useRegions';
import { useRelations } from '../../hooks/useRelations';
import { type Element } from '../../lib/types';

const { Title } = Typography;

type ElementRelationsProps = {
    open: boolean;
    element: Element;
    onCancel: () => void;
    onSuccess?: () => void;
};

export const ElementRelations: FC<ElementRelationsProps> = ({ open, element, onCancel, onSuccess }) => {
    const {
        linkElementRegions,
        linkElementProducts,
        fetchElementRegions,
        fetchElementProducts,
        fetchProductsUsingElement,
    } = useRelations();
    const { regions, loading: regionsLoading } = useRegions();
    const { products, loading: productsLoading } = useProducts();

    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [productsUsingElement, setProductsUsingElement] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && element) {
            const loadRelations = async () => {
                const regionIds = await fetchElementRegions(element.id);
                const productIds = await fetchElementProducts(element.id);
                const usingProductIds = await fetchProductsUsingElement(element.id);
                setSelectedRegions(regionIds);
                setSelectedProducts(productIds);
                setProductsUsingElement(usingProductIds);
            };
            loadRelations().catch(() => {});
        }
    }, [open, element, fetchElementRegions, fetchElementProducts, fetchProductsUsingElement]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await linkElementRegions(element.id, selectedRegions);
            await linkElementProducts(element.id, selectedProducts);
            onSuccess?.();
            onCancel();
        } catch (error) {
            // Error handling is done in the hook
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: 'regions',
            label: 'Regions',
            children: (
                <div>
                    <Title level={5}>Select regions where this element is applicable</Title>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select regions (leave empty for all regions)"
                        value={selectedRegions}
                        onChange={setSelectedRegions}
                        loading={regionsLoading}
                        options={regions.map((r) => ({
                            value: r.id,
                            label: `${r.name} (${r.identifier})`,
                        }))}
                    />
                    <div style={{ marginTop: 16, color: '#666' }}>
                        Leave empty to make element applicable to all regions
                    </div>
                </div>
            ),
        },
        {
            key: 'products',
            label: 'Products',
            children: (
                <div>
                    <Title level={5}>Select products where this element is applicable</Title>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select products (leave empty for all products)"
                        value={selectedProducts}
                        onChange={setSelectedProducts}
                        loading={productsLoading}
                        options={products.map((p) => ({
                            value: p.id,
                            label: `${p.name} (${p.identifier})`,
                        }))}
                    />
                    <div style={{ marginTop: 16, color: '#666' }}>
                        Leave empty to make element applicable to all products
                    </div>
                </div>
            ),
        },
        {
            key: 'used-in',
            label: 'Used In Products',
            children: (
                <div>
                    <Title level={5}>Products that use this element</Title>
                    <div style={{ marginTop: 16 }}>
                        {productsUsingElement.length === 0 ? (
                            <div style={{ color: '#999' }}>This element is not used in any products yet</div>
                        ) : (
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                value={productsUsingElement}
                                disabled
                                options={products
                                    .filter((p) => productsUsingElement.includes(p.id))
                                    .map((p) => ({
                                        value: p.id,
                                        label: `${p.name} (${p.identifier})`,
                                    }))}
                            />
                        )}
                    </div>
                    <div style={{ marginTop: 16, color: '#666' }}>
                        This is a read-only view. To add this element to products, go to the Products page and manage
                        relations there.
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Modal
            open={open}
            title={`Manage Relations: ${element.name}`}
            onCancel={onCancel}
            width={600}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={handleSave} loading={loading}>
                    Save
                </Button>,
            ]}
        >
            <Tabs items={tabItems} />
        </Modal>
    );
};
