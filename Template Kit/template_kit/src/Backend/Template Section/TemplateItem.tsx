import { DeleteOutlined } from '@ant-design/icons';
import { type FC } from 'react';

import { type TemplateData, type InputVar } from '../../types';

import { TemplateVariables } from './TemplateVariables';

type TemplateItemProps = {
    template: TemplateData;
    inputs: InputVar[];
    onDeleteTemplate: (id: number) => void;
    updateVariableMapping: (variableKey: string, inputId: string) => void;
};

export const TemplateItem: FC<TemplateItemProps> = ({ template, inputs, onDeleteTemplate, updateVariableMapping }) => {
    return (
        <div
            key={template.data.id}
            style={{
                marginTop: '16px',
                display: 'flex',
                justifyContent: 'space-between', // Adjusted for alignment
                alignItems: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                padding: '16px',
                width: '80%',
                backgroundColor: '#FAFAFA',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '.5px solid #e0e0e0',
                    borderRadius: '4px',
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    width: '200px',
                }}
            >
                <h3 style={{ marginBottom: 20 }}>{template.data.title}</h3>
                <img
                    src={template.data.previewUrl}
                    alt={template.data.title}
                    style={{
                        width: '150px',
                        height: '100px',
                        objectFit: 'fill',
                        borderRadius: '8px',
                    }}
                />
            </div>
            <TemplateVariables
                variables={template.variables}
                inputs={inputs}
                updateVariableMapping={updateVariableMapping}
            />
            <DeleteOutlined
                style={{ color: 'red', cursor: 'pointer', fontSize: '20px', alignSelf: 'center' }} // Adjusted alignment
                onClick={() => onDeleteTemplate(template.data.id)}
            />
        </div>
    );
};
