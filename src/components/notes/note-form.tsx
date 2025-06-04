'use client';

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Save, Loader2, ArrowLeft, Eye, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useCreateNote, useUpdateNote } from '@/services/client/notes';
import MarkdownPreview from '@/components/markdown-preview';
import Link from 'next/link';
import { Note } from '@/@types/db';

// Form schema based on the Note interface
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  label: z.enum(['draft', 'completed'], {
    required_error: 'Please select a label',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface NoteFormProps {
  note?: Note;
}

const NoteForm = ({ note }: NoteFormProps) => {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const isEditing = !!note;
    // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
      label: (note?.label || 'draft') as 'draft' | 'completed',
    },
  });

  // Setup mutations
  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  
  const isPending = isCreating || isUpdating;
    // Form submission handler
  const onSubmit = (values: FormValues) => {
    if (isEditing && note) {
      // Update existing note
      updateNote(
        { 
          id: note.id, 
          payload: values 
        },
        {
          onSuccess: (response) => {
            if (response.data) {
              toast.success('Note updated successfully');
              router.push(`/dashboard/notes/${response.data.id}`);
            } else {
              toast.error('Failed to update note');
            }
          },
          onError: (error) => {
            toast.error(`Error updating note: ${error.message || 'Something went wrong'}`);
          },
        }
      );
    } else {
      // Create new note
      createNote(
        values,
        {
          onSuccess: (response) => {
            if (response.data) {
              toast.success('Note created successfully');
              router.push(`/dashboard/notes/${response.data.id}`);
            } else {
              toast.error('Failed to create note');
            }
          },
          onError: (error) => {
            toast.error(`Error creating note: ${error.message || 'Something went wrong'}`);
          },
        }
      );
    }
  };

  // Watch form values for auto-save or preview
  const titleValue = form.watch('title');
  const contentValue = form.watch('content');
  const labelValue = form.watch('label');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-4">
            <Link href="/dashboard/notes">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Notes
              </Button>
            </Link>            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isEditing ? 'Edit Note' : 'Create New Note'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEditing 
                  ? 'Update your note content and settings' 
                  : 'Create a new note to organize your thoughts and insights'
                }
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main editor */}
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Edit3 className="h-5 w-5" />
                        Note Details
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPreview(!isPreview)}
                        className="gap-2"
                      >
                        {isPreview ? (
                          <>
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Preview
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter a descriptive title for your note" 
                              {...field} 
                              className="text-lg font-medium"
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            Choose a clear, descriptive title that summarizes your note
                          </FormDescription>
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
                              <div className="border rounded-md p-4 min-h-[400px] bg-muted/20">
                                {field.value ? (
                                  <MarkdownPreview content={field.value} />
                                ) : (
                                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                                    <div className="text-center">
                                      <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                      <p>Start writing to see preview</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Textarea 
                                placeholder="Write your note content here... You can use Markdown formatting!"
                                {...field}
                                className="min-h-[400px] resize-none"
                                disabled={isPending}
                              />
                            )}
                          </FormControl>
                          <FormDescription>
                            {!isPreview && "Supports Markdown formatting for rich text styling"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Note Settings */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Note Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="label"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select note status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                                  Draft
                                </div>
                              </SelectItem>
                              <SelectItem value="completed">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  Completed
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Mark as draft while working or completed when finished
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Note Preview Card */}
                    {(titleValue || contentValue) && (
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Preview</h4>
                        <div className="p-3 bg-muted/30 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm truncate">
                              {titleValue || 'Untitled Note'}
                            </h5>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${
                                labelValue === 'completed' ? 'bg-green-500' : 'bg-amber-500'
                              }`} />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {contentValue ? 
                              contentValue.slice(0, 120) + (contentValue.length > 120 ? '...' : '') 
                              : 'Start writing your note content...'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>                {/* Action Buttons */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full gap-2" 
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {isEditing ? 'Updating Note...' : 'Creating Note...'}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            {isEditing ? 'Update Note' : 'Create Note'}
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => router.push('/dashboard/notes')}
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NoteForm;
