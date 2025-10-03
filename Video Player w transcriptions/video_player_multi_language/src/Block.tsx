import { useBlockAssets } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { useEffect, useState, type FC } from 'react';

const convertSrtToVtt = (srtText: string): string => {
    return "WEBVTT\n\n" + srtText
        .replace(/\r/g, "") // Remove Windows line endings
        .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2"); // Convert comma to dot for WebVTT
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const { blockAssets } = useBlockAssets(appBridge);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [srtFiles, setSrtFiles] = useState<{ url: string; language: string }[]>([]);

    useEffect(() => {
        console.log("Updated block assets:", blockAssets);

        const videoAsset = blockAssets["main-video"]?.[0]; 
        if (videoAsset) {
            console.log('VIDEO ASSET:', videoAsset);
            setVideoUrl(videoAsset.genericUrl.replace("{width}", "1920"));
        }

        const srtAssets = blockAssets["srt-files"] || []; 
        console.log("Raw SRT Assets:", srtAssets);

        Promise.all(
            srtAssets.map(async (srt) => {
                try {
                    const response = await fetch(srt.originUrl);
                    let srtText = await response.text();
                    console.log(`✅ SRT Content for ${srt.fileName}:`, srtText);

                    const vttText = convertSrtToVtt(srtText); // Convert SRT to VTT
                    const blob = new Blob([vttText], { type: "text/vtt" }); // ✅ Store as VTT
                    const blobUrl = URL.createObjectURL(blob);

                    return { url: blobUrl, language: srt.title || srt.fileName.replace(".srt", "") };
                } catch (error) {
                    console.error(`❌ Failed to load SRT file (${srt.fileName}):`, error);
                    return { url: "", language: srt.fileName.replace(".srt", "") };
                }
            })
        ).then(setSrtFiles);

    }, [blockAssets]);

    useEffect(() => {
        const videoElement = document.querySelector("video");
        if (videoElement) {
            videoElement.load(); // ✅ Force reload to load subtitles
        }
    }, [srtFiles]);

    return (
        <div>
            {videoUrl && (
                <div>
                    <video controls width="100%" crossOrigin="anonymous">
                        <source src={videoUrl} type="video/mp4" />
                        {srtFiles.map((srt, index) => (
                            <track
                                key={index}
                                src={srt.url} 
                                label={srt.language}
                                kind="subtitles"
                                srcLang={srt.language.toLowerCase()}
                                default={index === 0}
                            />
                        ))}
                    </video>
                </div>
            )}
        </div>
    );
};
