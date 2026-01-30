import { GlobalOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { Select, Spin, Card, Typography, Input, Checkbox, Collapse, Tag, Space, Empty } from 'antd';
import { type FC, useState, useEffect, useMemo } from 'react';

import { useElements } from './hooks/useElements';
import { useProducts } from './hooks/useProducts';
import { useRegions } from './hooks/useRegions';
import { useRules } from './hooks/useRules';
import { useRuleExceptions } from './hooks/useRuleExceptions';
import { setSharedRegion, subscribeToRegionChanges, getSharedRegion } from './lib/sharedState';
import { supabase } from './lib/supabase';
import { type Region, type Rule, type Element } from './lib/types';
import { type UseCase } from './settings';

const { Title } = Typography;

type Settings = {
    use_case: UseCase;
};

// Region Selector Component
const RegionSelector: FC = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('regions').select('*').order('name');

                if (error) {
                    throw error;
                }
                setRegions(data || []);
            } catch (error: unknown) {
                console.error('Failed to fetch regions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegions().catch((error) => {
            console.error('Failed to fetch regions:', error);
        });
    }, []);

    // Restore saved state or default to first region after regions are loaded
    useEffect(() => {
        if (regions.length > 0 && !selectedRegionId) {
            const savedState = getSharedRegion();

            if (savedState?.regionId) {
                // Verify the saved region still exists in the fetched regions
                const regionExists = regions.some((r) => r.id === savedState.regionId);
                if (regionExists) {
                    setSelectedRegionId(savedState.regionId);
                    return;
                } else {
                    // Clear invalid saved state
                    setSharedRegion(null, null);
                }
            }

            // If no saved state or invalid saved state, default to first region
            if (regions.length > 0) {
                const firstRegion = regions[0];
                setSelectedRegionId(firstRegion.id);
            }
        }
    }, [regions, selectedRegionId]);

    // Update shared state when selection changes
    useEffect(() => {
        if (selectedRegionId && regions.length > 0) {
            const region = regions.find((r) => r.id === selectedRegionId);
            if (region) {
                setSharedRegion(selectedRegionId, region.name);
            }
        }
    }, [selectedRegionId, regions]);

    const selectedRegion = regions.find((r) => r.id === selectedRegionId);

    return (
        <div className="tw-p-4">
            <Title level={5} className="tw-mb-4">
                Select a Region
            </Title>
            <Spin spinning={loading}>
                <Input.Group compact style={{ display: 'flex' }}>
                    <Input
                        prefix={<GlobalOutlined />}
                        style={{
                            width: '50px',
                            textAlign: 'center',
                            pointerEvents: 'none',
                            backgroundColor: '#fafafa',
                            borderRight: 'none',
                        }}
                        readOnly
                        size="large"
                    />
                    <Select
                        placeholder=""
                        value={selectedRegionId}
                        onChange={setSelectedRegionId}
                        style={{ flex: 1 }}
                        size="large"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={regions.map((region) => ({
                            value: region.id,
                            label: region.name,
                        }))}
                    />
                </Input.Group>
            </Spin>
            {selectedRegion && (
                <Card className="tw-mt-4" size="small">
                    <p className="tw-m-0">
                        <span className="tw-font-medium">Selected:</span> {selectedRegion.name}
                    </p>
                </Card>
            )}
        </div>
    );
};

