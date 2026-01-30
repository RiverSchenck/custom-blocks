import { type Database } from '../../types/database.types';

// Convenience type exports
export type Region = Database['public']['Tables']['regions']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Element = Database['public']['Tables']['elements']['Row'];
export type Rule = Database['public']['Tables']['rules']['Row'];
export type RuleException = Database['public']['Tables']['rule_exceptions']['Row'];

export type RegionInsert = Database['public']['Tables']['regions']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ElementInsert = Database['public']['Tables']['elements']['Insert'];
export type RuleInsert = Database['public']['Tables']['rules']['Insert'];
export type RuleExceptionInsert = Database['public']['Tables']['rule_exceptions']['Insert'];

export type RegionUpdate = Database['public']['Tables']['regions']['Update'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type ElementUpdate = Database['public']['Tables']['elements']['Update'];
export type RuleUpdate = Database['public']['Tables']['rules']['Update'];
export type RuleExceptionUpdate = Database['public']['Tables']['rule_exceptions']['Update'];
