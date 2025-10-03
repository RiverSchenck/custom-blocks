// src/storage.ts
import { type ProgressItem } from './types';

export const STORAGE_KEY = 'frontify_lms_progress';

// Function to get progress items from localStorage
export const getStoredProgressItems = (): ProgressItem[] => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    return storedItems ? (JSON.parse(storedItems) as ProgressItem[]) : [];
};

// Function to save progress items to localStorage
export const saveProgressItems = (items: ProgressItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

// Function to remove a progress item by its ID
export const removeProgressItem = (id: number) => {
    const progressItems = getStoredProgressItems();
    const updatedItems = progressItems.filter((item) => item.id !== id);
    saveProgressItems(updatedItems);
    console.log(`Removed progress item with ID: ${id}`);
};
