
import { supabase } from "@/integrations/supabase/client";

export interface PartnerRequest {
  id?: string;
  businessName: string;
  contactName: string;
  mobileNumber: string;
  email: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export const createPartnerRequest = async (requestData: Omit<PartnerRequest, 'id' | 'status' | 'createdAt'>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('partner_requests')
      .insert({
        business_name: requestData.businessName,
        contact_name: requestData.contactName,
        mobile_number: requestData.mobileNumber,
        email: requestData.email,
        status: 'pending'
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating partner request:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error creating partner request:', error);
    return null;
  }
};

export const getPartnerRequests = async (): Promise<PartnerRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('partner_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching partner requests:', error);
      return [];
    }
    
    return (data || []).map(item => ({
      id: item.id,
      businessName: item.business_name,
      contactName: item.contact_name,
      mobileNumber: item.mobile_number,
      email: item.email,
      status: item.status as 'pending' | 'approved' | 'rejected',
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error fetching partner requests:', error);
    return [];
  }
};

export const updatePartnerRequestStatus = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('partner_requests')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating partner request status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating partner request status:', error);
    return false;
  }
};
