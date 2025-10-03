import { Color } from "@frontify/guideline-blocks-settings";
import { RgbaColor, ParsedColor, IntRange, RgbaColorWithName } from "./types";

type CssColorRed = number;
type CssColorGreen = number;
type CssColorBlue = number;
type CssColorAlpha = number;

const CssColorDefaultRed = 0;
const CssColorDefaultGreen = 0;
const CssColorDefaultBlue = 0;
const CssColorDefaultAlpha = 1;

type CssColor = {
    red: CssColorRed;
    green: CssColorGreen;
    blue: CssColorBlue;
    alpha?: CssColorAlpha;
};

export const isColorLight = (color: CssColor): boolean => {
    // copied brightness calculation from tiny color
    const brightness = (color.red * 299 + color.green * 587 + color.blue * 114) / 1000;

    return brightness > 128 || (color.alpha && color.alpha < 0.25) || false;
};

export const isColorInArray = (color1: CssColor, colorArray?: RgbaColorWithName[]): boolean => {
    return (colorArray ?? []).some((c) => 
        c.red === color1.red &&
        c.green === color1.green &&
        c.blue === color1.blue &&
        c.alpha === color1.alpha
    );
};


const fromKnownColorToCssColor = (color: Color | RgbaColor | ParsedColor): CssColor => {
    return {
        red: color.red <= 255 && color.red >= 0 ? (color.red as IntRange<0, 255>) : CssColorDefaultRed,
        green: color.green <= 255 && color.green >= 0 ? (color.green as IntRange<0, 255>) : CssColorDefaultBlue,
        blue: color.blue <= 255 && color.blue >= 0 ? (color.blue as IntRange<0, 255>) : CssColorDefaultGreen,
        alpha:
            typeof color.alpha === 'number' && color.alpha <= 1 && color.alpha >= 0
                ? color.alpha
                : CssColorDefaultAlpha,
    };
};

export const fromGraphQLColorToCssColor = (color: RgbaColor): CssColor => {
    return fromKnownColorToCssColor(color);
};

export const toRgbFunction = (cssColor: CssColor): string => {
    return cssColor.alpha === undefined || cssColor.alpha >= 1 || cssColor.alpha < 0
        ? `rgb(${cssColor.red} ${cssColor.green} ${cssColor.blue})`
        : `rgb(${cssColor.red} ${cssColor.green} ${cssColor.blue} / ${cssColor.alpha})`;
};