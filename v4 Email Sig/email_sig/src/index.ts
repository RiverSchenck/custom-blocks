import 'tailwindcss/tailwind.css';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { SignatureGenerator } from './Block';
import { settings } from './settings';

export default defineBlock({
    block: SignatureGenerator,
    settings,
});
