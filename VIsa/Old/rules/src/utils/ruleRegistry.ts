/**
 * Registry for sharing rule information between blocks on the same page
 * This allows exception blocks to see available default rules
 */

export type RuleInfo = {
    blockId: string;
    id: string;
    sectionId: string;
    ruleType: 'rule' | 'exception';
    defaultRuleSectionId?: string; // For exceptions: which default rule they reference
    legacyId?: string; // Legacy ID for the rule/exception
};

const STORAGE_KEY = 'visa-rules-registry';
const EVENT_NAME = 'visa-rule-registered';

/**
 * Register a rule block
 */
export const registerRule = (ruleInfo: RuleInfo): void => {
    const existing = getRegisteredRules();
    const updated = existing.filter((r) => r.blockId !== ruleInfo.blockId);
    updated.push(ruleInfo);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
            detail: updated,
        }),
    );
};

/**
 * Unregister a rule block (when block is deleted)
 */
export const unregisterRule = (blockId: string): void => {
    const existing = getRegisteredRules();
    const updated = existing.filter((r) => r.blockId !== blockId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
            detail: updated,
        }),
    );
};

/**
 * Get all registered rules
 */
export const getRegisteredRules = (): RuleInfo[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        return JSON.parse(stored) as RuleInfo[];
    } catch (error) {
        console.error('Error reading rules registry:', error);
        return [];
    }
};

/**
 * Get only default rules (for exception dropdown)
 */
export const getDefaultRules = (): RuleInfo[] => {
    return getRegisteredRules().filter((r) => r.ruleType === 'rule');
};

/**
 * Subscribe to rule registry updates
 */
export const subscribeToRulesRegistry = (callback: (rules: RuleInfo[]) => void): (() => void) => {
    callback(getRegisteredRules());

    const handleEvent = (event: Event) => {
        const customEvent = event as CustomEvent<RuleInfo[]>;
        callback(customEvent.detail);
    };

    window.addEventListener(EVENT_NAME, handleEvent);

    return () => {
        window.removeEventListener(EVENT_NAME, handleEvent);
    };
};

/**
 * Get exceptions that reference a specific default rule
 */
export const getExceptionsForRule = (defaultRuleSectionId: string): RuleInfo[] => {
    const allRules = getRegisteredRules();
    return allRules.filter((r) => r.ruleType === 'exception' && r.defaultRuleSectionId === defaultRuleSectionId);
};
