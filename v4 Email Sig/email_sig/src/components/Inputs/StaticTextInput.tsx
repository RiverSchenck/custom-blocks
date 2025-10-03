import React from 'react';
import { InputItem, InputType, StaticInputItem } from '../../types';
import { generateRandomId } from '../helpers';

//*********STATIC TEXT*********
export const handleAddStaticText = (
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    const id = generateRandomId();
    const newStaticText: StaticInputItem = {
        id,
        inputType: InputType.STATICTEXT,
        value: '',
        quillRef: React.createRef(),
        newLine: true,
        canDisable: false,
        isFlyoutOpen: false,
        allowColors: false,
    };
    setInputs([...inputs, newStaticText]);
};

export const handleStaticTextChange = (
    id: string,
    value: string,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    setInputs((inputs) =>
        inputs.map((input) =>
            input.id === id && input.inputType === InputType.STATICTEXT
                ? { ...input, value } // Only update value if the type matches
                : input
        )
    );
};
