declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': {
                src?: string;
                poster?: string;
                alt?: string;
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                ar?: boolean;
                reveal?: 'auto' | 'interaction' | 'manual';
                loading?: 'eager' | 'lazy';
                crossorigin?: 'anonymous' | 'use-credentials' | '';
                style?: React.CSSProperties;
                ref?: React.Ref<HTMLElement>;
                className?: string;
                // ...add more as needed
            };
        }
    }
}
export {};
