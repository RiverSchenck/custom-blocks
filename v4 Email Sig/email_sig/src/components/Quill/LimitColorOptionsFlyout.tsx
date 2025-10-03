/* (c) Copyright Frontify Ltd., all rights reserved. */

import React, { useEffect, useState } from 'react';
import { Color, Palette } from '@frontify/fondue';
import { ColorPickerFlyout } from '../../custom/components/ColorInputFlyout';
import { ColorPalette } from '@frontify/app-bridge';
import { mapAppBridgeColorPalettesToFonduePalettes } from '../helpers';
import { ColorInput, InputItem } from '../../types';

type ColorPickerFlyoutProps = {
    currentColor?: Color | null;
    appBridgeColorPalettes: ColorPalette[];
    input: InputItem;
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
};

export const LimitColorOptionsFlyout = ({
    input,
    inputs,
    setInputs,
    appBridgeColorPalettes,
}: ColorPickerFlyoutProps) => {
    const [colorPickerPalettes, setColorPickerPalettes] = useState<Palette[]>([]);

    const specificInput = input as ColorInput;

    useEffect(() => {
        const palettes = mapAppBridgeColorPalettesToFonduePalettes(appBridgeColorPalettes);
        setColorPickerPalettes(palettes);
    }, [appBridgeColorPalettes]);

    const handleColorSelect = (selectedColor: Color) => {
        console.log('Selected Color:', selectedColor);
        setInputs(
            inputs.map((item) => {
                if (item.id === input.id) {
                    const specificItem = item as ColorInput; // Make sure ColorInput correctly reflects the expected properties
                    const currentColors = specificItem.approvedColors || [];
                    console.log('Current Approved Colors:', currentColors);

                    const colorIndex = currentColors.findIndex(
                        (color) =>
                            color.red === selectedColor.red &&
                            color.green === selectedColor.green &&
                            color.blue === selectedColor.blue &&
                            color.alpha === selectedColor.alpha
                    );
                    console.log('Color Index:', colorIndex);

                    const updatedColors =
                        colorIndex === -1
                            ? [...currentColors, selectedColor]
                            : currentColors.filter((_, index) => index !== colorIndex);
                    console.log('Updated Approved Colors:', updatedColors);

                    return {
                        ...item,
                        approvedColors: updatedColors,
                    };
                }
                return item;
            })
        );
    };

    return (
        <div data-test-id="color-picker-flyout" className="[&>div]:tw-h-full">
            <ColorPickerFlyout
                currentColors={specificInput.approvedColors || []}
                palettes={colorPickerPalettes}
                onSelect={(color) => handleColorSelect(color)}
            />
        </div>
    );
};

export default LimitColorOptionsFlyout;
