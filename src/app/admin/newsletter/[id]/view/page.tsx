import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit, Send, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getNewsletter, getNewsletterAnalytics } from '@/services/server/newsletter'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import SendNewsletterButton from '@/components/admin/newsletter/send-newsletter-button'

interface ViewNewsletterPageProps {
  params: {
    id: string
  }
}

const ViewNewsletterPage = async ({ params }: ViewNewsletterPageProps) => {
  const { data: newsletter, error } = await getNewsletter(params.id);
  const { data: analytics } = await getNewsletterAnalytics(params.id);
  
  if (error || !newsletter) {
    notFound();
  }
  
  return (
    <div className="max-w-7xl flex flex-col space-y-2.5 sm:space-y-4 md:py-12 py-4 md:mx-auto w-full px-4 pb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link 
            href="/admin/newsletter" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Newsletters
          </Link>
          <h2 className="text-2xl font-bold">
            {newsletter.title}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(new Date(newsletter.created_at), 'dd MMMM yyyy')}
              </span>
            </div>
            {newsletter.category && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Tag className="h-3.5 w-3.5" />
                <span>{newsletter.category}</span>
              </div>
            )}
            <Badge className={newsletter.sent_at ? 
              "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : 
              "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            }>
              {newsletter.sent_at ? 'Sent' : 'Draft'}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href={`/admin/newsletter/${params.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          
          {!newsletter.sent_at && (
            <SendNewsletterButton id={newsletter.id} />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main newsletter content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
          </CardContent>
        </Card>
        
        {/* Analytics sidebar */}
        <div className="space-y-6">
          {newsletter.sent_at && analytics ? (
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Recipients:</span>
                    <span className="font-medium">{analytics.recipients || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Opens:</span>
                    <span className="font-medium">{analytics.opens || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Clicks:</span>
                    <span className="font-medium">{analytics.clicks || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Open rate:</span>
                    <span className="font-medium">
                      {analytics.open_rate ? `${analytics.open_rate}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Click rate:</span>
                    <span className="font-medium">
                      {analytics.click_rate ? `${analytics.click_rate}%` : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Sent on: {newsletter.sent_at ? format(new Date(newsletter.sent_at), 'dd MMMM yyyy, h:mm a') : 'Not sent yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                      Draft
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Created on:</span>
                    <span className="font-medium">
                      {format(new Date(newsletter.created_at), 'dd MMM yyyy')}
                    </span>
                  </div>
                  {newsletter.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{newsletter.category}</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Analytics will be available after sending the newsletter.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Tips card */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">Newsletter best practices</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                <li>Send newsletters consistently</li>
                <li>Test emails before sending to all subscribers</li>
                <li>Analyze performance to improve future newsletters</li>
                <li>Keep content valuable and relevant</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ViewNewsletterPage