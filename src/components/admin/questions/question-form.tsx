"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, BookText, Calendar, Tag, School, GraduationCap, Award, Type, StickyNote, Clipboard, RefreshCw, AlertCircle } from "lucide-react";
import { useCourses } from "@/services/client/courses";
import { useCreateQuestion } from "@/services/client/admin-question";
import { useInstitutions } from "@/services/client/institutions";
import { useRouter } from "next/navigation";
import { useUser } from "@/services/client/auth";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Define the schema for question form validation
const questionSchema = z.object({
  text: z.string().min(10, "Question text must be at least 10 characters"),
  year: z.string().min(4, "Please enter a valid year"),
  course: z.string().min(1, "Please select a course"),
  level: z.string().min(1, "Please select a level"),
  session: z.string().nullable().optional(),
  marks: z.number().min(1, "Marks must be at least 1"),
  semester: z.string().min(1, "Please select a semester"),
  institution: z.string().min(1, "Please select an institution"),
  type: z.string().min(1, "Please select a question type"),
  tags: z.array(z.string()).optional(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

// Save metadata to localStorage
const saveMetadata = (values: Omit<QuestionFormValues, 'text'>) => {
  localStorage.setItem('question_metadata', JSON.stringify(values));
};

// Get metadata from localStorage
const getMetadata = (): Omit<QuestionFormValues, 'text'> | null => {
  const metadata = localStorage.getItem('question_metadata');
  return metadata ? JSON.parse(metadata) : null;
};

const QuestionForm = () => {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);
  
  const { data: userData } = useUser();
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses();
  const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutions();
  const { mutate: createQuestion, isPending } = useCreateQuestion();
  
  // Get default values from localStorage or use empty values
  const savedMetadata = getMetadata();
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      year: savedMetadata?.year || new Date().getFullYear().toString(),
      course: savedMetadata?.course || "",
      level: savedMetadata?.level || "",
      session: savedMetadata?.session || null,
      marks: savedMetadata?.marks || 1,
      semester: savedMetadata?.semester || "",
      institution: savedMetadata?.institution || "",
      type: savedMetadata?.type || "",
      tags: savedMetadata?.tags || [],
    },
  });

  useEffect(() => {
    // If we have saved metadata and it's the first load, show a message
    if (savedMetadata && !hasSubmittedOnce) {
      toast.info("Previous question metadata loaded", {
        description: "You can continue adding questions with the same metadata.",
        action: {
          label: "Clear",
          onClick: () => setShowClearDialog(true),
        },
      });
    }
  }, [savedMetadata, hasSubmittedOnce]);

  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues("tags")?.includes(tagInput.trim())) {
      form.setValue("tags", [...(form.getValues("tags") || []), tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    form.setValue(
      "tags",
      form.getValues("tags")?.filter((t) => t !== tag) || []
    );
  };

  const clearMetadata = () => {
    localStorage.removeItem('question_metadata');
    
    // Reset form to default values without the saved metadata
    form.reset({
      text: "",
      year: new Date().getFullYear().toString(),
      course: "",
      level: "",
      session: null,
      marks: 1,
      semester: "",
      institution: "",
      type: "",
      tags: [],
    });
    
    setShowClearDialog(false);
    toast.success("Metadata cleared");
  };

  const onSubmit = (values: QuestionFormValues) => {
    // Save metadata for next question
    const { text, ...metadata } = values;
    saveMetadata(metadata);
    
    const payload = {
      ...values,
      // text_plain, course_name, and institution_name are removed as they're read-only
      uploaded_by: userData?.data?.id || "", // Use current user ID if available
    };

    createQuestion(payload, {
      onSuccess: (data) => {
        if (data?.data) {
          setHasSubmittedOnce(true);
          
          // Keep the form open for the next question, but clear the text
          form.setValue("text", "");
          
          toast.success("Question added successfully", {
            description: "You can add another question or go back to the dashboard.",
            action: {
              label: "Add Another",
              onClick: () => {
                window.scrollTo(0, 0);
              },
            },
          });
        }
      }
    });
  };
  
  // Levels for educational system
  const levels = ["100", "200", "300", "400", "500", "600"];
  
  // Question types
  const questionTypes = ["MCQ", "Essay", "Short Answer", "Practical"];
  
  // Semesters
  const semesters = [
    { name: "First Semester", value: "1" },
    { name: "Second Semester", value: "2" },
  ];
  
  // Current and past years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString());

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {savedMetadata && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clipboard className="h-4 w-4" />
                <span>Using saved metadata from previous question</span>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowClearDialog(true)}
              >
                <RefreshCw className="h-4 w-4" />
                Clear Metadata
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main question content section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookText className="h-5 w-5 text-blue-600" />
                  Question Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        Question Text
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the full question text here..."
                          className="min-h-32 resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the complete question as it appears in the original material.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Right sidebar for metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                  Question Metadata
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Year
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <School className="h-4 w-4" />
                          Institution
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoadingInstitutions}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingInstitutions ? "Loading institutions..." : "Select Institution"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingInstitutions ? (
                              <SelectItem value="loading" disabled>Loading institutions...</SelectItem>
                            ) : (
                              institutionsData?.data?.map((institution) => (
                                <SelectItem key={institution.id} value={institution.id}>
                                  {institution.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <BookText className="h-4 w-4" />
                          Course
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoadingCourses}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select Course"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {isLoadingCourses ? (
                              <SelectItem value="loading" disabled>Loading courses...</SelectItem>
                            ) : (
                              coursesData?.data?.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.name} ({course.code})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Level
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {semesters.map((semester) => (
                                <SelectItem key={semester.value} value={semester.value}>
                                  {semester.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Marks
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g., 10" 
                              {...field} 
                              value={field.value}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Type className="h-4 w-4" />
                            Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {questionTypes.map((type) => (
                                <SelectItem key={type} value={type.toLowerCase()}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="session"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Session (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 2022/2023" 
                            {...field} 
                            value={field.value || ""} 
                            onChange={e => field.onChange(e.target.value || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Tags
                        </FormLabel>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add tags..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddTag}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.getValues("tags")?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="px-2 py-1 bg-secondary/40"
                            >
                              {tag}
                              <button
                                type="button"
                                className="ml-1 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                ✕
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardFooter className="flex justify-between p-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isLoadingInstitutions || isLoadingCourses}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Question
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Clear Saved Metadata
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all saved question metadata (year, course, institution, etc.) and reset the form to default values. You will need to re-enter these details for new questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearMetadata}>Clear Metadata</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuestionForm;
