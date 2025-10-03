import { Button } from 'antd';
import React from 'react';

type ImageSelectorButtonProps = {
    openAssetChooser: () => void; // Function to open the asset chooser modal
    setCurrentCell: (cell: { key: number; dataIndex: string }) => void; // Function to set the current cell
    recordKey: number; // The unique key of the row
    dataIndex: string; // The dataIndex of the column
};

const ImageSelectorButton: React.FC<ImageSelectorButtonProps> = ({
    openAssetChooser,
    setCurrentCell,
    recordKey,
    dataIndex,
}) => {
    const handleOpenChooser = () => {
        setCurrentCell({ key: recordKey, dataIndex });
        openAssetChooser();
    };

    return <Button onClick={handleOpenChooser}>Select Image</Button>;
};

export default ImageSelectorButton;
