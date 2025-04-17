export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          display_name: string
          email: string
          phone?: string
          address?: string
          avatar_url?: string
          preferences: Json
          created_at: string
          updated_at?: string
        }
        Insert: {
          id: string
          display_name: string
          email: string
          phone?: string
          address?: string
          avatar_url?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          email?: string
          phone?: string
          address?: string
          avatar_url?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      shop_follows: {
        Row: {
          id: string
          user_id: string
          shop_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          shop_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          shop_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 