import { Contribution, Question, User } from "@/@types/db";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge'

const openai = new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain the concept of Law of Torts."}
      ],
    });

    return NextResponse.json({ 
      content: completion.choices[0].message.content 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get completion" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, question, type, contribution, user } = body;

    if (type === "question" && prompt && question) {
      const insights = await getQuestionInsights(prompt, question, user.data);
      return NextResponse.json({ insights }, { status: 200 });
    } 
    else if (type === "contribution" && prompt && question && contribution) {
      const insights = await getContributionInsights({ contribution, prompt, question, user });
      return NextResponse.json({ insights }, { status: 200 });
    }
    else {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// Helper functions
async function getQuestionInsights(prompt: string, question: Question, user: User) {
  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {"role": "system", "content": `You a "LawStack Assistant". You are versed in the concepts of law, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles.`},
      {"role": "assistant", "content": `You are a helpful assistant for user: ${user.username}. You are versed in the affairs of law in Nigeria, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles. You may proceed into other jurisdictions, but you are most comfortable with the Nigerian legal system.`},
      {"role": "assistant", "content": `Where a case is cited, or a reference is given, make a detailed research into the case or reference and provide a detailed explanation of the case or reference. You may also provide a summary of the case or reference. Don't forge answers!`},
      {"role": "assistant", "content": `Answers or responses to legal questions must be scoped to the course ${question?.course_name}. This user might probably be a student of ${question?.course_name} from ${question.institution_name}. Responses must be relevant and solidly grounded in the principles of law.`},
      {"role": "user", "content": `${prompt} for the question "${question.text}"`},
    ],
  });

  return completion.choices[0].message.content;
}

async function getContributionInsights({ contribution, prompt, question, user }: { prompt: string, question: Question, contribution: Contribution, user: User }) {

  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {"role": "system", "content": `You a "LawStack Assistant". You are versed in the concepts of law, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles.`},
      {"role": "assistant", "content": `You are a helpful assistant for user: ${user?.username}. You are versed in the affairs of law in Nigeria, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles. You may proceed into other jurisdictions, but you are most comfortable with the Nigerian legal system.`},
      {"role": "assistant", "content": `Where a case is cited, or a reference is given, make a detailed research into the case or reference and provide a detailed explanation of the case or reference. You may also provide a summary of the case or reference. Don't forge answers!`},
      {"role": "assistant", "content": `Answers or responses to legal questions must be scoped to the course ${question?.course_name}. This user might probably be a student of ${question?.course_name} from ${question.institution_name}. Responses must be relevant and solidly grounded in the principles of law.`},
      {"role": "assistant", "content": `A contributor by name ${contribution.contributor.username} proffered the reply ${contribution.text} for the question ${question.text}. Now the user ${user?.username} is prompting the prompt: ${prompt} for that contribution to that question.`},
      {"role": "user", "content": `${prompt} for the contribution "${contribution.text}" for the question ${question?.text}`},
    ],
  });

  return completion.choices[0].message.content;
}