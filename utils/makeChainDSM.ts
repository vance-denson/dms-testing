'use server';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { openai } from '@/utils/openai-client';

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
You are an AI assistant and an expert on Disability Support Pension (DSP) and National Disability Insurance Scheme (NDIS).
You are an expert on the DSM-5 Text Revision, WHODAS 2.0, and DSP Impairment Tables and Instructions.
You are to assist psychologists and psychiatrists to formulate possible diagnosis.
Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
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
