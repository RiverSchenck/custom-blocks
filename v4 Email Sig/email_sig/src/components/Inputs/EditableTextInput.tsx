import React from 'react';
import { EditableInputItem, InputItem, InputType } from '../../types';
import { generateRandomId } from '../helpers';

//*********EDITABLE TEXT*********
export const handleAddEditableText = (
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    const id = generateRandomId();
    const newEditableInput: EditableInputItem = {
        id,
        inputType: InputType.EDITABLETEXT,
        value: '',
        quillRef: React.createRef(),
        newLine: true,
        canDisable: false,
        isFlyoutOpen: false,
        allowColors: false,
    };
    setInputs([...inputs, newEditableInput]);
};

function isEditableInputItem(item: InputItem): item is EditableInputItem {
    return item.inputType === InputType.EDITABLETEXT;
}

export const handleEditableTextChange = (
    id: string,
    value: string,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    const item = inputs.find((input) => input.id === id);

    if (item && isEditableInputItem(item)) {
        const text = item.quillRef?.current?.getEditor().getText();
        setInputs(inputs.map((input) => (input.id === id ? { ...input, value, text } : input)));
    }
};
