import { FC } from "react";
import { IconLockClosed, IconLockOpen } from "@frontify/fondue/icons";
import { Card } from "@frontify/fondue";

interface LockableIconProps {
    locked: boolean;
    onToggle: () => void;
}

export const LockableIcon: FC<LockableIconProps> = ({ locked, onToggle }) => {
    return (
        <div className="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center">
            <Card onClick={onToggle}>
                <div
                    className={`tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center cursor-pointer ${
                        locked ? "tw-bg-[#fafafa]" : "tw-bg-[#7c57ff]"
                    }`}
                >
                    {locked ? (
                        <IconLockClosed size={16} />
                    ) : (
                        <div className="tw-text-white">
                            <IconLockOpen size={16} />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
