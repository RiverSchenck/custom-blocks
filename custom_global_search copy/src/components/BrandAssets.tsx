import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export type AssetProps = {
    title: string;
    previewUrl: string;
    type: string;
};

export const Asset: React.FC<AssetProps> = ({ title, previewUrl, type }) => {
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const waveformRef = useRef<HTMLDivElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); // New state to manage playback

    useEffect(() => {
        if (type === 'Audio') {
            waveSurferRef.current = WaveSurfer.create({
                container: waveformRef.current!,
                waveColor: 'violet',
                progressColor: 'purple',
            });
            waveSurferRef.current.load(previewUrl);
        }

        return () => {
            if (waveSurferRef.current) {
                waveSurferRef.current.destroy();
            }
        };
    }, [previewUrl, type]);

    const handlePlayToggle = () => {
        if (waveSurferRef.current) {
            if (isPlaying) {
                waveSurferRef.current.pause();
            } else {
                waveSurferRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (type === 'Audio') {
        return (
            <div id="audio_block" style={{ width: '100%', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={handlePlayToggle}
                        style={{
                            marginRight: '10px',
                            fontSize: '24px', // Increases the size of the Unicode play/pause symbols
                            padding: '10px', // Adds space around the button content
                            border: 'none', // Removes the default button border
                            borderRadius: '50%', // Makes the button rounded
                            backgroundColor: 'transparent', // Sets a transparent background for the button
                            cursor: 'pointer', // Changes the mouse cursor to a pointer when hovering over the button
                        }}
                    >
                        {isPlaying ? '❚❚' : '▶'}
                    </button>
                    <div ref={waveformRef} style={{ flex: 1 }}></div>
                </div>
                <p style={{ textAlign: 'center' }}>{title}</p>
            </div>
        );
    }

    return (
        <div
            id="asset_block"
            style={{
                padding: '10px',
                boxSizing: 'border-box',
                flex: '0 0 calc(25% - 20px)',
                margin: '10px',
                width: '200px',
                height: '250px',
                position: 'relative',
            }}
        >
            <img
                src={previewUrl}
                alt={title}
                style={{
                    maxWidth: '100%',
                    maxHeight: '80%',
                    display: 'block',
                    margin: '0 auto',
                }}
            />
            <p
                style={{
                    fontSize: '14px',
                    textAlign: 'center',
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                {title}
            </p>
        </div>
    );
};

export type BrandAssetsProps = {
    brandName: string;
    assets: { title: string; previewUrl: string; __typename: string }[];
};

const BrandAssets: React.FC<BrandAssetsProps> = ({ brandName, assets }) => {
    return (
        <div style={{ margin: '20px 0' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>{brandName}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {assets.map((asset, index) => (
                    <Asset key={index} title={asset.title} previewUrl={asset.previewUrl} type={asset.__typename} />
                ))}
            </div>
        </div>
    );
};

export default BrandAssets;
