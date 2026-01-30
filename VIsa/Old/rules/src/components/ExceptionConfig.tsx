import {
    Button,
    Card,
    Collapse,
    message,
    Select,
    Spin,
    Table,
    Tag,
    type CollapseProps,
    type TableColumnsType,
} from 'antd';
import { type FC, useEffect, useState } from 'react';

import { subscribeToRegionsProducts, type SharedRegionsProducts } from '../shared-data';
import { getDefaultRules, subscribeToRulesRegistry, type RuleInfo } from '../utils/ruleRegistry';

type ExceptionConfigProps = {
    id?: string;
    legacyId?: string;
    defaultRuleSectionId: string;
    selectedRegionProducts: Array<{ regionId: string; productId: string }>;
    onDefaultRuleSectionIdChange: (value: string) => void;
    onSelectedRegionProductsChange: (pairs: Array<{ regionId: string; productId: string }>) => void;
    onSave: (
        defaultRuleSectionId: string,
        selectedRegionProducts: Array<{ regionId: string; productId: string }>,
        allRegions: Array<{ id: string; name: string }>,
        allProducts: Array<{ id: string; name: string; category: string }>,
    ) => void;
};

type TableProduct = {
    id: string;
    name: string;
    category: string;
    key: string;
    isSelected: boolean;
};

