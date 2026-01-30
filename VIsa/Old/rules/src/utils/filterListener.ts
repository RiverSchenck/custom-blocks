/**
 * Utilities for listening to filter state changes from element-filter block
 */

import { type FilterState } from './sectionVisibility';

const STORAGE_KEY = 'visa-element-filter';
const EVENT_NAME = 'visa-filter-changed';

/**
 * Get current filter state from localStorage
 */
export const getCurrentFilter = (): FilterState | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return null;
        }
        return JSON.parse(stored) as FilterState;
    } catch (error) {
        console.error('Error reading filter state:', error);
        return null;
    }
};

/**
 * Subscribe to filter state changes
 * Returns cleanup function
 */
export const subscribeToFilterChanges = (callback: (filter: FilterState | null) => void): (() => void) => {
    // Call immediately with current filter
    callback(getCurrentFilter());

    // Listen for custom events (same page)
    const handleCustomEvent = (event: Event) => {
        const customEvent = event as CustomEvent<FilterState>;
        callback(customEvent.detail);
    };

    // Listen for storage events (cross-tab)
    const handleStorageEvent = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY) {
            callback(getCurrentFilter());
        }
    };

    window.addEventListener(EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    // Return cleanup function
    return () => {
        window.removeEventListener(EVENT_NAME, handleCustomEvent);
        window.removeEventListener('storage', handleStorageEvent);
    };
};
