import { defineSettings } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'main-video',
            label: 'Video Selection',
            type: 'assetInput',
            multiSelection: false,
            fileType: 'Videos',
            size: 'large',
            extensions: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'wmv', 'flv']
        },
    ],
    style: [
        {
            id: 'srt-files',
            label: 'SRT Selection',
            type: 'assetInput',
            multiSelection: true,
            extensions: ['srt'],
            size: 'large'
        },
    ],
});
