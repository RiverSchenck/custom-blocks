import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'rule_type',
            label: 'Rule Type',
            type: 'dropdown',
            defaultValue: 'rule',
            choices: [
                { label: 'Rule (Default)', value: 'rule' },
                { label: 'Exception', value: 'exception' },
            ],
        },
        {
            id: 'id',
            label: 'ID',
            type: 'input',
            placeholder: 'Enter ID',
        },
        {
            id: 'section_id',
            label: 'Section ID',
            type: 'input',
            placeholder: 'Enter section ID',
            show: (bundle) => (bundle as { settings?: { rule_type?: string } }).settings?.rule_type === 'rule',
        },
        {
            id: 'legacy_id',
            label: 'Legacy ID (Optional)',
            type: 'input',
            placeholder: 'Enter legacy section ID',
        },
        {
            id: 'default_rule_section_id',
            label: 'Default Rule Section ID',
            type: 'input',
            placeholder: 'Enter the default rule section ID this exception overrides',
            show: (bundle) => (bundle as { settings?: { rule_type?: string } }).settings?.rule_type === 'exception',
        },
    ],
});
