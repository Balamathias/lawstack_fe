import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { stackbase } from '@/services/server.entry';
import { getUser } from '@/services/server/auth';
import { AIModels } from '@/lib/utils';

export const runtime = 'edge'

const openai = new OpenAI({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {

  const { data: user } = await getUser()

  if (!user) {
    return NextResponse.json(
      { error: 'Smart analysis is only available for signed in users' },
      { status: 401 }
    );
  }

  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Invalid query. Please provide a valid search term.' },
        { status: 400 }
      );
    }
    
    // Get some relevant context from the API if available
    let contextText = '';
    try {
      // Perform a quick search to get relevant context
      const { data } = await stackbase.get(`/search/?query=${encodeURIComponent(query)}&limit=3`);
      
      if (data?.data?.past_questions?.length > 0) {
        const question = data.data.past_questions[0];
        contextText = `Related past question: "${question.text}"\n`;
      }
      
      if (data?.data?.courses?.length > 0) {
        const course = data.data.courses[0];
        contextText += `Related course: "${course.name}" - ${course.description || 'No description available'}\n`;
      }
    } catch (error) {
      console.log('Error fetching context:', error);
    }
    
    const response = await openai.chat.completions.create({
      model: AIModels.advanced,
      messages: [
        {
          role: 'system',
          content: `You are a Nigerian legal assistant specializing in providing insights on legal search terms.
Analyze the search term from a Nigerian legal perspective.
Focus on its relevance to Nigerian law, including statutory framework, case law, and practical implications.
Your response should be structured in paragraphs with bullet points for key aspects.
Include sections for: main analysis, related legal topics (5 topics), and suggested resources (4 resources).
Be concise but informative.`
        },
        {
          role: 'user',
          content: `Analyze this legal search term: "${query}"
${contextText ? `\nContext:\n${contextText}` : ''}`
        }
      ],
      max_tokens: 750,
      temperature: 0.7,
    });
    
    // Extract and parse the response
    const content = response.choices[0]?.message.content || '';
    
    // Parse the content to extract sections
    const analysisMatch = content.match(/^([\s\S]+?)(?=Related Topics:|$)/i);
    const topicsMatch = content.match(/Related Topics:([\s\S]+?)(?=Suggested Resources:|$)/i);
    const resourcesMatch = content.match(/Suggested Resources:([\s\S]+?)$/i);
    
    // Extract topics from bullet points
    const extractBulletPoints = (text: string | undefined) => {
      if (!text) return [];
      const lines = text.split('\n').map(line => line.trim());
      return lines
        .filter(line => line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))
        .map(line => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(Boolean);
    };
    
    const analysis = analysisMatch ? analysisMatch[1].trim() : content;
    const topicsText = topicsMatch ? topicsMatch[1].trim() : '';
    const resourcesText = resourcesMatch ? resourcesMatch[1].trim() : '';
    
    const relatedTopics = extractBulletPoints(topicsText);
    const suggestedResources = extractBulletPoints(resourcesText);
    
    return NextResponse.json({
      analysis,
      related_topics: relatedTopics,
      suggested_resources: suggestedResources
    });
    
  } catch (error: any) {
    console.error('Error processing AI search analysis:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze search term',
        details: error.message
      },
      { status: 500 }
    );
  }
} 