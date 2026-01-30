import { CloseOutlined, GlobalOutlined, PictureOutlined, PlusOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Button, Select, Spin } from 'antd';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';

import { getElementInstancesByFilter } from '../api';
import { type ElementInstance } from '../supabase';
import { type HighlightArea } from '../types';

type Region = { id: string; name: string };
type Product = { id: string; name: string; category: string };

const ELEMENT_FILTER_STORAGE_KEY = 'visa-element-filter';

type FilterStorageState = {
    regionId: string | null;
    productId: string | null;
    regionName: string | null;
    productName: string | null;
};

function readRegionFromStorage(regions: Region[]): string | null {
    if (regions.length === 0) {
        return null;
    }
    try {
        const raw = localStorage.getItem(ELEMENT_FILTER_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw) as FilterStorageState;
        const valid = parsed?.regionId && regions.some((r) => r.id === parsed.regionId);
        return valid ? parsed.regionId : null;
    } catch {
        return null;
    }
}

function writeElementFilterPrefill(regionId: string, productId: string, regions: Region[], products: Product[]): void {
    const region = regions.find((r) => r.id === regionId);
    const product = products.find((p) => p.id === productId);
    if (!region || !product) {
        return;
    }
    const state = {
        regionId,
        productId,
        regionName: region.name,
        productName: product.name,
    };
    localStorage.setItem(ELEMENT_FILTER_STORAGE_KEY, JSON.stringify(state));
}

type ImageAsset = { id: number; previewUrl: string; title: string };

const DEFAULT_HIGHLIGHT: HighlightArea = { x: 35, y: 35, width: 20, height: 20 };

export type ProductFilterUIProps = {
    regions: Region[];
    products: Product[];
    isEdit: boolean;
    savedProductId: string | null;
    onProductChange?: (productId: string | null) => void;
    imageAssets?: ImageAsset[] | null;
    onOpenAssetChooser?: () => void;
    highlightAreas?: Record<string, HighlightArea>;
    onHighlightAreasChange?: (next: Record<string, HighlightArea>) => void;
};

