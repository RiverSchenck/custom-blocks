import { Table, Button } from 'antd';
import React, { useState, useEffect } from 'react';

import { useAssetChooser } from './AssetChooser';
import ImageSelectorButton from './ImageSelectorButton';
import { type ColorImageMap, type CreateMap } from '../types';

const ItemTable = ({ appBridge }: ItemTableProps) => {

    const { openAssetChooserModal, subscribeToAssets } = useAssetChooser({
        appBridge,
        onAssetSelected: (url, title) => {
            if (currentCell) {
                const newData = dataSource.map((row) => {
                    if (row.key === currentCell.key) {
                        console.log('Updating row:', currentCell.dataIndex);
                        return {
                            ...row,
                            [currentCell.dataIndex]: <img src={url} alt={title} style={{ width: 50, height: 50 }} />,
                        };
                    }
                    return row;
                });
                setDataSource(newData);
            }
        },
    });

    useEffect(() => {
        subscribeToAssets();
    }, []);

  

    return (
        <div>

        </div>
    );
};

export default ItemTable;
