import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { sendMessage, getChatHistory, subscribeToChat, ChatMessage } from '@/lib/supabase/chat';
import { MessageSquare, Send, X, Paperclip, Smile, Clock, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
}

const ChatDialog: React.FC<ChatDialogProps> = ({ isOpen, onClose, adminId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchChatHistory();
      const subscription = subscribeToChat(currentUser.id, handleNewMessage);
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const fetchChatHistory = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const history = await getChatHistory(currentUser.id, adminId);
      setMessages(history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) {
      console.error('Cannot send message:', { hasMessage: !!newMessage.trim(), hasUser: !!currentUser });
      return;
    }

    const messageData = {
      content: newMessage.trim(),
      sender_id: currentUser.id,
      receiver_id: adminId,
      created_at: new Date().toISOString()
    };

    try {
      console.log('Sending message:', messageData);
      const sentMessage = await sendMessage(messageData);
      
      if (sentMessage) {
        console.log('Message sent successfully:', sentMessage);
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        setIsTyping(false);
      } else {
        console.error('Failed to send message: No response from server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error toast here
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        handleSendMessage();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    setIsTyping(!!value.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[500px] h-[600px] flex flex-col p-0",
        isDarkMode ? "bg-gray-800" : "bg-white",
        isMobile && "h-[100vh] max-h-[100vh] rounded-none"
      )}>
        <DialogHeader className={cn(
          "flex flex-row items-center justify-between p-4 border-b",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isDarkMode ? "bg-green-400" : "bg-green-500"
            )} />
            <DialogTitle className={cn(
              "text-lg font-semibold",
              isDarkMode ? "text-white" : ""
            )}>
              Live Chat Support
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "flex",
                      message.sender_id === currentUser?.id ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3 relative",
                        message.sender_id === currentUser?.id
                          ? isDarkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-500 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <p className={cn(
                          "text-xs",
                          message.sender_id === currentUser?.id
                            ? "text-blue-100"
                            : isDarkMode
                            ? "text-gray-400"
                            : "text-gray-500"
                        )}>
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.sender_id === currentUser?.id && (
                          <div className="flex items-center">
                            {message.read ? (
                              <CheckCheck size={12} className="text-blue-100" />
                            ) : (
                              <Check size={12} className="text-blue-100" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={cn(
                    "px-3 py-2 rounded-lg",
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className={cn(
          "flex gap-2 p-4 border-t",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full",
                isDarkMode ? "text-gray-300 hover:bg-gray-700" : ""
              )}
            >
              <Paperclip size={20} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full",
                isDarkMode ? "text-gray-300 hover:bg-gray-700" : ""
              )}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={20} />
            </Button>
          </div>
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={cn(
              "flex-1",
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
            )}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={cn(
              "h-10 w-10 rounded-full",
              isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "",
              !newMessage.trim() && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog; 