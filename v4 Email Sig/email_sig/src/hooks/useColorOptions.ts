// hooks/useColorOptions.js
import { useEffect, useState } from 'react';
import { AppBridgeBlock, useColorPalettes } from '@frontify/app-bridge';

const useColorOptions = (appBridge: AppBridgeBlock) => {
    const { colorPalettes } = useColorPalettes(appBridge);
    const [colorPickerPalettes, setColorPickerPalettes] = useState<string[]>([]);

    useEffect(() => {
        if (colorPalettes) {
            // Map each palette to its colors and format each color to an rgba string
            const paletteColors = colorPalettes.reduce<string[]>(
                (accumulator, palette) => [
                    ...accumulator,
                    ...palette.colors.map(
                        (color) => `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha || 1})`
                    ),
                ],
                []
            );
            setColorPickerPalettes(paletteColors);
            console.log(paletteColors); // Optional: log to verify
        }
    }, [colorPalettes]);

    return colorPickerPalettes;
};

export default useColorOptions;
