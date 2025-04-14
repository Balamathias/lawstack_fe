'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Send, 
  Eye, 
  CheckCircle, 
  Clock, 
  Mail,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useDeleteNewsletter, useSendNewsletter } from '@/services/client/admin-newsletter';
import Link from 'next/link';
import { Newsletter } from '@/services/server/newsletter';

interface NewsletterTableProps {
  newsletters: Newsletter[];
  isLoading?: boolean;
}

const NewsletterTable = ({ newsletters, isLoading }: NewsletterTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [sendDialogOpen, setSendDialogOpen] = React.useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = React.useState<Newsletter | null>(null);
  const [sendToEmail, setSendToEmail] = React.useState<string>("");
  const [sendAsTest, setSendAsTest] = React.useState(true);

  const { mutate: deleteNewsletter, isPending: isDeleting } = useDeleteNewsletter();
  const { mutate: sendNewsletter, isPending: isSending } = useSendNewsletter();

  const handleDelete = () => {
    if (!selectedNewsletter) return;
    
    deleteNewsletter(selectedNewsletter.id, {
      onSuccess: () => {
        toast.success('Newsletter deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedNewsletter(null);
      },
      onError: (error) => {
        toast.error(`Failed to delete newsletter: ${error.message}`);
      },
    });
  };

  const handleSend = () => {
    if (!selectedNewsletter) return;
    
    sendNewsletter({
      id: selectedNewsletter.id,
      test_email: sendAsTest ? sendToEmail : undefined,
    }, {
      onSuccess: (data) => {
        toast.success(data.message || 'Newsletter sent successfully');
        setSendDialogOpen(false);
        setSelectedNewsletter(null);
        setSendToEmail("");
      },
      onError: (error) => {
        toast.error(`Failed to send newsletter: ${error.message}`);
      },
    });
  };

  const openDeleteDialog = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setDeleteDialogOpen(true);
  };

  const openSendDialog = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setSendDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading newsletters...</p>
        </div>
      </div>
    );
  }

  if (!newsletters.length) {
    return (
      <div className="bg-muted/30 rounded-md p-8 text-center">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground/60 mb-3" />
        <h3 className="text-lg font-medium mb-2">No newsletters found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't created any newsletters yet. Create your first newsletter to get started.
        </p>
        <Link href="/admin/newsletter/create">
          <Button>Create Newsletter</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell">Created</th>
              <th className="h-12 px-4 text-left align-middle font-medium hidden lg:table-cell">Status</th>
              <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.map((newsletter) => (
              <tr key={newsletter.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="p-4 align-middle">
                  <div className="font-medium max-w-[250px] truncate">
                    {newsletter.title}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  {newsletter.category ? (
                    <Badge variant="outline" className="font-normal">
                      {newsletter.category}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </td>
                <td className="p-4 align-middle hidden md:table-cell">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(newsletter.created_at), 'dd MMM yyyy')}
                    </span>
                  </div>
                </td>
                <td className="p-4 align-middle hidden lg:table-cell">
                  {newsletter.sent_at ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1 font-normal">
                      <CheckCircle className="h-3 w-3" />
                      Sent
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1 font-normal">
                      <Clock className="h-3 w-3" />
                      Draft
                    </Badge>
                  )}
                </td>
                <td className="p-4 align-middle text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/admin/newsletter/${newsletter.id}/view`} passHref>
                        <DropdownMenuItem className="flex items-center cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/admin/newsletter/${newsletter.id}/edit`} passHref>
                        <DropdownMenuItem className="flex items-center cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem 
                        className="flex items-center cursor-pointer"
                        onClick={() => openSendDialog(newsletter)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="flex items-center text-destructive cursor-pointer"
                        onClick={() => openDeleteDialog(newsletter)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Newsletter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this newsletter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 p-3 rounded-md">
            {selectedNewsletter?.title}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Newsletter Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Newsletter</DialogTitle>
            <DialogDescription>
              Select how you want to send this newsletter.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 py-2">
              <Checkbox 
                id="send-test" 
                checked={sendAsTest} 
                onCheckedChange={(checked) => setSendAsTest(!!checked)}
              />
              <div className="space-y-1 flex-1">
                <label 
                  htmlFor="send-test" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Send as a test email
                </label>
                <p className="text-sm text-muted-foreground">
                  Send to a single email address for testing.
                </p>
                {sendAsTest && (
                  <input 
                    type="email"
                    placeholder="Enter email address"
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground mt-2"
                    value={sendToEmail}
                    onChange={(e) => setSendToEmail(e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3 py-2">
              <Checkbox 
                id="send-all" 
                checked={!sendAsTest} 
                onCheckedChange={(checked) => setSendAsTest(!checked)}
              />
              <div className="space-y-1">
                <label 
                  htmlFor="send-all" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Send to all subscribers
                </label>
                <p className="text-sm text-muted-foreground">
                  This will send the newsletter to all active subscribers.
                </p>
                {!sendAsTest && (
                  <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded text-yellow-800 dark:text-yellow-400 text-xs flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                      This action cannot be undone. The newsletter will be sent to all subscribers immediately.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSendDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || (sendAsTest && !sendToEmail)}
            >
              {isSending ? 'Sending...' : sendAsTest ? 'Send Test' : 'Send to All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterTable;