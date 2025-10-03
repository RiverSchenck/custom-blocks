import { AssetChooserObjectType, defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'DesignTokenSource',
            type: 'assetInput',
            size: 'large',
            objectTypes: [AssetChooserObjectType.File],
        },
    ],
});
