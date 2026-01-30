import { useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import { type RuleException } from '../lib/types';

export const useRuleExceptions = (ruleId?: string) => {
    const [exceptions, setExceptions] = useState<(RuleException & { regions?: string[]; products?: string[] })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExceptions = async () => {
            try {
                setLoading(true);
                let query = supabase.from('rule_exceptions').select('*').order('name');

                if (ruleId) {
                    query = query.eq('rule_id', ruleId);
                }

                const { data, error } = await query;

                if (error) {
                    throw error;
                }

                // Fetch related regions and products for each exception
                const exceptionsWithRelations = await Promise.all(
                    (data || []).map(async (exception) => {
                        const [regionsResult, productsResult] = await Promise.all([
                            supabase
                                .from('rule_exception_regions')
                                .select('region_id')
                                .eq('rule_exception_id', exception.id),
                            supabase
                                .from('rule_exception_products')
                                .select('product_id')
                                .eq('rule_exception_id', exception.id),
                        ]);

                        return {
                            ...exception,
                            regions: regionsResult.data?.map((r) => r.region_id) || [],
                            products: productsResult.data?.map((p) => p.product_id) || [],
                        };
                    }),
                );

                setExceptions(exceptionsWithRelations);
            } catch (error: unknown) {
                console.error('Failed to fetch rule exceptions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExceptions().catch(() => {});
    }, [ruleId]);

    return {
        exceptions,
        loading,
    };
};
