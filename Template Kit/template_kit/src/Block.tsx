import { useEditorState, useBlockSettings, useColorPalettes } from '@frontify/app-bridge';
import { type Palette } from '@frontify/fondue';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { useEffect, useState, type FC } from 'react';

import { BackendComponent } from './Backend/Backend';
import { FrontendComponent } from './Frontend/Frontend';
import { mapAppBridgeColorPalettesToFonduePalettes } from './helpers/helpers';
import { type InputVar, type Settings, type TemplateData } from './types';

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const { InputVariables, usedTemplates } = blockSettings || { InputVariables: [], usedTemplates: [] };
    const isEditing = useEditorState(appBridge);
    const [inputs, setInputs] = useState<InputVar[]>([]); // Managed state for inputs
    const [selectedTemplates, setSelectedTemplates] = useState<TemplateData[]>([]); // Managed state for tempaltes
    const { colorPalettes } = useColorPalettes(appBridge);
    const [colorPickerPalettesFondue, setColorPickerPalettes] = useState<Palette[]>([]);

    useEffect(() => {
        if (!isEditing) {
            // Perform any cleanup or state resets when exiting edit mode
            console.log('Switched to view mode. Current inputs:', inputs);
        } else {
            // Perform any setup when entering edit mode
            console.log('Entered edit mode.');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    useEffect(() => {
        setInputs(InputVariables || []);
    }, [InputVariables, appBridge]);

    useEffect(() => {
        setSelectedTemplates(usedTemplates || []);
    }, [usedTemplates, appBridge]);

    useEffect(() => {
        const palettes = mapAppBridgeColorPalettesToFonduePalettes(colorPalettes);
        setColorPickerPalettes(palettes);
    }, [colorPalettes]);

    const handleAddInput = (newInput: InputVar) => {
        setInputs((prevInputs) => {
            const newInputs = [...prevInputs, newInput];
            setBlockSettings({ InputVariables: newInputs }).catch((error) =>
                console.error('Failed to update block settings:', error),
            );
            return newInputs;
        });
    };

    const handleDeleteInput = (id: string) => {
        setInputs((prevInputs) => {
            const filteredInputs = prevInputs.filter((input) => input.id !== id);
            setBlockSettings({ InputVariables: filteredInputs }).catch((error) =>
                console.error('Failed to update block settings:', error),
            );
            return filteredInputs;
        });
    };

    const handleAddTemplate = (newTemplate: TemplateData) => {
        setSelectedTemplates((prevTemplates) => {
            const newTemplates = [...prevTemplates, newTemplate];
            setBlockSettings({ usedTemplates: newTemplates }).catch((error) =>
                console.error('Failed to update block settings:', error),
            );
            return newTemplates;
        });
    };

    const handleDeleteTemplate = (id: number) => {
        setSelectedTemplates((prevTemplates) => {
            const filteredTemplates = prevTemplates.filter((template) => template.data.id !== id);
            setBlockSettings({ usedTemplates: filteredTemplates }).catch((error) =>
                console.error('Failed to update block settings:', error),
            );
            return filteredTemplates;
        });
    };

    const handleUpdateVariableMapping = (variableKey: string, inputId: string) => {
        setSelectedTemplates((prevTemplates) => {
            const updatedVariables = prevTemplates.map((template) => ({
                ...template,
                variables: template.variables.map((variable) =>
                    variable.key === variableKey ? { ...variable, mappedInput: inputId } : variable,
                ),
            }));
            setBlockSettings({ usedTemplates: updatedVariables }).catch((error) =>
                console.error('Failed to update block settings:', error),
            );
            return updatedVariables;
        });
    };

    return (
        <div>
            {isEditing ? (
                <BackendComponent
                    inputs={inputs}
                    onAddInput={handleAddInput}
                    onDeleteInput={handleDeleteInput}
                    appBridge={appBridge}
                    selectedTemplates={selectedTemplates}
                    onAddTemplate={handleAddTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    updateVariableMapping={handleUpdateVariableMapping}
                />
            ) : (
                <FrontendComponent
                    inputs={inputs}
                    selectedTemplates={selectedTemplates}
                    fondueColorPalettes={colorPickerPalettesFondue}
                    appBridge={appBridge}
                />
            )}
        </div>
    );
};
