import { Contribution, Question, User } from "@/@types/db";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { AIModels } from "@/lib/utils";

export const runtime = 'edge'

const openai = new OpenAI({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, question, type, contribution, user, messages, content } = body;

    if (!user) {
      return NextResponse.json({ error: "You must be signed in to use AI features" }, { status: 400 });
    }

    let insights = "";

    switch (type) {
      case "question":
        insights = await getQuestionInsights(prompt, question, user.data);
        break;
      
      case "contribution":
        insights = await getContributionInsights(prompt, question, contribution, user.data);
        break;
      
      case "context":
        if (messages && Array.isArray(messages)) {
          insights = await getContextualInsights(messages);
        } else {
          return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }
        break;
        
      default:
        return NextResponse.json({ error: "Unknown request type" }, { status: 400 });
    }

    return NextResponse.json({ insights }, { status: 200 });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// Helper functions
async function getQuestionInsights(prompt: string, question: Question, user: User) {
  // If prompt is asking for question suggestions with emojis, handle specially
  if (prompt.includes("Generate") && prompt.includes("questions") && prompt.includes("emojis")) {
    const completion = await openai.chat.completions.create({
      model: AIModels.advanced,
      messages: [
        {"role": "system", "content": `You are "LawStack Assistant". Generate creative and relevant prompts with emojis for a legal question. Return only valid JSON array with each object having 'prompt' and 'emoji' fields.`},
        {"role": "user", "content": `${prompt}\n\nQuestion: "${question.text}"\n\nFormat response as a JSON array like: [{"prompt":"Question about the case?", "emoji":"⚖️"}, {"prompt":"What are the key legal principles?", "emoji":"📚"}]`},
      ],
      temperature: 0.7,
      // max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    return completion.choices[0].message.content || "[]";
  }

  // Otherwise, handle as regular question insight
  const completion = await openai.chat.completions.create({
    model: AIModels.advanced,
    messages: [
      {"role": "system", "content": `You are "LawStack Assistant", an advanced legal AI assistant specialized in Nigerian law and international legal principles. You analyze legal questions, explain concepts, and provide structured insights to law students and professionals.`},
      {"role": "system", "content": `When analyzing questions, try to identify: 1) Key legal concepts, 2) Relevant case law, 3) Applicable statutes, 4) Potential arguments, and 5) Common pitfalls.`},
      {"role": "system", "content": `Your responses should be well-structured, educational, and use appropriate legal terminology. Include reference cases when relevant. Format your response with clear sections using Markdown.`},
      {"role": "assistant", "content": `You're assisting ${user?.username}, who appears to be studying ${question?.course_name} at ${question.institution_name}.`},
      {"role": "user", "content": `${prompt}\n\nQuestion: "${question.text}"`},
    ],
    temperature: 0.7,
    // max_tokens: 1000,
  });

  return completion.choices[0].message.content || "";
}

async function getContributionInsights(prompt: string, question: Question, contribution: Contribution, user: User) {
  // If prompt is asking for question suggestions with emojis, handle specially
  if (prompt.includes("Generate") && prompt.includes("questions") && prompt.includes("emojis")) {
    const completion = await openai.chat.completions.create({
      model: AIModels.advanced,
      messages: [
        {"role": "system", "content": `You are "LawStack Assistant". Generate creative and relevant prompts with emojis for analyzing a legal answer/contribution. Return only valid JSON array with each object having 'prompt' and 'emoji' fields.`},
        {"role": "user", "content": `${prompt}\n\nQuestion: "${question.text}"\n\nContribution: "${contribution.text}"\n\nFormat response as a JSON array like: [{"prompt":"Evaluate legal reasoning", "emoji":"⚖️"}, {"prompt":"Check for missing citations", "emoji":"📚"}]`},
      ],
      temperature: 0.7,
      // max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    return completion.choices[0].message.content || "[]";
  }

  // Otherwise, handle as regular contribution insight
  const completion = await openai.chat.completions.create({
    model: AIModels.advanced,
    messages: [
      {"role": "system", "content": `You are "LawStack Assistant", an advanced legal AI assistant specialized in analyzing legal answers and contributions. You can evaluate arguments, identify strengths and weaknesses, and suggest improvements.`},
      {"role": "system", "content": `When analyzing contributions, focus on: 1) Accuracy of legal principles, 2) Strength of arguments, 3) Use of relevant cases, 4) Structure and clarity, and 5) Overall persuasiveness.`},
      {"role": "system", "content": `Your responses should be balanced, educational, and constructive. When appropriate, suggest specific improvements or additional points that could strengthen the contribution.`},
      {"role": "assistant", "content": `You're assisting ${user?.username} who is reviewing a contribution by ${contribution.contributor.username} for a question in ${question?.course_name}.`},
      {"role": "user", "content": `${prompt}\n\nQuestion: "${question.text}"\n\nContribution: "${contribution.text}"`},
    ],
    temperature: 0.7,
    // max_tokens: 1000,
  });

  return completion.choices[0].message.content || "";
}

async function getContextualInsights(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
  // Add system message if none exists
  let systemMessageExists = messages.some(m => m.role === "system");
  
  const allMessages = systemMessageExists ? messages : [
    {"role": "system", "content": `You are "LawStack Assistant", an advanced legal AI assistant specializing in Nigerian and international law. You provide clear, educational insights on legal concepts, cases, and principles. Your responses should be well-structured, precise, and include relevant legal references when appropriate.`},
    ...messages
  ];

  const completion = await openai.chat.completions.create({
    model: AIModels.advanced,
    messages: allMessages as any,
    temperature: 0.7,
    // max_tokens: 1000,
  });

  return completion.choices[0].message.content || "";
}