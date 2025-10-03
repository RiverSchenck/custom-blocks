import React from 'react';
import { TextInput, UserTextInput } from '../../types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import './quillOverrides.css';
import './customizeQuill';

type QuillFrontendStaticEditorProps = {
    input: TextInput;
};

export function QuillFrontendStaticEditor({ input }: QuillFrontendStaticEditorProps) {
    const specificUserInput = input.userInput as UserTextInput;
    return (
        <ReactQuill
            value={input.value}
            modules={{ toolbar: false }}
            readOnly={true}
            style={{ color: '#888', backgroundColor: specificUserInput?.disabled ? '#E5E5E5' : '#F9F9F9' }}
        />
    );
}
