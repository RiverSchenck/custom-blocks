import { supabase, type Region, type Product, type ElementInstance, type ElementRegionProduct } from './supabase';

/**
 * Fetch all regions from the database
 */
export const getAllRegions = async (): Promise<Region[]> => {
    const { data, error } = await supabase.from('regions').select('*').order('name', { ascending: true });

    if (error) {
        console.error('Error fetching regions:', error);
        return [];
    }

    return (data as Region[]) || [];
};

/**
 * Fetch all products from the database
 */
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

/**
 * Fetch an element instance by block ID
 */
export const getElementInstance = async (blockId: string): Promise<ElementInstance | null> => {
    const { data, error } = (await supabase.from('element_instances').select('*').eq('block_id', blockId).single()) as {
        data: ElementInstance | null;
        error: { code?: string } | null;
    };

    if (error) {
        if (error.code === 'PGRST116') {
            // No rows returned
            return null;
        }
        console.error('Error fetching element instance:', error);
        return null;
    }

    return (data as ElementInstance) || null;
};

/**
 * Fetch region/product associations for an element instance
 */
export const getElementRegionProducts = async (elementInstanceId: string): Promise<ElementRegionProduct[]> => {
    const { data, error } = await supabase
        .from('element_region_products')
        .select('*')
        .eq('element_instance_id', elementInstanceId);

    if (error) {
        console.error('Error fetching element region products:', error);
        return [];
    }

    return (data as ElementRegionProduct[]) || [];
};

/**
 * Create or update an element instance
 */
export const createOrUpdateElementInstance = async (
    blockId: string,
    pageUrl: string,
    elementName: string,
    identifier: string,
    description: string,
    regionProductIds: Array<{ regionId: string; productId: string }>,
): Promise<ElementInstance | null> => {
    // First, check if instance exists
    const existing = await getElementInstance(blockId);

    let elementInstance: ElementInstance;

    if (existing) {
        // Update existing instance
        const { data, error } = (await supabase
            .from('element_instances')
            .update({
                page_url: pageUrl,
                element_name: elementName,
                identifier,
                description,
                updated_at: new Date().toISOString(),
            })
            .eq('block_id', blockId)
            .select()
            .single()) as {
            data: ElementInstance | null;
            error: { code?: string } | null;
        };

        if (error) {
            console.error('Error updating element instance:', error);
            return null;
        }

        elementInstance = data as ElementInstance;
    } else {
        // Create new instance
        const { data, error } = (await supabase
            .from('element_instances')
            .insert({
                block_id: blockId,
                page_url: pageUrl,
                element_name: elementName,
                identifier,
                description,
            })
            .select()
            .single()) as {
            data: ElementInstance | null;
            error: { code?: string } | null;
        };

        if (error) {
            console.error('Error creating element instance:', error);
            return null;
        }

        elementInstance = data as ElementInstance;
    }

    // Update region/product associations
    // First, delete existing associations
    const { error: deleteError } = await supabase
        .from('element_region_products')
        .delete()
        .eq('element_instance_id', elementInstance.id);

    if (deleteError) {
        console.error('Error deleting existing region/product associations:', deleteError);
    }

    // Then, insert new associations
    if (regionProductIds.length > 0) {
        const associations = regionProductIds.map(({ regionId, productId }) => ({
            element_instance_id: elementInstance.id,
            region_id: regionId,
            product_id: productId,
        }));

        const { error: insertError } = await supabase.from('element_region_products').insert(associations);

        if (insertError) {
            console.error('Error inserting region/product associations:', insertError);
        }
    }

    return elementInstance;
};

/**
 * Query element instances that match a region/product filter
 */
export const getElementInstancesByFilter = async (
    regionId: string | null,
    productId: string | null,
): Promise<ElementInstance[]> => {
    // Both region and product should always be provided now, but handle edge cases
    if (!regionId || !productId) {
        // If either is missing, return empty array (shouldn't happen with new UI)
        return [];
    }

    // Get element instance IDs that match both region and product
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

    // Get unique element instance IDs
    const elementInstanceIds = [
        ...new Set((regionProductData as Array<{ element_instance_id: string }>).map((rp) => rp.element_instance_id)),
    ];

    // Fetch the element instances
    const { data, error } = await supabase.from('element_instances').select('*').in('id', elementInstanceIds);

    if (error) {
        console.error('Error fetching element instances by filter:', error);
        return [];
    }

    return (data as ElementInstance[]) || [];
};

/**
 * Get all element instances (for admin purposes)
 */
export const getAllElementInstances = async (): Promise<ElementInstance[]> => {
    const { data, error } = await supabase
        .from('element_instances')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all element instances:', error);
        return [];
    }

    return (data as ElementInstance[]) || [];
};

/**
 * Delete an element instance by block ID
 * This will cascade delete associated region/product relationships
 */
export const deleteElementInstance = async (blockId: string): Promise<boolean> => {
    // First, get the element instance to get its ID
    const elementInstance = await getElementInstance(blockId);

    if (!elementInstance) {
        // No instance exists, nothing to delete
        return true;
    }

    // Delete region/product associations first (if cascade delete isn't set up)
    const { error: deleteAssociationsError } = await supabase
        .from('element_region_products')
        .delete()
        .eq('element_instance_id', elementInstance.id);

    if (deleteAssociationsError) {
        console.error('Error deleting region/product associations:', deleteAssociationsError);
        // Continue with instance deletion even if associations fail
    }

    // Delete the element instance
    const { error: deleteError } = await supabase.from('element_instances').delete().eq('block_id', blockId);

    if (deleteError) {
        console.error('Error deleting element instance:', deleteError);
        return false;
    }

    return true;
};
