import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useBlockSettings, use } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { Button, Space, Tag } from 'antd';
import { useEffect, useState, type FC } from 'react';

import { getStoredProgressItems, saveProgressItems } from './storage';
import style from './style.module.css';
import { type ProgressItem, type BlockSettings } from './types';

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<BlockSettings>(appBridge);
    const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
    const [currentItem, setCurrentItem] = useState<ProgressItem | null>(null);

    useEffect(() => {
        // Load existing progress items from storage
        const storedItems = getStoredProgressItems();
        console.log('Loaded stored items:', storedItems);
        setProgressItems(storedItems);
    }, []);

    useEffect(() => {
        const blockName = blockSettings['progress-name'] ?? 'Unnamed Block';
        const blockId = blockSettings.blockId ?? appBridge.context().get().blockId;

        if (!blockId) {
            console.warn('Block ID is missing.');
            return;
        }

        console.log(appBridge);
        console.log(blockSettings);

        if (!blockSettings.progressData) {
            // Create a new progress item and store it in block settings
            const newItem: ProgressItem = {
                id: blockId,
                name: blockName,
                completed: false,
                link: window.location.href,
            };

            setBlockSettings({ ...blockSettings, progressData: newItem }).catch((error) => console.error(error));
            setCurrentItem(newItem);

            setProgressItems((prevItems) => {
                const updatedItems = [...prevItems, newItem];
                saveProgressItems(updatedItems);
                return updatedItems;
            });
        } else {
            // If block settings already have a progress item, check if it's in local storage
            const existingItem = blockSettings.progressData;
            const storedItems = getStoredProgressItems();

            // If ID is missing from localStorage, add it
            if (!storedItems.some((item: ProgressItem) => item.id === existingItem.id)) {
                const updatedItems = [...storedItems, existingItem];
                saveProgressItems(updatedItems);
                setProgressItems(updatedItems);
            }

            // Update name if changed
            if (existingItem.name !== blockName) {
                const updatedItem = { ...existingItem, name: blockName };
                setBlockSettings({ ...blockSettings, progressData: updatedItem }).catch((error) =>
                    console.error(error),
                );

                setProgressItems((prevItems) => {
                    const updatedItems = prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
                    saveProgressItems(updatedItems);
                    return updatedItems;
                });

                setCurrentItem(updatedItem);
            } else {
                setCurrentItem(existingItem);
            }
        }
    }, [blockSettings, setBlockSettings, appBridge]);

    // Ensure `progressItems` stays synced with `localStorage`
    useEffect(() => {
        if (progressItems.length > 0) {
            saveProgressItems(progressItems);
        }
    }, [progressItems]);

    const updateCompletionStatus = async (completed: boolean) => {
        if (!currentItem) {
            return;
        }

        const updatedItem = { ...currentItem, completed };
        setCurrentItem(updatedItem);
        await setBlockSettings({ ...blockSettings, progressData: updatedItem }).catch((error) => console.error(error));

        setProgressItems((prevItems) => {
            const updatedItems = prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item));
            saveProgressItems(updatedItems);
            return updatedItems;
        });
    };

    return (
        <div className={style.container}>
            <Space direction="vertical" size="middle" align="center">
                {currentItem?.completed ? (
                    <>
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                            Completed
                        </Tag>
                        <Button
                            type="primary"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => updateCompletionStatus(false)}
                        >
                            Mark as Incomplete
                        </Button>
                    </>
                ) : (
                    <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => updateCompletionStatus(true)}>
                        Mark as Complete
                    </Button>
                )}
            </Space>
        </div>
    );
};
