import {
    EmailInputItem,
    ImageInputItem,
    InputItem,
    InputType,
    StandardInputItem,
    UserImageInput,
    UserTextInput,
} from '../../types';
import { isImageInputItem, isTextInput, quillToHtml } from '../helpers';

export const handleUserInput = (
    input: InputItem,
    value: string,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    const specificUserInput = input.userInput as UserTextInput;
    const quillInstance = specificUserInput?.quillRef?.current?.getEditor();
    if (input?.inputType === InputType.STANDARDINPUT || input?.inputType === InputType.EMAIL) {
        const specificInput = input as StandardInputItem | EmailInputItem;
        const length = quillInstance?.getLength();
        if (typeof length === 'number' && specificInput?.format) {
            for (const [formatName, formatValue] of Object.entries(specificInput.format)) {
                quillInstance?.formatText(0, length, formatName, formatValue);
            }
        }

        const quillContent = quillInstance?.getContents();
        value = quillContent ? quillToHtml(quillContent) : '';
    }
    const textVal = quillInstance?.getText();
    const updatedUserInput = {
        ...input.userInput,
        value,
        text: textVal || '',
        quillRef: specificUserInput?.quillRef || { current: null },
        disabled: specificUserInput?.disabled || false,
    };

    // Create a new array with the updated input
    const updatedInputs = inputs.map((item) =>
        item.id === input.id ? { ...input, userInput: updatedUserInput } : item
    );

    setInputs(updatedInputs);
};

export const handleDelete = (
    id: string,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    setInputs(inputs.filter((input) => input.id !== id));
};

export const updateUserInputs = (inputs: InputItem[], setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>) => {
    const updatedInputs = inputs.map((input) => {
        if (isTextInput(input)) {
            const defaultText = input.inputType === InputType.EDITABLETEXT ? input.value || '' : '';

            // Update or initialize the userInput property
            const updatedUserInput: UserTextInput = {
                value: defaultText,
                quillRef: { current: null },
                text: '',
                disabled: false,
                format: input.format,
            };

            return { ...input, userInput: updatedUserInput };
        } else if (isImageInputItem(input)) {
            const updatedUserInput: UserImageInput = {
                selectedImageId: input.selectedImageId || '',
            };

            return { ...input, userInput: updatedUserInput };
        }
        return input;
    });

    setInputs(updatedInputs);
};

export const handleUserSelectImage = (
    itemId: string, // ID of the ImageInputItem
    imageId: string, // ID of the clicked image
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    setInputs(
        inputs.map((input) => {
            if (input.id === itemId && input.inputType === InputType.IMAGE) {
                const imageInput = input as ImageInputItem; // Typecast to use specific fields
                return {
                    ...imageInput,
                    userInput: {
                        ...imageInput.userInput,
                        selectedImageId: imageId,
                    },
                };
            }
            return input;
        })
    );
};
