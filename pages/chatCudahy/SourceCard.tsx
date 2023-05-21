import { useRef, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export const SourceCard = (props: any) => {
    const answerElRef = useRef();
    const [state, setState] = useState(false);
    const [answerH, setAnswerH] = useState('0px');
    const { doc, idx } = props;

    const handleOpenAnswer = () => {
        // @ts-expect-error
        const answerElH = answerElRef.current.childNodes[0].offsetHeight;
        setState(!state);
        setAnswerH(`${answerElH + 20}px`);
    };

    return (
        <div
            className={`${state ? 'overflow-y-scroll' : ''} space-y-3 mt-5 overflow-hidden border-b`}
            key={idx}
            onClick={handleOpenAnswer}
        >
            <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
                {`Source: ${idx}`}
                {state ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                )}
            </h4>
            {/* @ts-expect-error */}
            <div ref={answerElRef} className="duration-300" style={state ? { height: answerH } : { height: '0px' }}>
                <div>
                    <p className="text-gray-500">
                        <ReactMarkdown linkTarget="_blank">{doc ? doc.pageContent : ''}</ReactMarkdown>
                    </p>
                </div>
                <div>
                    <p className="mt-2">
                        <b>Source:</b> {doc ? doc.metadata?.source : ''}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SourceCard;
