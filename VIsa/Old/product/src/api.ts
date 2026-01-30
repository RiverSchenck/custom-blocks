import { supabase, type Region, type Product, type ElementInstance } from './supabase';

export const getAllRegions = async (): Promise<Region[]> => {
    const { data, error } = await supabase.from('regions').select('*').order('name', { ascending: true });

    if (error) {
        console.error('Error fetching regions:', error);
        return [];
    }

    return (data as Region[]) || [];
};

export const getAllProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return (data as Product[]) || [];
};

export const getElementInstancesByFilter = async (
    regionId: string | null,
    productId: string | null,
): Promise<ElementInstance[]> => {
    if (!regionId || !productId) {
        return [];
    }

    const { data: regionProductData, error: regionProductError } = await supabase
        .from('element_region_products')
        .select('element_instance_id')
        .eq('region_id', regionId)
        .eq('product_id', productId);

    if (regionProductError) {
        console.error('Error fetching element region products:', regionProductError);
        return [];
    }

    if (!regionProductData || regionProductData.length === 0) {
        return [];
    }

    const elementInstanceIds = [
        ...new Set((regionProductData as Array<{ element_instance_id: string }>).map((rp) => rp.element_instance_id)),
    ];

    const { data, error } = await supabase.from('element_instances').select('*').in('id', elementInstanceIds);

    if (error) {
        console.error('Error fetching element instances by filter:', error);
        return [];
    }

    return (data as ElementInstance[]) || [];
};
