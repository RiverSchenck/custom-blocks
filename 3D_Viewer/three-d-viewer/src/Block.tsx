import { useBlockAssets, useBlockSettings, rgbObjectToRgbString } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { useEffect, useRef, useState, type FC } from 'react';

interface Settings {
    autoRotate?: boolean;
    autoRotateSpeed?: string;
    autoRotateDirection?: boolean;
    cameraControls?: boolean;
    environment?: 'neutral' | 'legacy';
    colorInput?: { red: number; green: number; blue: number; alpha?: number; name?: string };
    cameraOrbitTheta?: string;
    cameraOrbitPhi?: string;
    cameraOrbitRadius?: string;
}

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const { blockAssets } = useBlockAssets(appBridge);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    useEffect(() => {
        console.log("Updated block assets:", blockAssets);

        const fileAsset = blockAssets["mainFile"]?.[0];
        if (fileAsset && fileAsset.extension?.toLowerCase() === 'glb') {
            setFileUrl(fileAsset.originUrl);
          } else {
            setFileUrl(null);
          }
    }, [blockAssets]);


    const mvRef = useRef<any>(null);

    useEffect(() => {
        const el = mvRef.current;
        if (!el) return;
        const onLoad = () => console.log('[model-viewer] loaded');
        const onError = (e: any) => console.error('[model-viewer] error', e?.detail || e);
        el.addEventListener('load', onLoad);
        el.addEventListener('error', onError);
        return () => {
            el.removeEventListener('load', onLoad);
            el.removeEventListener('error', onError);
        };
    }, [fileUrl]);

    const rps = (speed?: string, reverse?: boolean, fallback = 100) => {
        const raw = (speed ?? '').trim();
        const n = Number(raw.endsWith('%') ? raw.slice(0, -1) : raw);
        const magnitude = Number.isFinite(n) ? n : fallback;   // percent as number
        const signed = (reverse ? -1 : 1) * magnitude;
        return `${signed}%`;
      };

    const normAngle = (v: string | undefined, fallback = '0deg') => {
        if (!v) return fallback;
        const t = v.trim();
        if (/(deg|rad)$/i.test(t)) return t;
        const n = Number(t);
        return Number.isFinite(n) ? `${n}deg` : fallback;
    };

    const normRadius = (v: string | undefined, fallback = '105%') => {
        if (!v) return fallback;
        const t = v.trim();
        if (/%$|m$|cm$|mm$/i.test(t)) return t;
        const n = Number(t);
        return Number.isFinite(n) ? `${n}%` : fallback;
    };


    const bg =
    blockSettings?.colorInput
      ? rgbObjectToRgbString(blockSettings.colorInput)
      : '#ffffff';
    const autoRotate = blockSettings.autoRotate ?? true;
    const cameraControls = blockSettings.cameraControls ?? true;
    const rotationPerSecond = rps(blockSettings.autoRotateSpeed, blockSettings.autoRotateDirection);

    const theta  = normAngle(blockSettings.cameraOrbitTheta, '0deg');
    const phi    = normAngle(blockSettings.cameraOrbitPhi,   '75deg');
    const radius = normRadius(blockSettings.cameraOrbitRadius, '105%');

    const cameraOrbit = `${theta} ${phi} ${radius}`;

    const mvProps: any = {
        src: fileUrl,
        style: { width: '100%', height: '100%', backgroundColor: bg },
        // add string/number props normally
        'environment-image': blockSettings.environment || 'neutral',
        ...(cameraControls ? { 'camera-controls': '' } : {}),
        ...(autoRotate ? { 'auto-rotate': '', 'rotation-per-second': rotationPerSecond } : {}),
        'camera-orbit': cameraOrbit,
      };


    return (
        <div style={{ width: '100%', height: 500 }}>
        {fileUrl ? (
                <model-viewer ref={mvRef} {...mvProps} />

        ) : (
            <p>No supported 3D file selected (.glb required)</p>
        )}
        </div>
    );
};
