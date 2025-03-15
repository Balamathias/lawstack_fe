"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, User, Mail, Lock, AtSign, BadgeCheck, AlertCircle, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser, useUpdateUser } from "@/services/client/users";

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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Define the schema for user form validation
const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  first_name: z.string().optional().or(z.literal("")),
  last_name: z.string().optional().or(z.literal("")),
  is_staff: z.boolean().default(false),
  is_superuser: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserEditFormProps {
  userId: string;
}

const UserEditForm = ({ userId }: UserEditFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  
  const { data: userData, isLoading, isError } = useUser(userId);
  const { mutate: updateUser, isPending } = useUpdateUser();
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      is_staff: false,
      is_superuser: false,
      is_active: true,
    },
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      form.reset({
        username: user.username,
        email: user.email,
        password: "", // Don't include password in form initially
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
        is_active: user.is_active,
      });
    }
  }, [userData, form]);

  const onSubmit = (values: UserFormValues) => {
    // Only include password if user has chosen to change it
    const payload = {
      ...values,
      password: changePassword ? values.password : undefined,
    };
    
    // Remove empty values to prevent overwriting with blank strings
    Object.keys(payload).forEach(key => {
      if (payload[key] === "") {
        delete payload[key];
      }
    });
    
    updateUser({ 
      id: userId, 
      payload
    }, {
      onSuccess: (data) => {
        if (data?.data) {
          toast.success("User updated successfully");
          router.push("/admin/users");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !userData?.data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div>
              <h3 className="text-lg font-medium">Failed to load user</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The user you are trying to edit could not be found or loaded.
              </p>
            </div>
            <Button onClick={() => router.push("/admin/users")}>
              Return to Users
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
          {/* Main user details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                User Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AtSign className="h-4 w-4" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormDescription>
                      Username must be unique and is used for login
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </h3>
                  <Switch
                    checked={changePassword}
                    onCheckedChange={setChangePassword}
                  />
                </div>
                
                {changePassword && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="New password" 
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Leave blank to keep the current password
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* User permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-indigo-600" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Active Account
                      </FormLabel>
                      <FormDescription>
                        User can login and access the system
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_staff"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Staff Status
                      </FormLabel>
                      <FormDescription>
                        User can access admin interface
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // If is_staff is unchecked, also uncheck is_superuser
                          if (!checked && form.getValues('is_superuser')) {
                            form.setValue('is_superuser', false);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_superuser"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Administrator
                      </FormLabel>
                      <FormDescription>
                        Full access to all features and settings
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        disabled={!form.getValues('is_staff')}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          // If is_superuser is checked, also check is_staff
                          if (checked && !form.getValues('is_staff')) {
                            form.setValue('is_staff', true);
                          }
                        }}
                      />
                    </FormControl>
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
              onClick={() => router.push(`/admin/users/${userId}/view`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update User
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default UserEditForm;
