/**
 * Utilities for controlling section visibility via DOM manipulation
 */

/**
 * Find a section element by its data-id attribute
 */
export const getSectionElement = (sectionId: string): HTMLElement | null => {
    return document.querySelector(`[data-id="${sectionId}"]`);
};

/**
 * Hide a section by setting display: none
 */
export const hideSection = (sectionId: string): void => {
    const element = getSectionElement(sectionId);
    if (element) {
        element.style.display = 'none';
        console.log(`Hidden section: ${sectionId}`);
    } else {
        console.warn(`Section not found for hiding: ${sectionId}`);
    }
};

/**
 * Show a section by removing display: none
 */
export const showSection = (sectionId: string): void => {
    const element = getSectionElement(sectionId);
    if (element) {
        element.style.display = '';
        console.log(`Shown section: ${sectionId}`);
    } else {
        console.warn(`Section not found for showing: ${sectionId}`);
    }
};

/**
 * Check if an exception matches the current filter
 */
export type FilterState = {
    regionId: string | null;
    productId: string | null;
    regionName: string | null;
    productName: string | null;
};

export type ExceptionConfig = {
    selectedRegionProducts: Array<{ regionId: string; productId: string }>;
};

export const evaluateException = (exception: ExceptionConfig, currentFilter: FilterState): boolean => {
    if (!currentFilter.regionId || !currentFilter.productId) {
        return false;
    }

    // Check if current filter matches any of the exception's region/product combinations
    const matches = exception.selectedRegionProducts.some(
        (pair) => pair.regionId === currentFilter.regionId && pair.productId === currentFilter.productId,
    );

    console.log('evaluateException:', {
        currentFilter,
        selectedRegionProducts: exception.selectedRegionProducts,
        matches,
    });

    return matches;
};
