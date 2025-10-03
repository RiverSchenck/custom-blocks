import 'tailwindcss/tailwind.css';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { Audio_Library } from './Block';
import { settings } from './settings';

export default defineBlock({
    block: Audio_Library,
    settings,
});
