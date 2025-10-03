// components/SignaturePreview.tsx
import { FC } from 'react';
import { SignatureInput, InputType } from '../../../types';
import { Card } from '@frontify/fondue';
import { getTextInputStyles } from '../../../utils/getTextStyleClass';
import { TextPlaceholder } from './TextPlaceholder';

interface Props {
    viewInputs: SignatureInput[];
}

export const SignaturePreview: FC<Props> = ({ viewInputs }) => {
    console.log('preview ', viewInputs)
    return (
        <Card >
            <div className="tw-flex tw-flex-col tw-p-4">
                {viewInputs.map((input) => {
                    if (!input.visibility?.value) return null;

                    if (input.type === InputType.Text) {
                        const { className, style } = getTextInputStyles(input);
                        const isEmpty = !input.content.value.trim();
                        const isEditable = !input.content.locked;
                        const fontSizePt = input.fontSize?.value ?? 12;
                        const lineHeight = input.lineHeight ?? 1.5;
                        const pixelHeight = fontSizePt * 1.333 * lineHeight;
                        return (
                            <div key={input.id} className={className} style={style}>
                                {isEmpty && isEditable ? (
                                   <TextPlaceholder 
                                        pixelHeight={pixelHeight}
                                        placeholderLabel={input.name}
                                   />
                                ) : (
                                    input.content.value
                                )}
                            </div>
                        );
                    }

                    if (input.type === InputType.Image && input.imageSelection?.previewUrl) {
                        return (
                            <img
                                key={input.id}
                                src={input.imageSelection.previewUrl}
                                alt={input.name || 'Signature image'}
                                style={{ width: `${input.width.value}px` }}
                            />
                        );
                    }

                    return null;
                })}
            </div>
        </Card>
    );
};
