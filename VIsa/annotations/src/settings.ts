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
    ],
    style: [
        {
            id: 'highlight_color',
            label: 'Highlight color',
            type: 'colorInput',
            clearable: true,
        },
        {
            id: 'circle_color',
            label: 'Annotation circle color',
            type: 'colorInput',
            clearable: true,
        },
    ],
});
