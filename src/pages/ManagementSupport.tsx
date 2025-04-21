import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { MessageSquare, Mail, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

// Mock data - Replace with actual data from your backend
const mockSupportRequests = [
  {
    id: 1,
    subject: 'Payment Issue',
    category: 'payments',
    priority: 'high',
    status: 'open',
    createdAt: '2024-04-19T10:30:00Z',
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    id: 2,
    subject: 'Account Access',
    category: 'account',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-04-19T09:15:00Z',
    user: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  }
];

const mockActiveChats = [
  {
    id: 1,
    user: {
      name: 'Alice Johnson',
      email: 'alice@example.com'
    },
    lastMessage: 'Hello, I need help with my order',
    unreadCount: 2,
    lastActivity: '2024-04-19T11:45:00Z'
  },
  {
    id: 2,
    user: {
      name: 'Bob Wilson',
      email: 'bob@example.com'
    },
    lastMessage: 'Thanks for your help!',
    unreadCount: 0,
    lastActivity: '2024-04-19T10:30:00Z'
  }
];

const ManagementSupport = () => {
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline">Open</Badge>;
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="success">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Support Management | Admin Portal</title>
      </Helmet>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Support Management</h2>
            <p className="text-muted-foreground">
              Manage support requests and live chat sessions
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">
              <Mail className="h-4 w-4 mr-2" />
              Support Requests
            </TabsTrigger>
            <TabsTrigger value="chats">
              <MessageSquare className="h-4 w-4 mr-2" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[300px_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Support Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2 p-4">
                      {mockSupportRequests.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "p-4 rounded-lg cursor-pointer transition-colors",
                            selectedRequest === request.id
                              ? isDarkMode
                                ? "bg-gray-800"
                                : "bg-gray-100"
                              : isDarkMode
                              ? "hover:bg-gray-800"
                              : "hover:bg-gray-50"
                          )}
                          onClick={() => setSelectedRequest(request.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{request.subject}</h3>
                              <p className="text-sm text-muted-foreground">
                                {request.user.name} • {formatDate(request.createdAt)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {getPriorityBadge(request.priority)}
                              {getStatusBadge(request.status)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedRequest ? (
                    <div className="space-y-4">
                      {/* Request details will go here */}
                      <p>Request details for ID: {selectedRequest}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <p>Select a request to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[300px_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Active Chats</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2 p-4">
                      {mockActiveChats.map((chat) => (
                        <motion.div
                          key={chat.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "p-4 rounded-lg cursor-pointer transition-colors",
                            selectedChat === chat.id
                              ? isDarkMode
                                ? "bg-gray-800"
                                : "bg-gray-100"
                              : isDarkMode
                              ? "hover:bg-gray-800"
                              : "hover:bg-gray-50"
                          )}
                          onClick={() => setSelectedChat(chat.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{chat.user.name}</h3>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {chat.lastMessage}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(chat.lastActivity)}
                              </p>
                            </div>
                            {chat.unreadCount > 0 && (
                              <Badge variant="default">{chat.unreadCount}</Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChat ? (
                    <div className="space-y-4">
                      {/* Chat interface will go here */}
                      <p>Chat interface for ID: {selectedChat}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mb-2" />
                      <p>Select a chat to start messaging</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ManagementSupport; 