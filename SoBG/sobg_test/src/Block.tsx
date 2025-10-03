import { useBlockSettings } from '@frontify/app-bridge';
import { TextInput } from '@frontify/fondue-components';
import { type BlockProps } from '@frontify/guideline-blocks-settings';
import { type FC, useState, useEffect } from 'react';

export type Settings = {
    formInput: string;
    lastUpdatedBy?: {
        name: string;
        image: string;
        date: string;
    };
};

export const AnExampleBlock: FC<BlockProps> = ({ appBridge }) => {
    // ✅ 1. Use hook for initial load
    const [blockSettings] = useBlockSettings<Settings>(appBridge);
    const { formInput = '', lastUpdatedBy } = blockSettings;

    // ✅ 2. Local state synced from hook first, then from polling
    const [value, setValue] = useState(formInput);
    const [localLastUpdated, setLocalLastUpdated] = useState(lastUpdatedBy);

    // Sync with lastUpdatedBy
    useEffect(() => {
        setLocalLastUpdated(lastUpdatedBy);
    }, [lastUpdatedBy]);

    // Keep local state in sync with hook on first render
    useEffect(() => {
        setValue(formInput);
    }, [formInput]);

    const handleChange = async (newValue: string) => {
        setValue(newValue);
        try {
            const user = await appBridge.getCurrentLoggedUser();
            const updatedInfo = {
                name: user.name,
                image: user.image?.image ?? '',
                date: new Date().toISOString(),
            };

            await appBridge
                .updateBlockSettings({
                    formInput: newValue,
                    lastUpdatedBy: updatedInfo,
                })
                .catch(() => {
                    //  ignore
                });

            setLocalLastUpdated(updatedInfo); // for immediate UI update
        } catch {
            // ignore errors
        }
    };

    // ✅ 4. Poll for remote updates using getBlockSettings
    useEffect(() => {
        const poll = async () => {
            try {
                const settings = await appBridge.getBlockSettings<Settings>();
                const remoteValue = settings?.formInput ?? '';
                const remoteLastUpdatedBy = settings?.lastUpdatedBy;
                if (remoteValue !== value) {
                    setValue(remoteValue);
                }
                if (JSON.stringify(remoteLastUpdatedBy) !== JSON.stringify(localLastUpdated)) {
                    setLocalLastUpdated(remoteLastUpdatedBy);
                }
            } catch {
                // ignore
            }
        };

        const intervalId = setInterval(() => {
            poll().catch(() => {
                //  ignore
            });
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [appBridge, value]);

    return (
        <div>
            <TextInput value={value} onChange={(e) => handleChange(e.target.value)} />

            {localLastUpdated && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                        src={localLastUpdated.image}
                        alt={localLastUpdated.name}
                        style={{ width: 24, height: 24, borderRadius: '50%' }}
                    />
                    <span style={{ fontSize: 12, color: '#555' }}>
                        Last updated by <strong>{localLastUpdated.name}</strong> on{' '}
                        {new Date(localLastUpdated.date).toLocaleString()}
                    </span>
                </div>
            )}
        </div>
    );
};
