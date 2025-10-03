import React from 'react';
import { BaseInputItem, InputItem, InputType } from '../../types';
import { generateRandomId } from '../helpers';

//*********LINE BREAK*********
export const handleAddLineBreak = (
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    const id = generateRandomId();
    const newLineBreak: BaseInputItem = {
        id,
        inputType: InputType.LINEBREAK,
        newLine: true,
        canDisable: false,
        isFlyoutOpen: false,
        allowColors: false,
    };
    setInputs([...inputs, newLineBreak]);
};
