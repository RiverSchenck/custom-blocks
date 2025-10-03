/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineSettings } from '@frontify/guideline-blocks-settings';

export const DEFAULT_FONT = 'Arial';

export const settings = defineSettings({
    main: [
        {
            id: 'fontInput',
            type: 'dropdown',
            size: 'small',
            defaultValue: DEFAULT_FONT,
            choices: [
                {
                    value: 'useGoogleFont',
                    label: 'Use Google Font',
                },
                {
                    value: 'Arial',
                    label: 'Arial',
                },
                {
                    value: 'Verdana',
                    label: 'Verdana',
                },
                {
                    value: 'Helvetica',
                    label: 'Helvetica',
                },
                {
                    value: 'Times New Roman',
                    label: 'Times New Roman',
                },
                {
                    value: 'Trebuchet MS',
                    label: 'Trebuchet MS',
                },
                {
                    value: 'Georgia',
                    label: 'Georgia',
                },
                {
                    value: 'Courier New',
                    label: 'Courier New',
                },
                {
                    value: 'Palatino Linotype',
                    label: 'Palatino Linotype',
                },
                {
                    value: 'Tahoma',
                    label: 'Tahoma',
                },
                {
                    value: 'Lucida Sans Unicode',
                    label: 'Lucida Sans Unicode',
                },
                {
                    value: 'Impact',
                    label: 'Impact',
                },
                {
                    value: 'Comic Sans MS',
                    label: 'Comic Sans MS',
                },
            ],
        },
        {
            id: 'googleFont',
            label: 'Google Font Link',
            info: 'This is the link inside <link> and href= ex. https://fonts.googleapis.com/css2?family=Montserrat',
            type: 'textarea',
            defaultValue: 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap',
            show: (bundle) => bundle.getBlock('fontInput')?.value === 'useGoogleFont',
        },
    ],
    style: [
        {
            id: 'small_Font',
            label: 'Small Font Size (px)',
            info: 'Font Size of the "Small" option in the editors',
            type: 'input',
            inputType: 'number',
            defaultValue: '12',
        },
        {
            id: 'large_Font',
            label: 'Large Font Size (px)',
            info: 'Font Size of the "Large" option in the editors',
            type: 'input',
            inputType: 'number',
            defaultValue: '18',
        },
        {
            id: 'huge_Font',
            label: 'Huge Font Size (px)',
            info: 'Font Size of the "Huge" option in the editors',
            type: 'input',
            inputType: 'number',
            defaultValue: '24',
        },
        {
            id: 'line_Height',
            label: 'Line Height',
            info: 'Line Height of the signature.',
            type: 'input',
            inputType: 'number',
            defaultValue: '1.2',
        },
    ],
});
