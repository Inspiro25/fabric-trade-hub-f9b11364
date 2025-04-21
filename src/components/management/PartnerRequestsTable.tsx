import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPartnerRequests, updatePartnerRequestStatus, PartnerRequest } from '@/lib/supabase/partnerRequests';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Phone, Mail, Building2, Check, X } from 'lucide-react';

const PartnerRequestsTable: React.FC = () => {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const loadRequests = async () => {
    setLoading(true);
    const data = await getPartnerRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusUpdate = async (id: string | undefined, status: 'approved' | 'rejected') => {
    if (!id) return;
    
    const success = await updatePartnerRequestStatus(id, status);
    
    if (success) {
      toast({
        title: 'Success',
        description: `Partner request ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });
      // Reload the requests to update the UI
      loadRequests();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update partner request status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading partner requests...</div>;
  }

  if (requests.length === 0) {
    return <div className="p-8 text-center">No partner requests found.</div>;
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="bg-card">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base">{request.businessName}</h3>
                  <p className="text-sm text-muted-foreground">{request.contactName}</p>
                </div>
                <Badge variant={request.status === 'pending' ? 'secondary' : 'success'}>
                  {request.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{request.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{request.email}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" size="sm" variant="outline" onClick={() => handleStatusUpdate(request.id, 'rejected')}>
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button className="flex-1" size="sm" onClick={() => handleStatusUpdate(request.id, 'approved')}>
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.businessName}</TableCell>
              <TableCell>{request.contactName}</TableCell>
              <TableCell>{request.mobileNumber}</TableCell>
              <TableCell>{request.email}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>{new Date(request.createdAt || '').toLocaleDateString()}</TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusUpdate(request.id, 'approved')} 
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                      className="text-red-500 border-red-500 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnerRequestsTable;
