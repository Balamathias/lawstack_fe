'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useCreateNewsletter, useUpdateNewsletter } from '@/services/client/admin-newsletter'
import { NewsletterCategory, Newsletter } from '@/services/server/newsletter'

// Form schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NewsletterFormProps {
  newsletter?: Newsletter
  categories?: NewsletterCategory[]
}

const NewsletterForm = ({ newsletter, categories = [] }: NewsletterFormProps) => {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  
  // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: newsletter?.title || '',
      content: newsletter?.content || '',
      category: newsletter?.category || '',
    },
  })

  // Setup mutations
  const { mutate: createNewsletter, isPending: isCreating } = useCreateNewsletter()
  const { mutate: updateNewsletter, isPending: isUpdating } = useUpdateNewsletter()
  
  const isPending = isCreating || isUpdating
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    if (newsletter) {
      // Update existing newsletter
      updateNewsletter(
        { 
          id: newsletter.id, 
          ...values 
        },
        {
          onSuccess: () => {
            toast.success('Newsletter updated successfully')
            router.push('/admin/newsletter')
          },
          onError: (error) => {
            toast.error(`Error updating newsletter: ${error.message}`)
          },
        }
      )
    } else {
      // Create new newsletter
      createNewsletter(
        values,
        {
          onSuccess: () => {
            toast.success('Newsletter created successfully')
            router.push('/admin/newsletter')
          },
          onError: (error) => {
            toast.error(`Error creating newsletter: ${error.message}`)
          },
        }
      )
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Newsletter Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a title for your newsletter" 
                          {...field} 
                          className="text-lg font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        {isPreview ? (
                          <div 
                            className="border rounded-md p-4 min-h-[400px] prose dark:prose-invert max-w-none" 
                            dangerouslySetInnerHTML={{ __html: field.value }}
                          />
                        ) : (
                          <Textarea 
                            placeholder="Compose your newsletter content here..."
                            {...field}
                            className="min-h-[400px]"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Newsletter Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          value={field.value || ""} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No Category</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t p-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {newsletter ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {newsletter ? 'Update' : 'Create'}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Tips card */}
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Tips for great newsletters</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                  <li>Keep your subject line concise and engaging</li>
                  <li>Use a clear and consistent layout</li>
                  <li>Include a clear call-to-action</li>
                  <li>Personalize content when possible</li>
                  <li>Optimize for mobile devices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default NewsletterForm