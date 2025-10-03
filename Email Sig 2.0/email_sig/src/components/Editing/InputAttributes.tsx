import { FC, useEffect } from "react";
import { SignatureInput, InputType, TextInput as TextInputType, ImageInput, ImageSelectionMode } from "../../types";
import { Card,  BrandColorPicker, Palette } from '@frontify/fondue';
import { Divider, TextInput, Text, Select, Flyout, ColorPicker, Button } from '@frontify/fondue/components'
import { IconTypography, IconEye, IconEyeOff, IconTextFormatBold, IconTextFormatItalic, IconTextFormatUnderline, IconImageStack } from '@frontify/fondue/icons'
import { SystemFonts } from "../../utils/systemFontsList";
import { sanitizeColor } from "../../utils/sanatizeColor";
import { LockableIcon } from "./LockableIcon";
import { BrandColorLimiter } from "../fondueCustom/BrandColorLimiter";
import { Asset } from "@frontify/app-bridge";
import { fontSizes, lineHeights } from "../../utils/fontSizesList";
import { CardAttributeRow } from "./CardAttributeRow";
import { AssetFlyoutList } from "../AssetList";
//JLFr7aJokbHyxHLxykrhtFW1PkPTuCanuTWQBWG4
interface InputAtrributesProps {
    input: SignatureInput;
    onUpdate: (updatedInput: SignatureInput) => void;
    colorPalettes: Palette[];
    onAssetChooser: (selectedIds: number[], callback: (newAssets: Asset[]) => void) => void;
}

