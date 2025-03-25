'use server';

import { StackResponse, PaginatedStackResponse } from '@/@types/generics';
import { stackbase } from '../server.entry';

export type SearchFilters = {
  q?: string;
  institution?: string;
  course?: string;
  year?: string;
  type?: string;
};

export type SearchResults = {
  past_questions: any[];
  courses: any[];
  institutions: any[];
};

/**
 * Perform an advanced search across multiple content types
 */
export async function searchContent(filters: SearchFilters): Promise<StackResponse<SearchResults>> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const { data } = await stackbase.get(`/search/?${params.toString()}`);
    return data;
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.response?.data?.detail,
      error: error?.response?.data,
      data: {
        past_questions: [],
        courses: [],
        institutions: []
      },
      status: error?.response?.status
    };
  }
}

/**
 * Fetch filter options for search form
 */
export async function getSearchFilterOptions(): Promise<StackResponse<{
  institutions: Array<{ id: string; name: string }>;
  courses: Array<{ id: string; name: string }>;
  years: string[];
  types: string[];
}>> {
  try {
    // In a real implementation, this would be an API call
    // For now, we'll use the API structure but return static data
    // The actual implementation would be:
    // const { data } = await stackbase.get('/search/filters/');
    // return data;
    
    return {
      data: {
        institutions: [
          { id: '1', name: 'University of Lagos' },
          { id: '2', name: 'University of Ibadan' }
        ],
        courses: [
          { id: '1', name: 'Constitutional Law' },
          { id: '2', name: 'Criminal Law' }
        ],
        years: ['2023', '2022', '2021', '2020'],
        types: ['Assignment', 'Exam', 'Test', 'Tutorial']
      },
      message: 'Filter options retrieved successfully',
      error: null,
      status: 200
    };
  } catch (error: any) {
    return {
      message: error?.response?.data?.message || error.response?.data?.detail,
      error: error?.response?.data,
      data: {
        institutions: [],
        courses: [],
        years: [],
        types: []
      },
      status: error?.response?.status
    };
  }
} 