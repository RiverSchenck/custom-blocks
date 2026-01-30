import { message } from 'antd';
import { useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import { type Element, type ElementInsert, type ElementUpdate } from '../lib/types';

export const useElements = () => {
    const [elements, setElements] = useState<Element[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchElements = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('elements').select('*').order('name');

            if (error) {
                throw error;
            }
            setElements(data || []);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to fetch elements: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchElements().catch(() => {});
    }, []);

    const createElement = async (element: ElementInsert) => {
        try {
            const { data, error } = await supabase.from('elements').insert(element).select().single();

            if (error) {
                throw error;
            }
            setElements([...elements, data]);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Element created successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to create element: ${errorMessage}`);
            throw error;
        }
    };

    const updateElement = async (id: string, updates: ElementUpdate) => {
        try {
            const { data, error } = await supabase.from('elements').update(updates).eq('id', id).select().single();

            if (error) {
                throw error;
            }
            setElements(elements.map((e) => (e.id === id ? data : e)));
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-floating-promises
            message.success('Element updated successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update element: ${errorMessage}`);
            throw error;
        }
    };

    const deleteElement = async (id: string) => {
        try {
            const { error } = await supabase.from('elements').delete().eq('id', id);

            if (error) {
                throw error;
            }
            setElements(elements.filter((e) => e.id !== id));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Element deleted successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to delete element: ${errorMessage}`);
            throw error;
        }
    };

    return {
        elements,
        loading,
        createElement,
        updateElement,
        deleteElement,
        refetch: fetchElements,
    };
};
