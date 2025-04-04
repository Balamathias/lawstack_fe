"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, BookText, Calendar, Tag, School, GraduationCap, Award, Type, StickyNote, AlertCircle } from "lucide-react";
import { useCourses } from "@/services/client/courses";
import { useUpdateQuestion, } from "@/services/client/admin-question";
import { useQuestion, } from "@/services/client/question";
import { useInstitutions } from "@/services/client/institutions";
import { useRouter } from "next/navigation";
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
import { Skeleton } from "@/components/ui/skeleton";

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

interface QuestionEditFormProps {
  questionId: string;
}

const QuestionEditForm = ({ questionId }: QuestionEditFormProps) => {
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  
  const { data: questionData, isLoading: isLoadingQuestion, isError: isErrorQuestion } = useQuestion(questionId);
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses();
  const { data: institutionsData, isLoading: isLoadingInstitutions } = useInstitutions();
  const { mutate: updateQuestion, isPending } = useUpdateQuestion();
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      year: "",
      course: "",
      level: "",
      session: null,
      marks: 1,
      semester: "",
      institution: "",
      type: "",
      tags: [],
    },
  });

  // Set form values when question data is loaded
  useEffect(() => {
    if (questionData?.data) {
      const question = questionData.data;
      form.reset({
        text: question.text,
        year: question.year,
        course: question.course,
        level: question.level,
        session: question.session,
        marks: question.marks,
        semester: question.semester,
        institution: question.institution,
        type: question.type.toLowerCase(),
        tags: question.tags || [],
      });
    }
  }, [questionData, form]);

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

  const onSubmit = (values: QuestionFormValues) => {
    updateQuestion(
      { 
        id: questionId, 
        payload: values
      }, 
      {
        onSuccess: (data) => {
          if (data?.data) {
            toast.success("Question updated successfully");
            router.push("/admin/questions");
          }
        }
      }
    );
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

  if (isLoadingQuestion) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isErrorQuestion || !questionData?.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div>
              <h3 className="text-lg font-medium">Failed to load question</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The question you are trying to edit could not be found or loaded.
              </p>
            </div>
            <Button onClick={() => router.push("/admin/questions")}>
              Return to Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormControl>
                        <Input placeholder="e.g., 2023" {...field} />
                      </FormControl>
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
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Question
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default QuestionEditForm;
