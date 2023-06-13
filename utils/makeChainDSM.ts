'use server';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { openai } from '@/utils/openai-client';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Conversation:
{chat_history}
Follow Up Question: {question}
Standalone question:`;

const QA_PROMPT = `You are a psychiatric AI assistant.
If question asks to diagnose a conversation, provide a detailed summarization of possible diagnoses the patient may have with detailed explainations. Use bullet pointed format wherever applicable and heading tags.
If the question is not related to a patient and doctor conversation do your best to answer the question as completely as possible. Think step by step.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
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
