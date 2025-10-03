// EditingInputs.tsx
import { FC, useEffect, useState } from 'react';
import { SignatureInput, InputType } from '../../types';
import { InputAttributes } from './InputAttributes';
import { InputList } from './InputList';
import { IconPlus, IconTypography, IconImage, Palette } from '@frontify/fondue';
import { Asset } from '@frontify/app-bridge';
import { Button } from '@frontify/fondue/components';
import { SignaturePreview } from '../Viewing/Preview/SignaturePreview';

interface EditingInputsProps {
    inputs: SignatureInput[];
    colorPalettes: Palette[];
    addInput: (type: InputType) => SignatureInput;
    deleteInput: (id: string) => void;
    updateInput: (input: SignatureInput) => void;
    reorderInputs: (newOrder: SignatureInput[]) => void;
    onAssetChooser: (selectedIds: number[], callback: (newAssets: Asset[]) => void) => void;
}


export const EditingInputs: FC<EditingInputsProps> = ({
    inputs,
    colorPalettes,
    addInput,
    deleteInput,
    updateInput,
    reorderInputs,
    onAssetChooser,
}) => {

    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    
    const selectedInput = inputs.find(input => input.id === selectedInputId);

    useEffect(() => {
        if (!selectedInputId && inputs.length > 0) {
            setSelectedInputId(inputs[0].id);
        }
    }, []);
    
    const handleAddTextInput = () => {
        const newInput = addInput(InputType.Text);
        setSelectedInputId(newInput.id); // Select the newly added input
    };

    const handleAddImageInput = () => {
        const newInput = addInput(InputType.Image);
        setSelectedInputId(newInput.id); // Select the newly added input
    };

    const handleSelectInput = (id: string) => {
        setSelectedInputId(id);
    };

    const handleReorder = (newOrder: SignatureInput[]) => {
        reorderInputs(newOrder); // Call the reorderInputs function from the hook
    };

    const handleUpdateInput = (updatedInput: SignatureInput) => {
        updateInput(updatedInput);
    };

    const handleDeleteInput = (id: string) => {
        deleteInput(id);
        if (selectedInputId === id) {
            setSelectedInputId(null);
        }
    };

    return (
        <div className="tw-flex tw-w-full tw-gap-2">
            <div className="tw-w-1/2 tw-flex tw-gap-2">
                <div className="tw-w-1/3">
                    <div className="tw-flex tw-items-center tw-gap-1">
                        <Button
                            onPress={handleAddTextInput}
                            size="small"
                            variant="default"
                            emphasis="weak"
                        >
                            <IconPlus /><IconTypography />
                        </Button>
                        <Button
                            onPress={handleAddImageInput}
                            size="small"
                            variant="default"
                            emphasis="weak"
                        >
                            <IconPlus /><IconImage />
                        </Button>
                    </div>
                    <InputList
                        inputs={inputs}
                        selectedId={selectedInputId || ""}
                        onSelect={handleSelectInput}
                        onReorder={handleReorder}
                        onDelete={handleDeleteInput}
                    />
                </div>
                <div className="tw-w-2/3">
                    {selectedInput && (
                        <InputAttributes
                            key={selectedInput.id}
                            input={selectedInput}
                            onUpdate={handleUpdateInput}
                            colorPalettes={colorPalettes}
                            onAssetChooser={onAssetChooser}
                        />
                    )}
                </div>
            </div>
            <div className="tw-w-1/2 tw-gap-2"> 
                    <SignaturePreview
                        viewInputs={inputs}
                    />
            </div>
        </div>
    );
};
