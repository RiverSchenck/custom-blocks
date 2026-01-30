import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'main-dropdown',
            type: 'dropdown',
            defaultValue: 'content_block',
            size: 'large',
            disabled: true,
            choices: [
                {
                    value: 'content_block',
                    icon: 'BuildingBlock' as const,
                    label: 'Content Block',
                },
            ],
        },
        {
            id: 'element_name',
            label: 'Element Name',
            type: 'input',
            placeholder: 'e.g., CVV',
        },
        {
            id: 'identifier',
            label: 'Identifier',
            type: 'input',
            placeholder: 'e.g., cvv-element',
        },
        {
            id: 'description',
            label: 'Description',
            type: 'textarea',
            placeholder: 'Description of this element',
        },
    ],
});
