import { Select } from 'antd';
import { type FC } from 'react';

import { type Variable, type InputVar } from '../../types';
import { TypeTag } from '../TypeTag';

const { Option } = Select;

type TemplateVariablesProps = {
    variables: Variable[];
    inputs: InputVar[];
    updateVariableMapping: (variableKey: string, inputId: string) => void;
};

function formatVariableValue(variable: Variable): string {
    if (variable.type === 'COLOR') {
        if (!variable.value) {
            return 'Undefined color value';
        }
        const colorValue = variable.value as { id: string | null; r: number; g: number; b: number; a: number };
        return colorValue.id
            ? `Color ID: ${colorValue.id}`
            : `RGBA: (${colorValue.r}, ${colorValue.g}, ${colorValue.b}, ${colorValue.a})`;
    }
    return variable.value ? variable.value.toString() : 'Undefined value';
}

export const TemplateVariables: FC<TemplateVariablesProps> = ({ variables, inputs, updateVariableMapping }) => {
    const getInputOptions = (variableType: string) => {
        return inputs
            .filter((input) => input.type === variableType)
            .map((input) => (
                <Option key={input.id} value={input.id}>
                    {input.title}
                </Option>
            ));
    };

    return (
        <ul style={{ marginTop: 10 }}>
            {variables.map((variable) => (
                <li key={variable.key} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <TypeTag type={variable.type} />
                    <Select
                        style={{ width: '200px' }}
                        status={variable.mappedInput ? '' : 'error'}
                        placeholder={formatVariableValue(variable)}
                        value={variable.mappedInput || null}
                        onChange={(value: string) => updateVariableMapping(variable.key, value)}
                    >
                        {getInputOptions(variable.type)}
                    </Select>
                </li>
            ))}
        </ul>
    );
};
