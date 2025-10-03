/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SegmentedControl, TextInput } from '@frontify/fondue/components';
import { IconCheckMark, IconGridRegular, IconMagnifier, IconStackVertical } from '@frontify/fondue/icons';
import debounce from 'lodash/debounce';
import { useCallback, useState } from 'react';

import { isColorLight, fromGraphQLColorToCssColor, toRgbFunction } from './utilities/Color';
import { type Palette, type RgbaColorWithName } from './utilities/types';

type BrandColorView = 'grid' | 'list';

type BrandColorLimiterProps = {
    palettes?: Palette[];
    currentColors?: RgbaColorWithName[]; // Flat list of selected colors
    onColorChange?: (updatedPalettes: Palette[]) => void; // Structured return grouped by palette
};

export const BrandColorLimiter = ({
    palettes = [],
    currentColors = [],
    onColorChange = () => {},
    ...props
}: BrandColorLimiterProps) => {
    const [view, setView] = useState<BrandColorView>('grid');
    const [filteredPalettes, setFilteredPalettes] = useState(palettes);

    // Utility to compare two RGBA colors
    const isSameColor = (a: RgbaColorWithName, b: RgbaColorWithName) =>
        a.red === b.red && a.green === b.green && a.blue === b.blue && (a.alpha ?? 1) === (b.alpha ?? 1);

    const isColorSelected = (color: RgbaColorWithName) =>
        currentColors.some((selected) => isSameColor(selected, color));

    const handleQueryChange = useCallback(
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            const query = event.target.value.toLowerCase();
            setFilteredPalettes(
                palettes
                    .map((palette) => {
                        if (palette.title.toLowerCase().includes(query)) return palette;

                        const filteredColors = palette.colors.filter((color) =>
                            color.name?.toLowerCase().includes(query)
                        );

                        return { ...palette, colors: filteredColors };
                    })
                    .filter((palette) => palette.colors.length > 0)
            );
        }, 200),
        [palettes]
    );

    const handleToggle = (toggledColor: RgbaColorWithName) => {
        const isSelected = isColorSelected(toggledColor);

        const updatedFlat = isSelected
            ? currentColors.filter((c) => !isSameColor(c, toggledColor))
            : [...currentColors, toggledColor];

        // Reconstruct selected Palettes[]
        const updatedPalettes: Palette[] = palettes
            .map((palette) => {
                const filtered = palette.colors.filter((color) =>
                    updatedFlat.some((sel) => isSameColor(sel, color))
                );
                return { ...palette, colors: filtered };
            })
            .filter((p) => p.colors.length > 0);

        onColorChange(updatedPalettes);
    };

    return (
        <div
            className="tw-flex tw-flex-col tw-gap-4"
            data-picker-type="brand-color"
            data-test-id="brand-limiter-picker"
            {...props}
        >
            {/* Search + View toggle */}
            <div className="tw-flex tw-gap-2">
                <div className="tw-flex-1">
                    <TextInput.Root onChange={handleQueryChange}>
                        <TextInput.Slot name="left">
                            <IconMagnifier size={16} />
                        </TextInput.Slot>
                    </TextInput.Root>
                </div>
                <SegmentedControl.Root
                    defaultValue="grid"
                    onValueChange={(v) => setView(v as BrandColorView)}
                >
                    <SegmentedControl.Item value="grid" aria-label="Grid">
                        <IconGridRegular size={20} />
                    </SegmentedControl.Item>
                    <SegmentedControl.Item value="list" aria-label="List">
                        <IconStackVertical size={20} />
                    </SegmentedControl.Item>
                </SegmentedControl.Root>
            </div>

            {/* Color Palette List */}
            <ul
                className="tw-flex tw-flex-col tw-gap-4"
                data-layout={view}
                data-test-id="brand-color-limiter_palette-list"
            >
                {filteredPalettes.length > 0 ? (
                    filteredPalettes.map((palette) => (
                        <li key={palette.id} className="tw-flex tw-flex-col tw-gap-2">
                            <span className="tw-text-sm tw-font-medium tw-text-text">{palette.title}</span>
                            <ul
                                className="tw-grid tw-grid-cols-[repeat(auto-fill,1.5rem)] [[data-layout='list']_&]:tw-grid-cols-1 tw-gap-2"
                                data-test-id="brand-color-limiter_color-list"
                            >
                                {palette.colors.map((color, index) => (
                                    <li key={`${palette.id}-${color.name}-${index}`} data-test-id="brand-color">
                                        <button
                                            className="tw-flex tw-gap-4 tw-items-center"
                                            onClick={() => handleToggle(color)}
                                            type="button"
                                            aria-label={`Color value: ${color.name}`}
                                        >
                                            <span
                                                className="tw-flex tw-items-center tw-justify-center tw-w-6 tw-aspect-square tw-rounded tw-ring-1 tw-ring-line tw-ring-offset-1"
                                                style={{
                                                    background: toRgbFunction(
                                                        fromGraphQLColorToCssColor({
                                                            ...color,
                                                            alpha: color.alpha ?? 1,
                                                        })
                                                    ),
                                                    color: isColorLight(color)
                                                        ? 'var(--text-color)'
                                                        : 'var(--base-color)',
                                                }}
                                            >
                                                {isColorSelected(color) && <IconCheckMark size={20} />}
                                            </span>
                                            {view === 'list' && (
                                                <span className="tw-font-normal tw-text-text">
                                                    {color.name}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))
                ) : (
                    <li className="tw-text-sm tw-text-text">No colors available</li>
                )}
            </ul>
        </div>
    );
};

BrandColorLimiter.displayName = 'ColorChooser.Brand';
