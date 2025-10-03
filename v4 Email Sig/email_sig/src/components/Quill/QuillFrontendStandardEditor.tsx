import React, { useEffect, useState } from 'react';
import { InputItem, TextInput, UserTextInput } from '../../types';
import { handleUserInput } from '../Inputs/HandleUserInputs';
import ReactQuill from 'react-quill';
import { Color, ColorPickerFlyout, Palette } from '@frontify/fondue';
import 'react-quill/dist/quill.snow.css'; // import styles
import './quillOverrides.css';
import './customizeQuill';
import { ColorPalette } from '@frontify/app-bridge';
import { mapAppBridgeColorPalettesToFonduePalettes } from '../helpers';

type QuillFrontendStandardEditorProps = {
    input: TextInput;
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    colorPickerPalettes: string[];
    appBridgeColorPalettes: ColorPalette[];
};

export function QuillFrontendStandardEditor({
    input,
    inputs,
    setInputs,
    colorPickerPalettes,
    appBridgeColorPalettes,
}: QuillFrontendStandardEditorProps) {
    const [colorPickerPalettesFondue, setColorPickerPalettes] = useState<Palette[]>([]);

    useEffect(() => {
        const palettes = mapAppBridgeColorPalettesToFonduePalettes(appBridgeColorPalettes);
        setColorPickerPalettes(palettes);
    }, [appBridgeColorPalettes]);

    const toolbarOptions = input.allowColors ? [{ color: colorPickerPalettes }] : null;

    const QuillModules = {
        toolbar: toolbarOptions,
    };
    const specificUserInput = input.userInput as UserTextInput | undefined;

    const onSelect = (color: Color) => {
        console.log(color);
    };

    return (
        <div>
            {/* <ColorPickerFlyout
                palettes={colorPickerPalettesFondue}
                onSelect={onSelect}
                currentColor={{ red: 0, blue: 0, green: 0 }}
            /> */}
            <ReactQuill
                ref={specificUserInput?.quillRef || null}
                defaultValue={specificUserInput?.value || ''}
                value={specificUserInput?.value || ''}
                onChange={(value) => {
                    handleUserInput(input, value, inputs, setInputs);
                }}
                modules={QuillModules}
                readOnly={specificUserInput?.disabled}
                style={{ backgroundColor: specificUserInput?.disabled ? '#E5E5E5' : 'white' }}
            />
        </div>
    );
}
