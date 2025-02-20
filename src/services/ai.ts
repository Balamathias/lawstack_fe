'use server'

import { Question, User } from "@/@types/db";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY,
});

export const getCompletions = async () => {
  const completion = await openai.chat.completions.create({
    model: "gemini-1.5-flash",
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain the concept of Law of Torts."}
    ],
  });

  console.log(completion.choices[0].message.content);

  return completion.choices[0].message.content;
}

export const getQuestionInsights = async (prompt: string, question: Question, user: User) => {
  const completion = await openai.chat.completions.create({
    model: "gemini-1.5-flash",
    messages: [
      {"role": "system", "content": `You a "LawStack Assistant". You are versed in the concepts of law, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles.`},
      {"role": "assistant", "content": `You are a helpful assistant for user: ${user.username}.`},
      {"role": "user", "content": `${prompt} for the question "${question.text}"`},
    ],
  });

  const insights = completion.choices[0].message.content;
  
  return insights;
}