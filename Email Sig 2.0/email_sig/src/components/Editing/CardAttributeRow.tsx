import { FC, ReactNode } from 'react';
import { Text } from '@frontify/fondue';
import { LockableIcon } from './LockableIcon'; // Make sure this path is correct

type CardAttributeRowProps = {
    label: string;
    locked?: boolean;
    onToggleLock?: () => void;
    children: ReactNode;
    alignTop?: boolean;
};

export const CardAttributeRow: FC<CardAttributeRowProps> = ({
    label,
    locked,
    onToggleLock,
    children,
    alignTop = false,
}) => {
    return (
        <div className={`tw-flex tw-justify-between tw-items-${alignTop ? 'start' : 'center'} tw-p-2`}>
            <div className="tw-flex tw-items-center tw-gap-2 tw-flex-grow">
                {onToggleLock ? (
                    <LockableIcon locked={locked ?? false} onToggle={onToggleLock} />
                ) : (
                    <div className="tw-w-[24px]" /> // spacer to align with locked rows
                )}
                <Text size="small">{label}</Text>
            </div>
            <div className="tw-ml-auto">{children}</div>
        </div>
    );
};
