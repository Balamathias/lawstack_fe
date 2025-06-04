import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Profile, UpdateProfilePayload, UserProfileData, UpdateUserProfilePayload } from "@/@types/profile";
import { User } from "@/@types/db";
import { 
  getUserProfile, 
  getProfileByUsername,
  updateProfile
} from "../server/profile";
import { updateUser } from "../server/users";
import { QUERY_KEYS } from "./query-keys";
import { toast } from "sonner";

// Get user's complete profile data
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.get_user_profile, userId],
    queryFn: async () => {
      return getUserProfile(userId);
    },
    enabled: !!userId,
  });
};

// Get profile by username
export const useProfileByUsername = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.get_profile_by_username, username],
    queryFn: async () => {
      return getProfileByUsername(username);
    },
    enabled: !!username,
  });
};

// Update user profile (combines user and profile updates)
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.update_user_profile],
    mutationFn: async ({ userId, payload }: { userId: string; payload: UpdateUserProfilePayload }) => {
      // Split payload into user and profile fields
      const { first_name, last_name, phone, avatar, ...profileFields } = payload;
      
      const userFields = { first_name, last_name, phone, avatar };
      const hasUserFields = Object.values(userFields).some(value => value !== undefined);
      const hasProfileFields = Object.values(profileFields).some(value => value !== undefined);
      
      let userResult = null;
      let profileResult = null;
      
      // Update user fields if any
      if (hasUserFields) {
        // Remove undefined values
        const cleanUserFields = Object.fromEntries(
          Object.entries(userFields).filter(([_, value]) => value !== undefined)
        );
        userResult = await updateUser(userId, cleanUserFields);
      }
      
      // Update profile fields if any  
      if (hasProfileFields) {
        profileResult = await updateProfile(userId, profileFields);
      }
      
      return { userResult, profileResult };
    },
    onSuccess: (data) => {
      const { userResult, profileResult } = data;
      
      if ((userResult?.data || !userResult) && (profileResult?.data || !profileResult)) {
        toast.success("Profile updated successfully");
        
        // Invalidate related queries
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_user_profile] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_profile_by_username] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_user] 
        });
      } else {
        const errorMessage = userResult?.message || profileResult?.message || "Failed to update profile";
        toast.error(errorMessage);
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while updating the profile"
      );
    },
  });
};

// Update only profile fields
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.update_profile],
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateProfilePayload }) => {
      return updateProfile(userId, payload);
    },
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_user_profile] 
        });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_profile_by_username] 
        });
      } else {
        toast.error(data?.message || "Failed to update profile");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while updating the profile"
      );
    },
  });
};
