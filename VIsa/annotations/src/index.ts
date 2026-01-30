import 'tailwindcss/tailwind.css';
import 'antd/es/style/reset.css';
import '@frontify/guideline-blocks-settings/styles';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { AnExampleBlock } from './Block';
import { settings } from './settings';

export default defineBlock({
    block: AnExampleBlock,
    settings,
});
