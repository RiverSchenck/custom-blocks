import {
    defineSettings,
    numericalOrPercentRule,
    appendUnit,
    betweenPercentRule,
} from '@frontify/guideline-blocks-settings';

const normalizeAngle = (v: string | undefined, fallback = '0deg') => {
    if (!v) {
        return fallback;
    }
    const t = v.trim();
    if (/(deg|rad)$/i.test(t)) {
        return t;
    }
    const n = Number(t);
    return Number.isFinite(n) ? `${n}deg` : fallback;
};

const normalizeRadius = (v?: string, fallback = '105%') => {
    const t = String(v ?? '').trim();
    if (!t) {
        return fallback;
    }
    if (/%$|m$|cm$|mm$/i.test(t)) {
        return t;
    }
    const n = Number(t);
    return Number.isFinite(n) ? `${n}%` : fallback;
};

export const settings = defineSettings({
    main: [
        {
            id: 'mainFile',
            label: 'GLB Selection',
            type: 'assetInput',
            multiSelection: false,
            size: 'large',
            extensions: ['glb'],
        },
        {
            id: 'autoRotateSection',
            type: 'sectionHeading',
            label: 'Auto Rotation',
            blocks: [
                {
                    id: 'autoRotate',
                    label: 'Enabled?',
                    type: 'switch',
                    defaultValue: true,
                    on: [
                        {
                            id: 'autoRotateDirection',
                            label: 'Auto Rotate Speed',
                            type: 'switch',
                            switchLabel: 'Reverse',
                            defaultValue: false,
                        },
                        {
                            id: 'autoRotateSpeed',
                            type: 'input',
                            inputType: 'text',
                            placeholder: 'e.g. 50%',
                            clearable: false,
                            defaultValue: '50%',
                            rules: [numericalOrPercentRule, betweenPercentRule(-200, 200)],
                            onChange: (bundle) => {
                                appendUnit(bundle, 'autoRotateSpeed', '%');
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: 'cameraControlsSection',
            type: 'sectionHeading',
            label: 'Camera Controls',
            blocks: [
                {
                    id: 'cameraControls',
                    label: 'Allow Camera Controls',
                    type: 'switch',
                    defaultValue: true,
                },
            ],
        },
        {
            id: 'cameraStagingSection',
            type: 'sectionHeading',
            label: 'Camera Staging',
            blocks: [
                {
                    id: 'cameraOrbitControls',
                    type: 'multiInput',
                    blocks: [
                        {
                            id: 'cameraOrbitTheta',
                            type: 'input',
                            label: 'Theta',
                            inputType: 'text',
                            placeholder: 'e.g. 45deg',
                            clearable: false,
                            defaultValue: '0deg',
                            info: 'Horizontal rotation around the model (0° = front, 90° = right).',
                            onChange: (bundle) => {
                                const id = 'cameraOrbitTheta';
                                const val = bundle.getBlock(id)?.value as string | undefined;
                                const next = normalizeAngle(val, '0deg');
                                if (next !== val) {
                                    bundle.setBlockValue(id, next);
                                }
                            },
                        },
                        {
                            id: 'cameraOrbitPhi',
                            type: 'input',
                            label: 'Phi',
                            inputType: 'text',
                            placeholder: 'e.g. 75deg',
                            clearable: false,
                            defaultValue: '75deg',
                            info: 'Vertical tilt of the camera (0° = top-down, 90° = horizontal view).',
                            onChange: (bundle) => {
                                const id = 'cameraOrbitPhi';
                                const val = bundle.getBlock(id)?.value as string | undefined;
                                const next = normalizeAngle(val, '75deg');
                                if (next !== val) {
                                    bundle.setBlockValue(id, next);
                                }
                            },
                        },
                        {
                            id: 'cameraOrbitRadius',
                            type: 'input',
                            label: 'Radius',
                            inputType: 'text',
                            placeholder: 'e.g. 105% (or 2.5m)',
                            clearable: false,
                            defaultValue: '105%',
                            info: 'Distance of the camera from the model. Supports %, m, cm, mm.',
                            onChange: (bundle) => {
                                const id = 'cameraOrbitRadius';
                                const val = bundle.getBlock(id)?.value as string | undefined;
                                const next = normalizeRadius(val, '105%'); // appends % if missing; allows m/cm/mm
                                if (next !== val) {
                                    bundle.setBlockValue(id, next);
                                }
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: 'environment',
            label: 'Environment Lighting',
            type: 'segmentedControls',
            defaultValue: 'neutral',
            choices: [
                { value: 'neutral', label: 'Neutral' },
                { value: 'legacy', label: 'Legacy' },
            ],
        },
    ],
    style: [
        {
            id: 'colorInput',
            label: 'Background Color',
            type: 'colorInput',
        },
    ],
});
