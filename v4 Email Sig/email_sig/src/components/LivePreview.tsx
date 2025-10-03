import React, { CSSProperties } from 'react';
import { ImageInputItem, InputItem, InputType, Settings, UserImageInput, UserTextInput } from '../types';
import { isImageInputItem, isLinebreakInputItem, isTextInput } from './helpers';

export const livePreview = (inputs: InputItem[], isFrontend = true, fontFamily: string, blockSettings: Settings) => {
    const { line_Height } = blockSettings;
    const fontStyles: CSSProperties = {
        fontFamily: fontFamily ? `${fontFamily}, sans-serif` : undefined,
        padding: 0,
        margin: 0,
        verticalAlign: 'top',
        lineHeight: line_Height,
        textAlign: 'left',
    };
    return inputs
        .map((input) => {
            let value = input.value || '';
            if (isTextInput(input) || isLinebreakInputItem(input)) {
                const specificUserInput = input.userInput as UserTextInput;
                if (isFrontend) {
                    if (specificUserInput?.disabled === true) {
                        return null;
                    }
                    value = specificUserInput?.value || value;
                }

                value = formatValue(value, input, blockSettings);

                return (
                    <>
                        {input.inputType === InputType.STANDARDINPUT && (
                            <span style={fontStyles} dangerouslySetInnerHTML={{ __html: value || '' }} />
                        )}
                        {input.inputType === InputType.STATICTEXT && (
                            <span style={fontStyles} dangerouslySetInnerHTML={{ __html: value || '' }} />
                        )}
                        {input.inputType === InputType.EDITABLETEXT && (
                            <span style={fontStyles} dangerouslySetInnerHTML={{ __html: value || '' }} />
                        )}
                        {input.inputType === InputType.LINEBREAK && <br style={fontStyles} />}
                        {input.inputType === InputType.EMAIL && (
                            <a
                                href={`mailto:${specificUserInput?.text}`}
                                style={fontStyles}
                                dangerouslySetInnerHTML={{ __html: value || '' }}
                            />
                        )}
                    </>
                );
            } else if (isImageInputItem(input)) {
                let selectedImageId = input.selectedImageId;
                let selectedImage: ImageData | undefined;

                if (isFrontend && input.userInput) {
                    const specificUserInput = input.userInput as UserImageInput;
                    selectedImageId = specificUserInput.selectedImageId;
                }

                selectedImage = input.images.find((image) => image.id === selectedImageId);
                const selectedImageWidth = selectedImage ? selectedImage.width : undefined;

                return (
                    <div key={input.id}>
                        {selectedImage && <img src={selectedImage.url} alt="" width={selectedImageWidth} />}
                    </div>
                );
            }
            return null;
        })
        .filter((item) => item !== null);
};

const formatValue = (value: string, input: InputItem, blockSettings: Settings) => {
    value = value
        // eslint-disable-next-line unicorn/prefer-string-replace-all
        .replace(/<p><br><\/p>/g, '<br>');
    value = applyInlineStylesToHtmlString(value, blockSettings);
    value = value
        // eslint-disable-next-line unicorn/prefer-string-replace-all
        .replace(/<p([^>]*)>/gi, '<span$1>')
        // eslint-disable-next-line unicorn/prefer-string-replace-all
        .replace(/<\/p>/gi, '</span><br>');
    if (input.newLine === false) {
        value = value.replace(/<br>$/, '');
    }
    return value;
};

const applyInlineStylesToHtmlString = (html: string, blockSettings: Settings) => {
    const { small_Font, large_Font, huge_Font } = blockSettings;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const largeElements = Array.from(doc.querySelectorAll('.ql-size-large')) as HTMLElement[];
    const hugeElements = Array.from(doc.querySelectorAll('.ql-size-huge')) as HTMLElement[];

    // If there are no large or huge elements, set all elements to small
    if (largeElements.length === 0 && hugeElements.length === 0) {
        const allElements = Array.from(doc.querySelectorAll('*')) as HTMLElement[];
        for (const el of allElements) {
            el.style.fontSize = `${small_Font.toString()}px`;
        }
    } else {
        // Otherwise, apply the specified styles
        for (const el of Array.from(doc.querySelectorAll('.ql-size-small')) as HTMLElement[]) {
            el.style.fontSize = `${small_Font.toString()}px`;
        }
        for (const el of largeElements) {
            el.style.fontSize = `${large_Font.toString()}px`;
        }
        for (const el of hugeElements) {
            el.style.fontSize = `${huge_Font.toString()}px`;
        }
    }

    return doc.body.innerHTML;
};
