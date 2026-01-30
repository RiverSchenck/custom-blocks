/**
 * Shared state management for Frontify blocks
 * Uses Custom Events for real-time communication and Local Storage for persistence
 */

const STORAGE_KEY = 'frontify_shared_region_state';
const EVENT_NAME = 'frontify:region-changed';

export type SharedRegionState = {
    regionId: string | null;
    regionName: string | null;
    timestamp: number;
};

/**
 * Get the current selected region from storage
 */
export const getSharedRegion = (): SharedRegionState | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return null;
        }
        return JSON.parse(stored) as SharedRegionState;
    } catch (error) {
        console.error('Failed to read shared region state:', error);
        return null;
    }
};

/**
 * Set the selected region and broadcast to all blocks
 */
export const setSharedRegion = (regionId: string | null, regionName: string | null): void => {
    if (typeof window === 'undefined') {
        return;
    }

    const state: SharedRegionState = {
        regionId,
        regionName,
        timestamp: Date.now(),
    };

    try {
        // Save to localStorage for persistence
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

        // Broadcast to all blocks via Custom Event
        const event = new CustomEvent<SharedRegionState>(EVENT_NAME, {
            detail: state,
            bubbles: true,
        });
        window.dispatchEvent(event);
    } catch (error) {
        console.error('Failed to set shared region state:', error);
    }
};

/**
 * Subscribe to region changes
 * Returns an unsubscribe function
 */
export const subscribeToRegionChanges = (callback: (state: SharedRegionState | null) => void): (() => void) => {
    if (typeof window === 'undefined') {
        return () => {};
    }

    const handler = (event: Event) => {
        const customEvent = event as CustomEvent<SharedRegionState>;
        callback(customEvent.detail);
    };

    // Listen for custom events
    window.addEventListener(EVENT_NAME, handler);

    // Also call immediately with current state
    callback(getSharedRegion());

    // Return unsubscribe function
    return () => {
        window.removeEventListener(EVENT_NAME, handler);
    };
};
