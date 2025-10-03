import { defineBlock } from '@frontify/guideline-blocks-settings';

import { AnExampleBlock } from './Block';
import { settings } from './settings';
import { removeProgressItem } from './storage';

export default defineBlock({
    block: AnExampleBlock,
    settings,
    onBlockDeleted: ({ appBridge }) => {
        try {
            if (!appBridge) {
                console.warn('appBridge is not available.');
                return;
            }

            const context = appBridge.context().get();
            const blockId = context?.blockId;

            if (!blockId) {
                console.warn('Block ID is missing from context.');
                return;
            }

            console.log(`Deleting block with ID: ${blockId}`);
            removeProgressItem(blockId);
        } catch (error) {
            console.error('Error while deleting block progress data:', error);
        }
    },
});
