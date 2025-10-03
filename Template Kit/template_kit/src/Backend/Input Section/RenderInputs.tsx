import { generateRandomString } from '@frontify/app-bridge';
import { Button, ButtonSize } from '@frontify/fondue';
import { Select, Input, Space } from 'antd';
import { useState, type FC } from 'react';

import { type InputVar, type ColorInput, type TextInput, type ImageInput } from '../../types';

import { InputListItem } from './InputListItem';
import { INPUT_OPTIONS } from './inputOptions';

type RenderInputsProps = {
    inputs: InputVar[];
    onAddInput: (input: InputVar) => void;
    onDeleteInput: (id: string) => void;
};

const { Option } = Select;

export const RenderInputs: FC<RenderInputsProps> = ({ inputs, onAddInput, onDeleteInput }) => {
    const [inputType, setInputType] = useState<'text' | 'color' | 'image'>('text');
    const [inputTitle, setInputTitle] = useState('');

    const handleAdd = () => {
        let newInput: InputVar;
        const id = generateRandomString(); // Simple unique ID generation

        if (inputType === 'text') {
            newInput = {
                type: 'TEXT',
                display: 'Text',
                id,
                title: inputTitle,
                value: '',
            } as TextInput;
        } else if (inputType === 'color') {
            newInput = {
                type: 'COLOR',
                display: 'Color',
                id,
                title: inputTitle,
                value: '',
            } as ColorInput;
        } else {
            newInput = {
                type: 'IMAGE',
                display: 'Image',
                id,
                title: inputTitle,
                imageId: '',
            } as ImageInput;
        }

        onAddInput(newInput);
        setInputTitle('');
    };

    return (
        <div>
            <h2>Backend Component</h2>
            <Space direction="vertical">
                <Space>
                    <Select value={inputType} onChange={(value) => setInputType(value)} style={{ width: 120 }}>
                        {INPUT_OPTIONS.map((option) => (
                            <Option key={option.key} value={option.key}>
                                {option.title}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        placeholder="Input Title"
                        value={inputTitle}
                        onChange={(e) => setInputTitle(e.target.value)}
                    />
                    <Button onClick={handleAdd} size={ButtonSize.Small}>
                        Add Input
                    </Button>
                </Space>
                <div>
                    {inputs.map((input) => (
                        <InputListItem key={input.id} input={input} onDelete={onDeleteInput} />
                    ))}
                </div>
            </Space>
        </div>
    );
};
