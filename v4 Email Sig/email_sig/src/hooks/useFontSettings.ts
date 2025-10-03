// hooks/useFontSettings.js
import { useCallback, useEffect, useState } from 'react';
import { Settings } from '../types';
import { DEFAULT_FONT } from '../settings';

const useFontSettings = (blockSettings: Settings) => {
    const { googleFont, fontInput, small_Font, large_Font, huge_Font } = blockSettings;
    const [fontFamily, setFontFamily] = useState(DEFAULT_FONT);

    useEffect(() => {
        if (googleFont) {
            loadFont(googleFont);
        }
    }, [googleFont]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--small-font-size', `${small_Font}px`);
        root.style.setProperty('--large-font-size', `${large_Font}px`);
        root.style.setProperty('--huge-font-size', `${huge_Font}px`);
    }, [small_Font, large_Font, huge_Font]);

    const loadFont = (url: string) => {
        const link = document.createElement('link');
        link.href = url;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    };

    const extractFontFamily = useCallback(
        (fontInput: string) => {
            if (fontInput === 'useGoogleFont') {
                const match = googleFont.match(/family=([^&]+)/);
                if (match && match[1]) {
                    loadFont(googleFont);
                    return match[1].replace('+', ' '); // Replaces '+' with spaces.
                }
            }
            return fontInput || DEFAULT_FONT;
        },
        [googleFont]
    );

    useEffect(() => {
        setFontFamily(extractFontFamily(fontInput));
    }, [fontInput, extractFontFamily]);

    return fontFamily;
};

export default useFontSettings;
