import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { supabaseDsmClient } from '@/utils/supabase-client';
import { makeChainDSM } from '@/utils/makeChainDSM';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { question } = req.body;
    const history = [''];

    //only accept post requests
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    if (!question) {
        return res.status(400).json({ message: 'No question in the request' });
    }

    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

    /* init vectorstore*/
    try {
        const vectorStore = await SupabaseVectorStore.fromExistingIndex(new OpenAIEmbeddings(), {
            client: supabaseDsmClient,
            tableName: 'documents',
            queryName: 'match_documents',
        });

        const chain = makeChainDSM(vectorStore);
        //Ask a question using chat history
        const response = await chain.call({
            question: sanitizedQuestion,
            chat_history: history || [],
        });

        console.log('response', response);
        res.status(200).json(response);
    } catch (error: any) {
        console.log('error', error);
        throw new Error(`Error: ${error}`);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
}
