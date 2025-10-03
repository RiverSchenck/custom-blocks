import { Asset, useAssetChooser, useBlockSettings, useColorPalettes, useEditorState } from '@frontify/app-bridge';
import { mapAppBridgeColorPalettesToFonduePalettes, type BlockProps } from '@frontify/guideline-blocks-settings';
import { useEffect, useMemo, type FC } from 'react';
import { useEditingInputManager } from "./components/Inputs/editingInputManager";
import { EditingInputs } from './components/Editing/EditingInputs';
import { chooserOptions } from './utils/chooserOptions';
import { useViewInputManager } from './components/Inputs/viewInputManager';
import { Settings } from './types';
import { MainView } from './components/Viewing/MainView';

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const { savedInputs = [] } = blockSettings;
    const {
        inputs,
        addInput,
        deleteInput,
        updateInput,
        reorderInputs,
    } = useEditingInputManager(savedInputs, setBlockSettings);
    const { viewInputs, updateViewInput, syncViewInputs } = useViewInputManager();
    const { openAssetChooser, closeAssetChooser } = useAssetChooser(appBridge);
    const { colorPalettes } = useColorPalettes(appBridge);

    const colorPickerPalettes = useMemo(
        () => mapAppBridgeColorPalettesToFonduePalettes(colorPalettes),
        [colorPalettes]
    );

    useEffect(() => {
        if (!isEditing) {
            syncViewInputs(inputs);
        }
    }, [isEditing]);

    const onOpenAssetChooser = (selectedIds: number[], callback: (newAssets: Asset[]) => void) => {
        openAssetChooser(
            (newAssets: Asset[]) => {
                callback(newAssets);
                closeAssetChooser();  
            },
            chooserOptions
        ), { selectedIds};
    };

    return (
        <div className="tw-flex tw-flex-col tw-w-full tw-gap-2">
            {isEditing ? (
                <EditingInputs
                    inputs={inputs}
                    colorPalettes={colorPickerPalettes}
                    addInput={addInput}
                    deleteInput={deleteInput}
                    updateInput={updateInput}
                    reorderInputs={reorderInputs}
                    onAssetChooser={onOpenAssetChooser}
                />
            ) : (
                <div className="tw-p-2">
                    <MainView 
                        viewInputs={viewInputs} 
                        onUpdate={updateViewInput}
                        colorPalettes={colorPickerPalettes}
                    />
                </div>
            )}
        </div>
    );
};
