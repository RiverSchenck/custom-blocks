import { Modal, Form, Input, Button } from 'antd';
import { type FC } from 'react';

import { type Element, type ElementInsert, type ElementUpdate } from '../../lib/types';

type ElementFormProps = {
    open: boolean;
    element?: Element;
    onCancel: () => void;
    onSubmit: (values: ElementInsert | ElementUpdate) => Promise<void>;
    loading?: boolean;
};

export const ElementForm: FC<ElementFormProps> = ({ open, element, onCancel, onSubmit, loading = false }) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = (await form.validateFields()) as ElementInsert | ElementUpdate;
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            // Validation errors are handled by Ant Design
        }
    };

    return (
        <Modal
            open={open}
            title={element ? 'Edit Element' : 'Create Element'}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
                    {element ? 'Update' : 'Create'}
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={element || { name: '', identifier: '', description: '' }}
            >
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input placeholder="Element name" />
                </Form.Item>

                <Form.Item
                    name="identifier"
                    label="Identifier"
                    rules={[
                        { required: true, message: 'Please enter an identifier' },
                        {
                            pattern: /^\w+$/i,
                            message: 'Identifier must contain only letters, numbers, and underscores',
                        },
                    ]}
                >
                    <Input placeholder="unique_identifier" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={4} placeholder="Optional description" />
                </Form.Item>
            </Form>
        </Modal>
    );
};
