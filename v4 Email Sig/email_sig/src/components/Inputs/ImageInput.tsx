import React from 'react';
import { ImageInputItem, InputItem, InputType } from '../../types';
import { AppBridgeBlock, Asset } from '@frontify/app-bridge';
import { generateRandomId } from '../helpers';

//*********IMAGE*********
export const handleAddImage = (inputs: InputItem[], setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>) => {
    const id = generateRandomId();

    const newImageInput: ImageInputItem = {
        id,
        inputType: InputType.IMAGE,
        images: [],
        selectedImageId: '',
        newLine: true,
        canDisable: false,
        isFlyoutOpen: false,
        allowColors: false,
    };
    setInputs([...inputs, newImageInput]);
};

function isImageInputItem(item: InputItem): item is ImageInputItem {
    return item.inputType === InputType.IMAGE;
}

export const handleImageWidthChange = (
    inputId: string, // ID of the ImageInputItem
    imageId: string, // ID of the specific image within the ImageInputItem
    newWidth: number, // New width to set
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    setInputs(
        inputs.map((input) => {
            // Check if it's the correct ImageInputItem
            if (isImageInputItem(input) && input.id === inputId) {
                // Map through the images and update the width of the specified image
                const updatedImages = input.images.map((img) => {
                    if (img.id === imageId) {
                        return { ...img, width: newWidth }; // Update the width
                    }
                    return img; // Return all other images unchanged
                });
                return { ...input, images: updatedImages }; // Return updated ImageInputItem
            }
            return input; // Return all other items unchanged
        })
    );
};

export const handleSelectImage = (
    inputId: string,
    selectedId: string,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    setInputs(
        inputs.map((input) => {
            if (input.id === inputId && 'images' in input) {
                return { ...input, selectedImageId: selectedId };
            }
            return input;
        })
    );
};

export const onOpenAssetChooser = (
    id: string,
    appBridge: AppBridgeBlock,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    appBridge.openAssetChooser((result: Asset[]) => {
        if (result.length === 0) {
            appBridge.closeAssetChooser();
            return;
        }

        const newImage = {
            id: generateRandomId(),
            url: result[0].previewUrl,
            width: undefined,
        };

        setInputs(
            inputs.map((input) => {
                if (input.id === id && input.inputType === InputType.IMAGE) {
                    const imageInput = input as ImageInputItem;

                    if (imageInput.images.length < 5) {
                        const newImages = [...imageInput.images, newImage];
                        const newSelectedImageId = imageInput.selectedImageId || newImage.id;
                        return {
                            ...imageInput,
                            images: newImages,
                            selectedImageId: newSelectedImageId,
                        };
                    } else {
                        alert('Maximum of 5 images already added.');
                    }
                }
                return input;
            })
        );

        appBridge.closeAssetChooser();
    });
};

export const handleDeleteImage = (
    itemId: string,
    imageId: string,
    inputs: InputItem[],
    setInputs: React.Dispatch<React.SetStateAction<InputItem[]>>
) => {
    setInputs(
        inputs.map((input) => {
            if (input.id === itemId && input.inputType === InputType.IMAGE) {
                const imageInput = input as ImageInputItem;
                console.log('Processing ImageInputItem:', imageInput);
                const newImages = imageInput.images.filter((img) => img.id !== imageId);
                console.log('New Images:', newImages);
                const newSelectedImageId =
                    imageInput.selectedImageId === imageId
                        ? // eslint-disable-next-line prettier/prettier
                     (newImages.length > 0
                            ? newImages[0].id
                            : // eslint-disable-next-line prettier/prettier
                             '')
                        : imageInput.selectedImageId;
                console.log('New Selected Image ID:', newSelectedImageId);
                return {
                    ...imageInput,
                    images: newImages,
                    selectedImageId: newSelectedImageId,
                };
            }
            return input;
        })
    );
};
