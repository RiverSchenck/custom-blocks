import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'progress-name',
            type: 'input',
            placeholder: 'Progress Name',
            defaultValue: 'content_block',
            size: 'large',
            disabled: true,
        },
    ],
});
