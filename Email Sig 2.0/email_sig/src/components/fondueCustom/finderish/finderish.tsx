// import { FC, useState } from 'react';
// import { Dialog, Button, Checkbox } from '@frontify/fondue/components';
// import { ImageInput } from '../../../types';
// import { IconImageStack } from '@frontify/fondue/icons';
// import { Tag, TagSize, TagType } from '@frontify/fondue';
// import { FOCUS_VISIBLE_STYLE } from '@frontify/fondue';

// interface FinderishProps {
//     input: ImageInput; // Adjust the type as needed
//     selectUpdate: (selectedAsset: any) => void;
//     onDelete?: (updatedInput: ImageInput) => void;
//     isOpen: boolean;
//     onClose: () => void;
// }

// export const Finderish: FC<FinderishProps> = ({ input, onDelete, selectUpdate, isOpen, onClose }) => {

//     const [selectedAsset, setSelectedAsset] = useState(input.imageSelection ? input.imageSelection : null);

//     const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);

//     const toggleCheckbox = (id: number) => {
//         setSelectedForDeletion((prev) =>
//             prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//         );
//     };

//     const handleAssetClick = (item: any) => {
//         setSelectedAsset(item);
//         selectUpdate(item);
//     };

//     const handleDeleteSelected = () => {
//         if (!onDelete) return;
//         const filteredOptions = input.options.value?.filter(
//             (item) => !selectedForDeletion.includes(item.id)
//         ) ?? null;
    
//         const updated: ImageInput = {
//             ...input,
//             options: {
//                 ...input.options,
//                 value: filteredOptions,
//             },
//             imageSelection: selectedAsset && selectedForDeletion.includes(selectedAsset.id)
//                 ? null
//                 : selectedAsset,
//         };
    
//         setSelectedForDeletion([]);
//         setSelectedAsset(updated.imageSelection);
//         onDelete({ ...updated });
//     };

//     return (
//         <div className="tw-flex tw-items-center tw-gap-1">
//             <Dialog.Root
//                 modal={true}
//                 open={isOpen}
//                 onOpenChange={(open) => !open && onClose()}
//             >
//                 <Dialog.Content maxWidth="850px" minWidth='850px' minHeight="500px" padding="none" verticalAlign='center' showUnderlay={true}>
//                     <Dialog.Header>
//                         <Dialog.Title>
//                             <div className="tw-flex tw-items-center  tw-gap-2 tw-p-2">
//                                 <IconImageStack size={16} />
//                                 Image Options
//                             </div>
//                         </Dialog.Title>
//                     </Dialog.Header>
//                     <Dialog.Body >
//                         <div className="tw-w-[850px] tw-h-[800px] tw-overflow-y-auto tw-overflow-x-hidden tw-pr-4 tw-box-border tw-bg-[#f1f1f1]">
//                             <div className="tw-h-full js-co-assetbrowser__items-container">
//                                 <div className="tw-grid tw-gap-4 tw-py-2 tw-content-start tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3">
//                                     {input.options.value?.map((item, index) => (
//                                         <div
//                                             key={index}
//                                             onClick={() => handleAssetClick(item)}
//                                             className={`${FOCUS_VISIBLE_STYLE} tw-flex tw-relative tw-flex-col tw-w-full tw-cursor-pointer tw-m-2 tw-bg-white tw-shadow-sm tw-rounded-md tw-border-2 ${
//                                                 selectedAsset?.id === item.id ? 'tw-border-violet-60' : 'tw-border-transparent'
//                                             } tw-group`}
//                                         >
//                                             <div className="tw-p-4 tw-w-[">
//                                                 {onDelete && (
//                                                     <Checkbox 
//                                                         className="tw-absolute tw-top-[23px] tw-left-[23px] tw-h-[28px] tw-w-[28px]"
//                                                         size="large"
//                                                         value={selectedForDeletion.includes(item.id) ? true : false}
//                                                         onChange={(event) => {
//                                                             event.stopPropagation();
//                                                             toggleCheckbox(item.id);
//                                                         }}
//                                                     />
//                                                 )}

//                                                 <div className="tw-w-full tw-h-[154px] tw-bg-black-5 tw-text-center tw-rounded tw-flex tw-justify-center tw-items-center">
//                                                     <img
//                                                         className={`tw-object-contain tw-max-w-full tw-max-h-full ${
//                                                             'preview_available' in item && !item.preview_available ? 'tw-w-[60px]' : ''
//                                                         }`}
//                                                         src={item.previewUrl || item.externalUrl || item.genericUrl}
//                                                         alt={item.title}
//                                                         draggable="false"
//                                                     />
//                                                 </div>
//                                                 <div className="tw-mt-2 tw-text-sm tw-text-black-900 truncate" title={item.title}>
//                                                     {item.title}
//                                                 </div>
//                                                 <div className="tw-text-xs tw-text-black-500 tw-flex tw-gap-1">
//                                                     {item.width && item.height && (
//                                                         <Tag 
//                                                             label={`${item.width}x${item.height}`}
//                                                             size={TagSize.Small}
//                                                             type={TagType.Selected}
//                                                         />
//                                                     )}
//                                                     {item.extension && (
//                                                             <Tag 
//                                                                 label={item.extension.toUpperCase()}
//                                                                 size={TagSize.Small}
//                                                                 type={TagType.Selected}
//                                                             />
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </Dialog.Body>


//                     <Dialog.Footer>
//                         <div className="tw-flex tw-gap-2 tw-justify-end tw-p-2">
//                             {onDelete && (
//                                 <Button
//                                     emphasis="default"
//                                     variant="danger"
//                                     disabled={selectedForDeletion.length === 0}
//                                     onPress={handleDeleteSelected}
//                                 >
//                                     Delete Selected
//                                 </Button>
//                             )}
//                             <Dialog.Close>
//                                     <Button emphasis="default">Cancel</Button>
//                             </Dialog.Close>
//                             <Dialog.Close>
//                                 <Button>Submit</Button>
//                             </Dialog.Close>
//                         </div>
//                     </Dialog.Footer>
//                 </Dialog.Content>
//             </Dialog.Root>
//         </div>
//     );
// };

// export default Finderish;
