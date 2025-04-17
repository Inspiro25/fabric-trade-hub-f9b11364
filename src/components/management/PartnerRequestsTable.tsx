
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

const PartnerRequestsTable: React.FC = () => {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
