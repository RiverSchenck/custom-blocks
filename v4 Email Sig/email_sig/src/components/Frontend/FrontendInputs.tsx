import React from 'react';
import {
    EmailInputItem,
    ImageInputItem,
    InputItem,
    InputType,
    StandardInputItem,
    UserImageInput,
    UserTextInput,
} from '../../types';
import { Switch, Text } from '@frontify/fondue';
import { QuillFrontendEditableEditor } from '../Quill/QuillFrontendEditableEditor';
import { QuillFrontendStandardEditor } from '../Quill/QuillFrontendStandardEditor';
import { QuillFrontendStaticEditor } from '../Quill/QuillFrontendStaticEditor';
import ImageCarousel from '../ImageCarousel';
import { ColorPalette } from '@frontify/app-bridge';

interface FrontendInputProps {
    input: InputItem;
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    colorPickerPalettes: string[];
    appBridgeColorPalettes: ColorPalette[];
}

const FrontendInputs = ({
    input,
    inputs,
    colorPickerPalettes,
    setInputs,
    appBridgeColorPalettes,
}: FrontendInputProps) => {
    const addDisableBtn = (input: InputItem) => {
        const specificUserInput = input.userInput as UserTextInput;
        return (
            <div style={{ display: 'flex' }}>
                <Text size="small" weight="strong">
                    Disable field?
                </Text>
                <Switch
                    name="Disabled"
                    mode={specificUserInput?.disabled ? 'on' : 'off'}
                    onChange={() => {
                        setInputs((prevInputs) => {
                            return prevInputs.map((item) => {
                                if (item.id === input.id) {
                                    const updatedUserInput = {
                                        ...item.userInput,
                                        disabled: !specificUserInput?.disabled,
                                        // Ensure all required UserInput properties are present
                                        value: specificUserInput?.value ?? '',
                                        quillRef: specificUserInput?.quillRef ?? React.createRef(),
                                        text: specificUserInput?.text ?? '',
                                    };
                                    return { ...item, userInput: updatedUserInput };
                                }
                                return item;
                            });
                        });
                    }}
                    size="small"
                />
            </div>
        );
    };

    if (input.inputType === InputType.STANDARDINPUT || input.inputType === InputType.EMAIL) {
        const specificInput = input as StandardInputItem | EmailInputItem;
        return (
            <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>{specificInput.text}</p>
                    {input?.canDisable === true ? addDisableBtn(input) : null}
                </div>
                <QuillFrontendStandardEditor
                    input={input}
                    inputs={inputs}
                    setInputs={setInputs}
                    colorPickerPalettes={colorPickerPalettes}
                    appBridgeColorPalettes={appBridgeColorPalettes}
                />
            </div>
        );
    }
    if (input.inputType === InputType.EDITABLETEXT) {
        return (
            <div
                style={{
                    flex: '1',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '10px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>Editable Text</p>
                    {input.canDisable === true ? addDisableBtn(input) : null}
                </div>
                <QuillFrontendEditableEditor
                    input={input}
                    inputs={inputs}
                    setInputs={setInputs}
                    colorPickerPalettes={colorPickerPalettes}
                />
            </div>
        );
    }
    if (input.inputType === InputType.STATICTEXT && input.canDisable === true) {
        return (
            <div
                style={{
                    flex: '1',
                    overflow: 'visible',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '10px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>Static Text</p>
                    {input?.canDisable === true ? addDisableBtn(input) : null}
                </div>
                <QuillFrontendStaticEditor input={input} />
            </div>
        );
    }
    if (input.inputType === InputType.IMAGE) {
        const specificInput = input as ImageInputItem;
        const specificUserInput = input.userInput as UserImageInput;
        if (!specificUserInput || specificInput.images.length <= 1) {
            return null;
        }
        return (
            <div style={{ width: '100%' }}>
                <ImageCarousel specificInput={specificInput} inputs={inputs} setInputs={setInputs} isFrontend={true} />
            </div>
        );
    }

    return null;
};

export default FrontendInputs;
