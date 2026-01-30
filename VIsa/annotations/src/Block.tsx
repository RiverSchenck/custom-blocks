import { type Color, useBlockSettings, useEditorState, setAssetIdsByBlockAssetKey } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';

import { AnnotationsUI } from './components';
import { type Annotation } from './types';

type Settings = {
    annotations?: Annotation[];
    highlight_color?: Color | null;
    circle_color?: Color | null;
};

const DEFAULT_HIGHLIGHT = {
    border: '#2563eb',
    fill: 'rgba(37, 99, 235, 0.2)',
};

const DEFAULT_CIRCLE = {
    backgroundColor: '#e5e7eb',
    color: '#374151',
};

function toHighlightStyle(color: Color | null | undefined): {
    border: string;
    fill: string;
} {
    if (!color) {
        return DEFAULT_HIGHLIGHT;
    }
    const red = Number(color.red);
    const green = Number(color.green);
    const blue = Number(color.blue);
    return {
        border: `rgb(${red}, ${green}, ${blue})`,
        fill: `rgba(${red}, ${green}, ${blue}, 0.2)`,
    };
}

function isDark(r: number, g: number, b: number): boolean {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

function toCircleStyle(color: Color | null | undefined): {
    backgroundColor: string;
    color: string;
} {
    if (!color) {
        return DEFAULT_CIRCLE;
    }
    const red = Number(color.red);
    const green = Number(color.green);
    const blue = Number(color.blue);
    const backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    const textColor = isDark(red, green, blue) ? '#ffffff' : '#111827';
    return { backgroundColor, color: textColor };
}

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const isEditing = useEditorState(appBridge);
    const [blockAssets, setBlockAssets] = useState<Record<string, { id: number; previewUrl: string; title: string }[]>>(
        {},
    );

    const annotations = blockSettings.annotations ?? [];
    const imageAssets = blockAssets.image ?? null;
    const highlightStyle = useMemo(
        () => toHighlightStyle(blockSettings.highlight_color),
        [blockSettings.highlight_color],
    );
    const circleStyle = useMemo(() => toCircleStyle(blockSettings.circle_color), [blockSettings.circle_color]);

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

    const handleAnnotationsChange = useCallback(
        (next: Annotation[]) => {
            setBlockSettings({ annotations: next }).catch((error) => {
                console.error('Error saving annotations:', error);
            });
        },
        [setBlockSettings],
    );

    const setImageAssetIds = useCallback(
        (assetIds: number[]) => {
            appBridge
                .api(
                    setAssetIdsByBlockAssetKey({
                        key: 'image',
                        assetIds,
                    }),
                )
                .then(() => {
                    fetchBlockAssets().catch(() => {});
                })
                .catch((error) => {
                    console.error('Error saving block asset:', error);
                });
        },
        [appBridge, fetchBlockAssets],
    );

    const onAddImage = useCallback(() => {
        appBridge.openAssetChooser((assets) => {
            if (assets.length === 0) {
                return;
            }
            appBridge.closeAssetChooser();
            const currentIds = (imageAssets ?? []).map((a) => a.id);
            setImageAssetIds([...currentIds, assets[0].id]);
        }, {});
    }, [appBridge, imageAssets, setImageAssetIds]);

    const onRemoveImage = useCallback(
        (index: number) => {
            const current = imageAssets ?? [];
            const next = current.filter((_, i) => i !== index).map((a) => a.id);
            appBridge
                .api(
                    setAssetIdsByBlockAssetKey({
                        key: 'image',
                        assetIds: next,
                    }),
                )
                .then(() => fetchBlockAssets().catch(() => {}))
                .catch((error) => console.error('Error saving block asset:', error));
        },
        [appBridge, imageAssets, fetchBlockAssets],
    );

    const onChangeImage = useCallback(
        (index: number) => {
            const current = imageAssets ?? [];
            appBridge.openAssetChooser(
                (assets) => {
                    if (assets.length === 0) {
                        return;
                    }
                    appBridge.closeAssetChooser();
                    const next = [...current.map((a) => a.id)];
                    next[index] = assets[0].id;
                    setImageAssetIds(next);
                },
                { selectedValueId: current[index]?.id },
            );
        },
        [appBridge, imageAssets, setImageAssetIds],
    );

    return (
        <AnnotationsUI
            appBridge={appBridge}
            annotations={annotations}
            onAnnotationsChange={handleAnnotationsChange}
            imageAssets={imageAssets}
            onAddImage={isEditing ? onAddImage : undefined}
            onRemoveImage={isEditing ? onRemoveImage : undefined}
            onChangeImage={isEditing ? onChangeImage : undefined}
            isEdit={isEditing}
            highlightStyle={highlightStyle}
            circleStyle={circleStyle}
        />
    );
};
