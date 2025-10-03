import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './AudioAsset.css'; // Assuming you have a separate CSS file
import { IconPause20Filled, IconPlay20Filled } from '@frontify/fondue';

export type AssetProps = {
    id: string;
    title: string;
    previewUrl: string;
};

const AudioAsset: React.FC<AssetProps> = ({ title, previewUrl }) => {
    const waveformRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);

    useEffect(() => {
        if (waveformRef.current) {
            const ws = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'violet',
                progressColor: 'purple',
            });

            ws.load(previewUrl);
            setWaveSurfer(ws);
        }

        return () => {
            if (waveSurfer) {
                waveSurfer.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewUrl]);

    const handlePlayToggle = () => {
        if (waveSurfer) {
            if (isPlaying) {
                waveSurfer.pause();
            } else {
                waveSurfer.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="audio-block">
            <div className="audio-controls">
                <button onClick={handlePlayToggle} className="play-toggle">
                    {isPlaying ? <IconPause20Filled /> : <IconPlay20Filled />}
                </button>
                <div ref={waveformRef} className="waveform"></div>
            </div>
            <div className="audio-metadata">
                <p className="audio-title">{title}</p>
            </div>
        </div>
    );
};

export default AudioAsset;
