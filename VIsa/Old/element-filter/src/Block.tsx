import { useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { Card } from 'antd';
import { type FC, useEffect, useState } from 'react';

import { getElementInstance, getElementRegionProducts } from './api';
import { AdminAccordion } from './components/AdminAccordion';
import { FilterUI } from './components/FilterUI';
import { broadcastRegionsProducts } from './shared-data';

type Settings = {
    element_name?: string;
    identifier?: string;
    description?: string;
    regions?: Array<{ id: string; name: string }>;
    products?: Array<{ id: string; name: string; category: string }>;
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const isEditing = useEditorState(appBridge);
    const [blockId, setBlockId] = useState<string | null>(null);
    const [pageUrl, setPageUrl] = useState<string>('');
    const [selectedRegions, setSelectedRegions] = useState<Array<{ id: string; name: string }>>([]);
    const [selectedProducts, setSelectedProducts] = useState<Array<{ id: string; name: string; category: string }>>([]);

    useEffect(() => {
        // Get block ID (can be number or string)
        const id = appBridge.context('blockId').get();
        setBlockId(id ? String(id) : null);

        // Get current page URL
        const url = window.location.href;
        setPageUrl(url);
    }, [appBridge]);

    // Load and filter selected regions/products for view mode
    useEffect(() => {
        const loadSelected = async () => {
            if (!isEditing && blockId && blockSettings.regions && blockSettings.products) {
                try {
                    // Get the element instance to find selected region/product pairs
                    const elementInstance = await getElementInstance(blockId);
                    if (elementInstance) {
                        const regionProducts = await getElementRegionProducts(elementInstance.id);

                        // Extract unique selected region and product IDs
                        const selectedRegionIds = new Set(regionProducts.map((rp) => rp.region_id));
                        const selectedProductIds = new Set(regionProducts.map((rp) => rp.product_id));

                        // Filter to only selected regions and products
                        const filteredRegions = blockSettings.regions.filter((r) => selectedRegionIds.has(r.id));
                        const filteredProducts = blockSettings.products.filter((p) => selectedProductIds.has(p.id));

                        setSelectedRegions(filteredRegions);
                        setSelectedProducts(filteredProducts);

                        // Broadcast only selected regions/products to other blocks
                        if (filteredRegions.length > 0 && filteredProducts.length > 0) {
                            broadcastRegionsProducts(filteredRegions, filteredProducts);
                        }
                    } else {
                        // No element instance, use all available (fallback)
                        setSelectedRegions(blockSettings.regions);
                        setSelectedProducts(blockSettings.products);
                    }
                } catch (error) {
                    console.error('Error loading selected regions/products:', error);
                    // On error, use all available (fallback)
                    setSelectedRegions(blockSettings.regions);
                    setSelectedProducts(blockSettings.products);
                }
            } else {
                // In edit mode or no data, clear selected
                setSelectedRegions([]);
                setSelectedProducts([]);
            }
        };

        loadSelected().catch((error) => {
            console.error('Error in loadSelected:', error);
        });
    }, [isEditing, blockId, blockSettings.regions, blockSettings.products]);

    const handleSave = async (
        name: string,
        identifier: string,
        description: string,
        allRegions: Array<{ id: string; name: string }>,
        allProducts: Array<{ id: string; name: string; category: string }>,
        selectedRegionProductPairs: Array<{ regionId: string; productId: string }>,
    ) => {
        try {
            await setBlockSettings({
                element_name: name,
                identifier,
                description,
                regions: allRegions,
                products: allProducts,
            });

            // Extract only the selected regions and products (unique sets)
            const selectedRegionIds = new Set(selectedRegionProductPairs.map((p) => p.regionId));
            const selectedProductIds = new Set(selectedRegionProductPairs.map((p) => p.productId));

            const selectedRegions = allRegions.filter((r) => selectedRegionIds.has(r.id));
            const selectedProducts = allProducts.filter((p) => selectedProductIds.has(p.id));

            // Broadcast only the selected regions/products to other blocks
            broadcastRegionsProducts(selectedRegions, selectedProducts);
        } catch (error) {
            console.error('Error saving block settings:', error);
        }
    };

    // Render admin accordion in edit mode
    if (isEditing && blockId) {
        return (
            <Card title="Element Configuration" style={{ width: '100%' }}>
                <AdminAccordion
                    blockId={blockId}
                    pageUrl={pageUrl}
                    elementName={blockSettings.element_name || ''}
                    identifier={blockSettings.identifier || ''}
                    description={blockSettings.description || ''}
                    onSave={handleSave}
                />
            </Card>
        );
    }

    // Render filter UI in view mode (use only selected regions/products, no API calls)
    return <FilterUI regions={selectedRegions} products={selectedProducts} />;
};
