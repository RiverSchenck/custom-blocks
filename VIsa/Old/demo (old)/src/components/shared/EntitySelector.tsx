import { Select } from 'antd';
import { type FC } from 'react';

type EntitySelectorProps = {
    value?: string;
    onChange?: (value: string) => void;
    options: Array<{ id: string; name: string; identifier?: string }>;
    placeholder?: string;
    loading?: boolean;
};

export const EntitySelector: FC<EntitySelectorProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    loading = false,
}) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            loading={loading}
            style={{ width: '100%' }}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={options.map((opt) => ({
                value: opt.id,
                label: `${opt.name}${opt.identifier ? ` (${opt.identifier})` : ''}`,
            }))}
        />
    );
};
