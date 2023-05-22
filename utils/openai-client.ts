import { OpenAI } from 'langchain/llms/openai';
import { BaseCallbackHandler } from 'langchain/callbacks';
import { AgentAction, AgentFinish, ChainValues } from 'langchain/schema';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI Credentials');
}

export const openai = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    // modelName: 'gpt-3.5-turbo',
    temperature: 0.1,
    verbose: true,
});
