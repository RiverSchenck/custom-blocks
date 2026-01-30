import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Region = {
    id: string;
    name: string;
    created_at: string;
};

export type Product = {
    id: string;
    name: string;
    category: 'Credit' | 'Debit' | 'Prepaid' | 'Combination';
    created_at: string;
};

export type ElementInstance = {
    id: string;
    block_id: string;
    page_url: string;
    element_name: string;
    identifier: string;
    description: string;
    created_at: string;
    updated_at: string;
};

export type ElementRegionProduct = {
    id: string;
    element_instance_id: string;
    region_id: string;
    product_id: string;
    created_at: string;
};
