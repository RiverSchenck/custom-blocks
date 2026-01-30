import { useBlockSettings, useEditorState, setAssetIdsByBlockAssetKey } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { type FC, useCallback, useEffect, useState } from 'react';

import { getAllRegions, getAllProducts } from './api';
import { ProductFilterUI } from './components';
import { type HighlightArea } from './types';

type Settings = {
    selected_product_id?: string | null;
    highlight_areas?: Record<string, HighlightArea>;
};

type Region = { id: string; name: string };
type Product = { id: string; name: string; category: string };

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const isEditing = useEditorState(appBridge);
    const [regions, setRegions] = useState<Region[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [blockAssets, setBlockAssets] = useState<Record<string, { id: number; previewUrl: string; title: string }[]>>(
        {},
    );

    const savedProductId = blockSettings.selected_product_id ?? null;
    const imageAssets = blockAssets.image ?? null;

    const fetchBlockAssets = useCallback(async () => {
        try {
            const assets = await appBridge.getBlockAssets();
            setBlockAssets(assets as Record<string, { id: number; previewUrl: string; title: string }[]>);
        } catch (error) {
            console.error('Error fetching block assets:', error);
        }
    }, [appBridge]);

    useEffect(() => {
        fetchBlockAssets().catch(() => {});
    }, [fetchBlockAssets]);

    useEffect(() => {
        const load = async () => {
            const [r, p] = await Promise.all([getAllRegions(), getAllProducts()]);
            setRegions(r as Region[]);
            setProducts(p as Product[]);
        };
        load().catch((error) => {
            console.error('Error loading regions/products:', error);
        });
    }, []);

    const handleProductChange = useCallback(
        (productId: string | null) => {
            setBlockSettings({
                selected_product_id: productId ?? undefined,
            }).catch((error) => {
                console.error('Error saving product block selection:', error);
            });
        },
        [setBlockSettings],
    );

    const highlightAreas = blockSettings.highlight_areas ?? {};
    const handleHighlightAreasChange = useCallback(
        (next: Record<string, HighlightArea>) => {
            setBlockSettings({ highlight_areas: next }).catch((error) => {
                console.error('Error saving highlight areas:', error);
            });
        },
        [setBlockSettings],
    );

    const onOpenAssetChooser = useCallback(() => {
        appBridge.openAssetChooser(
            (assets) => {
                if (assets.length === 0) {
                    return;
                }
                const assetId = assets[0].id;
                appBridge
                    .api(setAssetIdsByBlockAssetKey({ key: 'image', assetIds: [assetId] }))
                    .then(() => {
                        fetchBlockAssets().catch(() => {});
                    })
                    .catch((error) => {
                        console.error('Error saving block asset:', error);
                    });
                appBridge.closeAssetChooser();
            },
            {
                selectedValueId: imageAssets?.[0]?.id,
            },
        );
    }, [appBridge, imageAssets, fetchBlockAssets]);

    if (!isEditing) {
        if (!savedProductId) {
            return null;
        }
        return (
            <ProductFilterUI
                regions={regions}
                products={products}
                isEdit={false}
                savedProductId={savedProductId}
                imageAssets={imageAssets}
                highlightAreas={highlightAreas}
            />
        );
    }

    return (
        <ProductFilterUI
            regions={regions}
            products={products}
            isEdit
            savedProductId={savedProductId}
            onProductChange={handleProductChange}
            imageAssets={imageAssets}
            onOpenAssetChooser={onOpenAssetChooser}
            highlightAreas={highlightAreas}
            onHighlightAreasChange={handleHighlightAreasChange}
        />
    );
};
