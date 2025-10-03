import {
    type AppBridgeBlock,
    type Asset,
    type AssetChooserOptions,
    AssetChooserObjectType,
    FileExtensionSets,
    closeAssetChooser,
    openAssetChooser,
} from '@frontify/app-bridge';

interface AssetChooserProps {
    appBridge: AppBridgeBlock;
    onAssetSelected: (url: string, title: string) => void; // Callback for when an asset is selected
}

interface AssetChooserHook {
    openAssetChooserModal: () => Promise<void>;
    subscribeToAssets: () => void;
}

const assetChooserOptions: AssetChooserOptions = {
    objectTypes: [AssetChooserObjectType.ImageVideo],
    extensions: [...FileExtensionSets.Images],
    multiSelection: false,
};

export const useAssetChooser = ({ appBridge, onAssetSelected }: AssetChooserProps): AssetChooserHook => {
    const handleAssetSelection = async (eventReturn: { assets: Asset[] }) => {
        const asset = eventReturn.assets[0];
        console.log('Asset selected:', asset); // Log the selected asset to verify it's being triggered
        try {
            await appBridge.dispatch(closeAssetChooser());
            onAssetSelected(asset.previewUrl, asset.title); // Confirm parameters are correct
        } catch (error) {
            console.error('Failed to close asset chooser:', error);
        }
    };

    const subscribeToAssets = () => {
        appBridge.subscribe('assetsChosen', (eventReturn: { assets: Asset[] }) => {
            handleAssetSelection(eventReturn).catch((error) => console.error('Error handling assets:', error));
        });
    };

    return {
        openAssetChooserModal: () => appBridge.dispatch(openAssetChooser(assetChooserOptions)),
        subscribeToAssets,
    };
};
