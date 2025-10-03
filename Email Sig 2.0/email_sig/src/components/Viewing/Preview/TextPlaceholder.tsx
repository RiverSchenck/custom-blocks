import { FC } from 'react';

interface Props {
    pixelHeight: number;
    placeholderLabel?: string;
}

export const TextPlaceholder: FC<Props> = ({ pixelHeight, placeholderLabel }) => {
    const displayLabel = placeholderLabel || 'Placeholder';

    return (
        <div
            className="tw-inline-block tw-align-center"
            style={{
                height: `${pixelHeight}px`,
                lineHeight: `${pixelHeight}px`,
            }}
        >
            <div
                className="tw-inline-block tw-bg-black tw-rounded-sm tw-opacity-40 tw-text-transparent tw-select-none"
                style={{
                    height: '60%',
                }}
            >
                {displayLabel}
            </div>
        </div>
    );
};
