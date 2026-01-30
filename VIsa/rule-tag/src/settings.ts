import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'id',
            label: 'ID',
            type: 'input',
            placeholder: 'Enter ID',
        },
        {
            id: 'legacy_id',
            label: 'Legacy ID',
            type: 'input',
            placeholder: 'Enter legacy ID',
        },
    ],
    style: [
        {
            id: 'background_color',
            label: 'Background Color',
            type: 'colorInput',
            clearable: true,
        },
    ],
});
