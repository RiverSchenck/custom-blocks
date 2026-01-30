/**
 * Shared data utilities for inter-block communication
 * This is a copy from element-filter to allow rules block to access regions/products data
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
