// components/MainView.tsx
import { FC} from 'react';
import { ImageInput, InputType, SignatureInput, TextInput} from '../../types';
import { SignaturePreview } from './Preview/SignaturePreview';
import { Palette } from '@frontify/fondue';
import { SignatureTextInput } from './Form/SignatureTextInput';
import { SignatureImageInput } from './Form/SignatureImageInput';

interface Props {
    viewInputs: SignatureInput[];
    colorPalettes: Palette[];
    onUpdate: (updatedInput: SignatureInput) => void;
}

export const MainView: FC<Props> = ({ viewInputs, colorPalettes, onUpdate }) => {

    if (viewInputs.length === 0) {
        return null;
    }

    const handleChange = (input: SignatureInput, updatedPartial: Partial<SignatureInput>) => {
        let updatedInput: SignatureInput;
    
        if (input.type === InputType.Text) {
            updatedInput = {
                ...(input as TextInput),
                ...updatedPartial,
            } as TextInput;
        } else {
            const imageInput = {
                ...(input as ImageInput),
                ...updatedPartial,
            } as ImageInput;
    
            if (!imageInput.imageSelection && imageInput.options?.length) {
                imageInput.imageSelection = imageInput.options[0];
            }
    
            updatedInput = imageInput;
        }
    
        onUpdate(updatedInput);
    };
    

    return (
        <div className="tw-flex tw-gap-4">
            <div className='tw-w-1/2'>
            <div className="tw-flex tw-flex-col tw-gap-6">
                    {viewInputs.map((viewInput) => {
                        return (
                            <>
                                {viewInput.type === InputType.Text && (
                                    <SignatureTextInput 
                                        viewInput={viewInput}
                                        colorPalettes={colorPalettes}
                                        onChange={handleChange}
                                    />
                                )}

                                {viewInput.type === InputType.Image &&
                                    <SignatureImageInput 
                                        viewInput={viewInput}
                                        onChange={handleChange}
                                    />
                                }
                            </>
                        );
                    })}
                </div>
            </div>
            <div className='tw-w-1/2'>
                <SignaturePreview viewInputs={viewInputs} />
            </div>
        </div>
    );
};
