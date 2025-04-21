import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read: boolean;
  type: 'user' | 'admin';
}

export interface SupportRequest {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

// Chat Functions
export const sendMessage = async (message: {
  content: string;
  receiver_id: string;
  sender_id: string;
}): Promise<ChatMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        id: uuidv4(),
        content: message.content,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        created_at: new Date().toISOString(),
        read: false,
        type: 'user'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    toast({
      title: 'Error',
      description: 'Failed to send message',
      variant: 'destructive'
    });
    return null;
  }
};

export const getChatHistory = async (userId: string, adminId: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .or(`sender_id.eq.${adminId},receiver_id.eq.${adminId}`)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

// Support Request Functions
export const createSupportRequest = async (request: {
  user_id: string;
  subject: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}): Promise<SupportRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .insert({
        id: uuidv4(),
        user_id: request.user_id,
        subject: request.subject,
        message: request.message,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        priority: request.priority,
        category: request.category
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating support request:', error);
    toast({
      title: 'Error',
      description: 'Failed to create support request',
      variant: 'destructive'
    });
    return null;
  }
};

export const getSupportRequests = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('support_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching support requests:', error);
    return [];
  }
};

// Real-time subscriptions
export const subscribeToChat = (userId: string, callback: (message: ChatMessage) => void) => {
  return supabase
    .channel('chat_messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_messages',
        filter: `receiver_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();
};

export const subscribeToSupportRequests = (userId: string, callback: (request: SupportRequest) => void) => {
  return supabase
    .channel('support_requests')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'support_requests',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new as SupportRequest);
      }
    )
    .subscribe();
}; 