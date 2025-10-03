import { FC } from 'react';
import { SignatureInput, ImageInput, ImageSelectionMode } from '../../../types';
import {  Card, FormControl, FormControlDirection, Text } from '@frontify/fondue';
import { IconEyeOff, IconEye } from '@frontify/fondue/icons';
import { AssetFlyoutList } from '../../AssetList';
import { TextInput } from '@frontify/fondue/components';

interface SignatureImageInputProps {
    viewInput: ImageInput;
    onChange: (input: SignatureInput, updatedPartial: Partial<SignatureInput>) => void;
}

export const SignatureImageInput: FC<SignatureImageInputProps> = ({ viewInput, onChange }) => {

    // Skip rendering if there are no selectable options
    if (!viewInput.options || viewInput.options.length <= 1) {
        return null;
    }
    
    return (
        <FormControl
        key={`${viewInput.id}-form`}
        clickable
        label={{ children: viewInput.name || 'Image', htmlFor: `${viewInput.id}-form` }}
        extra={!viewInput.visibility?.locked && (
            <Card
                hoverable
                aria-label="Visibility"
                onClick={() =>
                    onChange(viewInput, {
                        visibility: {
                            ...viewInput.visibility,
                            value: !viewInput.visibility.value,
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
                {viewInput.selectionMode === ImageSelectionMode.Suggested &&
                    <AssetFlyoutList
                        input={viewInput}
                        selectUpdate={(newAsset) =>                     
                            onChange(viewInput, {
                                imageSelection: newAsset,
                        })}
                    />
                }
                {viewInput.selectionMode === ImageSelectionMode.LibraryRestricted && (
                    <div className="tw-px-2 tw-py-2">

                    </div>
                )}
                {!viewInput.url.locked &&
                <div className='tw-px-2 tw-pb-2'>
                    <FormControl 
                    key={`${viewInput.id}-url-form`}
                    clickable
                    label={{ children: 'Url', htmlFor: `${viewInput.id}-url-text` }}
                    direction={FormControlDirection.Horizontal}
                    >
                        <TextInput
                            id={`${viewInput.id}-url-text`}
                            spellCheck={false}
                            type='url'
                            disabled={!viewInput.visibility?.value ? true : false}
                            value={viewInput.url.value}
                            onChange={(e) =>
                                onChange(viewInput, {
                                    url: {
                                        ...viewInput.url,
                                        value: e.target.value,
                                    },
                                })
                            }
                        />
                    </FormControl>
                </div>
                }
                 {!viewInput.width.locked &&
                <div className='tw-px-2 tw-pb-2'>
                    <FormControl 
                    key={`${viewInput.id}-width-form`}
                    clickable
                    label={{ children: 'Width', htmlFor: `${viewInput.id}-width-text` }}
                    direction={FormControlDirection.Horizontal}
                    >
                        <TextInput
                            id={`${viewInput.id}-width-text`}
                            spellCheck={false}
                            type='number'
                            disabled={!viewInput.visibility?.value ? true : false}
                            value={viewInput.url.value}
                            onChange={(event) =>
                                onChange(viewInput, {
                                    width: {
                                        ...viewInput.width,
                                        value: parseInt(event.target.value, 10) || 0,
                                    },
                                })
                            }
                        />
                    </FormControl>
                </div>
                }
            </Card>
        </FormControl>
    );
};
