import { message } from 'antd';
import { useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import { type Rule, type RuleInsert, type RuleUpdate, type Element } from '../lib/types';

export const useRules = () => {
    const [rules, setRules] = useState<(Rule & { element?: Element })[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('rules')
                .select(
                    `
          *,
          element:elements(*)
        `,
                )
                .order('identifier_code');

            if (error) {
                throw error;
            }
            setRules(data || []);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to fetch rules: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules().catch(() => {});
    }, []);

    const createRule = async (rule: RuleInsert) => {
        try {
            const { data, error } = await supabase
                .from('rules')
                .insert(rule)
                .select(
                    `
          *,
          element:elements(*)
        `,
                )
                .single();

            if (error) {
                throw error;
            }
            setRules([...rules, data]);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Rule created successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to create rule: ${errorMessage}`);
            throw error;
        }
    };

    const updateRule = async (id: string, updates: RuleUpdate) => {
        try {
            const { data, error } = await supabase
                .from('rules')
                .update(updates)
                .eq('id', id)
                .select(
                    `
          *,
          element:elements(*)
        `,
                )
                .single();

            if (error) {
                throw error;
            }
            setRules(rules.map((r) => (r.id === id ? data : r)));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Rule updated successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update rule: ${errorMessage}`);
            throw error;
        }
    };

    const deleteRule = async (id: string) => {
        try {
            const { error } = await supabase.from('rules').delete().eq('id', id);

            if (error) {
                throw error;
            }
            setRules(rules.filter((r) => r.id !== id));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Rule deleted successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to delete rule: ${errorMessage}`);
            throw error;
        }
    };

    return {
        rules,
        loading,
        createRule,
        updateRule,
        deleteRule,
        refetch: fetchRules,
    };
};
