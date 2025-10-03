import { FC, useRef, useState } from 'react';
import { ImageInput } from '../types';
import { AssetInput, AssetInputSize, FOCUS_VISIBLE_STYLE } from '@frontify/fondue';
import { IconTrashBin, IconPlusBoxStack } from '@frontify/fondue/icons';
import { Toolbar } from '@frontify/guideline-blocks-settings';
import { Flyout } from '@frontify/fondue/components';
import { transformToAssetType } from '../utils/TransformToAssetType';

interface AssetFlyoutListProps {
    input: ImageInput;
    selectUpdate: (selectedAsset: any) => void;
    onDelete?: (updatedInput: ImageInput) => void;
    onLibraryClick?: () => void;
}

export const AssetFlyoutList: FC<AssetFlyoutListProps> = ({ input, onDelete, selectUpdate, onLibraryClick}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedAsset, setSelectedAsset] = useState(input.imageSelection || null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const handleAssetClick = (item: any) => {
        setSelectedAsset(item);
        selectUpdate(item);
    };

    return (
        <Flyout.Root open={isOpen} onOpenChange={setIsOpen}>
            <Flyout.Trigger>
            <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
                <AssetInput
                    assets={transformToAssetType(input.options ?? [])}
                    onMultiAssetClick={() => setIsOpen(!isOpen)}
                    size={AssetInputSize.Small}
                    onLibraryClick={onLibraryClick}
                    actions={[
                        {
                            id: 'asset-input-viewer',
                            menuItems: [
                                {
                                    id: 'finderish-action',
                                    title: 'Select different Image',
                                    onClick: () => onLibraryClick && onLibraryClick(),
                                },
                            ],
                        },
                    ]}
                />
            </div>
            </Flyout.Trigger>
            <Flyout.Content maxWidth='385px' width='385px'>
                <Flyout.Body>
                    <div className="tw-grid tw-gap-4 tw-px-2 tw-pb-2 tw-grid-cols-2 tw-max-w-full tw-w-[350px]">

                        {/* Fake "Add Asset" Card */}
                        {onLibraryClick && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onLibraryClick();
                                }}
                                className="tw-flex tw-items-center tw-justify-center tw-bg-[#f2f2f2] tw-rounded-md tw-border-2 tw-border-dashed tw-cursor-pointer tw-h-[100px] tw-w-full hover:tw-bg-gray-20"
                            >
                                <IconPlusBoxStack size='32' />
                            </div>
                        )}

                        {input.options?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleAssetClick(item)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className={`${FOCUS_VISIBLE_STYLE} tw-relative tw-w-full tw-cursor-pointer tw-bg-[#f9f9f9] tw-shadow-sm tw-rounded-md tw-border-2 ${
                                    selectedAsset?.id === item.id ? 'tw-border-violet-60' : 'tw-border-transparent'
                                }`}
                                style={{ height: '100px' }}
                            >
                                <img
                                    className="tw-w-full tw-h-full tw-object-cover tw-rounded"
                                    src={item.previewUrl || item.externalUrl || item.genericUrl}
                                    alt={item.title}
                                    draggable="false"
                                />
                                {hoveredIndex === index && onDelete && (
                                    <div 
                                        className="tw-absolute tw-top-1 tw-right-1 tw-z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Toolbar
                                            items={[
                                                {
                                                    type: 'button',
                                                    icon: <IconTrashBin size={20} />,
                                                    tooltip: 'Remove Image',
                                                    onClick: () => {
                                                        if (!onDelete) return;
                                                        const updatedOptions = input.options?.filter((opt) => opt.id !== item.id) ?? [];
                                                    
                                                        onDelete({
                                                            ...input,
                                                            options: updatedOptions,
                                                            imageSelection: input.imageSelection?.id === item.id
                                                                ? (updatedOptions.length > 0 ? updatedOptions[0] : null)
                                                                : input.imageSelection,
                                                        });
                                                    }
                                                },
                                            ]}
                                            attachments={{ isEnabled: false }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Flyout.Body>
            </Flyout.Content>
        </Flyout.Root>
    );
};

export default AssetFlyoutList;
