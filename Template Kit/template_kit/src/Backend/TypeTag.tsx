import { IconTextBrackets20, IconColorFan20, IconImage20 } from '@frontify/fondue';
import { Tag } from 'antd';
import { type FC } from 'react';

type TypeTagProps = {
    type: 'TEXT' | 'IMAGE' | 'COLOR';
};

export const TypeTag: FC<TypeTagProps> = ({ type }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '90px' }}>
            <Tag
                color={type === 'TEXT' ? 'blue' : type === 'COLOR' ? 'green' : 'purple'}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    width: '80px',
                }}
            >
                {type === 'TEXT' && (
                    <>
                        <IconTextBrackets20 />
                        {'Text'}
                    </>
                )}
                {type === 'COLOR' && (
                    <>
                        <IconColorFan20 />
                        {'Color'}
                    </>
                )}
                {type === 'IMAGE' && (
                    <>
                        <IconImage20 />
                        {'Image'}
                    </>
                )}
            </Tag>
        </div>
    );
};
