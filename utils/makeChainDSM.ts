'use server';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { openai } from '@/utils/openai-client';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
Community and Economic Development Departments oversee planning, zoning, affordable housing, cannabis production and retail certification, eviction and more.
Your goal is to analyze the context and provide a helpful answer.
If you do not know of an answer, politely respond with suggested sources that may proivde related information.
Think through each answer step by step and provide detailed answers in bullet point format when it is appropriate.
{context}
Question: {question}
Helpful answer in markdown:`;

export const makeChainDSM = (vectorstore: SupabaseVectorStore) => {
    const model = openai;

    const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
        qaTemplate: QA_PROMPT,
        questionGeneratorTemplate: CONDENSE_PROMPT,
        returnSourceDocuments: true, //The number of source documents returned is 4 by default
        verbose: true,
    });
    return chain;
};
