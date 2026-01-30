import { message } from 'antd';

import { supabase } from '../lib/supabase';

export const useRelations = () => {
    const linkProductElements = async (productId: string, elementIds: string[]) => {
        try {
            // Remove existing links
            await supabase.from('product_elements').delete().eq('product_id', productId);

            // Add new links
            if (elementIds.length > 0) {
                const { error } = await supabase.from('product_elements').insert(
                    elementIds.map((elementId) => ({
                        product_id: productId,
                        element_id: elementId,
                    })),
                );

                if (error) {
                    throw error;
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Product elements updated successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update product elements: ${errorMessage}`);
            throw error;
        }
    };

    const linkRegionProducts = async (regionId: string, productIds: string[]) => {
        try {
            await supabase.from('region_products').delete().eq('region_id', regionId);

            if (productIds.length > 0) {
                const { error } = await supabase.from('region_products').insert(
                    productIds.map((productId) => ({
                        region_id: regionId,
                        product_id: productId,
                    })),
                );

                if (error) {
                    throw error;
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Region products updated successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update region products: ${errorMessage}`);
            throw error;
        }
    };

    const linkElementRegions = async (elementId: string, regionIds: string[]) => {
        try {
            await supabase.from('element_regions').delete().eq('element_id', elementId);

            if (regionIds.length > 0) {
                const { error } = await supabase.from('element_regions').insert(
                    regionIds.map((regionId) => ({
                        element_id: elementId,
                        region_id: regionId,
                    })),
                );

                if (error) {
                    throw error;
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Element regions updated successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update element regions: ${errorMessage}`);
            throw error;
        }
    };

    const linkElementProducts = async (elementId: string, productIds: string[]) => {
        try {
            await supabase.from('element_products').delete().eq('element_id', elementId);

            if (productIds.length > 0) {
                const { error } = await supabase.from('element_products').insert(
                    productIds.map((productId) => ({
                        element_id: elementId,
                        product_id: productId,
                    })),
                );

                if (error) {
                    throw error;
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Element products updated successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update element products: ${errorMessage}`);
            throw error;
        }
    };

    const linkRuleExceptionRegions = async (ruleExceptionId: string, regionIds: string[]) => {
        try {
            await supabase.from('rule_exception_regions').delete().eq('rule_exception_id', ruleExceptionId);

            if (regionIds.length > 0) {
                const { error } = await supabase.from('rule_exception_regions').insert(
                    regionIds.map((regionId) => ({
                        rule_exception_id: ruleExceptionId,
                        region_id: regionId,
                    })),
                );

                if (error) {
                    throw error;
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Rule exception regions updated successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update rule exception regions: ${errorMessage}`);
            throw error;
        }
    };

    const linkRuleExceptionProducts = async (ruleExceptionId: string, productIds: string[]) => {
        try {
            await supabase.from('rule_exception_products').delete().eq('rule_exception_id', ruleExceptionId);

            if (productIds.length > 0) {
                const { error } = await supabase.from('rule_exception_products').insert(
                    productIds.map((productId) => ({
                        rule_exception_id: ruleExceptionId,
                        product_id: productId,
                    })),
                );

                if (error) {
                    throw error;
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Rule exception products updated successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update rule exception products: ${errorMessage}`);
            throw error;
        }
    };

    const fetchProductElements = async (productId: string) => {
        const { data } = await supabase.from('product_elements').select('element_id').eq('product_id', productId);

        return data?.map((d) => d.element_id) || [];
    };

    const fetchRegionProducts = async (regionId: string) => {
        const { data } = await supabase.from('region_products').select('product_id').eq('region_id', regionId);

        return data?.map((d) => d.product_id) || [];
    };

    const fetchElementRegions = async (elementId: string) => {
        const { data } = await supabase.from('element_regions').select('region_id').eq('element_id', elementId);

        return data?.map((d) => d.region_id) || [];
    };

    const fetchElementProducts = async (elementId: string) => {
        const { data } = await supabase.from('element_products').select('product_id').eq('element_id', elementId);

        return data?.map((d) => d.product_id) || [];
    };

    const fetchProductsUsingElement = async (elementId: string) => {
        const { data } = await supabase.from('product_elements').select('product_id').eq('element_id', elementId);

        return data?.map((d) => d.product_id) || [];
    };

    const fetchRuleExceptionRegions = async (ruleExceptionId: string) => {
        const { data } = await supabase
            .from('rule_exception_regions')
            .select('region_id')
            .eq('rule_exception_id', ruleExceptionId);

        return data?.map((d) => d.region_id) || [];
    };

    const fetchRuleExceptionProducts = async (ruleExceptionId: string) => {
        const { data } = await supabase
            .from('rule_exception_products')
            .select('product_id')
            .eq('rule_exception_id', ruleExceptionId);

        return data?.map((d) => d.product_id) || [];
    };

    return {
        linkProductElements,
        linkRegionProducts,
        linkElementRegions,
        linkElementProducts,
        linkRuleExceptionRegions,
        linkRuleExceptionProducts,
        fetchProductElements,
        fetchRegionProducts,
        fetchElementRegions,
        fetchElementProducts,
        fetchProductsUsingElement,
        fetchRuleExceptionRegions,
        fetchRuleExceptionProducts,
    };
};
