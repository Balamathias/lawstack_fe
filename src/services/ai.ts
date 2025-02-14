'use server'

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