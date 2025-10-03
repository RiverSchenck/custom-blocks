import styles from '../../styles';
import { ImageInputItem, InputItem, InputType } from '../../types';
import { Draggable } from 'react-beautiful-dnd';
import { IconGrabHandle32 } from '@frontify/fondue';
import LineBreakContainer from '../../components/Backend/LineBreakContainer';
import ImageInputContainer from '../../components/Backend/ImageInputContainer';
import InputContainer from '../../components/Backend/InputContainer';
import { AppBridgeBlock, ColorPalette } from '@frontify/app-bridge';

interface BackendInputsProps {
    input: InputItem;
    inputs: InputItem[];
    index: number;
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    colorPickerPalettes: string[];
    appBridge: AppBridgeBlock;
    appBridgeColorPalettes: ColorPalette[];
}

const BackendInputs = ({
    input,
    inputs,
    index,
    setInputs,
    colorPickerPalettes,
    appBridge,
    appBridgeColorPalettes,
}: BackendInputsProps) => {
    return (
        <Draggable key={input.id} draggableId={input.id} index={index}>
            {(provided) => (
                <div
                    id="backendInputs"
                    style={styles.backendInputsContainer}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <div className="iconContainer">
                            <div style={{ position: 'relative' }}>
                                <IconGrabHandle32 />
                            </div>
                            {input.inputType !== InputType.LINEBREAK ? (
                                <div style={{ position: 'relative', marginTop: '-5px' }}>
                                    <IconGrabHandle32 />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>

                        <div className="parentDiv" style={styles.inputsContainer}>
                            {(input.inputType === InputType.STANDARDINPUT ||
                                input.inputType === InputType.STATICTEXT ||
                                input.inputType === InputType.EDITABLETEXT ||
                                input.inputType === InputType.EMAIL) && (
                                <InputContainer
                                    input={input}
                                    inputs={inputs}
                                    index={index}
                                    setInputs={setInputs}
                                    colorPickerPalettes={colorPickerPalettes}
                                    appBridgeColorPalettes={appBridgeColorPalettes}
                                />
                            )}
                            {input.inputType === InputType.IMAGE && (
                                <ImageInputContainer
                                    input={input as ImageInputItem}
                                    inputs={inputs}
                                    index={index}
                                    setInputs={setInputs}
                                    appBridge={appBridge}
                                />
                            )}
                            {input.inputType === InputType.LINEBREAK && (
                                <LineBreakContainer input={input} inputs={inputs} index={index} setInputs={setInputs} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default BackendInputs;
