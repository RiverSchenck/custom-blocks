/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement, useState } from 'react';

import { ColorPreview } from '@frontify/fondue';
import { type ColorPickerProps } from '@frontify/fondue';
import { ColorPicker } from './ColorPicker';
import { Flyout } from '@frontify/fondue';

import { type Color, ColorFormat } from '@frontify/fondue';

import { ColorInputTrigger } from '@frontify/fondue';

export type ColorPickerFlyoutProps = Pick<ColorPickerProps, 'palettes' | 'onSelect'> & {
    id?: string;
    disabled?: boolean;
    onClick?: () => void;
    onClose?: () => void;
    currentColors: Color[] | null;
    clearable?: boolean;
    onClear?: () => void;
    onDelete?: () => void;
};

export const ColorPickerFlyout = ({
    id,
    onClick,
    onClose,
    onSelect,
    currentColors,
    palettes,
    disabled = false,
    clearable = false,
    onClear,
    onDelete,
}: ColorPickerFlyoutProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const [currentFormat, setCurrentFormat] = useState(ColorFormat.Hex);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            onClose?.();
        }
        setOpen(isOpen);
    };

    const handleClick = () => {
        setOpen(false);
        onClick?.();
    };

    return (
        <Flyout
            hug={false}
            onConfirm={handleClick}
            isOpen={open}
            onCancel={() => handleOpenChange(false)}
            contentMinHeight={150}
            fixedHeader={
                <ColorPreview
                    color={
                        currentColors && currentColors.length > 0
                            ? currentColors[0]
                            : { red: 255, green: 255, blue: 255 }
                    }
                />
            }
            onOpenChange={handleOpenChange}
            isTriggerDisabled={disabled}
            trigger={
                <ColorInputTrigger
                    isOpen={open}
                    currentColor={null}
                    format={currentFormat}
                    disabled={disabled}
                    id={id}
                    clearable={clearable}
                    onClear={() => {
                        setOpen(false);
                        onClear && onClear();
                    }}
                    onDelete={
                        onDelete
                            ? () => {
                                  setOpen(false);
                                  onDelete && onDelete();
                              }
                            : undefined
                    }
                />
            }
        >
            <ColorPicker
                currentFormat={currentFormat}
                setFormat={setCurrentFormat}
                palettes={palettes}
                currentColors={currentColors || [{ red: 255, green: 255, blue: 255 }]}
                onSelect={onSelect}
            />
        </Flyout>
    );
};
ColorPickerFlyout.displayName = 'FondueColorPickerFlyout';
