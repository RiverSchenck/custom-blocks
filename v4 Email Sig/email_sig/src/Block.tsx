import React, { FC, useEffect, useState } from 'react';
import { useBlockSettings, useColorPalettes, useEditorState } from '@frontify/app-bridge';
import type { BlockProps } from '@frontify/guideline-blocks-settings';
import { InputItem, Settings, TextInput } from './types';
import ReactQuill from 'react-quill';
import { updateUserInputs } from './components/Inputs/HandleUserInputs';
import useColorOptions from './hooks/useColorOptions';
import RenderFrontend from './components/Frontend/RenderFrontend';
import RenderBackend from './components/Backend/RenderBackend';

export const SignatureGenerator: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const isEditing = useEditorState(appBridge);
    const [inputs, setInputs] = useState<InputItem[]>([]);
    // const [userInputs, setUserInputs] = useState<UserInput[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { customSig } = blockSettings;
    const colorPickerPalettes = useColorOptions(appBridge);
    const { colorPalettes } = useColorPalettes(appBridge);
    const appBridgeColorPalettes = colorPalettes;

    const initializeInputsWithRefs = (customSig: InputItem[]) => {
        return customSig.map((inputItem) => ({
            ...inputItem,
            quillRef: React.createRef<ReactQuill>(),
        }));
    };

    useEffect(() => {
        if (customSig && colorPickerPalettes.length > 0 && isLoading) {
            const inputsWithNewQuillRefs = initializeInputsWithRefs(customSig);
            setInputs(inputsWithNewQuillRefs);
            updateUserInputs(inputsWithNewQuillRefs, setInputs);
            // updateUserInputs(inputsWithNewQuillRefs, userInputs, setUserInputs);
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customSig, colorPickerPalettes]);

    useEffect(() => {
        if (isEditing) {
            saveInputs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputs]);

    useEffect(() => {
        if (!isEditing) {
            updateUserInputs(inputs, setInputs);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing]);

    function isTextInput(input: InputItem): input is TextInput {
        return 'quillRef' in input;
    }

    const saveInputs = () => {
        const inputsWithoutQuillRef = inputs.map((input) => {
            if (isTextInput(input)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { quillRef, userInput, ...rest } = input;
                return rest;
            }
            return input;
        });

        setBlockSettings({
            customSig: inputsWithoutQuillRef,
        });
    };

    const renderContent = () => {
        if (isLoading) {
            return null;
        } else {
            if (isEditing) {
                return (
                    <RenderBackend
                        inputs={inputs}
                        setInputs={setInputs}
                        appBridge={appBridge}
                        blockSettings={blockSettings}
                        colorPickerPalettes={colorPickerPalettes}
                        appBridgeColorPalettes={appBridgeColorPalettes}
                    />
                );
            } else {
                if (inputs.length === 0) {
                    return <div></div>;
                } else {
                    return (
                        <RenderFrontend
                            inputs={inputs}
                            setInputs={setInputs}
                            colorPickerPalettes={colorPickerPalettes}
                            blockSettings={blockSettings}
                            appBridgeColorPalettes={appBridgeColorPalettes}
                        />
                    );
                }
            }
        }
    };

    return renderContent();
};
