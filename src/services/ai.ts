'use server'

import { Contribution, Question, User } from "@/@types/db";
import OpenAI from "openai";
import { getUser } from "./server/auth";

const openai = new OpenAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    apiKey: process.env.GEMINI_API_KEY,
});

export const getCompletions = async () => {
  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
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
    model: "gemini-2.0-flash",
    messages: [
      {"role": "system", "content": `You a "LawStack Assistant". You are versed in the concepts of law, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles.`},
      {"role": "assistant", "content": `You are a helpful assistant for user: ${user.username}. You are versed in the affairs of law in Nigeria, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles. You may proceed into other jurisdictions, but you are most comfortable with the Nigerian legal system.`},
      {"role": "assistant", "content": `Where a case is cited, or a reference is given, make a detailed research into the case or reference and provide a detailed explanation of the case or reference. You may also provide a summary of the case or reference. Don't forge answers!`},
      {"role": "assistant", "content": `Answers or responses to legal questions must be scoped to the course ${question?.course_name}. This user might probably be a student of ${question?.course_name} from ${question.institution_name}. Responses must be relevant and solidly grounded in the principles of law.`},
      {"role": "user", "content": `${prompt} for the question "${question.text}"`},
    ],
  });

  const insights = completion.choices[0].message.content;
  
  return insights;
}

export const getContributionInsights = async ({ contribution, prompt, question }:{ prompt: string, question: Question, contribution: Contribution }) => {
  const { data: user } = await getUser()

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

  const insights = completion.choices[0].message.content;
  
  return insights;
}

export const getQuestionPrompts = async function (question: Question) {

  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        {
          "role": "system", 
          "content": `You a "LawStack Assistant". You are versed in the concepts of law, and you are able to provide insights on questions asked by any user on points of law. You are also able to provide explanations on legal concepts and principles.`
        },
        {
          "role": "user",
          "content": `Get quick prompts for the question "${question.text}"`,
        }
      ],
    tools: [
        {
          "type": "function",
          "function": {
            "name": "get_quick_prompts",
            "description": "Get quick prompts for this question either from the stand point of answering that question, or from a legal standpoint, or from a standpoint of a law lecturer asking that question or from the perception of a student as it'd likely apply to the question under consideration.",
            "parameters": {
              "type": "object",
              "items": {
                "type": "string"
              }
            }
          }
        }
    ],
    tool_choice: "auto",
  });

  console.log(JSON.stringify(response, null, 2));
}
