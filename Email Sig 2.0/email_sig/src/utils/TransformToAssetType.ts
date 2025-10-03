import { Asset } from '@frontify/app-bridge';
import { AssetType } from '@frontify/fondue';

export const transformToAssetType = (assets: Asset[] = []): AssetType[] => {
    return Array.isArray(assets)
        ? assets.map((asset) => ({
              type: 'image',
              name: asset.title ?? 'Untitled',
              extension: asset.extension,
              src: asset.previewUrl || asset.genericUrl,
              alt: asset.title,
              size: asset.fileSize,
              source: 'library',
              sourceName: asset.title || 'Unknown',
          }))
        : [];
};
