import { Modal, Form, Input, Button } from 'antd';
import { type FC } from 'react';

import { type Region, type RegionInsert, type RegionUpdate } from '../../lib/types';

type RegionFormProps = {
    open: boolean;
    region?: Region;
    onCancel: () => void;
    onSubmit: (values: RegionInsert | RegionUpdate) => Promise<void>;
    loading?: boolean;
};

export const RegionForm: FC<RegionFormProps> = ({ open, region, onCancel, onSubmit, loading = false }) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = (await form.validateFields()) as RegionInsert | RegionUpdate;
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            // Validation errors are handled by Ant Design
        }
    };

    return (
        <Modal
            open={open}
            title={region ? 'Edit Region' : 'Create Region'}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
                    {region ? 'Update' : 'Create'}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" initialValues={region || { name: '', identifier: '', description: '' }}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a name' }]}>
                    <Input placeholder="Region name" />
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
