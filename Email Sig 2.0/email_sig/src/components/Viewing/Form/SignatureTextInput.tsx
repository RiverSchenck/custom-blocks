import { FC } from 'react';
import { TextInput } from '@frontify/fondue-components';
import { TextInput as TextInputType, SignatureInput } from '../../../types';
import { Card, FormControl, Palette, Text } from '@frontify/fondue';
import { getTextInputStyles } from '../../../utils/getTextStyleClass';
import { TextToolbar } from './TextToolbar';
import { IconEyeOff, IconEye } from '@frontify/fondue/icons';

interface SignatureTextInputProps {
    viewInput: TextInputType;
    colorPalettes: Palette[];
    onChange: (input: SignatureInput, updatedPartial: Partial<SignatureInput>) => void;
}

export const SignatureTextInput: FC<SignatureTextInputProps> = ({ viewInput, colorPalettes, onChange }) => {
    return (
        <FormControl
        key={`${viewInput.id}-form`}
        clickable
        label={{ children: viewInput.name || 'Text', htmlFor: `${viewInput.id}-form` }}
        extra={!viewInput.visibility?.locked && (
            <Card
                hoverable
                aria-label="Visibility"
                onClick={() =>
                    onChange(viewInput, {
                        visibility: {
                            ...viewInput.visibility,
                            value: !viewInput.visibility?.value,
                        },
                    })
                }
            >
                <div
                    className={`tw-flex tw-items-center tw-justify-center tw-gap-1 tw-w-fit tw-px-2 tw-h-6 tw-rounded ${
                        !viewInput.visibility?.value ? 'tw-bg-[#d5d6d6]' : ''
                    }`}
                >
                    {viewInput.visibility?.value ? (
                        <>
                            <IconEyeOff size={16} />
                            <Text size="x-small">Hide</Text>
                        </>
                    ) : (
                        <>
                            <IconEye size={16} />
                            <Text size="x-small">Show</Text>
                        </>
                    )}
                </div>
            </Card>
        )}
    >
            <Card>
                <div className='tw-bg-[#fafafa]'>
                    <TextToolbar
                        key={`${viewInput.id}-toolbar`}
                        viewInput={viewInput}
                        onChange={onChange}
                        colorPalettes={colorPalettes} />
                    <TextInput
                        id={`${viewInput.id}-form`}
                        spellCheck={false}
                        disabled={!viewInput.visibility?.value ? true : false}
                        value={viewInput.content.value}
                        onChange={(e) =>
                            onChange(viewInput, {
                                content: {
                                    ...viewInput.content,
                                    value: e.target.value,
                                },
                            })
                        }
                        {...getTextInputStyles(viewInput)} />
                </div>
            </Card>
    </FormControl>
    );
};
