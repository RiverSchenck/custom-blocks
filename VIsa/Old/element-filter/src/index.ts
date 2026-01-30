import 'tailwindcss/tailwind.css';
import 'antd/es/style/reset.css';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { AnExampleBlock } from './Block';
import { deleteElementInstance } from './api';
import { settings } from './settings';

export default defineBlock({
    block: AnExampleBlock,
    settings,
    onBlockDeleted: async ({ appBridge }) => {
        try {
            // Get block ID
            const blockId = appBridge.context('blockId').get();

            if (blockId) {
                // Delete the element instance from the database
                await deleteElementInstance(String(blockId));
                console.log(`Element instance deleted for block ID: ${blockId}`);
            }
        } catch (error) {
            console.error('Error deleting element instance on block deletion:', error);
        }
    },
});
