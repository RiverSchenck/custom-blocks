import styles from '../../styles';
import { InputItem } from '../../types';
import InputFlyouts from './InputFlyouts';
import { IconQuestionMarkCircle16, Tooltip, TooltipPosition } from '@frontify/fondue';
import { QuillBackendEditor } from '../Quill/QuillBackendEditor';
import { ColorPalette } from '@frontify/app-bridge';
import { inputTypeTextMapping } from '../../config';

interface InputContainerProps {
    input: InputItem;
    inputs: InputItem[];
    index: number;
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    colorPickerPalettes: string[];
    appBridgeColorPalettes: ColorPalette[];
}

const InputContainer = ({
    input,
    inputs,
    index,
    setInputs,
    colorPickerPalettes,
    appBridgeColorPalettes,
}: InputContainerProps) => {
    const inputTypeText = inputTypeTextMapping[input.inputType].text;
    const inputTypeTooltip = inputTypeTextMapping[input.inputType].tooltip;
    return (
        <>
            <div style={styles.inputTypeContainer}>
                <div style={styles.innerTypeContainer}>
                    <div style={{ width: '20px' }}></div>
                    <div style={styles.innerTypetextContainer}>
                        {inputTypeText}
                        <div style={{ marginLeft: '5px' }}>
                            <Tooltip
                                content={inputTypeTooltip}
                                enterDelay={0}
                                heading=""
                                hoverDelay={200}
                                position={TooltipPosition['Bottom']}
                                triggerElement={
                                    <button className="tw-flex tw-justify-center tw-items-center">
                                        <IconQuestionMarkCircle16 />
                                    </button>
                                }
                            />
                        </div>
                    </div>
                    <InputFlyouts
                        input={input}
                        index={index}
                        inputs={inputs}
                        setInputs={setInputs}
                        appBridgeColorPalettes={appBridgeColorPalettes}
                    />
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <QuillBackendEditor
                    key={input.id}
                    input={input}
                    inputs={inputs}
                    setInputs={setInputs}
                    colorPickerPalettes={colorPickerPalettes}
                    // appBridge={appBridge}
                />
            </div>
        </>
    );
};

export default InputContainer;
