import React from 'react';
import { InputItem, TextInput, UserTextInput } from '../../types';
import { handleUserInput } from '../Inputs/HandleUserInputs';
import ReactQuill from 'react-quill';
import { QuillModulesBase } from '../../config';
import 'react-quill/dist/quill.snow.css'; // import styles
import './quillOverrides.css';
import './customizeQuill';

type QuillFrontendEditableEditorProps = {
    input: TextInput;
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    colorPickerPalettes: string[];
};

export function QuillFrontendEditableEditor({
    input,
    inputs,
    setInputs,
    colorPickerPalettes,
}: QuillFrontendEditableEditorProps) {
    const QuillModules = {
        ...QuillModulesBase,
        toolbar: [...QuillModulesBase.toolbar, [{ color: colorPickerPalettes }]],
    };
    const specificUserInput = input.userInput as UserTextInput;

    return (
        <ReactQuill
            ref={specificUserInput?.quillRef || null}
            value={specificUserInput?.value || ''}
            onChange={(value) => {
                handleUserInput(input, value, inputs, setInputs);
            }}
            modules={QuillModules}
            readOnly={specificUserInput?.disabled}
            style={{ backgroundColor: specificUserInput?.disabled ? '#E5E5E5' : 'white' }}
        />
    );
}
