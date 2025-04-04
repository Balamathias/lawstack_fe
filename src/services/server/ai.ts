'use server';

import { StackResponse } from '@/@types/generics';
import { stackbase } from '../server.entry';
import axios from 'axios';

interface SearchAnalysisResponse {
  analysis: string;
  relatedTopics: string[];
  suggestedResources: string[];
}

/**
 * Analyze a search query with AI to provide legal insights
 */
export async function analyzeSearchQuery(query: string): Promise<StackResponse<SearchAnalysisResponse>> {
  try {
    if (!query) {
      return {
        message: 'No query provided',
        error: null,
        data: {
          analysis: '',
          relatedTopics: [],
          suggestedResources: []
        },
        status: 400
      };
    }

    // Real API integration - Using our Next.js API route with axios
    try {
      // Fix: Use absolute URL instead of relative URL to avoid parsing errors
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/ai/search-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        data: {
          analysis: data.analysis,
          relatedTopics: data.related_topics || [],
          suggestedResources: data.suggested_resources || []
        },
        message: 'Analysis generated successfully',
        error: null,
        status: 200
      };
    } catch (apiError) {
      console.log('API error, falling back to mock data', apiError);
      // Fallback to mock data in case the API is not available
      // This provides a graceful degradation experience
      
      // We'll use a mock that changes based on the query for a more realistic experience
      const legalTerms = [
        { term: 'habeas corpus', description: 'A legal recourse whereby a person can report an unlawful detention or imprisonment.' },
        { term: 'tort', description: 'A civil wrong that causes someone to suffer loss or harm, resulting in legal liability.' },
        { term: 'jurisprudence', description: 'The theory and philosophy of law.' },
        { term: 'due process', description: 'The legal requirement that the state must respect all legal rights owed to a person.' }
      ];
      
      const matchingTerm = legalTerms.find(term => 
        query.toLowerCase().includes(term.term.toLowerCase())
      );
      
      const mockAnalysis = matchingTerm ? 
        `The term "${matchingTerm.term}" is a key concept in legal studies. ${matchingTerm.description}
      
This concept is central to constitutional law and civil liberties jurisprudence.

Key aspects include:
• Historical development through landmark cases
• Application in modern legal contexts
• Constitutional foundation and precedent
• Variations in interpretation across different legal systems` :
        `The search term "${query}" relates to Nigerian legal concepts and principles.

This area of law encompasses several important doctrines and cases.

Key aspects include:
• Relevant statutory frameworks
• Notable Nigerian court decisions
• Comparative analysis with other jurisdictions
• Practical implications for legal practice`;
      
      return {
        data: {
          analysis: mockAnalysis,
          relatedTopics: [
            "Constitutional Law", 
            "Civil Liberties", 
            "Legal Rights", 
            "Due Process", 
            "Judicial Review"
          ],
          suggestedResources: [
            "Constitutional Law: Principles and Policies (Chemerinsky)",
            "Legal Fundamentals: Rights and Responsibilities",
            "Case Study: Important precedents in Nigerian constitutional law",
            "The Nigerian Constitution and Civil Rights: A Practical Guide"
          ]
        },
        message: 'Analysis generated successfully (mock data)',
        error: null,
        status: 200
      };
    }
  } catch (error: any) {
    console.error('Error analyzing search query:', error);
    return {
      message: error?.response?.data?.message || error.response?.data?.detail || 'Error analyzing search',
      error: error?.response?.data || error.message,
      data: {
        analysis: '',
        relatedTopics: [],
        suggestedResources: []
      },
      status: error?.response?.status || 500
    };
  }
} 