export const InputAttributes: FC<InputAtrributesProps> = ({ input, onUpdate, colorPalettes, onAssetChooser }) => {
    
    useEffect(() => {
        if (input.type === InputType.Text) {
            console.log('Sanitized color:', sanitizeColor((input as TextInputType).color.value));
        }
    }, [input]);

    const handleUpdate = (updatedPartial: Partial<SignatureInput>) => {
        let updatedInput: SignatureInput;
    
        if (input.type === InputType.Text) {
            updatedInput = {
                ...(input as TextInputType),
                ...updatedPartial,
            } as TextInputType;
        } else {
            const imageInput = {
                ...(input as ImageInput),
                ...updatedPartial,
            } as ImageInput;
    
            const options = imageInput.options ?? [];
    
            // Ensure imageSelection exists in options or fallback to first available
            if (!options.some((opt) => opt.id === imageInput.imageSelection?.id)) {
                imageInput.imageSelection = options.length > 0 ? options[0] : null;
            }
    
            updatedInput = imageInput;
        }
    
        onUpdate(updatedInput);
    };

    return (
        <div className="tw-space-y-2 tw-mb-3">
            <Card key={input.id}>
                {/* Form Name Section */}
                
                <div className="tw-flex tw-justify-between tw-items-center tw-p-2">
                    <div className="tw-flex tw-items-center tw-gap-2 tw-flex-grow">
                        {/* Icon Container */}
                        <div className="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center">
                            <Card>
                                <div className="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-bg-gray-80">
                                {input.type === InputType.Text ? (
                                    <IconTypography size={20} />
                                ) : (
                                    <IconImageStack size={20} />
                                )}
                                </div>
                            </Card>
                        </div>
                        <Text size="small">
                            Form Name
                        </Text>
                    </div>
                    <TextInput
                        value={input.name}
                        onChange={(event) => handleUpdate({ name: event.target.value })}
                        placeholder="Input Name"
                        className="tw-w-28 tw-text-xxs tw-ml-auto"
                    />
                </div>
                <Divider padding="none" />

                {/* Conditional Content Section for Text Input */}
                {input.type === InputType.Text && (
                    <>
                        <CardAttributeRow
                            label="Content"
                            locked={input.content.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    content: {
                                        ...input.content,
                                        locked: !input.content.locked,
                                    },
                                })
                            }
                        >
                            <TextInput
                                value={input.content.value}
                                type="text"
                                onChange={(event) =>
                                    handleUpdate({
                                        content: {
                                            ...input.content,
                                            value: event.target.value,
                                        },
                                    })
                                }
                                placeholder="Default Text"
                                className="tw-w-28 tw-text-xxs tw-ml-auto" />
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Typeface"
                            locked={input.typeface.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    typeface: {
                                        ...input.typeface,
                                        locked: !input.typeface.locked,
                                    },
                                })
                            }
                        >
                            <div className=" tw-w-28 tw-flex tw-items-center tw-justify-center">
                                <Select
                                showStringValue={false}
                                value={input.typeface.value}
                                onSelect={(value) =>
                                    value !== null &&
                                    handleUpdate({
                                        typeface: {
                                            ...input.typeface,
                                            value,
                                        },
                                    })
                                }
                                >
                                    {SystemFonts.map((font) => (
                                        <Select.Item key={font} value={font} label={font}>
                                            <Text size="x-small">{font}</Text>
                                        </Select.Item>
                                    ))}
                                </Select>
                            </div>
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Font Size"
                            locked={input.fontSize.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    fontSize: {
                                        ...input.fontSize,
                                        locked: !input.fontSize.locked,
                                    },
                                })
                            }
                        >
                            <div className=" tw-w-20 tw-flex tw-items-center tw-justify-center">
                                <Select 
                                    value={String(input.fontSize.value)} 
                                    showStringValue={false}
                                    onSelect={(value) => {
                                        if (value !== null) {
                                            const size = parseInt(value, 10);
                                            handleUpdate({
                                                fontSize: {
                                                    ...input.fontSize,
                                                    value: size,
                                                },
                                            });
                                        }
                                    }}
                                >
                                        {fontSizes.map((size) => (
                                            <Select.Item key={size} value={String(size)} label={`${size}px`}>
                                                <Text size="x-small">{size} pt</Text>
                                            </Select.Item>
                                        ))}
                                    
                                </Select>
                            </div>
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Line Height"
                        >
                            <div className=" tw-w-20 tw-flex tw-items-center tw-justify-center">
                                <Select 
                                    value={String(input.lineHeight)} 
                                    showStringValue={false}
                                    onSelect={(value) => {
                                        if (value !== null) {
                                            handleUpdate({
                                                lineHeight: parseFloat(value),
                                            });
                                        }
                                    }}
                                >
                                    {lineHeights.map((height) => (
                                        <Select.Item key={height} value={String(height)} label={`${height}`}>
                                            <Text size="x-small">{height}</Text>
                                        </Select.Item>
                                    ))}
                                </Select>
                            </div>
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Text Color"
                            locked={input.color.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    color: {
                                        ...input.color,
                                        locked: !input.color.locked,
                                    },
                                })
                            }
                        >
                            <Flyout.Root >
                                <Flyout.Trigger>
                                <div className="tw-w-16 tw-flex tw-items-center tw-justify-center">
                                    <ColorPicker.Input
                                        currentColor={sanitizeColor(input.color.value)}
                                    />
                                </div>
                                </Flyout.Trigger>
                                <Flyout.Content maxWidth="600px">
                                    <Flyout.Body>
                                        <div className="tw-p-2 md:tw-w-[450px]">
                                            <BrandColorPicker 
                                                key='color-picker-component'
                                                palettes={colorPalettes}
                                                currentColor={input.color.value}
                                                onSelect={(value) =>
                                                    handleUpdate({
                                                        color: {
                                                            ...input.color,
                                                            value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </Flyout.Body>
                                </Flyout.Content>
                            </Flyout.Root>
                        </CardAttributeRow>

                        {!input.color.locked && (
                        <>
                            <Divider padding="none" />

                            <CardAttributeRow
                            label="Restrict Color" 
                            >
                                <Flyout.Root>
                                    <Flyout.Trigger>
                                    <div className=" tw-w-16 tw-flex tw-items-center tw-justify-center">
                                            <ColorPicker.Input currentColor={sanitizeColor(input.color.value)}/>
                                    </div>
                                    </Flyout.Trigger>
                                    <Flyout.Content maxWidth="600px">
                                        <Flyout.Body>
                                            <div className="tw-p-2 md:tw-w-[450px]">
                                            <BrandColorLimiter
                                                key='color-limiter-component'
                                                currentColors={
                                                    input.color.restrictedOptions?.flatMap((p) => p.colors) ?? []
                                                }
                                                palettes={colorPalettes}
                                                onColorChange={(updatedColors) =>
                                                    handleUpdate({
                                                        color: {
                                                            ...input.color,
                                                            restrictedOptions: updatedColors,
                                                        },
                                                    })
                                                }
                                            />
                                            </div>
                                        </Flyout.Body>
                                    </Flyout.Content>
                                </Flyout.Root>
                            </CardAttributeRow> 
                        </>
                        )}

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Visibility"
                            locked={input.visibility.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    visibility: {
                                        ...input.visibility,
                                        locked: !input.visibility.locked,
                                    },
                                })
                            }
                        >
                            <Button 
                                variant="default"
                                emphasis={input.visibility.value ? "default" : "strong"}
                                onPress={() =>
                                    handleUpdate({
                                        visibility: {
                                            ...input.visibility,
                                            value: !input.visibility.value,
                                        },
                                    })
                                }
                            >
                                {input.visibility.value ?
                                    <IconEye size={16} />
                                :
                                    <IconEyeOff size={16} />
                                }
                            </Button>
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Bold"
                            locked={input.bold.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    bold: {
                                        ...input.bold,
                                        locked: !input.bold.locked,
                                    },
                                })
                            }
                        >
                            <Button 
                                variant="default"
                                emphasis={input.bold.value ? "strong" : "default"}
                                onPress={() =>
                                    handleUpdate({
                                        bold: {
                                            ...input.bold,
                                            value: !input.bold.value,
                                        },
                                    })
                                }
                            >
                                    <IconTextFormatBold size={16} />
                            </Button>
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Italic"
                            locked={input.italic.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    italic: {
                                        ...input.italic,
                                        locked: !input.italic.locked,
                                    },
                                })
                            }
                        >
                            <Button 
                                variant="default"
                                emphasis={input.italic.value ? "strong" : "default"}
                                onPress={() =>
                                    handleUpdate({
                                        italic: {
                                            ...input.italic,
                                            value: !input.italic.value,
                                        },
                                    })
                                }
                            >
                                    <IconTextFormatItalic size={16} />
                            </Button>
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Underline"
                            locked={input.underline.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    underline: {
                                        ...input.underline,
                                        locked: !input.underline.locked,
                                    },
                                })
                            }
                        >
                            <Button 
                                variant="default"
                                emphasis={input.underline.value ? "strong" : "default"}
                                onPress={() =>
                                    handleUpdate({
                                        underline: {
                                            ...input.underline,
                                            value: !input.underline.value,
                                        },
                                    })
                                }
                            >
                                    <IconTextFormatUnderline size={16} />
                            </Button>
                        </CardAttributeRow>
                    </>
                )}

                {/* Conditional Content Section for Image Input */}
                {input.type === InputType.Image && (
                    <>

                        <CardAttributeRow
                            label="Method"
                        >
                            <div className=" tw-w-32 tw-flex tw-items-center tw-justify-center">
                            <Select
                                value={input.selectionMode}
                                showStringValue={false}
                                onSelect={(value) => {
                                    if (value !== null) {
                                        handleUpdate({
                                            selectionMode: value as ImageSelectionMode,
                                        });
                                    }
                                }}
                            >
                                {Object.values(ImageSelectionMode).map((mode) => (
                                    <Select.Item
                                        key={mode}
                                        value={mode}
                                        label={mode}
                                    >
                                        <Text size="x-small">{mode}</Text>
                                    </Select.Item>
                                ))}
                            </Select>
                        </div>
                        </CardAttributeRow>

                        <Divider padding="none" />

                        <div className="tw-px-2 tw-pt-2">
                            {/* Options Label */}
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <Text size="small">
                                    Options
                                </Text>
                            </div>
                            {/* Asset Input - Placed directly below the previous line */}
                            <div className="tw-px-2 tw-pt-2">
                                <AssetFlyoutList
                                    input={input}
                                    selectUpdate={(newAsset) => {
                                        handleUpdate({
                                            imageSelection: newAsset
                                        })
                                    }}
                                    onDelete={handleUpdate}
                                    onLibraryClick={() =>
                                        onAssetChooser(
                                            input.options?.map((asset) => asset.id) ?? [],
                                            (newAssets) =>
                                                handleUpdate({
                                                    options: newAssets,
                                                    imageSelection: input.imageSelection ?? (newAssets.length > 0 ? newAssets[0] : null),
                                                })
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <Divider padding="none" />

                        <div className="tw-flex tw-justify-between tw-items-center tw-p-2">
                            <div className="tw-flex tw-items-center tw-gap-2 tw-flex-grow">
                                <LockableIcon 
                                    locked={input.width.locked} 
                                    onToggle={() =>
                                        handleUpdate({
                                            width: {
                                                ...input.width,
                                                locked: !input.width.locked,
                                            },
                                        })
                                    }
                                />
                                <Text size="small">
                                    Width
                                </Text>
                            </div>
                            <div className="tw-flex tw-items-center tw-gap-1 tw-text-right">
                                <TextInput
                                    value={input.width.value}
                                    type="number"
                                    onChange={(event) =>
                                        handleUpdate({
                                            width: {
                                                ...input.width,
                                                value: parseInt(event.target.value, 10) || 0,
                                            },
                                        })
                                    }
                                    className="tw-w-16 tw-text-xxs"
                                />
                                <Text>px</Text>
                            </div>
                        </div>

                        <Divider padding="none" />

                        <div className="tw-flex tw-justify-between tw-items-center tw-p-2">
                            <div className="tw-flex tw-items-center tw-gap-2 tw-flex-grow">
                                <LockableIcon 
                                    locked={input.url.locked} 
                                    onToggle={() =>
                                        handleUpdate({
                                            url: {
                                                ...input.url,
                                                locked: !input.url.locked,
                                            },
                                        })
                                    }
                                />
                                <Text size="small">
                                    Url
                                </Text>
                            </div>
                            <TextInput
                                value={input.url.value}
                                type="text"
                                onChange={(event) =>
                                    handleUpdate({
                                        url: {
                                            ...input.url,
                                            value: event.target.value,
                                        },
                                    })
                                }
                                placeholder="Default Text"
                                className="tw-w-28 tw-text-xxs tw-ml-auto" />
                        </div>

                        <Divider padding="none" />

                        <CardAttributeRow
                            label="Visibility"
                            locked={input.visibility.locked}
                            onToggleLock={() =>
                                handleUpdate({
                                    visibility: {
                                        ...input.visibility,
                                        locked: !input.visibility.locked,
                                    },
                                })
                            }
                        >
                            <Button 
                                variant="default"
                                emphasis={input.visibility.value ? "default" : "strong"}
                                onPress={() =>
                                    handleUpdate({
                                        visibility: {
                                            ...input.visibility,
                                            value: !input.visibility.value,
                                        },
                                    })
                                }
                            >
                                {input.visibility.value ?
                                    <IconEye size={16} />
                                :
                                    <IconEyeOff size={16} />
                                }
                            </Button>
                        </CardAttributeRow>
                    </>
                )}
            </Card>
        </div>
    );
};
