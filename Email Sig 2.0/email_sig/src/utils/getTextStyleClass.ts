import type { CSSProperties } from 'react';
import { TextInput } from '../types';

export const getTextInputStyles = (
    input: TextInput
): {
    className: string;
    style: CSSProperties;
} => {
    const style: CSSProperties = {};

    if (input.bold?.value) {
        style.fontWeight = 'bold';
    }

    if (input.italic?.value) {
        style.fontStyle = 'italic';
    }

    if (input.underline?.value) {
        style.textDecoration = 'underline';
    }

    if (typeof input.typeface?.value === 'string') {
        style.fontFamily = input.typeface.value;
    }

    if (typeof input.fontSize?.value === 'number') {
        style.fontSize = `${input.fontSize.value}pt`;
    }

    if (typeof input.lineHeight === 'number') {
        style.lineHeight = input.lineHeight;
    }

    if (input.color?.value) {
        const { red, green, blue, alpha = 1 } = input.color.value;
        const rgba = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        style.color = rgba;
        style.textDecorationColor = rgba;
    }

    return {
        className: '', // no classes anymore
        style,
    };
};
