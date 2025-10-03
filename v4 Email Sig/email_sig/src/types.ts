import ReactQuill from 'react-quill';
import { Color } from '@frontify/fondue';

export enum InputType {
    STANDARDINPUT = 'standardInput',
    IMAGE = 'image',
    LINEBREAK = 'lineBreak',
    STATICTEXT = 'staticText',
    EDITABLETEXT = 'editableText',
    EMAIL = 'email',
}

export interface Settings {
    googleFont: string;
    fontInput: string;
    customSig: InputItem[];
    small_Font: number;
    large_Font: number;
    huge_Font: number;
    line_Height: number;
}

export interface BaseInputItem {
    id: string;
    inputType: InputType;
    newLine: boolean;
    canDisable: boolean;
    isFlyoutOpen: boolean;
    allowColors: boolean;
    userInput?: UserInput;
}

export interface StandardInputItem extends BaseInputItem {
    value?: string;
    quillRef?: React.RefObject<ReactQuill>;
    text: string;
    format?: Record<string, unknown>;
    approvedColors?: Color[];
}

export interface ImageInputItem extends BaseInputItem {
    images: ImageData[];
    selectedImageId: string;
    value?: string;
}

export interface ImageData {
    id: string;
    url: string;
    width?: number;
}

export interface StaticInputItem extends BaseInputItem {
    value?: string;
    quillRef?: React.RefObject<ReactQuill>;
    format?: Record<string, unknown>;
}

export interface EditableInputItem extends BaseInputItem {
    value: string;
    quillRef?: React.RefObject<ReactQuill>;
    format?: Record<string, unknown>;
    approvedColors?: Color[];
}

export interface EmailInputItem extends BaseInputItem {
    value?: string;
    quillRef?: React.RefObject<ReactQuill>;
    text: string;
    format?: Record<string, unknown>;
    approvedColors?: Color[];
}

export type ColorInput = StandardInputItem | EditableInputItem | EmailInputItem;

export type TextInput = StandardInputItem | StaticInputItem | EditableInputItem | EmailInputItem;

export type InputItem = StandardInputItem | ImageInputItem | StaticInputItem | EditableInputItem | EmailInputItem;

export interface UserInputBase {
    input: InputItem;
}

export interface UserTextInput {
    value: string;
    quillRef: React.RefObject<ReactQuill>;
    text?: string;
    disabled: boolean;
    format?: Record<string, unknown>;
}

export interface UserImageInput {
    selectedImageId: string;
}

export type UserInput = UserTextInput | UserImageInput;

export type QuillRefType = React.RefObject<ReactQuill>;
