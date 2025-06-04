'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateUserProfile } from "@/services/client/profile";
import { UserProfileData, UpdateUserProfilePayload } from "@/@types/profile";
import { User, MapPin, Phone, FileText, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  state: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  profile: UserProfileData;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm = ({ profile, onSave, onCancel }: ProfileEditFormProps) => {
  const updateProfileMutation = useUpdateUserProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      state: profile.state || '',
      nationality: profile.nationality || '',
      address: profile.address || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // Remove empty strings and convert to undefined
      const payload: UpdateUserProfilePayload = {};
      
      Object.entries(values).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          (payload as any)[key] = value.trim();
        }
      });

      await updateProfileMutation.mutateAsync({
        userId: profile.id,
        payload,
      });

      onSave();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
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
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Enter phone number" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="resize-none"
                        rows={4}
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormMessage />
                      <span className="text-xs text-muted-foreground">
                        {field.value?.length || 0}/500
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter nationality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state or province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address"
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={updateProfileMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
