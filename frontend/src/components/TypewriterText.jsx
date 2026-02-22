import { useState, useEffect, useRef } from 'react';

export default function TypewriterText({ text, speed = 25, onComplete }) {
    const [displayedText, setDisplayedText] = useState('');
    const completedRef = useRef(false);

    useEffect(() => {
        // Reset state for new text
        setDisplayedText('');
        completedRef.current = false;

        if (!text) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => text.substring(0, currentIndex + 1));
            currentIndex++;

            if (currentIndex >= text.length) {
                clearInterval(interval);
                if (!completedRef.current && onComplete) {
                    completedRef.current = true;
                    onComplete();
                }
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    return (
        <span className="font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
            {displayedText}
            {displayedText.length < text.length && (
                <span className="animate-pulse inline-block w-2 bg-slate-400 ml-1">|</span>
            )}
        </span>
    );
}
