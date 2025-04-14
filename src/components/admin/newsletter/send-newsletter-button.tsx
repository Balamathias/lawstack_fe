'use client'

import React, { useState } from 'react'
import { Send, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useSendNewsletter } from '@/services/client/admin-newsletter'
import { useRouter } from 'next/navigation'

interface SendNewsletterButtonProps {
  id: string
}

const SendNewsletterButton = ({ id }: SendNewsletterButtonProps) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [sendAsTest, setSendAsTest] = useState(true)
  const [sendToEmail, setSendToEmail] = useState('')
  
  const { mutate: sendNewsletter, isPending } = useSendNewsletter()
  
  const handleSend = () => {
    sendNewsletter(
      {
        id,
        test_email: sendAsTest ? sendToEmail : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || 'Newsletter sent successfully')
          setOpen(false)
          router.refresh()
        },
        onError: (error) => {
          toast.error(`Failed to send newsletter: ${error.message}`)
        },
      }
    )
  }
  
  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
      >
        <Send className="h-4 w-4" />
        Send
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
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
                  <Input 
                    type="email"
                    placeholder="Enter email address"
                    className="mt-2"
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
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isPending || (sendAsTest && !sendToEmail)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {sendAsTest ? 'Sending Test...' : 'Sending...'}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {sendAsTest ? 'Send Test' : 'Send to All'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SendNewsletterButton