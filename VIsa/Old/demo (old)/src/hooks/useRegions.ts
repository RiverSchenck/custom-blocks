import { message } from 'antd';
import { useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import { type Region, type RegionInsert, type RegionUpdate } from '../lib/types';

export const useRegions = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRegions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('regions').select('*').order('name');

            if (error) {
                throw error;
            }
            setRegions(data || []);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to fetch regions: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegions().catch(() => {});
    }, []);

    const createRegion = async (region: RegionInsert) => {
        try {
            const { data, error } = await supabase.from('regions').insert(region).select().single();

            if (error) {
                throw error;
            }
            setRegions([...regions, data]);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Region created successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to create region: ${errorMessage}`);
            throw error;
        }
    };

    const updateRegion = async (id: string, updates: RegionUpdate) => {
        try {
            const { data, error } = await supabase.from('regions').update(updates).eq('id', id).select().single();

            if (error) {
                throw error;
            }
            setRegions(regions.map((r) => (r.id === id ? data : r)));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Region updated successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update region: ${errorMessage}`);
            throw error;
        }
    };

    const deleteRegion = async (id: string) => {
        try {
            const { error } = await supabase.from('regions').delete().eq('id', id);

            if (error) {
                throw error;
            }
            setRegions(regions.filter((r) => r.id !== id));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Region deleted successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to delete region: ${errorMessage}`);
            throw error;
        }
    };

    return {
        regions,
        loading,
        createRegion,
        updateRegion,
        deleteRegion,
        refetch: fetchRegions,
    };
};
