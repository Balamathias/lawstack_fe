'use server';

import { stackbase } from '../server.entry';
import { PaginatedStackResponse, StackResponse } from '@/@types/generics';

export interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Newsletter {
  id: string;
  title: string;
  content: string;
  category: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterDelivery {
  id: string;
  newsletter: string;
  subscriber: string;
  sent_at: string;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
  updated_at: string;
}

// Get all newsletters with optional filtering
export const getNewsletters = async (params?: Record<string, any>): Promise<PaginatedStackResponse<Newsletter[]>> => {
  try {
    const response = await stackbase.get('/newsletter/newsletters/', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching newsletters:', error);
    return {
      data: [],
      count: 0,
      error: error.response?.data?.error || error.message || 'Failed to fetch newsletters',
      message: error.response?.data?.error || error.message || 'Failed to fetch newsletters',
      next: '',
      previous: '',
      status: 500,
    };
  }
};

// Get a single newsletter by ID
export const getNewsletter = async (id: string): Promise<StackResponse<Newsletter | null>> => {
  try {
    const response = await stackbase.get(`/newsletter/newsletters/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching newsletter ${id}:`, error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to fetch newsletter',
      error: error.response?.data?.error || error.message || 'Failed to fetch newsletter',
      status: 500,
    };
  }
};

// Get all subscribers with optional filtering
export const getSubscribers = async (params?: Record<string, any>): Promise<PaginatedStackResponse<Subscriber[]>> => {
  try {
    const response = await stackbase.get('/newsletter/subscribers/', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching subscribers:', error);
    return {
      data: [],
      error: error.response?.data?.error || error.message || 'Failed to fetch subscribers',
        count: 0,
        message: error.response?.data?.error || error.message || 'Failed to fetch subscribers',
        next: '',
        previous: '',
        status: 500,
    };
  }
};

// Get all categories with optional filtering
export const getNewsletterCategories = async (params?: Record<string, any>): Promise<PaginatedStackResponse<NewsletterCategory[]>> => {
  try {
    const response = await stackbase.get('/newsletter/categories/', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching newsletter categories:', error);
    return {
      data: [],
        count: 0,
        message: error.response?.data?.error || error.message || 'Failed to fetch newsletter categories',
        next: '',
        previous: '',
        status: 500,
      error: error.response?.data?.error || error.message || 'Failed to fetch newsletter categories',
    };
  }
};

// Get delivery statistics
export const getDeliveryStatistics = async (): Promise<StackResponse<any>> => {
  try {
    const response = await stackbase.get('/newsletter/statistics/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching delivery statistics:', error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to fetch delivery statistics',
      status: 500,
      error: error.response?.data?.error || error.message || 'Failed to fetch delivery statistics',
    };
  }
};

// ADMIN FUNCTIONS

// Create a new newsletter
export const createNewsletter = async (data: { 
  title: string; 
  content: string; 
  category?: string | null;
}): Promise<StackResponse<Newsletter | null>> => {
  try {
    const response = await stackbase.post('/newsletter/newsletters/', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating newsletter:', error);
    return {
      data: null,
      error: error.response?.data?.error || error.response?.data?.detail || 'Failed to create newsletter',
      message: error.response?.data?.error || error.response?.data?.detail || 'Failed to create newsletter',
      status: 500,
    };
  }
};

// Update an existing newsletter
export const updateNewsletter = async (
  id: string,
  data: { 
    title?: string; 
    content?: string; 
    category?: string | null; 
  }
): Promise<StackResponse<Newsletter | null>> => {
  try {
    const response = await stackbase.patch(`/newsletter/newsletters/${id}/`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating newsletter ${id}:`, error);
    return {
      data: null,
      error: error.response?.data?.error || error.response?.data?.detail || 'Failed to update newsletter',
        message: error.response?.data?.error || error.response?.data?.detail || 'Failed to update newsletter',
        status: 500,
    };
  }
};

// Delete a newsletter
export const deleteNewsletter = async (id: string): Promise<StackResponse<any>> => {
  try {
    const response = await stackbase.delete(`/newsletter/newsletters/${id}/`);
    return {
      data: { success: true },
      error: null,
      message: 'Newsletter deleted successfully',
      status: 200,
    };
  } catch (error: any) {
    console.error(`Error deleting newsletter ${id}:`, error);
    return {
      data: null,
      error: error.response?.data?.error || error.message || 'Failed to delete newsletter',
        message: error.response?.data?.error || error.message || 'Failed to delete newsletter',
        status: 500,
    };
  }
};

// Send a newsletter to subscribers
export const sendNewsletter = async (
  id: string, 
  testEmail?: string
): Promise<StackResponse<any>> => {
  try {
    const endpoint = testEmail 
      ? `/newsletter/newsletters/${id}/send_test/` 
      : `/newsletter/newsletters/${id}/send/`;
    
    const data = testEmail ? { email: testEmail } : {};
    
    const response = await stackbase.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error sending newsletter ${id}:`, error);
    return {
      data: null,
      error: error.response?.data?.error || error.message || 'Failed to send newsletter',
        message: error.response?.data?.error || error.message || 'Failed to send newsletter',
        status: 500,
    };
  }
};

// Create a new newsletter category
export const createNewsletterCategory = async (data: {
  name: string;
  description?: string | null;
}): Promise<StackResponse<NewsletterCategory | null>> => {
  try {
    const response = await stackbase.post('/newsletter/categories/', data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating newsletter category:', error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to create newsletter category',
      error: error.response?.data?.error || error.message || 'Failed to create newsletter category',
      status: 500,
    };
  }
};
// Update a newsletter category
export const updateNewsletterCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string | null;
  }
): Promise<StackResponse<NewsletterCategory | null>> => {
  try {
    const response = await stackbase.patch(`/newsletter/categories/${id}/`, data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating newsletter category ${id}:`, error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to update newsletter category',
      error: error.response?.data?.error || error.message || 'Failed to update newsletter category',
      status: 500,
    };
  }
};
// Delete a newsletter category
export const deleteNewsletterCategory = async (id: string): Promise<StackResponse<any>> => {
  try {
    await stackbase.delete(`/newsletter/categories/${id}/`);
    return {
      data: { success: true },
      message: 'Newsletter category deleted successfully',
      error: null,
      status: 200,
    };
  } catch (error: any) {
    console.error(`Error deleting newsletter category ${id}:`, error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to delete newsletter category',
      error: error.response?.data?.error || error.message || 'Failed to delete newsletter category',
      status: 500,
    };
  }
}

// Delete a subscriber (admin function)
export const deleteSubscriber = async (id: string): Promise<StackResponse<any>> => {
  try {
    await stackbase.delete(`/newsletter/subscribers/${id}/`);
    return {
      data: { success: true },
      message: 'Subscriber deleted successfully',
      error: null,
      status: 200,
    };
  } catch (error: any) {
    console.error(`Error deleting subscriber ${id}:`, error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to delete subscriber',
      error: error.response?.data?.error || error.message || 'Failed to delete subscriber',
      status: 500,
    };
  }
}

// Get newsletter analytics
export const getNewsletterAnalytics = async (id: string): Promise<StackResponse<any>> => {
  try {
    const response = await stackbase.get(`/newsletter/newsletters/${id}/analytics/`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching analytics for newsletter ${id}:`, error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to fetch newsletter analytics',
      error: error.response?.data?.error || error.message || 'Failed to fetch newsletter analytics',
      status: 500,
    };
  }
}

export const verifySubscription = async (token: string): Promise<StackResponse<any>> => {
  try {
    const response = await stackbase.get(`/newsletter/verify-subscription/${token}/`);
    return response.data;
  } catch (error: any) {
    console.error('Error verifying subscription:', error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to verify subscription',
      error: error.response?.data?.error || error.message || 'Failed to verify subscription',
      status: 500,
    };
  }
}
export const unsubscribe = async (token: string): Promise<StackResponse<any>> => {
  try {
    const response = await stackbase.get(`/newsletter/unsubscribe/${token}/`);
    return response.data;
  } catch (error: any) {
    console.error('Error unsubscribing:', error);
    return {
      data: null,
      message: error.response?.data?.error || error.message || 'Failed to unsubscribe',
      error: error.response?.data?.error || error.message || 'Failed to unsubscribe',
      status: 500,
    };
  }
}