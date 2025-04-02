
// Define JSON type to satisfy Supabase's JSON type requirements
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
