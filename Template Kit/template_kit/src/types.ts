import { type TemplateLegacy } from '@frontify/app-bridge';

export type ColorInput = {
    type: 'COLOR';
    display: 'Color';
    value: string;
    id: string;
    title: string;
};

export type TextInput = {
    type: 'TEXT';
    display: 'Text';
    value: string;
    id: string;
    title: string;
};

export type ImageInput = {
    type: 'IMAGE';
    display: 'Image';
    imageId: string;
    id: string;
    title: string;
};

export type InputVar = ColorInput | TextInput | ImageInput;

export type Settings = {
    InputVariables: InputVar[];
    usedTemplates: TemplateData[];
};

export type TextVariable = {
    key: string;
    type: 'TEXT';
    value: string;
    mappedInput: string | null;
};

export type ImageVariable = {
    key: string;
    type: 'IMAGE';
    value: number | null;
    mappedInput: string | null;
};

export type ColorVariable = {
    key: string;
    type: 'COLOR';
    mappedInput: string | null;
    value: {
        id: string | null;
        r: number;
        g: number;
        b: number;
        a: number;
    };
};

export type Variable = TextVariable | ImageVariable | ColorVariable;

export type TemplateData = {
    data: TemplateLegacy;
    variables: Variable[];
};

export type TemplateVariablesData = {
    variables: Variable[];
};

type CreativeTemplate = {
    variables: Variable[];
};

export type CreativeTemplateResponse = {
    creativeTemplate: CreativeTemplate;
};
