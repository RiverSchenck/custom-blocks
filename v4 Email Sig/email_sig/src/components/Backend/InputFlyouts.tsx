import styles from '../../styles';
import {
    Button,
    ButtonEmphasis,
    ButtonRounding,
    ButtonSize,
    ButtonStyle,
    ButtonType,
    Divider,
    Flyout,
    FlyoutPlacement,
    IconCog16,
    Switch,
    Text,
} from '@frontify/fondue';
import { InputItem, InputType } from '../../types';
import { handleDelete } from '../../components/Inputs/HandleUserInputs';
import { ColorPalette } from '@frontify/app-bridge';
import LimitColorOptionsFlyout from '../Quill/LimitColorOptionsFlyout';

interface InputFlyoutsProps {
    input: InputItem;
    index: number;
    inputs: InputItem[];
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>;
    appBridgeColorPalettes?: ColorPalette[];
}

const InputFlyouts = ({ input, index, inputs, setInputs, appBridgeColorPalettes }: InputFlyoutsProps) => {
    return (
        <div style={styles.flyoutContainer}>
            <Flyout
                offset={5}
                isOpen={input.isFlyoutOpen}
                onCancel={() => {
                    setInputs((prevInputs) => {
                        const newInputs = [...prevInputs];
                        newInputs[index] = {
                            ...newInputs[index],
                            isFlyoutOpen: false,
                        };
                        return newInputs;
                    });
                }}
                onOpenChange={() => {
                    setInputs((prevInputs) => {
                        const newInputs = [...prevInputs];
                        newInputs[index] = {
                            ...newInputs[index],
                            isFlyoutOpen: true,
                        };
                        return newInputs;
                    });
                }}
                placement={FlyoutPlacement['Bottom']}
                trigger={
                    <div>
                        <Button
                            hugWidth
                            size={ButtonSize.Small}
                            icon={<IconCog16 />}
                            style={ButtonStyle.Default}
                            emphasis={ButtonEmphasis.Weak}
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            onClick={() => {
                                setInputs((prevInputs) => {
                                    const newInputs = [...prevInputs];
                                    newInputs[index] = {
                                        ...newInputs[index],
                                        isFlyoutOpen: !newInputs[index].isFlyoutOpen,
                                    };
                                    return newInputs;
                                });
                            }}
                        ></Button>
                    </div>
                }
            >
                <div className="tw-flex tw-flex-col tw-gap-y-2 tw-p-8">
                    {input.inputType === InputType.EDITABLETEXT ||
                    input.inputType === InputType.STANDARDINPUT ||
                    input.inputType === InputType.STATICTEXT ||
                    input.inputType === InputType.EMAIL ? (
                        <>
                            <Text size="medium">Break to next line?</Text>
                            <Text size="x-small">Line break will seperate this input and next.</Text>
                            <Switch
                                name="New Line"
                                mode={input.newLine ? 'on' : 'off'}
                                onChange={() => {
                                    setInputs((prevInputs) => {
                                        const newInputs = [...prevInputs];
                                        newInputs[index] = {
                                            ...newInputs[index],
                                            newLine: !newInputs[index].newLine,
                                        };
                                        return newInputs;
                                    });
                                }}
                                size="medium"
                            />
                            <div className="tw-flex tw-flex-col tw-gap-y-4">
                                <Divider color="#eaebeb" height="10px" />
                            </div>
                            <Text size="medium">Allow users to disable this input?</Text>
                            <Switch
                                name="Can Disable"
                                mode={input.canDisable ? 'on' : 'off'}
                                onChange={() => {
                                    setInputs((prevInputs) => {
                                        const newInputs = [...prevInputs];
                                        newInputs[index] = {
                                            ...newInputs[index],
                                            canDisable: !newInputs[index].canDisable,
                                        };
                                        return newInputs;
                                    });
                                }}
                                size="medium"
                            />
                            <div className="tw-flex tw-flex-col tw-gap-y-4">
                                <Divider color="#eaebeb" height="10px" />
                            </div>
                            <Text size="medium">Allow users to change text color?</Text>
                            <Switch
                                name="Can change text?"
                                mode={input.allowColors ? 'on' : 'off'}
                                onChange={() => {
                                    setInputs((prevInputs) => {
                                        const newInputs = [...prevInputs];
                                        newInputs[index] = {
                                            ...newInputs[index],
                                            allowColors: !newInputs[index].allowColors,
                                        };
                                        return newInputs;
                                    });
                                }}
                                size="medium"
                            />
                            <LimitColorOptionsFlyout
                                appBridgeColorPalettes={appBridgeColorPalettes || []}
                                input={input}
                                inputs={inputs}
                                setInputs={setInputs}
                            />
                            <div className="tw-flex tw-flex-col tw-gap-y-4">
                                <Divider color="#eaebeb" height="10px" />
                            </div>
                        </>
                    ) : null}
                    <Button
                        onClick={() => handleDelete(input.id, inputs, setInputs)}
                        disabled={false}
                        rounding={ButtonRounding['Medium']}
                        size={ButtonSize['Small']}
                        style={ButtonStyle['Danger']}
                        type={ButtonType['Button']}
                    >
                        Delete this input
                    </Button>
                </div>
            </Flyout>
        </div>
    );
};

export default InputFlyouts;
