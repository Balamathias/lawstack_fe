'use server';

import { StackResponse, PaginatedStackResponse } from '@/@types/generics';
import { stackbase } from '../server.entry';
import { Course, Question, SearchFilters, SearchResults } from '@/@types/db';
import { getInstitutions, Institution } from './institutions';
import { getCourses } from './courses';

/**
 * Perform an advanced search across multiple content types
 */
export async function searchContent(filters: SearchFilters): Promise<StackResponse<SearchResults>> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert any value to string to fix the TypeScript error
        params.append(key, String(value));
      }
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
    const { data: schools } = await getInstitutions();
    const { data: courses } = await getCourses()
    // return data;
    
    return {
      data: {
        institutions: schools.map((school: Institution) => ({ id: school.id, name: school.name })),
        courses: courses.map((course: Course) => ({ id: course.id, name: course.name })),
        years: Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, i) => String(new Date().getFullYear() - i)),
        types: ['essay', 'mcq']
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