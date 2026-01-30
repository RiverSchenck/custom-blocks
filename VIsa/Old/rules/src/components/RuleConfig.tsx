import { Card, Tag } from 'antd';
import { type FC, useEffect, useState } from 'react';

import { getExceptionsForRule, subscribeToRulesRegistry, type RuleInfo } from '../utils/ruleRegistry';

type RuleConfigProps = {
    sectionId: string | null;
    id?: string;
    legacyId?: string;
};

export const RuleConfig: FC<RuleConfigProps> = ({ sectionId, id, legacyId }) => {
    const [linkedExceptions, setLinkedExceptions] = useState<RuleInfo[]>([]);

    useEffect(() => {
        if (!sectionId) {
            return undefined;
        }

        // Subscribe to rules registry to find exceptions that reference this rule
        const cleanup = subscribeToRulesRegistry(() => {
            // Find exceptions that reference this rule's section ID
            const exceptions = getExceptionsForRule(sectionId);
            setLinkedExceptions(exceptions);
        });

        // Also check immediately
        const exceptions = getExceptionsForRule(sectionId);
        setLinkedExceptions(exceptions);

        return cleanup;
    }, [sectionId]);

    const tagText = [id, legacyId].filter(Boolean).join(' | ');

    return (
        <Card title="Default Rule Configuration" style={{ width: '100%' }}>
            <div className="tw-space-y-4">
                {tagText && (
                    <div>
                        <p className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Rule Identifier</p>
                        <Tag color="blue" className="tw-text-sm">
                            {tagText}
                        </Tag>
                    </div>
                )}

                {linkedExceptions.length > 0 && (
                    <div className="tw-pt-4 tw-border-t tw-border-gray-200">
                        <p className="tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">Linked Exceptions</p>
                        <div className="tw-flex tw-flex-wrap tw-gap-2">
                            {linkedExceptions.map((exception) => {
                                const exceptionTagText = [exception.id, exception.legacyId].filter(Boolean).join(' | ');
                                return (
                                    <Tag key={exception.blockId} color="green">
                                        {exceptionTagText || exception.id || 'Exception'}
                                    </Tag>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};
