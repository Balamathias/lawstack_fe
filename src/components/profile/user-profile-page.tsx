'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Building,
  Award,
  Globe,
  FileText,
  Camera
} from "lucide-react";
import { useUserProfile, useUpdateUserProfile } from "@/services/client/profile";
import { getUser } from "@/services/server/auth";
import ProfilePictureUpload from "@/components/ui/profile-picture-upload";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileEditForm } from './profile-edit-form';

interface UserProfilePageProps {
  userId?: string;
  currentUser?: any;
}

export const UserProfilePage = ({ userId, currentUser }: UserProfilePageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  
  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = !userId || userId === currentUser?.id;
  
  const { data: profileData, isLoading, isError } = useUserProfile(profileUserId);
  const updateProfileMutation = useUpdateUserProfile();

  const profile = profileData?.data;

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return "U";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleAvatarUpload = async (avatarUrl: string) => {
    try {
      await updateProfileMutation.mutateAsync({
        userId: profileUserId,
        payload: { avatar: avatarUrl }
      });
      setShowAvatarUpload(false);
    } catch (error) {
      console.error('Failed to update profile avatar:', error);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <Card className="">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Profile not found</h3>
            <p>The user profile you're looking for doesn't exist or couldn't be loaded.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        </div>
        <CardContent className="relative pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage 
                  src={profile.avatar || ''} 
                  alt={`${profile.first_name || ''} ${profile.last_name || ''}`}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {getInitials(profile.first_name, profile.last_name, profile.email)}
                </AvatarFallback>
              </Avatar>
              
              {isOwnProfile && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-background border-2"
                  onClick={() => setShowAvatarUpload(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-4 sm:mt-16">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {profile.first_name && profile.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile.username || profile.email.split('@')[0]
                  }
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-muted-foreground">@{profile.username || 'user'}</span>
                  <Badge variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    {profile.rank || 'Newbie'}
                  </Badge>
                  {profile.points > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {profile.points} points
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form or Profile Details */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileEditForm
              profile={profile}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="profile-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  
                  {profile.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  
                  {profile.institution_name && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.institution_name}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Joined {formatDate(profile.joined)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Bio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Bio</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {profile.bio}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No bio available</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  {profile.nationality && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.nationality}</span>
                    </div>
                  )}
                  
                  {profile.state && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.state}</span>
                    </div>
                  )}
                  
                  {profile.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{profile.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Update Profile Picture</CardTitle>
            </CardHeader>            <CardContent>              
              <ProfilePictureUpload
                userId={profileUserId}
                currentAvatar={profile.avatar || undefined}
                onAvatarChange={handleAvatarUpload}
              />
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAvatarUpload(false)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
      <CardContent className="pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
          <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
          <div className="flex-1 space-y-4 sm:mt-16">
            <div>
              <Skeleton className="h-8 w-48" />
              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
    
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </div>
  </div>
);