// Product Board Component - listens to region changes
const ProductBoard: FC = () => {
    const [selectedRegion, setSelectedRegion] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        // Subscribe to region changes
        const unsubscribe = subscribeToRegionChanges((state) => {
            if (state?.regionId && state?.regionName) {
                setSelectedRegion({ id: state.regionId, name: state.regionName });
            } else {
                setSelectedRegion(null);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <div className="tw-p-4">
            <Title level={5} className="tw-mb-4">
                Product Board
            </Title>
            {selectedRegion ? (
                <Card>
                    <p>
                        Showing products for region: <strong>{selectedRegion.name}</strong>
                    </p>
                    <p className="tw-text-sm tw-text-gray-500">Product board content will go here...</p>
                </Card>
            ) : (
                <Card>
                    <p className="tw-text-gray-500">Please select a region to view products.</p>
                </Card>
            )}
        </div>
    );
};

// Rule Viewer Component - listens to region changes
const RuleViewer: FC<{ appBridge: BlockProps['appBridge'] }> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(undefined);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);

    const { regions } = useRegions();
    const { products, loading: productsLoading } = useProducts();
    const { elements, loading: elementsLoading } = useElements();
    const { rules, loading: rulesLoading } = useRules();

    // Also listen to shared region state (from Region Selector block)
    useEffect(() => {
        const unsubscribe = subscribeToRegionChanges((state) => {
            if (state?.regionId) {
                setSelectedRegionId(state.regionId);
            }
        });

        // Also check for saved region on mount
        const savedState = getSharedRegion();
        if (savedState?.regionId) {
            setSelectedRegionId(savedState.regionId);
        }

        return unsubscribe;
    }, []);


    // Fetch product-element relationships
    const [productElementMap, setProductElementMap] = useState<Record<string, string[]>>({});
    const [loadingRelations, setLoadingRelations] = useState(true);

    useEffect(() => {
        const fetchRelations = async () => {
            try {
                setLoadingRelations(true);
                const { data } = await supabase.from('product_elements').select('product_id, element_id');

                const map: Record<string, string[]> = {};
                (data || []).forEach((rel) => {
                    if (!map[rel.product_id]) {
                        map[rel.product_id] = [];
                    }
                    map[rel.product_id].push(rel.element_id);
                });

                setProductElementMap(map);
            } catch (error) {
                console.error('Failed to fetch product-element relationships:', error);
            } finally {
                setLoadingRelations(false);
            }
        };

        fetchRelations().catch(() => {});
    }, []);

    // Organize data: Product -> Elements -> Rules
    // Show all rules, organized by product if they're linked, or by element if not
    const productElementRules = useMemo(() => {
        if (!elements.length || !rules.length || loadingRelations) {
            return [];
        }

        const result: Array<{
            product?: { id: string; name: string };
            elements: Array<{ element: Element; rules: (Rule & { element?: Element })[] }>;
        }> = [];

        // Get all elements that have rules
        const elementsWithRules = elements
            .map((element) => {
                const elementRules = rules.filter((rule) => rule.element_id === element.id);
                return elementRules.length > 0 ? { element, rules: elementRules } : null;
            })
            .filter((pe): pe is { element: Element; rules: (Rule & { element?: Element })[] } => pe !== null);

        if (elementsWithRules.length === 0) {
            return [];
        }

        // Filter products if any are selected
        const productsToShow =
            selectedProductIds.length > 0
                ? products.filter((p) => selectedProductIds.includes(p.id))
                : products;

        // Group elements by product
        const productGroups = new Map<string, typeof elementsWithRules>();

        productsToShow.forEach((product) => {
            const elementIds = productElementMap[product.id] || [];
            const productElements = elementsWithRules.filter((ewr) => elementIds.includes(ewr.element.id));

            if (productElements.length > 0) {
                productGroups.set(product.id, productElements);
                result.push({
                    product,
                    elements: productElements,
                });
            }
        });

        // Add unlinked elements (elements with rules that aren't in any product)
        const linkedElementIds = new Set(
            Array.from(productGroups.values())
                .flat()
                .map((ewr) => ewr.element.id),
        );
        const unlinkedElements = elementsWithRules.filter((ewr) => !linkedElementIds.has(ewr.element.id));

        if (unlinkedElements.length > 0) {
            result.push({
                elements: unlinkedElements,
            });
        }

        // If no products are selected and no products exist, just show all elements with rules
        if (result.length === 0 && elementsWithRules.length > 0) {
            result.push({
                elements: elementsWithRules,
            });
        }

        return result;
    }, [products, elements, rules, productElementMap, loadingRelations, selectedProductIds]);

    const handleRuleToggle = (ruleId: string, checked: boolean) => {
        if (checked) {
            setSelectedRuleIds([...selectedRuleIds, ruleId]);
        } else {
            setSelectedRuleIds(selectedRuleIds.filter((id) => id !== ruleId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allRuleIds = rules.map((r) => r.id);
            setSelectedRuleIds(allRuleIds);
        } else {
            setSelectedRuleIds([]);
        }
    };


    const loading = productsLoading || elementsLoading || rulesLoading || loadingRelations;

    const selectedRegion = regions.find((r) => r.id === selectedRegionId);

    // Helper function to determine if an exception applies to the current region/product context
    const exceptionApplies = (
        exception: { regions?: string[]; products?: string[] },
        regionId?: string,
        productIds: string[] = [],
    ): boolean => {
        // If exception has no region/product restrictions, it applies to all
        const hasRegionRestriction = exception.regions && exception.regions.length > 0;
        const hasProductRestriction = exception.products && exception.products.length > 0;

        // If no restrictions, applies to all
        if (!hasRegionRestriction && !hasProductRestriction) {
            return true;
        }

        // Check region match
        if (hasRegionRestriction) {
            if (!regionId || !exception.regions?.includes(regionId)) {
                return false;
            }
        }

        // Check product match
        if (hasProductRestriction) {
            if (productIds.length === 0 || !productIds.some((pid) => exception.products?.includes(pid))) {
                return false;
            }
        }

        return true;
    };

    // Fetch all rule exceptions for consumer mode
    const [allExceptions, setAllExceptions] = useState<
        Map<string, Array<{ regions?: string[]; products?: string[]; name: string; description: string }>>
    >(new Map());
    const [exceptionsLoading, setExceptionsLoading] = useState(false);

    useEffect(() => {
        if (!isEditing && selectedRegionId && rules.length > 0) {
            const fetchAllExceptions = async () => {
                try {
                    setExceptionsLoading(true);
                    const { data } = await supabase.from('rule_exceptions').select('*').order('name');

                    const exceptionsMap = new Map<
                        string,
                        Array<{ regions?: string[]; products?: string[]; name: string; description: string }>
                    >();

                    await Promise.all(
                        (data || []).map(async (exception) => {
                            const [regionsResult, productsResult] = await Promise.all([
                                supabase
                                    .from('rule_exception_regions')
                                    .select('region_id')
                                    .eq('rule_exception_id', exception.id),
                                supabase
                                    .from('rule_exception_products')
                                    .select('product_id')
                                    .eq('rule_exception_id', exception.id),
                            ]);

                            const ruleId = exception.rule_id;
                            if (!exceptionsMap.has(ruleId)) {
                                exceptionsMap.set(ruleId, []);
                            }

                            exceptionsMap.get(ruleId)?.push({
                                regions: regionsResult.data?.map((r) => r.region_id) || [],
                                products: productsResult.data?.map((p) => p.product_id) || [],
                                name: exception.name,
                                description: exception.description || '',
                            });
                        }),
                    );

                    setAllExceptions(exceptionsMap);
                } catch (error) {
                    console.error('Failed to fetch exceptions:', error);
                } finally {
                    setExceptionsLoading(false);
                }
            };

            fetchAllExceptions().catch(() => {});
        } else {
            setAllExceptions(new Map());
            setExceptionsLoading(false);
        }
    }, [isEditing, selectedRegionId, rules.length]);

    // Consumer mode (view only) - show simple tags
    const applicableRules = useMemo(() => {
        if (isEditing || !selectedRegionId) {
            return [];
        }

        const applicable: Array<{
            rule: Rule & { element?: Element };
            exception?: { name: string; description: string };
        }> = [];

        rules.forEach((rule) => {
            const exceptions = allExceptions.get(rule.id) || [];
            const applicableException = exceptions.find((exc) =>
                exceptionApplies(exc, selectedRegionId, selectedProductIds),
            );

            if (applicableException) {
                applicable.push({
                    rule,
                    exception: {
                        name: applicableException.name,
                        description: applicableException.description,
                    },
                });
            } else {
                // Base rule applies
                applicable.push({ rule });
            }
        });

        return applicable;
    }, [rules, selectedRegionId, selectedProductIds, allExceptions, isEditing, exceptionApplies]);

    if (!isEditing) {
        if (!selectedRegionId) {
            return (
                <div className="tw-p-4">
                    <Empty description="Please select a region to view applicable rules." />
                </div>
            );
        }

        if (exceptionsLoading) {
            return (
                <div className="tw-p-4">
                    <Spin />
                </div>
            );
        }

        return (
            <div className="tw-p-4">
                <Space size={[16, 16]} direction="vertical" style={{ width: '100%' }}>
                    {applicableRules.map(({ rule, exception }) => {
                        const text = exception
                            ? exception.description || exception.name
                            : rule.description || '';
                        const ruleName = exception ? exception.name : rule.name;
                        return (
                            <div key={rule.id} className="tw-flex tw-flex-col tw-gap-2">
                                <Space size={8} wrap>
                                    <Tag
                                        color={exception ? 'orange' : 'blue'}
                                        style={{ fontSize: '14px', padding: '6px 12px' }}
                                    >
                                        <strong>{rule.identifier_code}</strong>
                                    </Tag>
                                    <Tag
                                        color={exception ? 'orange' : 'default'}
                                        style={{ fontSize: '14px', padding: '6px 12px' }}
                                    >
                                        {ruleName}
                                    </Tag>
                                </Space>
                                {text && (
                                    <Typography.Text className="tw-text-base tw-text-black tw-leading-relaxed">
                                        {text}
                                    </Typography.Text>
                                )}
                            </div>
                        );
                    })}
                </Space>
            </div>
        );
    }

    // Edit mode - full UI
    return (
        <div className="tw-p-4">
            <Title level={5} className="tw-mb-4">
                Rule Selector
            </Title>

            <Card className="tw-mb-4">
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {selectedRegion && (
                        <div>
                            <Typography.Text strong className="tw-mb-2 tw-block">
                                Active Region
                            </Typography.Text>
                            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                                <strong>{selectedRegion.name}</strong>
                            </Tag>
                            <Typography.Text type="secondary" className="tw-ml-2 tw-text-xs">
                                (Selected from Region Selector block)
                            </Typography.Text>
                        </div>
                    )}

                    <div>
                        <Typography.Text strong className="tw-mb-2 tw-block">
                            Filter by Products (Optional - leave empty to show all)
                        </Typography.Text>
                        <Select
                            mode="multiple"
                            placeholder="Select products to filter (optional)"
                            value={selectedProductIds}
                            onChange={setSelectedProductIds}
                            style={{ width: '100%' }}
                            size="large"
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={products.map((product) => ({
                                value: product.id,
                                label: product.name,
                            }))}
                            loading={productsLoading}
                        />
                        {selectedProductIds.length > 0 && (
                            <div className="tw-mt-2">
                                <Tag color="green">
                                    {selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''}{' '}
                                    selected
                                </Tag>
                            </div>
                        )}
                    </div>
                </Space>
            </Card>

            <Spin spinning={loading}>
                <Card>
                    {isEditing && (
                        <div className="tw-mb-4 tw-flex tw-items-center tw-justify-between">
                            <Space>
                                <Checkbox
                                    checked={selectedRuleIds.length === rules.length && rules.length > 0}
                                    indeterminate={
                                        selectedRuleIds.length > 0 && selectedRuleIds.length < rules.length
                                    }
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                >
                                    Select All Rules ({selectedRuleIds.length}/{rules.length})
                                </Checkbox>
                            </Space>
                            {selectedRuleIds.length > 0 && (
                                <Tag color="success" style={{ fontSize: '12px' }}>
                                    {selectedRuleIds.length} rule{selectedRuleIds.length > 1 ? 's' : ''} selected
                                </Tag>
                            )}
                        </div>
                    )}

                    {productElementRules.filter((per) => per.elements.length > 0).length === 0 ? (
                        <Empty
                            description={
                                !isEditing && !selectedRegionId
                                    ? 'Please select a region to view applicable rules.'
                                    : 'No rules found for the selected products and elements.'
                            }
                        />
                    ) : (
                        <Collapse
                            ghost
                            items={productElementRules
                                .filter((per) => per.elements.length > 0)
                                .map((item, index) => {
                                    const { product, elements: productElements } = item;
                                    return {
                                        key: product?.id || `unlinked-${index}`,
                                        label: (
                                            <div className="tw-flex tw-items-center tw-gap-2">
                                                <strong>{product?.name || 'Unlinked Elements'}</strong>
                                                <Tag>{productElements.length} elements</Tag>
                                            </div>
                                        ),
                                        children: (
                                            <div className="tw-pl-4">
                                                {productElements.map(({ element, rules: elementRules }) => (
                                                    <Card
                                                        key={element.id}
                                                        size="small"
                                                        className="tw-mb-2"
                                                        title={
                                                            <div className="tw-flex tw-items-center tw-justify-between">
                                                                <Space>
                                                                    <InfoCircleOutlined />
                                                                    <strong>{element.name}</strong>
                                                                    <Tag color="green">{elementRules.length} rules</Tag>
                                                                </Space>
                                                                {isEditing && (
                                                                    <Checkbox
                                                                        checked={elementRules.every((r) =>
                                                                            selectedRuleIds.includes(r.id),
                                                                        )}
                                                                        indeterminate={
                                                                            elementRules.some((r) =>
                                                                                selectedRuleIds.includes(r.id),
                                                                            ) &&
                                                                            !elementRules.every((r) =>
                                                                                selectedRuleIds.includes(r.id),
                                                                            )
                                                                        }
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                const newIds = [
                                                                                    ...selectedRuleIds,
                                                                                    ...elementRules
                                                                                        .map((r) => r.id)
                                                                                        .filter((id) => !selectedRuleIds.includes(id)),
                                                                                ];
                                                                                setSelectedRuleIds(newIds);
                                                                            } else {
                                                                                setSelectedRuleIds(
                                                                                    selectedRuleIds.filter(
                                                                                        (id) => !elementRules.some((r) => r.id === id),
                                                                                    ),
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        Select All
                                                                    </Checkbox>
                                                                )}
                                                            </div>
                                                        }
                                                    >
                                                        <div className="tw-space-y-2">
                                                            {elementRules
                                                                .filter(() => {
                                                                    // In view mode, only show rules if we have a region context
                                                                    if (!isEditing) {
                                                                        return !!selectedRegionId;
                                                                    }
                                                                    return true;
                                                                })
                                                                .map((rule) => (
                                                                    <RuleItem
                                                                        key={rule.id}
                                                                        rule={rule}
                                                                        element={element}
                                                                        selected={selectedRuleIds.includes(rule.id)}
                                                                        onToggle={handleRuleToggle}
                                                                        isEdit={isEditing}
                                                                        regionId={selectedRegionId}
                                                                        productIds={selectedProductIds}
                                                                        exceptionApplies={exceptionApplies}
                                                                    />
                                                                ))}
                                                        </div>
                                                    </Card>
                                                ))}
                                            </div>
                                        ),
                                    };
                                })}
                            />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

// Rule Item Component with exceptions
const RuleItem: FC<{
    rule: Rule & { element?: Element };
    element: Element;
    selected: boolean;
    onToggle: (ruleId: string, checked: boolean) => void;
    isEdit: boolean;
    regionId?: string;
    productIds: string[];
    exceptionApplies: (
        exception: { regions?: string[]; products?: string[] },
        regionId?: string,
        productIds?: string[],
    ) => boolean;
}> = ({ rule, selected, onToggle, isEdit, regionId, productIds, exceptionApplies }) => {
    const { exceptions, loading: exceptionsLoading } = useRuleExceptions(rule.id);

    // In view mode, find the applicable exception (if any)
    const applicableException = useMemo(() => {
        if (isEdit || !regionId) {
            return null;
        }
        return exceptions.find((exc) => exceptionApplies(exc, regionId, productIds));
    }, [isEdit, regionId, productIds, exceptions, exceptionApplies]);

    // In view mode, only show this rule if there's an applicable exception or no exceptions exist
    if (!isEdit) {
        // If there's an applicable exception, show it instead of the base rule
        if (applicableException) {
            return (
                <Card size="small" className="tw-mb-2" style={{ backgroundColor: '#fff7e6', border: '2px solid #faad14' }}>
                    <div className="tw-flex tw-items-start tw-gap-2">
                        <div className="tw-flex-1">
                            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                <Tag color="orange" style={{ fontSize: '12px' }}>EXCEPTION APPLIES</Tag>
                                <strong>{applicableException.name}</strong>
                                <Tag color="blue">{rule.identifier_code}</Tag>
                            </div>
                            {applicableException.description && (
                                <p className="tw-text-sm tw-text-gray-700 tw-mb-2">{applicableException.description}</p>
                            )}
                            <div className="tw-text-xs tw-text-gray-500 tw-mt-2">
                                <div>Base Rule: {rule.name}</div>
                                {rule.description && <div className="tw-mt-1">{rule.description}</div>}
                            </div>
                        </div>
                    </div>
                </Card>
            );
        }

        // If no applicable exception and we have a region/product context, show the base rule
        if (regionId) {
            return (
                <Card size="small" className="tw-mb-2" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                    <div className="tw-flex tw-items-start tw-gap-2">
                        <div className="tw-flex-1">
                            <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                <Tag color="green" style={{ fontSize: '12px' }}>RULE APPLIES</Tag>
                                <strong>{rule.name}</strong>
                                <Tag color="blue">{rule.identifier_code}</Tag>
                            </div>
                            {rule.description && <p className="tw-text-sm tw-text-gray-700 tw-mb-2">{rule.description}</p>}
                            {exceptions.length > 0 && (
                                <div className="tw-text-xs tw-text-gray-500 tw-mt-2">
                                    {exceptions.length} exception{exceptions.length > 1 ? 's' : ''} exist but don't apply to
                                    this context
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            );
        }

        // No region selected, don't show in view mode
        return null;
    }

    // Edit mode - show checkbox and all exceptions
    return (
        <Card size="small" className="tw-mb-2" style={{ backgroundColor: selected ? '#f0f9ff' : 'transparent' }}>
            <div className="tw-flex tw-items-start tw-gap-2">
                <Checkbox
                    checked={selected}
                    onChange={(e) => onToggle(rule.id, e.target.checked)}
                    className="tw-mt-1"
                />
                <div className="tw-flex-1">
                    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                        <strong>{rule.name}</strong>
                        <Tag color="blue">{rule.identifier_code}</Tag>
                        {selected && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    </div>
                    {rule.description && <p className="tw-text-sm tw-text-gray-600 tw-mb-2">{rule.description}</p>}
                    {exceptionsLoading ? (
                        <Spin size="small" />
                    ) : exceptions.length > 0 ? (
                        <div className="tw-mt-2">
                            <div className="tw-text-xs tw-font-medium tw-text-gray-500 tw-mb-1">
                                Exceptions ({exceptions.length}):
                            </div>
                            <div className="tw-space-y-1">
                                {exceptions.map((exception) => (
                                    <Card key={exception.id} size="small" className="tw-bg-yellow-50">
                                        <div className="tw-flex tw-items-start tw-gap-2">
                                            <InfoCircleOutlined style={{ color: '#faad14' }} />
                                            <div className="tw-flex-1">
                                                <div className="tw-font-medium tw-text-sm">{exception.name}</div>
                                                {exception.description && (
                                                    <div className="tw-text-xs tw-text-gray-600">
                                                        {exception.description}
                                                    </div>
                                                )}
                                                <div className="tw-mt-1 tw-flex tw-gap-2 tw-flex-wrap">
                                                    {exception.regions && exception.regions.length > 0 && (
                                                        <Tag color="orange">
                                                            {exception.regions.length} region
                                                            {exception.regions.length > 1 ? 's' : ''}
                                                        </Tag>
                                                    )}
                                                    {exception.products && exception.products.length > 0 && (
                                                        <Tag color="purple">
                                                            {exception.products.length} product
                                                            {exception.products.length > 1 ? 's' : ''}
                                                        </Tag>
                                                    )}
                                                    {(!exception.regions || exception.regions.length === 0) &&
                                                        (!exception.products || exception.products.length === 0) && (
                                                            <Tag color="default">Applies to all</Tag>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </Card>
    );
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    const renderContent = () => {
        switch (blockSettings.use_case) {
            case 'region_selector':
                return <RegionSelector />;
            case 'product_board':
                return <ProductBoard />;
            case 'rule_viewer':
                return <RuleViewer appBridge={appBridge} />;
            default:
                return <div className="tw-p-4 tw-text-red-600">Unknown use case</div>;
        }
    };

    return <div className="tw-w-full">{renderContent()}</div>;
};
