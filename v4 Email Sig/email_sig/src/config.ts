import { InputType } from './types';

export const toolbarProps = ['bold', 'italic', 'underline', 'strike'];

export const QuillModulesBase = {
    preserveWhiteSpace: true,
    toolbar: [
        toolbarProps, // toggled buttons
        [{ size: ['small', 'large', 'huge'] }], // custom dropdown
        ['link'], // link button
    ],
};

export const inputTypeTextMapping = {
    standardInput: {
        text: 'Simple Input',
        tooltip: 'To apply styling highlight text. Simple Input applies consistent styling to all text',
    },
    staticText: {
        text: 'Static Text',
        tooltip:
            'Use Static Text to apply custom styling at the individual character level. This allows for a varied appearance within the same text field, unlike Simple Input where styling is consistent across all text.',
    },
    editableText: {
        text: 'User Editable Text',
        tooltip:
            'Use User Editable Text to apply custom styling at the individual character level. This allows for a varied appearance within the same text field, unlike Simple Input where styling is consistent across all text.',
    },
    image: {
        text: InputType.IMAGE,
        tooltip: '',
    },
    lineBreak: {
        text: 'Line Break',
        tooltip: '',
    },
    email: {
        text: 'Email',
        tooltip:
            'To apply styling highlight text. Email Input applies consistent styling to all text. A email hyperlink to the text is automatically generated.',
    },
};
