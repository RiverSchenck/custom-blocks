import { Modal, Tabs, Select, Button, Typography } from 'antd';
import { useState, useEffect, type FC } from 'react';

import { useElements } from '../../hooks/useElements';
import { useRegions } from '../../hooks/useRegions';
import { useRelations } from '../../hooks/useRelations';
import { type Product } from '../../lib/types';

const { Title } = Typography;

type ProductRelationsProps = {
    open: boolean;
    product: Product;
    onCancel: () => void;
    onSuccess?: () => void;
};

export const ProductRelations: FC<ProductRelationsProps> = ({ open, product, onCancel, onSuccess }) => {
    const { linkProductElements, linkRegionProducts, fetchProductElements, fetchRegionProducts } = useRelations();
    const { elements, loading: elementsLoading } = useElements();
    const { regions, loading: regionsLoading } = useRegions();

    const [selectedElements, setSelectedElements] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && product) {
            const loadRelations = async () => {
                const elementIds = await fetchProductElements(product.id);
                const regionIds = await fetchRegionProducts(product.id);
                setSelectedElements(elementIds);
                setSelectedRegions(regionIds);
            };
            loadRelations().catch(() => {});
        }
    }, [open, product, fetchProductElements, fetchRegionProducts]);

    const handleSave = async () => {
        try {
            setLoading(true);
            await linkProductElements(product.id, selectedElements);
            await linkRegionProducts(product.id, selectedRegions);
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
            key: 'elements',
            label: 'Elements',
            children: (
                <div>
                    <Title level={5}>Select elements that compose this product</Title>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select elements"
                        value={selectedElements}
                        onChange={setSelectedElements}
                        loading={elementsLoading}
                        options={elements.map((el) => ({
                            value: el.id,
                            label: `${el.name} (${el.identifier})`,
                        }))}
                    />
                    <div style={{ marginTop: 16, color: '#666' }}>Elements can be shared across multiple products</div>
                </div>
            ),
        },
        {
            key: 'regions',
            label: 'Regions',
            children: (
                <div>
                    <Title level={5}>Select regions where this product is valid</Title>
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
                    <div style={{ marginTop: 16, color: '#666' }}>Leave empty to make product valid in all regions</div>
                </div>
            ),
        },
    ];

    return (
        <Modal
            open={open}
            title={`Manage Relations: ${product.name}`}
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
