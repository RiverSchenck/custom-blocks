import { Button, Collapse, Input, message, Spin, Table, Tag, type CollapseProps, type TableColumnsType } from 'antd';
import { type FC, useEffect, useState } from 'react';

import {
    createOrUpdateElementInstance,
    getAllProducts,
    getAllRegions,
    getElementInstance,
    getElementRegionProducts,
} from '../api';
import { type Product, type Region } from '../supabase';

const { TextArea } = Input;

type AdminAccordionProps = {
    blockId: string;
    pageUrl: string;
    elementName: string;
    identifier: string;
    description: string;
    onSave: (
        name: string,
        identifier: string,
        description: string,
        allRegions: Array<{ id: string; name: string }>,
        allProducts: Array<{ id: string; name: string; category: string }>,
        selectedRegionProductPairs: Array<{ regionId: string; productId: string }>,
    ) => void;
};

type TableProduct = Product & {
    key: string;
    isSelected: boolean;
};

export const AdminAccordion: FC<AdminAccordionProps> = ({
    blockId,
    pageUrl,
    elementName: initialElementName,
    identifier: initialIdentifier,
    description: initialDescription,
    onSave,
}) => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedRegions, setExpandedRegions] = useState<string[]>([]);

    // Form state
    const [elementName, setElementName] = useState(initialElementName);
    const [identifier, setIdentifier] = useState(initialIdentifier);
    const [description, setDescription] = useState(initialDescription);
    const [selectedRegionProducts, setSelectedRegionProducts] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const [regionsData, productsData] = await Promise.all([getAllRegions(), getAllProducts()]);
            setRegions(regionsData);
            setProducts(productsData);

            // Load existing element instance if it exists
            const existingInstance = await getElementInstance(blockId);
            if (existingInstance) {
                setElementName(existingInstance.element_name);
                setIdentifier(existingInstance.identifier);
                setDescription(existingInstance.description);

                // Load selected region/products
                const regionProducts = await getElementRegionProducts(existingInstance.id);
                const selected = new Set<string>();
                for (const rp of regionProducts) {
                    selected.add(`${rp.region_id}:${rp.product_id}`);
                }
                setSelectedRegionProducts(selected);
            }

            setLoading(false);
        };

        loadData().catch((error) => {
            console.error('Error loading data:', error);
        });
    }, [blockId]);

    const handleAccordionChange = (keys: string | string[]) => {
        setExpandedRegions(Array.isArray(keys) ? keys : [keys]);
    };

    const toggleProduct = (regionId: string, productId: string) => {
        const key = `${regionId}:${productId}`;
        const newSelected = new Set(selectedRegionProducts);
        if (newSelected.has(key)) {
            newSelected.delete(key);
        } else {
            newSelected.add(key);
        }
        setSelectedRegionProducts(newSelected);
    };

    const handleSave = async () => {
        if (!elementName.trim() || !identifier.trim()) {
            await message.error('Please fill in Element Name and Identifier');
            return;
        }

        setSaving(true);
        try {
            // Convert selected region/products to array
            const regionProductIds: Array<{ regionId: string; productId: string }> = [];
            for (const key of selectedRegionProducts) {
                const [regionId, productId] = key.split(':');
                regionProductIds.push({ regionId, productId });
            }

            await createOrUpdateElementInstance(
                blockId,
                pageUrl,
                elementName.trim(),
                identifier.trim(),
                description.trim(),
                regionProductIds,
            );

            // Prepare regions and products for block settings (with IDs and names)
            const regionsForSettings = regions.map((r) => ({ id: r.id, name: r.name }));
            const productsForSettings = products.map((p) => ({ id: p.id, name: p.name, category: p.category }));

            onSave(
                elementName.trim(),
                identifier.trim(),
                description.trim(),
                regionsForSettings,
                productsForSettings,
                regionProductIds,
            );
            await message.success('Element configuration saved successfully!');
        } catch (error) {
            console.error('Error saving element instance:', error);
            await message.error('Error saving element configuration. Please check the console.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="tw-flex tw-justify-center tw-items-center tw-py-8">
                <Spin size="large" />
            </div>
        );
    }

    const handleSelectAll = (regionId: string) => {
        const newSelected = new Set(selectedRegionProducts);
        for (const product of products) {
            newSelected.add(`${regionId}:${product.id}`);
        }
        setSelectedRegionProducts(newSelected);
    };

    const handleDeselectAll = (regionId: string) => {
        const newSelected = new Set(selectedRegionProducts);
        for (const product of products) {
            newSelected.delete(`${regionId}:${product.id}`);
        }
        setSelectedRegionProducts(newSelected);
    };

    const getCategoryColor = (category: string): string => {
        switch (category) {
            case 'Credit':
                return 'blue';
            case 'Debit':
                return 'green';
            case 'Prepaid':
                return 'purple';
            case 'Combination':
                return 'default';
            default:
                return 'default';
        }
    };

    const collapseItems: CollapseProps['items'] = regions.map((region) => {
        const regionProducts = products.filter((p) => selectedRegionProducts.has(`${region.id}:${p.id}`));

        const allSelected =
            products.length > 0 && products.every((p) => selectedRegionProducts.has(`${region.id}:${p.id}`));

        // Prepare table data for this region
        const tableData: TableProduct[] = products.map((product) => {
            const key = `${region.id}:${product.id}`;
            return {
                ...product,
                key,
                isSelected: selectedRegionProducts.has(key),
            };
        });

        // Define table columns
        const columns: TableColumnsType<TableProduct> = [
            {
                key: 'name',
                title: 'Product Name',
                dataIndex: 'name',
                sorter: (a: TableProduct, b: TableProduct) => a.name.localeCompare(b.name),
            },
            {
                key: 'category',
                title: 'Category',
                dataIndex: 'category',
                filters: [
                    { text: 'Credit', value: 'Credit' },
                    { text: 'Debit', value: 'Debit' },
                    { text: 'Prepaid', value: 'Prepaid' },
                    { text: 'Combination', value: 'Combination' },
                ],
                onFilter: (value, record: TableProduct) => record.category === value,
                sorter: (a: TableProduct, b: TableProduct) => a.category.localeCompare(b.category),
                render: (category: string) => <Tag color={getCategoryColor(category)}>{category}</Tag>,
            },
        ];

        // Handle row selection - works with filtered data
        const handleTableSelectAll = (selected: boolean, selectedRows: TableProduct[], changeRows: TableProduct[]) => {
            const newSelected = new Set(selectedRegionProducts);
            if (selected) {
                // Select all visible/filtered rows
                for (const row of selectedRows) {
                    newSelected.add(row.key);
                }
            } else {
                // Deselect all visible/filtered rows
                for (const row of changeRows) {
                    newSelected.delete(row.key);
                }
            }
            setSelectedRegionProducts(newSelected);
        };

        const handleRowSelect = (record: TableProduct) => {
            toggleProduct(region.id, record.id);
        };

        return {
            key: region.id,
            label: (
                <div className="tw-flex tw-items-center tw-justify-between tw-w-full">
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <span>{region.name}</span>
                        {regionProducts.length > 0 && (
                            <span className="tw-text-xs tw-bg-blue-100 tw-text-blue-800 tw-px-2 tw-py-1 tw-rounded-full">
                                {regionProducts.length} selected
                            </span>
                        )}
                    </div>
                    <div className="tw-flex tw-gap-2">
                        <Button
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAll(region.id);
                            }}
                            disabled={allSelected}
                        >
                            Select All
                        </Button>
                        <Button
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeselectAll(region.id);
                            }}
                            disabled={regionProducts.length === 0}
                        >
                            Deselect All
                        </Button>
                    </div>
                </div>
            ),
            children: (
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    size="small"
                    rowKey="key"
                    rowSelection={{
                        selectedRowKeys: tableData.filter((row) => row.isSelected).map((row) => row.key),
                        onSelectAll: handleTableSelectAll,
                        onSelect: handleRowSelect,
                    }}
                />
            ),
        };
    });

    return (
        <div className="tw-space-y-4">
            <div className="tw-space-y-4 tw-p-4 tw-bg-gray-50 tw-rounded-md">
                <div>
                    <label
                        htmlFor="element-name"
                        className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1"
                    >
                        Element Name *
                    </label>
                    <Input
                        id="element-name"
                        value={elementName}
                        onChange={(e) => setElementName(e.target.value)}
                        placeholder="e.g., CVV"
                    />
                </div>

                <div>
                    <label htmlFor="identifier" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">
                        Identifier *
                    </label>
                    <Input
                        id="identifier"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g., cvv-element"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1"
                    >
                        Description
                    </label>
                    <TextArea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Description of this element"
                    />
                </div>
            </div>

            <div className="tw-space-y-2">
                <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900">Applicable Regions & Products</h3>
                <p className="tw-text-sm tw-text-gray-600">
                    Select which regions and products this element applies to:
                </p>

                <Collapse items={collapseItems} activeKey={expandedRegions} onChange={handleAccordionChange} />
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-pt-4">
                <Button
                    type="primary"
                    onClick={handleSave}
                    loading={saving}
                    disabled={!elementName.trim() || !identifier.trim()}
                >
                    Save Configuration
                </Button>
            </div>
        </div>
    );
};
