"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, BookText, School, Clock, Calculator, GraduationCap, AlertCircle, ArrowDownUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateCourse } from "@/services/client/courses";
import { useInstitutions } from "@/services/client/institutions";

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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Define the schema for course form validation
const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  code: z.string().min(2, "Course code must be at least 2 characters"),
  description: z.string().min(10, "Please provide a detailed course description"),
  level: z.string().min(1, "Please select a level"),
  duration: z.string().min(1, "Please specify the duration"),
  credit_units: z.number().min(1, "Credit units must be at least 1"),
  institution: z.array(z.string()).min(1, "Please select at least one institution"),
  ordering: z.number().nullable().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const CourseForm = () => {
  const router = useRouter();
  
  // Fetch institutions data from API
  const { data: institutionsData, isLoading: isLoadingInstitutions, error: institutionsError } = useInstitutions();
  
  // Levels for educational system
  const levels = ["100", "200", "300", "400", "500", "600"];
  
  const { mutate: createCourse, isPending } = useCreateCourse();
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      level: "",
      duration: "",
      credit_units: 1,
      institution: [],
      ordering: null,
    },
  });

  const onSubmit = (values: CourseFormValues) => {
    // Convert the form values to the format expected by the API
    const payload = {
      ...values,
      ordering: Number(values?.ordering || '0'),
      // Add any additional fields needed by the API
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      id: "", // This would be handled by the backend
    };
    
    createCourse(payload, {
      onSuccess: (data) => {
        if (data?.data) {
          toast.success("Course added successfully");
          router.push("/admin/courses");
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main course details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="h-5 w-5 text-blue-600" />
                Course Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Introduction to Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CSC101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the course content and objectives..."
                        className="min-h-32 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Course metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level} Level
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Duration
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1 semester" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credit_units"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Credit Units
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 3" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ordering"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ArrowDownUp className="h-4 w-4" />
                      Display Order (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 1" 
                        {...field} 
                        value={field.value === null ? '' : field.value}
                        onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first in the list
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        Institutions
                      </FormLabel>
                      <FormDescription>
                        Select the institutions where this course is offered.
                      </FormDescription>
                    </div>
                    
                    {institutionsError ? (
                      <div className="p-4 border border-destructive/30 rounded-md bg-destructive/10 text-destructive flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        Failed to load institutions. Please try again later.
                      </div>
                    ) : isLoadingInstitutions ? (
                      <div className="flex items-center justify-center p-6 border rounded-md">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading institutions...</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {institutionsData?.data?.map((institution) => (
                          <FormField
                            key={institution.id}
                            control={form.control}
                            name="institution"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={institution.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(institution.id)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, institution.id]
                                          : field.value?.filter(
                                              (value) => value !== institution.id
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {institution.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        
                        {institutionsData?.data?.length === 0 && (
                          <div className="p-4 border rounded-md text-muted-foreground text-sm">
                            No institutions found. Please add institutions first.
                          </div>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              disabled={isPending || isLoadingInstitutions}
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
                  Save Course
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CourseForm;