export const ProductFilterUI: FC<ProductFilterUIProps> = ({
    regions,
    products,
    isEdit,
    savedProductId,
    onProductChange,
    imageAssets = null,
    onOpenAssetChooser,
    highlightAreas = {},
    onHighlightAreasChange,
}) => {
    const [regionId, setRegionId] = useState<string | null>(null);
    const [productId, setProductId] = useState<string | null>(savedProductId);
    const [elements, setElements] = useState<ElementInstance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
    const [dragging, setDragging] = useState<{
        elementId: string;
        startX: number;
        startY: number;
        areaX: number;
        areaY: number;
    } | null>(null);
    const imageContainerRef = useRef<HTMLDivElement | null>(null);

    const effectiveRegionId = regionId;
    const effectiveProductId = isEdit ? productId : savedProductId;

    const fetchElements = useCallback(async (rId: string | null, pId: string | null) => {
        if (!rId || !pId) {
            setElements([]);
            setError(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getElementInstancesByFilter(rId, pId);
            setElements(data);
        } catch (error_) {
            console.error('Error fetching elements:', error_);
            setError('Failed to load elements.');
            setElements([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isEdit) {
            setProductId(savedProductId);
        }
    }, [isEdit, savedProductId]);

    useEffect(() => {
        if (regions.length === 0) {
            return;
        }
        const fromStorage = readRegionFromStorage(regions);
        setRegionId(fromStorage ?? regions[0].id);
    }, [regions]);

    useEffect(() => {
        fetchElements(effectiveRegionId, effectiveProductId).catch((error_) => {
            console.error('Error fetching elements:', error_);
        });
    }, [effectiveRegionId, effectiveProductId, fetchElements]);

    const handleRegionChange = (value: string) => {
        setRegionId(value);
    };

    const handleProductChange = (value: string) => {
        setProductId(value);
        onProductChange?.(value);
    };

    const handleElementLinkClick = useCallback(() => {
        if (!effectiveRegionId || !effectiveProductId) {
            return;
        }
        writeElementFilterPrefill(effectiveRegionId, effectiveProductId, regions, products);
        // Allow default navigation to element page
    }, [effectiveRegionId, effectiveProductId, regions, products]);

    const addHighlight = useCallback(
        (elementId: string) => {
            if (highlightAreas[elementId]) {
                return;
            }
            const next = { ...highlightAreas, [elementId]: { ...DEFAULT_HIGHLIGHT } };
            onHighlightAreasChange?.(next);
        },
        [highlightAreas, onHighlightAreasChange],
    );

    const removeHighlight = useCallback(
        (elementId: string) => {
            const { [elementId]: _, ...rest } = highlightAreas;
            onHighlightAreasChange?.(rest);
        },
        [highlightAreas, onHighlightAreasChange],
    );

    const handleAreaMouseDown = useCallback(
        (e: React.MouseEvent, elementId: string) => {
            if (!isEdit || !highlightAreas[elementId]) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            const a = highlightAreas[elementId];
            setDragging({ elementId, startX: e.clientX, startY: e.clientY, areaX: a.x, areaY: a.y });
        },
        [isEdit, highlightAreas],
    );

    const updateAreaPosition = useCallback(
        (elementId: string, x: number, y: number) => {
            const a = highlightAreas[elementId];
            if (!a) {
                return;
            }
            const nx = Math.max(0, Math.min(100 - a.width, x));
            const ny = Math.max(0, Math.min(100 - a.height, y));
            const next = { ...highlightAreas, [elementId]: { ...a, x: nx, y: ny } };
            onHighlightAreasChange?.(next);
        },
        [highlightAreas, onHighlightAreasChange],
    );

    useEffect(() => {
        if (!dragging) {
            return;
        }
        const onMove = (e: MouseEvent) => {
            const rect = imageContainerRef.current?.getBoundingClientRect();
            if (!rect) {
                return;
            }
            const dx = ((e.clientX - dragging.startX) / rect.width) * 100;
            const dy = ((e.clientY - dragging.startY) / rect.height) * 100;
            updateAreaPosition(dragging.elementId, dragging.areaX + dx, dragging.areaY + dy);
        };
        const onUp = () => setDragging(null);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [dragging, updateAreaPosition]);

    if (isEdit && (regions.length === 0 || products.length === 0)) {
        return (
            <div className="tw-text-center tw-py-8 tw-text-gray-500">
                <p>No filter options available</p>
            </div>
        );
    }

    const showProductSelector = isEdit && products.length > 0;

    return (
        <div className="tw-w-full tw-py-2">
            <div className="tw-flex tw-items-center tw-gap-4 tw-mb-4">
                <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1">
                    <div className="tw-flex tw-items-center tw-justify-center tw-w-11 tw-h-11 tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-lg tw-shrink-0 tw-transition-colors hover:tw-bg-gray-100">
                        <GlobalOutlined className="tw-text-gray-600 tw-text-lg" />
                    </div>
                    <Select
                        value={regionId ?? undefined}
                        onChange={handleRegionChange}
                        placeholder="Select Region"
                        className="tw-flex-1"
                        size="large"
                        options={regions.map((r) => ({ label: r.name, value: r.id }))}
                        style={{ width: '100%' }}
                    />
                </div>
                {showProductSelector && (
                    <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1">
                        <div className="tw-flex tw-items-center tw-justify-center tw-w-11 tw-h-11 tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-lg tw-shrink-0 tw-transition-colors hover:tw-bg-gray-100">
                            <ShoppingOutlined className="tw-text-gray-600 tw-text-lg" />
                        </div>
                        <Select
                            value={productId ?? undefined}
                            onChange={handleProductChange}
                            placeholder="Select Product"
                            className="tw-flex-1"
                            size="large"
                            options={products.map((p) => ({ label: p.name, value: p.id }))}
                            style={{ width: '100%' }}
                        />
                    </div>
                )}
            </div>

            {isEdit && onOpenAssetChooser && (
                <div className="tw-mb-4">
                    <Button
                        type="default"
                        icon={<PictureOutlined />}
                        onClick={onOpenAssetChooser}
                        className="tw-w-full sm:tw-w-auto"
                    >
                        {imageAssets?.length ? 'Change image' : 'Select image'}
                    </Button>
                </div>
            )}

            <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-6 tw-items-start">
                <div className="tw-flex-1 tw-min-w-0 tw-w-full">
                    {!effectiveRegionId || !effectiveProductId ? (
                        isEdit ? (
                            <div className="tw-text-center tw-py-6 tw-text-gray-500">
                                <p>Select a region and product to view elements.</p>
                            </div>
                        ) : (
                            <div className="tw-text-center tw-py-6 tw-text-gray-500">
                                <p>Select a region to view elements.</p>
                            </div>
                        )
                    ) : loading ? (
                        <div className="tw-flex tw-justify-center tw-py-8">
                            <Spin />
                        </div>
                    ) : error ? (
                        <div className="tw-text-center tw-py-6 tw-text-red-600">
                            <p>{error}</p>
                        </div>
                    ) : elements.length === 0 ? (
                        <div className="tw-text-center tw-py-6 tw-text-gray-500">
                            <p>No elements match this region and product.</p>
                        </div>
                    ) : (
                        <ul className="tw-list-none tw-pl-0 tw-m-0 tw-space-y-2">
                            {elements.map((el, index) => (
                                <li
                                    key={el.id}
                                    className="tw-flex tw-items-center tw-gap-3 tw-py-2 tw-px-3 tw-rounded-lg tw-transition-colors hover:tw-bg-gray-50"
                                    onMouseEnter={!isEdit ? () => setHoveredElementId(el.id) : undefined}
                                    onMouseLeave={!isEdit ? () => setHoveredElementId(null) : undefined}
                                >
                                    <span
                                        className="tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-medium tw-shrink-0"
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '50%',
                                            backgroundColor: '#e5e7eb',
                                            color: '#374151',
                                        }}
                                        aria-hidden
                                    >
                                        {index + 1}
                                    </span>
                                    <a
                                        href={el.page_url}
                                        className="tw-text-blue-600 tw-underline hover:tw-text-blue-800 tw-flex-1 tw-min-w-0 tw-truncate"
                                        title={el.identifier || undefined}
                                        onClick={handleElementLinkClick}
                                    >
                                        {el.element_name}
                                    </a>
                                    {isEdit && onHighlightAreasChange && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addHighlight(el.id);
                                            }}
                                            disabled={!!highlightAreas[el.id]}
                                            className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded tw-border tw-border-transparent tw-transition-colors hover:tw-bg-gray-200 disabled:tw-opacity-40 disabled:tw-cursor-not-allowed"
                                            title={highlightAreas[el.id] ? 'Highlight added' : 'Add highlight on image'}
                                            aria-label={
                                                highlightAreas[el.id] ? 'Highlight added' : 'Add highlight on image'
                                            }
                                        >
                                            <PlusOutlined className="tw-text-gray-600" />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {imageAssets?.length ? (
                    <div className="tw-shrink-0 tw-w-full lg:tw-w-auto lg:tw-max-w-sm">
                        {imageAssets.map((asset, assetIndex) => (
                            <div key={asset.id}>
                                <div
                                    ref={assetIndex === 0 ? imageContainerRef : undefined}
                                    className="tw-relative tw-inline-block tw-max-w-full"
                                >
                                    <img
                                        src={asset.previewUrl}
                                        alt={asset.title || 'Asset'}
                                        className="tw-block tw-max-w-full tw-max-h-48 tw-object-contain tw-rounded-lg tw-border tw-border-gray-200"
                                        draggable={false}
                                    />
                                    {assetIndex === 0 && (
                                        <div
                                            className="tw-absolute tw-inset-0"
                                            style={{ pointerEvents: 'none' }}
                                            aria-hidden
                                        >
                                            {Object.entries(highlightAreas).map(([elementId, area]) => {
                                                const show =
                                                    isEdit ||
                                                    (hoveredElementId === elementId && !!highlightAreas[elementId]);
                                                if (!show) {
                                                    return null;
                                                }
                                                const isHover = !isEdit && hoveredElementId === elementId;
                                                const AreaWrapper = isEdit ? 'button' : 'div';
                                                return (
                                                    <AreaWrapper
                                                        key={elementId}
                                                        type={isEdit ? 'button' : undefined}
                                                        aria-label={isEdit ? 'Highlight area; drag to move' : undefined}
                                                        className="tw-absolute tw-transition-opacity tw-text-left"
                                                        style={{
                                                            left: `${area.x}%`,
                                                            top: `${area.y}%`,
                                                            width: `${area.width}%`,
                                                            height: `${area.height}%`,
                                                            border: `2px solid ${isHover ? '#2563eb' : 'rgba(0,0,0,0.4)'}`,
                                                            backgroundColor: isHover
                                                                ? 'rgba(37, 99, 235, 0.2)'
                                                                : 'rgba(0,0,0,0.1)',
                                                            borderRadius: 4,
                                                            pointerEvents: isEdit ? 'auto' : 'none',
                                                            ...(isEdit && {
                                                                padding: 0,
                                                                margin: 0,
                                                                cursor: 'move',
                                                            }),
                                                        }}
                                                        onMouseDown={
                                                            isEdit
                                                                ? (e) => {
                                                                      e.preventDefault();
                                                                      handleAreaMouseDown(e, elementId);
                                                                  }
                                                                : undefined
                                                        }
                                                    >
                                                        {isEdit && (
                                                            <button
                                                                type="button"
                                                                className="tw-absolute tw-top-1 tw-right-1 tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center tw-rounded tw-bg-red-500 tw-text-white tw-text-xs hover:tw-bg-red-600"
                                                                style={{ pointerEvents: 'auto' }}
                                                                onMouseDown={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    removeHighlight(elementId);
                                                                }}
                                                                aria-label="Remove highlight"
                                                            >
                                                                <CloseOutlined />
                                                            </button>
                                                        )}
                                                    </AreaWrapper>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                {asset.title ? (
                                    <p className="tw-text-sm tw-text-gray-600 tw-mt-1">{asset.title}</p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