export const ExceptionConfig: FC<ExceptionConfigProps> = ({
    id,
    legacyId,
    defaultRuleSectionId: initialDefaultRuleSectionId,
    selectedRegionProducts: initialSelectedRegionProducts,
    onDefaultRuleSectionIdChange,
    onSelectedRegionProductsChange,
    onSave,
}) => {
    const [regionsProducts, setRegionsProducts] = useState<SharedRegionsProducts | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
    const [defaultRuleSectionId, setDefaultRuleSectionId] = useState(initialDefaultRuleSectionId);
    const [availableRules, setAvailableRules] = useState<RuleInfo[]>([]);
    const [selectedRegionProducts, setSelectedRegionProducts] = useState<Set<string>>(
        new Set(initialSelectedRegionProducts.map((p) => `${p.regionId}:${p.productId}`)),
    );

    useEffect(() => {
        const cleanupRegions = subscribeToRegionsProducts((data: SharedRegionsProducts | null) => {
            setRegionsProducts(data);
            setLoading(false);
        });

        // Subscribe to rules registry to get available default rules
        const cleanupRules = subscribeToRulesRegistry((rules) => {
            const defaultRules = rules.filter((r) => r.ruleType === 'rule');
            setAvailableRules(defaultRules);
        });

        // Also get initial rules
        setAvailableRules(getDefaultRules());

        return () => {
            cleanupRegions();
            cleanupRules();
        };
    }, []);

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

    const handleSelectAll = (regionId: string) => {
        if (!regionsProducts) {
            return;
        }
        const newSelected = new Set(selectedRegionProducts);
        for (const product of regionsProducts.products) {
            newSelected.add(`${regionId}:${product.id}`);
        }
        setSelectedRegionProducts(newSelected);
        // Update parent
        const pairs: Array<{ regionId: string; productId: string }> = [];
        for (const key of newSelected) {
            const [rId, pId] = key.split(':');
            pairs.push({ regionId: rId, productId: pId });
        }
        onSelectedRegionProductsChange(pairs);
    };

    const handleDeselectAll = (regionId: string) => {
        if (!regionsProducts) {
            return;
        }
        const newSelected = new Set(selectedRegionProducts);
        for (const product of regionsProducts.products) {
            newSelected.delete(`${regionId}:${product.id}`);
        }
        setSelectedRegionProducts(newSelected);
        // Update parent
        const pairs: Array<{ regionId: string; productId: string }> = [];
        for (const key of newSelected) {
            const [rId, pId] = key.split(':');
            pairs.push({ regionId: rId, productId: pId });
        }
        onSelectedRegionProductsChange(pairs);
    };

    const handleSave = async () => {
        if (!defaultRuleSectionId.trim()) {
            await message.error('Please select a default rule');
            return;
        }

        if (!regionsProducts) {
            await message.error('Regions and products data not available');
            return;
        }

        setSaving(true);
        try {
            // Convert selected region/products to array
            const regionProductPairs: Array<{ regionId: string; productId: string }> = [];
            for (const key of selectedRegionProducts) {
                const [regionId, productId] = key.split(':');
                regionProductPairs.push({ regionId, productId });
            }

            const regionsForSettings = regionsProducts.regions.map((r: SharedRegionsProducts['regions'][0]) => ({
                id: r.id,
                name: r.name,
            }));
            const productsForSettings = regionsProducts.products.map((p: SharedRegionsProducts['products'][0]) => ({
                id: p.id,
                name: p.name,
                category: p.category,
            }));

            console.log('Saving exception with region/product pairs:', regionProductPairs);
            onSave(defaultRuleSectionId.trim(), regionProductPairs, regionsForSettings, productsForSettings);
            await message.success('Exception configuration saved successfully!');
        } catch (error) {
            console.error('Error saving exception configuration:', error);
            await message.error('Error saving exception configuration. Please check the console.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card title="Exception Configuration" style={{ width: '100%' }}>
                <div className="tw-flex tw-justify-center tw-items-center tw-py-8">
                    <Spin size="large" />
                    <p className="tw-ml-4 tw-text-gray-600">Loading regions and products data...</p>
                </div>
            </Card>
        );
    }

    if (!regionsProducts || regionsProducts.regions.length === 0 || regionsProducts.products.length === 0) {
        return (
            <Card title="Exception Configuration" style={{ width: '100%' }}>
                <div className="tw-p-4 tw-text-center tw-text-gray-500">
                    <p>
                        No regions or products available. Please ensure an element-filter block is configured on this
                        page.
                    </p>
                </div>
            </Card>
        );
    }

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

    const collapseItems: CollapseProps['items'] = regionsProducts.regions.map(
        (region: SharedRegionsProducts['regions'][0]) => {
            const regionProducts = regionsProducts.products.filter((p: SharedRegionsProducts['products'][0]) =>
                selectedRegionProducts.has(`${region.id}:${p.id}`),
            );

            const allSelected =
                regionsProducts.products.length > 0 &&
                regionsProducts.products.every((p: SharedRegionsProducts['products'][0]) =>
                    selectedRegionProducts.has(`${region.id}:${p.id}`),
                );

            // Prepare table data for this region
            const tableData: TableProduct[] = regionsProducts.products.map(
                (product: SharedRegionsProducts['products'][0]) => {
                    const key = `${region.id}:${product.id}`;
                    return {
                        ...product,
                        key,
                        isSelected: selectedRegionProducts.has(key),
                    };
                },
            );

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
            const handleTableSelectAll = (
                selected: boolean,
                selectedRows: TableProduct[],
                changeRows: TableProduct[],
            ) => {
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
                // Update parent with current selections
                const pairs: Array<{ regionId: string; productId: string }> = [];
                for (const key of newSelected) {
                    const [regionId, productId] = key.split(':');
                    pairs.push({ regionId, productId });
                }
                onSelectedRegionProductsChange(pairs);
            };

            const handleRowSelect = (record: TableProduct) => {
                toggleProduct(region.id, record.id);
                // Update parent with current selections
                const pairs: Array<{ regionId: string; productId: string }> = [];
                const updatedSelected = new Set(selectedRegionProducts);
                const key = `${region.id}:${record.id}`;
                if (updatedSelected.has(key)) {
                    updatedSelected.delete(key);
                } else {
                    updatedSelected.add(key);
                }
                for (const k of updatedSelected) {
                    const [regionId, productId] = k.split(':');
                    pairs.push({ regionId, productId });
                }
                onSelectedRegionProductsChange(pairs);
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
        },
    );

    const tagText = [id, legacyId].filter(Boolean).join(' | ');

    return (
        <Card title="Exception Configuration" style={{ width: '100%' }}>
            <div className="tw-space-y-4">
                {tagText && (
                    <div>
                        <p className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Rule Identifier</p>
                        <Tag color="blue" className="tw-text-sm">
                            {tagText}
                        </Tag>
                    </div>
                )}

                {selectedRegionProducts.size > 0 && regionsProducts && (
                    <div className="tw-p-3 tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-md">
                        <p className="tw-text-xs tw-font-medium tw-text-gray-700 tw-mb-2">
                            Saved Region/Product Combinations ({selectedRegionProducts.size}):
                        </p>
                        <div className="tw-flex tw-flex-wrap tw-gap-1 tw-max-h-32 tw-overflow-y-auto">
                            {Array.from(selectedRegionProducts).map((key) => {
                                const [regionId, productId] = key.split(':');
                                const region = regionsProducts.regions.find((r) => r.id === regionId);
                                const product = regionsProducts.products.find((p) => p.id === productId);
                                return (
                                    <Tag key={key} color="default">
                                        {region?.name || regionId} / {product?.name || productId}
                                    </Tag>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="default-rule-select"
                        className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1"
                    >
                        Default Rule *
                    </label>
                    <Select
                        id="default-rule-select"
                        value={defaultRuleSectionId || undefined}
                        onChange={(value) => {
                            setDefaultRuleSectionId(value);
                            onDefaultRuleSectionIdChange(value);
                        }}
                        placeholder="Select a default rule"
                        style={{ width: '100%' }}
                        options={availableRules.map((rule) => ({
                            label: `${rule.id} (Section: ${rule.sectionId})`,
                            value: rule.sectionId,
                        }))}
                        notFoundContent={
                            <div className="tw-p-4 tw-text-center tw-text-gray-500">
                                <p>No default rules found on this page.</p>
                                <p className="tw-text-xs tw-mt-1">
                                    Add a default rule block to this page to create an exception.
                                </p>
                            </div>
                        }
                    />
                    <p className="tw-text-xs tw-text-gray-500 tw-mt-1">
                        Select the default rule this exception overrides. When this exception matches, the default
                        section will be hidden and this exception section will be shown.
                    </p>
                </div>

                <div className="tw-space-y-2">
                    <h3 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                        Exception Region & Product Combinations
                    </h3>
                    <p className="tw-text-sm tw-text-gray-600">
                        Select which region/product combinations trigger this exception:
                    </p>

                    <Collapse items={collapseItems} activeKey={expandedRegions} onChange={handleAccordionChange} />
                </div>

                <div className="tw-flex tw-justify-end tw-gap-2 tw-pt-4">
                    <Button
                        type="primary"
                        onClick={handleSave}
                        loading={saving}
                        disabled={!defaultRuleSectionId.trim()}
                    >
                        Save Configuration
                    </Button>
                </div>
            </div>
        </Card>
    );
};
