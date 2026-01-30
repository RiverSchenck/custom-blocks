import { GlobalOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { type FC, useCallback, useEffect, useState } from 'react';

type FilterState = {
    regionId: string | null;
    productId: string | null;
    regionName: string | null;
    productName: string | null;
};

const STORAGE_KEY = 'visa-element-filter';

type FilterUIProps = {
    regions: Array<{ id: string; name: string }>;
    products: Array<{ id: string; name: string; category: string }>;
};

export const FilterUI: FC<FilterUIProps> = ({ regions: regionsProp, products: productsProp }) => {
    const [filterState, setFilterState] = useState<FilterState>({
        regionId: null,
        productId: null,
        regionName: null,
        productName: null,
    });

    const broadcastFilterChange = useCallback((state: FilterState) => {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

        // Broadcast custom event for same-page communication
        window.dispatchEvent(
            new CustomEvent('visa-filter-changed', {
                detail: state,
            }),
        );

        // Trigger storage event for cross-tab communication
        window.dispatchEvent(
            new StorageEvent('storage', {
                key: STORAGE_KEY,
                newValue: JSON.stringify(state),
            }),
        );
    }, []);

    // Note: We don't broadcast here because we need to broadcast only selected regions/products,
    // which is handled in Block.tsx after loading from the database

    useEffect(() => {
        if (regionsProp.length === 0 || productsProp.length === 0) {
            return;
        }

        // Load saved filter state from localStorage
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState) as FilterState;
                // Verify the saved IDs still exist
                const regionExists = regionsProp.some((r) => r.id === parsed.regionId);
                const productExists = productsProp.some((p) => p.id === parsed.productId);

                if (regionExists && productExists) {
                    setFilterState(parsed);
                } else {
                    // If saved IDs don't exist, default to first
                    const defaultState: FilterState = {
                        regionId: regionsProp[0].id,
                        productId: productsProp[0].id,
                        regionName: regionsProp[0].name,
                        productName: productsProp[0].name,
                    };
                    setFilterState(defaultState);
                    broadcastFilterChange(defaultState);
                }
            } catch (error) {
                console.error('Error parsing saved filter state:', error);
                // On error, default to first
                const defaultState: FilterState = {
                    regionId: regionsProp[0].id,
                    productId: productsProp[0].id,
                    regionName: regionsProp[0].name,
                    productName: productsProp[0].name,
                };
                setFilterState(defaultState);
                broadcastFilterChange(defaultState);
            }
        } else {
            // No saved state, default to first region and product
            const defaultState: FilterState = {
                regionId: regionsProp[0].id,
                productId: productsProp[0].id,
                regionName: regionsProp[0].name,
                productName: productsProp[0].name,
            };
            setFilterState(defaultState);
            broadcastFilterChange(defaultState);
        }
    }, [regionsProp, productsProp, broadcastFilterChange]);

    const handleRegionChange = (regionId: string) => {
        const region = regionsProp.find((r) => r.id === regionId);
        if (region) {
            const newState: FilterState = {
                ...filterState,
                regionId: region.id,
                regionName: region.name,
            };
            setFilterState(newState);
            broadcastFilterChange(newState);
        }
    };

    const handleProductChange = (productId: string) => {
        const product = productsProp.find((p) => p.id === productId);
        if (product) {
            const newState: FilterState = {
                ...filterState,
                productId: product.id,
                productName: product.name,
            };
            setFilterState(newState);
            broadcastFilterChange(newState);
        }
    };

    if (regionsProp.length === 0 || productsProp.length === 0) {
        return (
            <div className="tw-text-center tw-py-8 tw-text-gray-500">
                <p>No filter options available</p>
            </div>
        );
    }

    return (
        <div className="tw-w-full tw-py-2">
            <div className="tw-flex tw-items-center tw-gap-4">
                <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1">
                    <div className="tw-flex tw-items-center tw-justify-center tw-w-11 tw-h-11 tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-lg tw-shrink-0 tw-transition-colors hover:tw-bg-gray-100">
                        <GlobalOutlined className="tw-text-gray-600 tw-text-lg" />
                    </div>
                    <Select
                        value={filterState.regionId}
                        onChange={handleRegionChange}
                        placeholder="Select Region"
                        className="tw-flex-1"
                        size="large"
                        options={regionsProp.map((region) => ({
                            label: region.name,
                            value: region.id,
                        }))}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1">
                    <div className="tw-flex tw-items-center tw-justify-center tw-w-11 tw-h-11 tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-lg tw-shrink-0 tw-transition-colors hover:tw-bg-gray-100">
                        <ShoppingOutlined className="tw-text-gray-600 tw-text-lg" />
                    </div>
                    <Select
                        value={filterState.productId}
                        onChange={handleProductChange}
                        placeholder="Select Product"
                        className="tw-flex-1"
                        size="large"
                        options={productsProp.map((product) => ({
                            label: product.name,
                            value: product.id,
                        }))}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};
