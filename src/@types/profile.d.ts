export interface Profile {
  id: string;
  user: string;
  bio: string | null;
  avatar: string | null;
  points: number;
  rank: string;
  state: string | null;
  nationality: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  bio?: string;
  avatar?: string;
  state?: string;
  nationality?: string;
  address?: string;
}

export interface UserProfileData {
  // Base user fields
  id: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar: string | null;
  institution: string | null;
  institution_name: string | null;
  joined: string;
  
  // Extended profile fields
  bio: string | null;
  points: number;
  rank: string;
  state: string | null;
  nationality: string | null;
  address: string | null;
}

export interface UpdateUserProfilePayload {
  // User fields
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
  
  // Profile fields  
  bio?: string;
  state?: string;
  nationality?: string;
  address?: string;
}
