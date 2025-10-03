/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useState } from 'react';

import { SegmentedControls } from '@frontify/fondue';

import { type Color, ColorFormat, type Palette } from '@frontify/fondue';

import { BrandColorPicker } from './BrandColorPicker';
import './ColorPicker.css';
import { CustomColorPicker } from '@frontify/fondue';

export type ColorPickerProps = {
    palettes?: Palette[];
    currentColors: Color[];
    currentFormat: ColorFormat;
    setFormat: (id: ColorFormat) => void;
    onSelect: (color: Color) => void;
    allowCustomColor?: boolean;
};

enum ColorType {
    Brand = 'Brand',
    Custom = 'Custom',
}

const colorTypes = [
    { id: ColorType.Brand, value: 'Brand' },
    { id: ColorType.Custom, value: 'Custom' },
];

export const ColorPicker = ({
    currentColors,
    palettes,
    onSelect,
    setFormat,
    currentFormat = ColorFormat.Hex,
    allowCustomColor = true,
}: ColorPickerProps) => {
    const [colorType, setColorType] = useState(ColorType.Brand);

    return (
        <div className="tw-w-[400px] tw-relative">
            <div className="tw-p-5 tw-flex tw-flex-col tw-gap-2">
                {palettes && allowCustomColor && (
                    <SegmentedControls
                        items={colorTypes}
                        activeItemId={colorType}
                        onChange={(type) => setColorType(type as ColorType)}
                    />
                )}
                {palettes && colorType === ColorType.Brand ? (
                    <BrandColorPicker
                        currentColor={currentColors[0]}
                        currentColors={currentColors}
                        palettes={palettes}
                        onSelect={onSelect}
                    />
                ) : (
                    <CustomColorPicker
                        currentColor={currentColors[0]}
                        currentFormat={currentFormat}
                        setFormat={setFormat}
                        onSelect={onSelect}
                    />
                )}
            </div>
        </div>
    );
};
ColorPicker.displayName = 'FondueColorPicker';
