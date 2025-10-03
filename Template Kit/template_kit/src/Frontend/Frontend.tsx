import {
    useAssetChooser,
    type AppBridgeBlock,
    AssetChooserObjectType,
    FileExtensionSets,
    type Asset,
} from '@frontify/app-bridge';
import { ColorPickerFlyout, type Palette, AssetInput, AssetInputSize, Button } from '@frontify/fondue';
import { Input as AntdInput } from 'antd';
import { useState, useEffect, type FC } from 'react';

import { type TemplateData, type InputVar } from '../types';

type FrontendComponentProps = {
    inputs: InputVar[];
    selectedTemplates: TemplateData[];
    fondueColorPalettes: Palette[];
    appBridge: AppBridgeBlock;
};

type UserSelection = {
    id: string;
    type: string;
    text?: string;
    color?: { red: number; green: number; blue: number };
    image?: Asset;
};

export const FrontendComponent: FC<FrontendComponentProps> = ({
    inputs,
    fondueColorPalettes,
    appBridge,
    selectedTemplates,
}) => {
    const [userSelections, setUserSelections] = useState<UserSelection[]>([]);
    const { openAssetChooser, closeAssetChooser } = useAssetChooser(appBridge);

    // Initialize userSelections state with an empty object for each input
    useEffect(() => {
        setUserSelections(inputs.map((input) => ({ id: input.id, type: input.type })));
    }, [inputs]);

    const handleTextInputChange = (index: number, value: string) => {
        setUserSelections((prevSelections) => {
            const newSelections = [...prevSelections];
            newSelections[index] = { ...newSelections[index], text: value };
            return newSelections;
        });
    };

    const handleColorSelect = (index: number, color: { red: number; green: number; blue: number }) => {
        setUserSelections((prevSelections) => {
            const newSelections = [...prevSelections];
            newSelections[index] = { ...newSelections[index], color };
            return newSelections;
        });
    };

    const handleImageSelect = (index: number, image: Asset) => {
        setUserSelections((prevSelections) => {
            const newSelections = [...prevSelections];
            newSelections[index] = { ...newSelections[index], image };
            return newSelections;
        });
    };

    const onOpenAssetChooser = (index: number) => {
        openAssetChooser(
            (result) => {
                handleImageSelect(index, result[0]); // Assuming single selection
                closeAssetChooser();
            },
            {
                multiSelection: false,
                objectTypes: [AssetChooserObjectType.ImageVideo],
                extensions: FileExtensionSets.Images,
            },
        );
    };

    const generateCreative = () => {
        for (const template of selectedTemplates) {
            console.log(template);
        }
    };

    return (
        <div>
            {inputs.map((input, index) => (
                <div key={input.id} style={{ marginBottom: '16px' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{input.title}</div>
                    {input.type === 'TEXT' && (
                        <AntdInput
                            placeholder={input.title}
                            value={userSelections[index]?.text || ''}
                            onChange={(e) => handleTextInputChange(index, e.target.value)}
                        />
                    )}
                    {input.type === 'COLOR' && (
                        <ColorPickerFlyout
                            palettes={fondueColorPalettes}
                            onSelect={(color) => handleColorSelect(index, color)}
                            currentColor={userSelections[index]?.color || { red: 0, blue: 0, green: 0 }}
                        />
                    )}
                    {input.type === 'IMAGE' && (
                        <AssetInput
                            numberOfLocations={2}
                            onLibraryClick={() => onOpenAssetChooser(index)}
                            size={AssetInputSize.Small}
                            assets={
                                userSelections[index]?.image
                                    ? [
                                          {
                                              extension: 'JPG',
                                              name: userSelections[index]?.image?.title || '',
                                              size: userSelections[index]?.image?.fileSize || 0,
                                              source: 'library',
                                              sourceName: userSelections[index]?.image?.creatorName || '',
                                              src: userSelections[index]?.image?.genericUrl || '',
                                              type: 'image',
                                          },
                                      ]
                                    : []
                            }
                        />
                    )}
                </div>
            ))}
            <Button onClick={generateCreative}>Generate</Button>
        </div>
    );
};
