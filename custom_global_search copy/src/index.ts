import 'tailwindcss/tailwind.css';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { CustomSearch } from './Block';
import { settings } from './settings';

export default defineBlock({
    block: CustomSearch,
    settings,
});
