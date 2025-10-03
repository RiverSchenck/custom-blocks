import {
    BaseInputItem,
    EditableInputItem,
    EmailInputItem,
    ImageInputItem,
    InputItem,
    InputType,
    StandardInputItem,
    StaticInputItem,
    TextInput,
} from '../types';
import Quill, { Delta } from 'quill';
import { Palette } from '@frontify/fondue';
import { ColorPalette } from '@frontify/app-bridge';

// export const getUserInputById = (id: string, userInputs: UserInput[]) => {
//     return userInputs?.find((userInput) => userInput.id === id);
// };

export const quillToHtml = (quillDelta: Delta) => {
    const tempQuill = new Quill(document.createElement('div'));
    tempQuill.setContents(quillDelta);
    return tempQuill.root.innerHTML;
};

interface QuillInstance {
    container: {
        style: {
            whiteSpace: string;
        };
    };
}
//WHY? By default quill gets rid of leading and trailing whitespace. This is an issue when creating static text in the email sig in many use cases.
//https://github.com/quilljs/quill/issues/1752
class PreserveWhiteSpace {
    constructor(private quill: QuillInstance) {
        quill.container.style.whiteSpace = 'pre-line';
    }
}
Quill.register('modules/preserveWhiteSpace', PreserveWhiteSpace);

export const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

type Nullable<T> = T | null;

type V3Color = {
    id: number;
    name: Nullable<string>;
    red: Nullable<number>;
    green: Nullable<number>;
    blue: Nullable<number>;
    alpha: Nullable<number>;
};

type V4Color = {
    id: number;
    title: Nullable<string>;
    revision: {
        rgba: {
            red: Nullable<number>;
            green: Nullable<number>;
            blue: Nullable<number>;
            alpha: Nullable<number>;
        };
    };
};

type Color = V3Color | V4Color;

const mapAppBridgeColorPaletteToFonduePalette = (colorPalette: ColorPalette): Palette => {
    return {
        id: colorPalette.id,
        title: colorPalette.name,
        colors: colorPalette.colors.map(mapColor),
    };
};

export const mapAppBridgeColorPalettesToFonduePalettes = (colorPalettes: ColorPalette[]): Palette[] => {
    return colorPalettes.map(mapAppBridgeColorPaletteToFonduePalette);
};

const isV4Color = (color: Color): color is V4Color => {
    return 'revision' in color;
};

const mapColor = (color: Color) => {
    if (isV4Color(color)) {
        const { title, revision } = color;
        return {
            alpha: revision.rgba.alpha ? revision.rgba.alpha / 255 : 1,
            red: revision.rgba.red ?? 0,
            green: revision.rgba.green ?? 0,
            blue: revision.rgba.blue ?? 0,
            name: title ?? '',
        };
    }
    return {
        alpha: color.alpha ? color.alpha / 255 : 1,
        red: color.red ?? 0,
        green: color.green ?? 0,
        blue: color.blue ?? 0,
        name: color.name ?? '',
    };
};

export function isImageInputItem(item: InputItem): item is ImageInputItem {
    return item.inputType === InputType.IMAGE;
}

export function isStandardInputItem(item: InputItem): item is StandardInputItem {
    return item.inputType === InputType.STANDARDINPUT;
}

export function isLinebreakInputItem(item: InputItem): item is BaseInputItem {
    return item.inputType === InputType.LINEBREAK;
}

export function isStaticInputItem(item: InputItem): item is StaticInputItem {
    return item.inputType === InputType.STATICTEXT;
}

export function isEditableInputItem(item: InputItem): item is EditableInputItem {
    return item.inputType === InputType.EDITABLETEXT;
}

export function isEmailInputItem(item: InputItem): item is EmailInputItem {
    return item.inputType === InputType.EMAIL;
}

export function isTextInput(input: InputItem): input is TextInput {
    return [InputType.STANDARDINPUT, InputType.STATICTEXT, InputType.EDITABLETEXT, InputType.EMAIL].includes(
        input.inputType
    );
}
