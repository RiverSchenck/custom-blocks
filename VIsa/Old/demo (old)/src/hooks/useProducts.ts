import { message } from 'antd';
import { useState, useEffect } from 'react';

import { supabase } from '../lib/supabase';
import { type Product, type ProductInsert, type ProductUpdate } from '../lib/types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('products').select('*').order('name');

            if (error) {
                throw error;
            }
            setProducts(data || []);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to fetch products: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts().catch(() => {});
    }, []);

    const createProduct = async (product: ProductInsert) => {
        try {
            const { data, error } = await supabase.from('products').insert(product).select().single();

            if (error) {
                throw error;
            }
            setProducts([...products, data]);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Product created successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to create product: ${errorMessage}`);
            throw error;
        }
    };

    const updateProduct = async (id: string, updates: ProductUpdate) => {
        try {
            const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();

            if (error) {
                throw error;
            }
            setProducts(products.map((p) => (p.id === id ? data : p)));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Product updated successfully');
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to update product: ${errorMessage}`);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);

            if (error) {
                throw error;
            }
            setProducts(products.filter((p) => p.id !== id));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.success('Product deleted successfully');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            message.error(`Failed to delete product: ${errorMessage}`);
            throw error;
        }
    };

    return {
        products,
        loading,
        createProduct,
        updateProduct,
        deleteProduct,
        refetch: fetchProducts,
    };
};
