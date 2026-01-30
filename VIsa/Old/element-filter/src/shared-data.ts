/**
 * Shared data utilities for inter-block communication
 * This allows other blocks to access regions and products data without making API calls
 */

export type SharedRegion = {
    id: string;
    name: string;
};

export type SharedProduct = {
    id: string;
    name: string;
    category: string;
};

export type SharedRegionsProducts = {
    regions: SharedRegion[];
    products: SharedProduct[];
};

const STORAGE_KEY = 'visa-shared-regions-products';
const EVENT_NAME = 'visa-regions-products-updated';

/**
 * Broadcast regions and products data to other blocks
 */
export const broadcastRegionsProducts = (regions: SharedRegion[], products: SharedProduct[]): void => {
    const data: SharedRegionsProducts = { regions, products };

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Broadcast custom event for same-page communication
    window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
            detail: data,
        }),
    );

    // Trigger storage event for cross-tab communication
    window.dispatchEvent(
        new StorageEvent('storage', {
            key: STORAGE_KEY,
            newValue: JSON.stringify(data),
        }),
    );
};

/**
 * Get regions and products from localStorage
 * Returns null if data is not available
 */
export const getSharedRegionsProducts = (): SharedRegionsProducts | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return null;
        }
        return JSON.parse(stored) as SharedRegionsProducts;
    } catch (error) {
        console.error('Error reading shared regions/products:', error);
        return null;
    }
};

/**
 * Hook-like function to subscribe to regions/products updates
 * Returns the current data and a cleanup function
 */
export const subscribeToRegionsProducts = (callback: (data: SharedRegionsProducts | null) => void): (() => void) => {
    // Call immediately with current data
    callback(getSharedRegionsProducts());

    // Listen for custom events (same page)
    const handleCustomEvent = (event: Event) => {
        const customEvent = event as CustomEvent<SharedRegionsProducts>;
        callback(customEvent.detail);
    };

    // Listen for storage events (cross-tab)
    const handleStorageEvent = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY) {
            callback(getSharedRegionsProducts());
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
