import { useState } from 'react';

interface LayoutProps {
    children?: React.ReactNode;
}

const initState = {
    chatOpen: false,
};

export interface state {
    chatpOpen: Boolean;
}

export default function MainLayout({ children }: LayoutProps) {
    const [state, setState] = useState(initState);
    return (
        <main className="flex flex-1" style={{}}>
            {children}
        </main>
    );
}
