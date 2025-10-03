import React from 'react';
import { EmailInputItem, InputItem, InputType } from '../../types';
import { generateRandomId } from '../helpers';

export const handleAddEmail = (inputs: InputItem[], setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>) => {
    const id = generateRandomId();
    const newEmailInput: EmailInputItem = {
        // Explicitly define as EmailInputItem
        id,
        inputType: InputType.EMAIL,
        value: '',
        text: '',
        quillRef: React.createRef(),
        newLine: true,
        canDisable: false,
        isFlyoutOpen: false,
        allowColors: false,
    };
    setInputs([...inputs, newEmailInput]);
};
