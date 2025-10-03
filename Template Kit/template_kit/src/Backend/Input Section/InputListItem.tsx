import { DeleteOutlined } from '@ant-design/icons';
import { type FC } from 'react';

import { type InputVar } from '../../types';
import { TypeTag } from '../TypeTag';

type InputListItemProps = {
    input: InputVar;
    onDelete: (id: string) => void;
};

export const InputListItem: FC<InputListItemProps> = ({ input, onDelete }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                padding: '8px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                width: '290px',
            }}
        >
            <TypeTag type={input.type} />
            <p style={{ flexGrow: 1, margin: 0 }}>{input.title}</p>
            <DeleteOutlined
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => onDelete(input.id)}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'darkred')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'red')}
            />
        </div>
    );
};
