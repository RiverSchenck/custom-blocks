import { type AppBridgeBlock } from '@frontify/app-bridge';

export type ColorImageMap = {
    [color: string]: string; // Mapping from color to image URL
};

export type CreateMap = {
    appBridge: AppBridgeBlock;
    colorImageMap: ColorImageMap;
    setColorImageMap: (value: ColorImageMap | ((prevMap: ColorImageMap) => ColorImageMap)) => void;
};
