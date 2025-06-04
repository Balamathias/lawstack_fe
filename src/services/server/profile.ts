'use server'

import { StackResponse } from '@/@types/generics'
import { Profile, UpdateProfilePayload, UserProfileData } from '@/@types/profile'
import { stackbase } from '../server.entry'

/**
 * Get user's complete profile data (user + profile)
 */
export const getUserProfile = async (userId: string): Promise<StackResponse<UserProfileData | null>> => {
    try {
        const { data } = await stackbase.get(`/users/${userId}/profile/`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

/**
 * Get profile by username
 */
export const getProfileByUsername = async (username: string): Promise<StackResponse<UserProfileData | null>> => {
    try {
        const { data } = await stackbase.get(`/profile/${username}/`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

/**
 * Update user profile information
 */
export const updateProfile = async (userId: string, payload: UpdateProfilePayload): Promise<StackResponse<Profile | null>> => {
    try {
        const { data } = await stackbase.patch(`/users/${userId}/profile/`, payload)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}
