declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': {
                src?: string;
                poster?: string;
                alt?: string;
                'camera-controls'?: boolean | string;
                'auto-rotate'?: boolean | string;
                'rotation-per-second'?: string;
                'camera-orbit'?: string;
                'environment-image'?: string;
                ar?: boolean;
                reveal?: 'auto' | 'interaction' | 'manual';
                loading?: 'eager' | 'lazy';
                crossorigin?: 'anonymous' | 'use-credentials' | '';
                style?: React.CSSProperties;
                ref?: React.Ref<HTMLElement>;
                className?: string;
            };
        }
    }
}
export {};
