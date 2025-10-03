import { IconEnum, defineSettings } from '@frontify/guideline-blocks-settings';

export type Settings = {
    skuPropertyId: string; // which metadata field to read/filter for SKUs
  };
  
  // Fake list for now — replace with a dynamic fetch later
  export const FAKE_METADATA_PROPERTIES = [
    {
      value: 'eyJpZGVudGlmaWVyIjoxMjEyOSwidHlwZSI6ImN1c3RvbU1ldGFkYXRhUHJvcGVydHkifQ==',
      label: 'SKU',
    },
    {
      value: 'eyJpZGVudGlmaWVyIjo2MzM3LCJ0eXBlIjoiY3VzdG9tTWV0YWRhdGFQcm9wZXJ0eSJ9',
      label: 'Product',
    },
    {
      value: 'eyJpZGVudGlmaWVyIjoxMjEwNiwidHlwZSI6ImN1c3RvbU1ldGFkYXRhUHJvcGVydHkifQ==',
      label: 'Preview CDN',
    },
    {
      value: 'eyJpZGVudGlmaWVyIjo2MzYxLCJ0eXBlIjoiY3VzdG9tTWV0YWRhdGFQcm9wZXJ0eSJ9',
      label: 'test editable',
    },
  ];

export const settings = defineSettings({
    main: [
        {
          id: 'skuPropertyId',
          label: 'Metadata field to use for SKU',
          type: 'dropdown',
          size: 'small',
          choices: FAKE_METADATA_PROPERTIES,
        },
      ],
});
