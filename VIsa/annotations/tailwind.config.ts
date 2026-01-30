import { type Config } from 'tailwindcss';

export default {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- tailwind preset from guideline-blocks-settings
    presets: [require('@frontify/guideline-blocks-settings/tailwind')],
    content: ['src/**/*.{ts,tsx}'],
    prefix: 'tw-',
    corePlugins: {
        preflight: false,
    },
} satisfies Config;
