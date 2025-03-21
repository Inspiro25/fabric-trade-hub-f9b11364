
import { supabase } from "@/integrations/supabase/client";

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  code: string;
  discount: number | null;
  start_date: string;
  expiry: string;
  type: 'percentage' | 'shipping' | 'bogo';
  shop_id: string | null;
  banner_image: string | null;
  is_active: boolean;
  created_at: string;
}

export async function getAllOffers() {
  const { data, error } = await supabase
    .from('offers')
    .select('*, shops(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }

  return data as (Offer & { shops: { name: string } | null })[];
}

export async function getActiveOffers() {
  const { data, error } = await supabase
    .from('offers')
    .select('*, shops(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching active offers:", error);
    throw error;
  }

  return data as (Offer & { shops: { name: string } | null })[];
}

export async function getShopOffers(shopId: string) {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching shop offers:", error);
    throw error;
  }

  return data as Offer[];
}

export async function getOfferById(id: string) {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching offer:", error);
    throw error;
  }

  return data as Offer;
}

export async function createOffer(offer: Omit<Offer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('offers')
    .insert(offer)
    .select()
    .single();

  if (error) {
    console.error("Error creating offer:", error);
    throw error;
  }

  return data as Offer;
}

export async function updateOffer(id: string, offer: Partial<Omit<Offer, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('offers')
    .update(offer)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating offer:", error);
    throw error;
  }

  return data as Offer;
}

export async function deleteOffer(id: string) {
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting offer:", error);
    throw error;
  }
}
