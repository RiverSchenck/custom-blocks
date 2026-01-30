module.exports = {
    extends: ['@frontify/eslint-config-react'],
    settings: {
        react: {
            version: 'detect',
        },
    },
    parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- commonjs dirname
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
};
