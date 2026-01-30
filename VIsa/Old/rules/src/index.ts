import 'tailwindcss/tailwind.css';
import 'antd/es/style/reset.css';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { AnExampleBlock } from './Block';
import { settings } from './settings';
import { unregisterRule } from './utils/ruleRegistry';

export default defineBlock({
    block: AnExampleBlock,
    settings,
    onBlockDeleted: ({ appBridge }) => {
        try {
            // Get block ID
            const blockId = appBridge.context('blockId').get();

            if (blockId) {
                // Unregister the rule from the registry
                unregisterRule(String(blockId));
                console.log(`Rule unregistered for block ID: ${blockId}`);
            }
        } catch (error) {
            console.error('Error unregistering rule on block deletion:', error);
        }
    },
});
