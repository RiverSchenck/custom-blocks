import { FC } from "react";
import { SignatureInput } from "../../types";
import { OrderableList, OrderableListItem, DraggableItem } from '@frontify/fondue';
import { Text } from '@frontify/fondue';

interface InputListProps {
    inputs: SignatureInput[];
    selectedId: string;
    onSelect: (id: string) => void;
    onReorder: (newOrder: SignatureInput[]) => void;
    onDelete: (id: string) => void;
}

export const InputList: FC<InputListProps> = ({ inputs, selectedId, onDelete, onSelect, onReorder }) => {
    // Convert inputs to OrderableListItem format
    const orderableItems: OrderableListItem<SignatureInput>[] = inputs.map((input, index) => ({
        ...input,
        alt: input.name || "Untitled",
        sort: index,
    }));

// Handle reordering
const handleMove = (movedItems: DraggableItem<SignatureInput>[]) => {
    // Extract the moved item (since movedItems contains only one item)
    const movedItem = movedItems[0];
    
    // Find the original index of the moved item
    const currentIndex = inputs.findIndex((input) => input.id === movedItem.id);
    if (currentIndex === -1) return;

    // Get the new index directly from the sort property
    const newIndex = movedItem.sort;

    // Create a copy of the inputs array
    const updatedInputs = [...inputs];

    // Remove the moved item from its original position
    const [removedItem] = updatedInputs.splice(currentIndex, 1);

    // Insert the moved item at the new position
    updatedInputs.splice(newIndex, 0, removedItem);

    console.log("Reordered Inputs:", updatedInputs);
    onReorder(updatedInputs); // Update the order using the reordered list
};

    return (
        <div className="tw-w-full">
            <OrderableList
                dragHandlerPosition='left'
                enableDragDelay
                itemStyle={{
                    activeColorStyle: 'soft',
                    borderRadius: 'small',
                    borderStyle: 'solid',
                    borderWidth: 'x-small',
                    contentHight: 'content-fit',
                    shadow: 'small',
                    spacingY: 'x-small'
                }}
                items={orderableItems}
                dragDisabled={false}
                selectedId={selectedId}
                onMove={handleMove}
                renderContent={(item) => (
                    <div
                        key={`${item.id}-list-item`}
                        onClick={() => onSelect(item.id)}  // Ensure onSelect is called
                        className={`tw-flex tw-items-center tw-p-1 tw-text-xxs ${
                            selectedId === item.id ? "tw-bg-gray-200" : "tw-bg-white"
                        }`}
                    >
                        <Text size="x-small" whitespace="nowrap" overflow="ellipsis">{item.alt}</Text>
                        <button
            onClick={(e) => {
                e.stopPropagation(); // prevent selecting the item when clicking delete
                onDelete(item.id);
            }}
            className="tw-ml-2 tw-text-red-500 tw-text-xs hover:tw-text-red-700"
        >
            ✕
        </button>
                    </div>
                )}
            />
        </div>
    );
};
