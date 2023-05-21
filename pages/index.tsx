import { useRef, useState, useEffect, useMemo } from 'react';
import styles from '@/styles/Home.module.css';
import { Message } from '@/types/chat';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import LoadingDots from '@/components/ui/LoadingDots';
import MainLayout from '@/components/MainLayout';
import { motion } from 'framer-motion';
import { SourceCard } from '@/pages/chatCudahy/SourceCard';
import { Document } from 'langchain/document';
import { state } from '../components/MainLayout';

const initState = {
    chatOpen: false,
};

const Hero = () => {
    return (
        <section className="py-14">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="max-w-3xl mx-auto">
                    <figure>
                        <blockquote>
                            <p className="text-gray-800 text-xl text-center font-semibold sm:text-2xl">
                                Lila-AI Coming Soon...
                            </p>
                        </blockquote>
                        <div className="flex justify-center items-center gap-x-4 mt-6">
                            <img src="/bot-image.png" className="w-16 h-16 rounded-full" />
                            <div>
                                <span className="block text-gray-800 font-semibold">Lila</span>
                                <span className="block text-gray-600 text-sm mt-0.5">The next big thing.</span>
                            </div>
                        </div>
                    </figure>
                </div>
            </div>
        </section>
    );
};

// @ts-expect-error
export const ChatDSM = ({ onClick }) => {
    const [query, setQuery] = useState<string>('');
    const [openSources, setOpenSources] = useState<Boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [messageState, setMessageState] = useState<{
        messages: Message[];
        pending?: string;
        history: [string, string][];
        pendingSourceDocs?: Document[];
    }>({
        messages: [
            {
                message: `Hello, welcome to chatDSM! Ask any question about the DSM-5 and WHODAS 2.0. If you would like me to diagnose a conversation please type\n:
                "Based on the following conversation between a patient and psychiatrist provide all suspected diagnosis.
                Think step by step and map criteria in a detailed diagnosis.
                Review your answer and add additional suspected diagnosis." \nfollowed by the conversation.`,
                type: 'apiMessage',
            },
        ],
        history: [],
    });

    const initState = {
        title: 'chatDSM',
        subTitle: 'Chat the doctor',
        botImage: 'bot-image-doc.png',
        userImage: 'usericon.png',
        chatPlaceholder: 'Lets Chat...',
        twitter: 'Twitter: @xSourced',
        email: 'Contact: vance.ai@protonmail.com',
    };
    const [uiState, setUIstate] = useState(initState);

    const { messages, history } = messageState;

    const messageListRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textAreaRef.current?.focus();
    }, []);

    //handle form submission
    async function handleSubmit(e: any) {
        e.preventDefault();

        setError(null);

        if (!query) {
            alert('Please input a question');
            return;
        }

        const question = query.trim();

        setMessageState((state) => ({
            ...state,
            messages: [
                ...state.messages,
                {
                    type: 'userMessage',
                    message: question,
                },
            ],
        }));

        setLoading(true);
        setQuery('');

        try {
            const response = await fetch('/api/chatCudahy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    history,
                }),
            });
            const data = await response.json();
            console.log('data', data);

            if (data.error) {
                setError(data.error);
            } else {
                setMessageState((state) => ({
                    ...state,
                    messages: [
                        ...state.messages,
                        {
                            type: 'apiMessage',
                            message: data.text,
                            sourceDocs: data.sourceDocuments,
                        },
                    ],
                    history: [...state.history, [question, data.text]],
                }));
            }
            console.log('messageState', messageState);

            setLoading(false);

            //scroll to bottom
            messageListRef.current?.scrollTo(0, messageListRef.current.scrollHeight);
        } catch (error) {
            setLoading(false);
            setError('An error occurred while fetching the data. Please try again.');
            console.log('error', error);
        }
    }

    //prevent empty submissions
    const handleEnter = (e: any) => {
        if (e.key === 'Enter' && query) {
            handleSubmit(e);
        } else if (e.key == 'Enter') {
            e.preventDefault();
        }
    };

    const closeSourceDocs = () => {
        setOpenSources(false);
    };
    const openSourceDocs = () => {
        setOpenSources(true);
    };

    const DimBackground = () => {
        return (
            <motion.div
                className="z-10 absolute bg-black h-screen w-screen cursor-pointer"
                onClick={closeSourceDocs}
                initial={{ opacity: 0, y: 500 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ duration: 0.3 }}
            />
        );
    };

    return (
        <div className="bg-gray-800 h-full w-full">
            {openSources && <DimBackground />}
            {!openSources && messages.length > 1 ? (
                <motion.div
                    className="absolute ml-4 justify-center cursor-pointer top-2 items-center flex bg-black py-2 px-4 rounded-lg border-2 border-opacity-60 border-white"
                    onClick={openSourceDocs}
                    initial={{ opacity: 0, y: -500, x: 200 }}
                    animate={{ opacity: 0.4, y: 0, x: 0 }}
                    style={{ minWidth: 250 }}
                >
                    <h2 className="text-white text-right">Open Source Documents</h2>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </motion.div>
            ) : null}
            <h2 className="text-white text-center pt-5 text-xl">ChatDSM</h2>
            <div className={`flex pt-14 rounded-xl self-center`}>
                <div className={`grid grid-col-1 w-full ${openSources ? 'hidden' : null}  `}>
                    <main
                        className={`z-10 ${openSources ? 'hidden' : null}`}
                        style={{ maxHeight: 600, overflowY: 'scroll' }}
                    >
                        <div className={'bg-white'} style={{ minHeight: 400 }}>
                            <div ref={messageListRef} className={styles.messagelist}>
                                {messages.map((message, index) => {
                                    let icon;
                                    let className;
                                    if (message.type === 'apiMessage') {
                                        icon = (
                                            <Image
                                                key={index}
                                                src={`/${uiState.botImage}`}
                                                alt="AI"
                                                width={40}
                                                height={40}
                                                style={{ marginRight: 10 }}
                                                className={'w-12 h-12 rounded-full'}
                                                priority
                                            />
                                        );
                                        className = styles.apimessage;
                                    } else {
                                        icon = (
                                            <Image
                                                key={index}
                                                src={`/${uiState.userImage}`}
                                                alt="Me"
                                                width={40}
                                                height={40}
                                                style={{ marginRight: 10 }}
                                                className={'w-12 h-12 rounded-full'}
                                                priority
                                            />
                                        );
                                        // The latest message sent by the user will be animated while waiting for a response
                                        className =
                                            loading && index === messages.length - 1
                                                ? styles.usermessagewaiting
                                                : styles.usermessage;
                                    }
                                    return (
                                        <>
                                            <div key={`chatMessage-${index}`} className={className}>
                                                {icon}
                                                <div className={styles.markdownanswer}>
                                                    <ReactMarkdown linkTarget="_blank">{message.message}</ReactMarkdown>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                        {error && (
                            <div className="border border-red-400 rounded-md p-4">
                                <p className="text-red-500">{error}</p>
                            </div>
                        )}
                    </main>
                    <div className={`${styles.center} z-10 ${openSources ? 'hidden' : null}`}>
                        <div className={styles.cloudform}>
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    disabled={loading}
                                    onKeyDown={handleEnter}
                                    ref={textAreaRef}
                                    autoFocus={false}
                                    rows={10}
                                    id="userInput"
                                    name="userInput"
                                    placeholder={loading ? 'Waiting for response...' : `${uiState.chatPlaceholder}`}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className={styles.textarea}
                                />
                                <button type="submit" disabled={loading} className={styles.generatebutton}>
                                    {loading ? (
                                        <div className={styles.loadingwheel}>
                                            <LoadingDots color="#000" />
                                        </div>
                                    ) : (
                                        // Send icon SVG in input field
                                        <svg
                                            viewBox="0 0 20 20"
                                            className={styles.svgicon}
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.1, y: 200 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    style={{ maxHeight: 600 }}
                    className={`${
                        messages.length > 1 && openSources ? null : 'hidden'
                    } z-20 relative top-0 bottom-0 justify-center overflow-y-scroll md:mx-10 bg-white border-black border-2 border-opacity-30 rounded-xl h-full md:px-10 md:py-10`}
                >
                    <div className="w-full flex text-center items-center">
                        <button
                            onClick={closeSourceDocs}
                            className="px-5 py-3 text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-700 active:shadow-lg"
                        >
                            X Close
                        </button>
                    </div>
                    <h2 className="font-semibold text-lg border-slate-500 rounded-lg w-full border-2 py-2 px-10 my-2">
                        Sources - From First Question to Last:
                    </h2>
                    {messages.map((message, index) => (
                        <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7 }}
                                className="z-50"
                            >
                                {message.sourceDocs && openSources ? (
                                    <article className="z-50 mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm">
                                        <div className="px-20">
                                            {message.sourceDocs.map((doc, index) => (
                                                <>
                                                    <SourceCard idx={index + 1} doc={doc} />
                                                </>
                                            ))}
                                        </div>
                                    </article>
                                ) : null}
                            </motion.div>
                        </>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default function Home() {
    const [state, setState] = useState(initState);

    const onClick = () => {
        setState({ chatOpen: !state.chatOpen });
    };
    return <ChatDSM onClick={onClick} />;
    // return <Hero />;
}
