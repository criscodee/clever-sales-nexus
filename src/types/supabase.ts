
import { Database as GeneratedDatabase } from "@/integrations/supabase/types";

export interface SalesRecordRow {
  id: string;
  date: string;
  customer: string;
  employee: string;
  amount: number;
  created_at?: string;
}

export interface SalesItemRow {
  id: number;
  sale_id: string;
  product: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CustomDatabase extends GeneratedDatabase {
  public: {
    Tables: {
      sales_records: {
        Row: SalesRecordRow;
        Insert: SalesRecordRow;
        Update: Partial<SalesRecordRow>;
      };
      sales_items: {
        Row: SalesItemRow;
        Insert: Omit<SalesItemRow, 'id'> & { id?: number };
        Update: Partial<SalesItemRow>;
      };
    } & GeneratedDatabase['public']['Tables'];
    Views: GeneratedDatabase['public']['Views'];
    Functions: GeneratedDatabase['public']['Functions'];
    Enums: GeneratedDatabase['public']['Enums'];
    CompositeTypes: GeneratedDatabase['public']['CompositeTypes'];
  };
}

export type CustomSupabaseClient = ReturnType<typeof createClient<CustomDatabase>>;

// This is just for TypeScript - we'll still use the actual supabase client
import { createClient } from '@supabase/supabase-js';
