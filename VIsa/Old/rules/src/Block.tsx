import { LinkOutlined } from '@ant-design/icons';
import { useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { Button, message, Tag } from 'antd';
import { type FC, useEffect, useState } from 'react';

import { ExceptionConfig, RuleConfig } from './components';
import { subscribeToFilterChanges } from './utils/filterListener';
import { registerRule, unregisterRule } from './utils/ruleRegistry';
import {
    evaluateException,
    hideSection,
    showSection,
    type ExceptionConfig as ExceptionConfigType,
} from './utils/sectionVisibility';

type Settings = {
    rule_type?: 'rule' | 'exception';
    id?: string;
    section_id?: string;
    legacy_id?: string;
    default_rule_section_id?: string;
    selected_region_products?: Array<{ regionId: string; productId: string }>;
    regions?: Array<{ id: string; name: string }>;
    products?: Array<{ id: string; name: string; category: string }>;
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    const [blockSettings, setBlockSettings] = useBlockSettings<Settings>(appBridge);
    const isEditing = useEditorState(appBridge);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const [blockId, setBlockId] = useState<string | null>(null);

    useEffect(() => {
        // Get section ID and block ID
        const sectionIdValue = appBridge.context('sectionId').get();
        const id = appBridge.context('blockId').get();
        setSectionId(sectionIdValue ? String(sectionIdValue) : null);
        setBlockId(id ? String(id) : null);
    }, [appBridge]);

    // Register/unregister rule in registry
    useEffect(() => {
        if (!blockId || !sectionId) {
            return undefined;
        }

        const ruleType = blockSettings.rule_type || 'rule';
        const ruleId = blockSettings.id;

        if (ruleId && ruleType === 'rule') {
            // Register default rule
            registerRule({
                blockId: String(blockId),
                id: ruleId,
                sectionId,
                ruleType: 'rule',
                legacyId: blockSettings.legacy_id,
            });
        } else if (ruleId && ruleType === 'exception') {
            // Register exception with reference to default rule
            registerRule({
                blockId: String(blockId),
                id: ruleId,
                sectionId,
                ruleType: 'exception',
                defaultRuleSectionId: blockSettings.default_rule_section_id,
                legacyId: blockSettings.legacy_id,
            });
        }

        // Cleanup: unregister when component unmounts
        return () => {
            if (blockId) {
                unregisterRule(String(blockId));
            }
        };
    }, [
        blockId,
        sectionId,
        blockSettings.rule_type,
        blockSettings.id,
        blockSettings.default_rule_section_id,
        blockSettings.legacy_id,
    ]);

    // Auto-set section_id for default rules from block's section ID
    useEffect(() => {
        if (isEditing && sectionId && blockSettings.rule_type === 'rule' && blockSettings.section_id !== sectionId) {
            setBlockSettings({ ...blockSettings, section_id: sectionId }).catch((error) => {
                console.error('Error setting section_id:', error);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, sectionId, blockSettings.rule_type, blockSettings.section_id]);

    // Ensure section element has an ID attribute for link navigation
    useEffect(() => {
        if (!sectionId) {
            return undefined;
        }

        const sectionElement = document.querySelector(`[data-id="${sectionId}"]`);
        if (sectionElement && !sectionElement.id) {
            sectionElement.id = `section-${sectionId}`;
        }

        return undefined;
    }, [sectionId]);

    // Handle scrolling to section on page load if URL has section parameter
    useEffect(() => {
        if (isEditing || !sectionId) {
            return undefined;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const sectionParam = urlParams.get('section');
        const hashSection = window.location.hash.replace('#section-', '').replace('#', '');

        // Check if this section should be scrolled to
        if (sectionParam === sectionId || hashSection === sectionId) {
            // Wait a bit for page to load, then scroll
            const scrollTimeout = setTimeout(() => {
                const sectionElement = document.querySelector(`[data-id="${sectionId}"]`);
                if (sectionElement) {
                    // Ensure element has an id for hash navigation
                    if (!sectionElement.id) {
                        sectionElement.id = `section-${sectionId}`;
                    }
                    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);

            return () => {
                clearTimeout(scrollTimeout);
            };
        }

        return undefined;
    }, [isEditing, sectionId]);

    // Show all sections when in edit mode
    useEffect(() => {
        if (isEditing) {
            const ruleType = blockSettings.rule_type || 'rule';

            if (ruleType === 'rule') {
                // Show the default rule section
                const sectionIdToControl = blockSettings.section_id || sectionId;
                if (sectionIdToControl) {
                    showSection(sectionIdToControl);
                }
            } else if (ruleType === 'exception') {
                // Show both default and exception sections
                const defaultRuleSectionId = blockSettings.default_rule_section_id;
                const exceptionSectionId = sectionId;

                if (defaultRuleSectionId) {
                    showSection(defaultRuleSectionId);
                }
                if (exceptionSectionId) {
                    showSection(exceptionSectionId);
                }
            }

            return undefined;
        }
    }, [
        isEditing,
        blockSettings.rule_type,
        blockSettings.section_id,
        blockSettings.default_rule_section_id,
        sectionId,
    ]);

    // Handle rule/exception visibility logic in view mode
    useEffect(() => {
        if (isEditing) {
            return undefined;
        }

        const ruleType = blockSettings.rule_type || 'rule';

        if (ruleType === 'rule') {
            // For default rules: Show the section by default, hide if any exception matches
            const sectionIdToControl = blockSettings.section_id;
            if (!sectionIdToControl) {
                return undefined;
            }

            const cleanup = subscribeToFilterChanges((filter) => {
                if (!filter || !filter.regionId || !filter.productId) {
                    // No filter selected, show default section
                    showSection(sectionIdToControl);
                    return;
                }

                // Check if any exception on the page matches this filter
                // We'll need to check all exception blocks, but for now we'll show the default
                // The exception blocks will handle hiding it if they match
                showSection(sectionIdToControl);
            });

            return cleanup;
        } else if (ruleType === 'exception') {
            // For exceptions: Evaluate if this exception matches, control both default and exception sections
            const defaultRuleSectionId = blockSettings.default_rule_section_id;
            const selectedRegionProducts = blockSettings.selected_region_products || [];
            const exceptionSectionId = sectionId;

            console.log('Exception block settings:', {
                defaultRuleSectionId,
                selectedRegionProducts,
                exceptionSectionId,
                blockSettings,
            });

            if (!defaultRuleSectionId || !exceptionSectionId) {
                console.warn('Exception block missing required IDs:', {
                    defaultRuleSectionId,
                    exceptionSectionId,
                });
                return;
            }

            const exceptionConfig: ExceptionConfigType = {
                selectedRegionProducts,
            };

            const cleanup = subscribeToFilterChanges((filter) => {
                if (!filter || !filter.regionId || !filter.productId) {
                    // No filter selected, show default, hide exception
                    showSection(defaultRuleSectionId);
                    hideSection(exceptionSectionId);
                    return;
                }

                const matches = evaluateException(exceptionConfig, filter);

                console.log('Exception evaluation:', {
                    filter,
                    selectedRegionProducts,
                    matches,
                    defaultRuleSectionId,
                    exceptionSectionId,
                });

                if (matches) {
                    // Exception matches: Hide default, show exception
                    console.log('Exception matches - hiding default, showing exception');
                    hideSection(defaultRuleSectionId);
                    showSection(exceptionSectionId);
                } else {
                    // Exception doesn't match: Show default, hide exception
                    console.log('Exception does not match - showing default, hiding exception');
                    showSection(defaultRuleSectionId);
                    hideSection(exceptionSectionId);
                }
            });

            return cleanup;
        }

        return undefined;
    }, [isEditing, blockSettings, sectionId]);

    // Handle save for exception configuration
    const handleExceptionSave = async (
        defaultRuleSectionId: string,
        selectedRegionProducts: Array<{ regionId: string; productId: string }>,
        allRegions: Array<{ id: string; name: string }>,
        allProducts: Array<{ id: string; name: string; category: string }>,
    ) => {
        await setBlockSettings({
            ...blockSettings,
            default_rule_section_id: defaultRuleSectionId,
            selected_region_products: selectedRegionProducts,
            regions: allRegions,
            products: allProducts,
        });
    };

    // Render configuration UI in edit mode
    if (isEditing) {
        const ruleType = blockSettings.rule_type || 'rule';

        if (ruleType === 'rule') {
            return <RuleConfig sectionId={sectionId} id={blockSettings.id} legacyId={blockSettings.legacy_id} />;
        } else {
            return (
                <ExceptionConfig
                    id={blockSettings.id}
                    legacyId={blockSettings.legacy_id}
                    defaultRuleSectionId={blockSettings.default_rule_section_id || ''}
                    selectedRegionProducts={blockSettings.selected_region_products || []}
                    onDefaultRuleSectionIdChange={async (value) => {
                        await setBlockSettings({ ...blockSettings, default_rule_section_id: value });
                    }}
                    onSelectedRegionProductsChange={async (pairs) => {
                        await setBlockSettings({ ...blockSettings, selected_region_products: pairs });
                    }}
                    onSave={handleExceptionSave}
                />
            );
        }
    }

    // In view mode, show a tag for rules and exceptions with ID | legacy ID
    const ruleType = blockSettings.rule_type || 'rule';
    if (blockSettings.id || blockSettings.legacy_id) {
        const tagText = [blockSettings.id, blockSettings.legacy_id].filter(Boolean).join(' | ');
        const tagColor = ruleType === 'rule' ? 'blue' : 'green';

        const handleCopyLink = async () => {
            if (!sectionId) {
                return;
            }

            // Ensure section has an ID attribute
            const sectionElement = document.querySelector(`[data-id="${sectionId}"]`);
            if (sectionElement && !sectionElement.id) {
                sectionElement.id = `section-${sectionId}`;
            }

            // Method 1: Use query parameter (most reliable)
            const url = new URL(window.location.href);
            url.searchParams.set('section', sectionId);

            // Method 2: Also add hash fragment as fallback
            url.hash = `section-${sectionId}`;

            const linkUrl = url.toString();

            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                try {
                    await navigator.clipboard.writeText(linkUrl);
                    await message.success('Link copied to clipboard!');
                    return;
                } catch (error) {
                    console.error('Clipboard API failed:', error);
                }
            }

            // Fallback: Use execCommand
            try {
                const textArea = document.createElement('textarea');
                textArea.value = linkUrl;
                textArea.style.position = 'fixed';
                textArea.style.top = '0';
                textArea.style.left = '0';
                textArea.style.width = '2em';
                textArea.style.height = '2em';
                textArea.style.padding = '0';
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                textArea.style.opacity = '0';
                textArea.style.zIndex = '-9999';

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    await message.success('Link copied to clipboard!');
                } else {
                    await message.error('Failed to copy link. Please copy manually.');
                }
            } catch (error_) {
                console.error('Fallback copy failed:', error_);
                await message.error('Failed to copy link. Please copy manually.');
            }
        };

        return (
            <div className="tw-inline-flex tw-items-center tw-gap-2">
                <Tag color={tagColor}>{tagText}</Tag>
                {sectionId && (
                    <Button
                        type="text"
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={handleCopyLink}
                        title="Copy link to this section"
                        className="tw-text-gray-500 hover:tw-text-gray-700"
                    />
                )}
            </div>
        );
    }

    // For rules/exceptions without ID/legacy ID, don't render anything visible
    // It only controls section visibility via DOM manipulation
    return null;
};
