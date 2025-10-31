// src/app/config/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osmafaixzfabbcwbxqql.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zbWFmYWl4emZhYmJjd2J4cXFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjU4NjksImV4cCI6MjA3NzQ0MTg2OX0.PWd4tu4jjDG0MidrLHBVuvigPp85YkNgmt838HRKSZM';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Tipos para TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          price: number;
          category: string;
          image: string | null;
          rating: number;
          stock: number;
          created_at: string;
        };
      };
      orders: {
        Row: {
          id: number;
          user_id: string;
          total: number;
          subtotal: number;
          tax: number;
          shipping: number;
          status: string;
          shipping_address: any;
          created_at: string;
        };
        Insert: {
          user_id: string;
          total: number;
          subtotal: number;
          tax: number;
          shipping?: number;
          status?: string;
          shipping_address: any;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: number;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          order_id: number;
          product_id: number;
          quantity: number;
          price: number;
        };
      };
    };
  };
}