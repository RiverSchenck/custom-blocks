import { InputItem, Settings } from '../../types';
import {
    Button,
    ButtonEmphasis,
    ButtonGroup,
    ButtonSize,
    ButtonStyle,
    IconQuestionMarkCircle16,
    Tooltip,
    TooltipPosition,
} from '@frontify/fondue';
import { handleAddSimpleInput } from '../../components/Inputs/SimpleInput';
import { handleAddImage } from '../../components/Inputs/ImageInput';
import { handleAddLineBreak } from '../../components/Inputs/LinebreakInput';
import { handleAddStaticText } from '../../components/Inputs/StaticTextInput';
import { handleAddEditableText } from '../../components/Inputs/EditableTextInput';
import { handleAddEmail } from '../../components/Inputs/EmailInput';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import BackendInputs from '../../components/Backend/BackendInputs';
import { livePreview } from '../../components/LivePreview';
import useFontSettings from '../../hooks/useFontSettings';
import { AppBridgeBlock, ColorPalette } from '@frontify/app-bridge';

interface RenderBackendProps {
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    appBridge: AppBridgeBlock;
    blockSettings: Settings;
    colorPickerPalettes: string[];
    appBridgeColorPalettes: ColorPalette[];
}

const RenderBackend = ({
    inputs,
    setInputs,
    appBridge,
    blockSettings,
    colorPickerPalettes,
    appBridgeColorPalettes,
}: RenderBackendProps) => {
    const fontFamily = useFontSettings(blockSettings);
    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        } // dropped outside the list

        const items = Array.from(inputs);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setInputs(items);
    };

    const buttonConfig = [
        {
            text: 'Simple Input',
            onClick: () => handleAddSimpleInput(inputs, setInputs),
            tooltip:
                'This input allows you to define the appearance and label of the input field that will be displayed to end users. The text you enter here will be shown as the title of the input field on the frontend. Additionally, the style you create on the text here will be the style of the users text',
        },
        {
            text: 'Image',
            onClick: () => handleAddImage(inputs, setInputs),
            tooltip:
                'Utilize this input to incorporate an image into the signature. The image you choose will be static, meaning the end user will see it but will not have the ability to modify it',
        },
        {
            text: 'Line Break',
            onClick: () => handleAddLineBreak(inputs, setInputs),
            tooltip: 'Inserts a line break.',
        },
        {
            text: 'Static Text',
            onClick: () => handleAddStaticText(inputs, setInputs),
            tooltip:
                'This input is for text that the user cannot change. No form is displayed for this input. The static text will be applied to the email signature',
        },
        {
            text: 'User Editable Text',
            onClick: () => handleAddEditableText(inputs, setInputs),
            tooltip:
                'Use this input when you want to provide initial content that the end user can modify. This supports rich text editing, so users can customize the text to their needs. For instance, they might want to insert specific links into the text or change text size. Unlike Simple Input, the user can modify the style of this text',
        },
        {
            text: 'Email Input',
            onClick: () => handleAddEmail(inputs, setInputs),
            tooltip:
                'This input allows you to define the appearance and label of the input field that will be displayed to end users. The text you enter here will be shown as the title of the input field on the frontend. Additionally, the style you create on the text here will be the style of the users text. The email will automatically generate an email hyperlink.',
        },
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="elements">
                        {(provided) => (
                            <div
                                className="elements"
                                style={{ width: '50%', marginRight: '5%' }}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {inputs.map((input, index) => (
                                    <BackendInputs
                                        key={input.id}
                                        input={input}
                                        inputs={inputs}
                                        index={index}
                                        setInputs={setInputs}
                                        colorPickerPalettes={colorPickerPalettes}
                                        appBridge={appBridge}
                                        appBridgeColorPalettes={appBridgeColorPalettes}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div style={{ width: '50%' }}>
                    <span>{livePreview(inputs, false, fontFamily, blockSettings)}</span>
                </div>
            </div>
            {/* <div style={{ display: 'flex', width: '50%' }}>
                <div style={{ display: 'flex', marginLeft: '3%', width: '100%' }}>
                    <Button
                        onClick={saveInputs}
                        rounding={ButtonRounding['Medium']}
                        size={ButtonSize['Medium']}
                        hugWidth={false}
                        style={ButtonStyle['Primary']}
                        type={ButtonType['Button']}
                    >
                        {'Save'}
                    </Button>
                </div>
            </div> */}
            <div style={{ display: 'flex', marginTop: '25px' }}>
                {inputs.length <= 50 ? (
                    <ButtonGroup size={ButtonSize['Small']}>
                        {buttonConfig.map((button, index) => (
                            <Button
                                key={index}
                                emphasis={ButtonEmphasis['Default']}
                                icon={<span>+</span>}
                                onClick={button.onClick}
                                style={ButtonStyle['Default']}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {button.text}
                                    <div style={{ marginLeft: '5px' }}>
                                        <Tooltip
                                            content={button.tooltip}
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
                            </Button>
                        ))}
                    </ButtonGroup>
                ) : (
                    '50 Max Inputs'
                )}
            </div>
        </div>
    );
};

export default RenderBackend;
