import React from 'react';
import { InputItem, InputType, StandardInputItem } from '../../types';
import { isEmailInputItem, quillToHtml } from '../helpers';
import { generateRandomId, isStandardInputItem } from '../helpers';
import { toolbarProps } from '../../config';

//*********STANDARD INPUT*********
export const handleAddSimpleInput = (
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    const id = generateRandomId();
    const newStandardInput: StandardInputItem = {
        id,
        inputType: InputType.STANDARDINPUT,
        value: '',
        text: '',
        quillRef: React.createRef(),
        newLine: true,
        canDisable: false,
        isFlyoutOpen: false,
        allowColors: false,
    };
    setInputs([...inputs, newStandardInput]);
};

//For StandardInput we want all formating to apply to the whole text box
export const handleSimpleInputChange = (
    id: string,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    const item = inputs.find((input) => input.id === id);

    if (item && (isStandardInputItem(item) || isEmailInputItem(item))) {
        const quillInstance = item?.quillRef?.current?.getEditor();
        const format = quillInstance?.getFormat();
        const length = quillInstance?.getLength();

        if (length) {
            const allFormats = [...toolbarProps, 'size', 'color'];
            for (const formatName of allFormats) {
                let formatValue;
                if (formatName === 'size') {
                    // Set a default size
                    formatValue = format?.[formatName] ?? 'small';
                } else {
                    formatValue = format?.[formatName] ?? false;
                }
                if (formatName === 'color') {
                    // Set a default size
                    formatValue = format?.[formatName] ?? '#000000';
                } else {
                    formatValue = format?.[formatName] ?? false;
                }
                quillInstance?.formatText(0, length, formatName, formatValue);
            }
        }
        const quillContent = quillInstance?.getContents();
        const htmlContent = quillContent ? quillToHtml(quillContent) : '';
        setInputs(
            inputs.map((input) =>
                input.id === id
                    ? { ...input, value: htmlContent, format, text: quillInstance?.getText() || 'ERROR' }
                    : input
            )
        );
    }
};
