import { defineSettings } from '@frontify/guideline-blocks-settings';

export type UseCase = 'region_selector' | 'product_board' | 'rule_viewer';

export const settings = defineSettings({
    main: [
        {
            id: 'use_case',
            type: 'dropdown',
            label: 'Block Use Case',
            defaultValue: 'region_selector',
            size: 'large',
            choices: [
                {
                    value: 'region_selector',
                    icon: 'MapPointer' as const,
                    label: 'Region Selector',
                },
                {
                    value: 'product_board',
                    icon: 'BuildingBlock' as const,
                    label: 'Product Board',
                },
                {
                    value: 'rule_viewer',
                    icon: 'Document' as const,
                    label: 'Rule Viewer',
                },
            ],
        },
        // Product Board specific settings
        {
            id: 'product_board_layout',
            type: 'slider',
            label: 'Layout Style',
            defaultValue: 'grid',
            choices: [
                { label: 'Grid', value: 'grid' },
                { label: 'List', value: 'list' },
                { label: 'Cards', value: 'cards' },
            ],
            show: (bundle) => bundle.getBlock('use_case')?.value === 'product_board',
        },
        {
            id: 'product_board_show_description',
            type: 'switch',
            label: 'Show Product Descriptions',
            defaultValue: true,
            show: (bundle) => bundle.getBlock('use_case')?.value === 'product_board',
        },
        {
            id: 'product_board_filter_by_type',
            type: 'switch',
            label: 'Enable Type Filtering',
            defaultValue: false,
            show: (bundle) => bundle.getBlock('use_case')?.value === 'product_board',
        },
        // Rule Viewer specific settings
        {
            id: 'rule_viewer_show_exceptions',
            type: 'switch',
            label: 'Show Rule Exceptions',
            defaultValue: true,
            show: (bundle) => bundle.getBlock('use_case')?.value === 'rule_viewer',
        },
        {
            id: 'rule_viewer_group_by_element',
            type: 'switch',
            label: 'Group Rules by Element',
            defaultValue: false,
            show: (bundle) => bundle.getBlock('use_case')?.value === 'rule_viewer',
        },
        {
            id: 'rule_viewer_show_identifier',
            type: 'switch',
            label: 'Show Identifier Code',
            defaultValue: true,
            show: (bundle) => bundle.getBlock('use_case')?.value === 'rule_viewer',
        },
    ],
    style: [],
});
