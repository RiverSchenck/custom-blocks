import React, { Dispatch, SetStateAction } from 'react';
import { InputItem, InputType, TextInput } from '../../types';
import { handleEditableTextChange } from '../Inputs/EditableTextInput';
import { handleSimpleInputChange } from '../Inputs/SimpleInput';
import { handleStaticTextChange } from '../Inputs/StaticTextInput';
import ReactQuill from 'react-quill';
import { QuillModulesBase } from '../../config';
import 'react-quill/dist/quill.snow.css'; // import styles
import './quillOverrides.css';
import './customizeQuill';

type QuillBackendEditorProps = {
    input: TextInput;
    inputs: InputItem[];
    setInputs: Dispatch<SetStateAction<InputItem[]>>;
    colorPickerPalettes: string[];
};

export function QuillBackendEditor({ input, inputs, setInputs, colorPickerPalettes }: QuillBackendEditorProps) {
    const QuillModules = {
        ...QuillModulesBase,
        toolbar: [...QuillModulesBase.toolbar, [{ color: colorPickerPalettes }]],
    };

    return (
        <div>
            <ReactQuill
                style={{ width: '100%' }}
                ref={input.quillRef}
                value={input.value || ''}
                onChange={(value) => {
                    if (input.inputType === InputType.EDITABLETEXT) {
                        handleEditableTextChange(input.id, value, inputs, setInputs);
                    } else if (input.inputType === InputType.STANDARDINPUT) {
                        handleSimpleInputChange(input.id, inputs, setInputs);
                    } else if (input.inputType === InputType.EMAIL) {
                        handleSimpleInputChange(input.id, inputs, setInputs);
                    } else {
                        handleStaticTextChange(input.id, value, inputs, setInputs);
                    }
                }}
                modules={QuillModules}
                theme="snow"
            />
        </div>
    );
}
