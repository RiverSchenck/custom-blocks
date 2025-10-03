import { FC } from 'react';
import { Select, Flyout, Text, Divider, ColorPicker } from '@frontify/fondue/components';
import { IconTextFormatBold, IconTextFormatItalic, IconTextFormatUnderline } from '@frontify/fondue/icons';
import { BrandColorPicker, Card, Palette } from '@frontify/fondue';
import { SignatureInput, TextInput } from '../../../types';
import { SystemFonts } from '../../../utils/systemFontsList';
import { fontSizes } from '../../../utils/fontSizesList';
import { sanitizeColor } from '../../../utils/sanatizeColor';

interface TextToolbarProps {
    viewInput: TextInput;
    onChange: (input: SignatureInput, updatedPartial: Partial<SignatureInput>) => void;
    colorPalettes: Palette[];
}


export const TextToolbar: FC<TextToolbarProps> = ({ viewInput, onChange, colorPalettes }) => {

    if (
        viewInput.bold.locked &&
        viewInput.italic.locked &&
        viewInput.underline.locked &&
        viewInput.typeface.locked &&
        viewInput.fontSize.locked &&
        viewInput.color.locked
    ) {
        return null;
    }

    return (
        <div className="tw-flex tw-items-center tw-gap-1 tw-p-1">
            {/* Bold */}
            {!viewInput.bold.locked && (
                <div className={'tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center'}>
                    <Card
                        hoverable
                        aria-label="Bold"
                        onClick={() =>
                            onChange(viewInput, {
                                bold: {
                                    ...viewInput.bold,
                                    value: !viewInput.bold.value,
                                },
                            })
                        }
                    >
                        <div
                            className={`tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8`}
                        >
                            <IconTextFormatBold
                                size={16}
                                className={viewInput.bold.value ? 'tw-text-[#b39dfd]' : 'tw-text-base-strong'} 
                            />
                        </div>
                    </Card>
                </div>

             )}


            {/* Italic */}
            {!viewInput.italic.locked && (
                <div className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center">
                    <Card
                        hoverable
                        aria-label="Italic"
                        onClick={() =>
                            onChange(viewInput, {
                                italic: {
                                    ...viewInput.italic,
                                    value: !viewInput.italic.value,
                                },
                            })
                        }
                    >
                        <div className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8">
                            <IconTextFormatItalic 
                                size={16} 
                                className={viewInput.italic.value ? 'tw-text-[#b39dfd]' : 'tw-text-base-strong'} 
                            />
                        </div>
                    </Card>
                </div>
            )}

            {/* Underline */}
            {!viewInput.underline.locked && (
                <div className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center">
                    <Card
                        hoverable
                        aria-label="Underline"
                        onClick={() =>
                            onChange(viewInput, {
                                underline: {
                                    ...viewInput.underline,
                                    value: !viewInput.underline.value,
                                },
                            })
                        }
                    >
                        <div className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8">
                            <IconTextFormatUnderline 
                                size={16} 
                                className={viewInput.underline.value ? 'tw-text-[#b39dfd]' : 'tw-text-base-strong'} 
                            />
                        </div>
                    </Card>
                </div>
            )}

            {(
                (!viewInput.bold.locked || !viewInput.italic.locked || !viewInput.underline.locked) &&
                (!viewInput.typeface.locked || !viewInput.fontSize.locked || !viewInput.color.locked)
            ) && (
                <Divider direction="vertical" color="x-strong" className="tw-h-8 tw-mx-1 tw-flex-shrink-0" />
            )}

            {/* Typeface Selector */}
                {!viewInput.typeface.locked && (
                    <div className='tw-text-xxs tw-flex-shrink-0'>
                        <div className="tw-w-24 tw-min-w-0">
                        <Select
                            value={viewInput.typeface.value}
                            showStringValue={false}
                            onSelect={(value) => {
                                onChange(viewInput, {
                                    typeface: {
                                        ...viewInput.typeface,
                                        value: value || SystemFonts[0],
                                    },
                                });
                            }}
                        >
                            {SystemFonts.map((font) => (
                                <Select.Item key={font} value={font} label={font}>
                                    <Text size="x-small">{font}</Text>
                                </Select.Item>
                            ))}
                        </Select>
                        </div>
                    </div>
                )}

            {/* Font Size Selector */}
            {!viewInput.fontSize.locked && (
                <div className='tw-text-xxs'>
                    <div className="tw-w-22">
                        <Select 
                            value={String(viewInput.fontSize.value)} 
                            showStringValue={false}
                            onSelect={(value) => {
                                if (value !== null) {
                                    onChange(viewInput, {
                                        fontSize: {
                                            ...viewInput.fontSize,
                                            value: parseInt(value, 10),
                                        },
                                    });
                                }
                            }}
                        >
                            {fontSizes.map((size) => (
                                <Select.Item key={size} value={String(size)} label={`${size}px`}>
                                    <Text size="x-small" >{size} pt</Text>
                                </Select.Item>
                            ))}
                        </Select>
                    </div>
                </div>
            )}

            {/* Color Picker */}
            {!viewInput.color.locked && (
                <Flyout.Root>
                    <Flyout.Trigger>
                        <div className="tw-w-[43px] tw-flex tw-items-center tw-justify-center">
                            <ColorPicker.Input
                            currentColor={sanitizeColor(viewInput.color.value)}
                            />
                        </div>
                    </Flyout.Trigger>
                    <Flyout.Content maxWidth="600px">
                        <Flyout.Body>
                        <BrandColorPicker 
                            key='color-picker-component'
                            palettes={
                                viewInput.color.restrictedOptions && viewInput.color.restrictedOptions.length > 0
                                    ? viewInput.color.restrictedOptions
                                    : colorPalettes
                            }
                            currentColor={viewInput.color.value}
                            onSelect={(value) => 
                                onChange(viewInput, {
                                    color: {
                                        ...viewInput.color,
                                        value,
                                    },
                            })}
                        />
                        </Flyout.Body>
                    </Flyout.Content>
                </Flyout.Root>
            )}
        </div>
    );
};
