import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Search, Mail, Phone, Building2, MessageSquare, RefreshCw } from 'lucide-react';

interface DemoRequest {
  id: string;
  name: string;
  email: string;
  hospital: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  contacted: 'bg-info/10 text-info border-info/20',
  scheduled: 'bg-primary/10 text-primary border-primary/20',
  converted: 'bg-success/10 text-success border-success/20',
  closed: 'bg-muted text-muted-foreground border-muted',
};

export default function DemoRequestsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);

  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['demo-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demo_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DemoRequest[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('demo_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-requests'] });
      toast.success('Status updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    },
  });

  const filteredRequests = requests?.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.hospital.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demo Requests</h1>
          <p className="text-muted-foreground">Manage incoming demo requests from potential customers</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or hospital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['pending', 'contacted', 'scheduled', 'converted', 'closed'].map((status) => {
          const count = requests?.filter((r) => r.status === status).length || 0;
          return (
            <Card key={status} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status)}>
              <CardContent className="pt-4 pb-4">
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
                <p className="text-2xl font-bold">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests ({filteredRequests?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredRequests?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No demo requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests?.map((request) => (
                    <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRequest(request)}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-muted-foreground">{request.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.hospital}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[request.status]}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(request.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={request.status}
                          onValueChange={(value) => {
                            handleStatusChange(request.id, value);
                          }}
                        >
                          <SelectTrigger className="w-[130px]" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Demo Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {selectedRequest.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{selectedRequest.name}</p>
                  <Badge variant="outline" className={statusColors[selectedRequest.status]}>
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">
                    {selectedRequest.email}
                  </a>
                </div>
                {selectedRequest.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedRequest.phone}`} className="text-primary hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedRequest.hospital}</span>
                </div>
                {selectedRequest.message && (
                  <div className="flex items-start gap-3 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">{selectedRequest.message}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Received on {format(new Date(selectedRequest.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
                </p>
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={`mailto:${selectedRequest.email}`}>Send Email</a>
                </Button>
                {selectedRequest.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedRequest.phone}`}>Call</a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
