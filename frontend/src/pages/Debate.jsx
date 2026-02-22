import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { runTurn } from '../api';
import AgentCard from '../components/AgentCard';
import RoundBadge from '../components/RoundBadge';
import TypewriterText from '../components/TypewriterText';

export default function Debate() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [exchangeCount, setExchangeCount] = useState(1);
    const [activeSpeaker, setActiveSpeaker] = useState(null); // 'llama' | 'gemini' | null
    const [llamaResponse, setLlamaResponse] = useState('');
    const [geminiResponse, setGeminiResponse] = useState('');
    const [isLlamaThinking, setIsLlamaThinking] = useState(false);
    const [isGeminiThinking, setIsGeminiThinking] = useState(false);
    const [typingComplete, setTypingComplete] = useState({ llama: false, gemini: false });

    // Safety check on mount
    useEffect(() => {
        if (!state?.debateId) {
            navigate('/');
        }
    }, [state, navigate]);

    const startGeminiTurn = useCallback(async () => {
        setIsGeminiThinking(true);
        setActiveSpeaker(null);
        try {
            const data = await runTurn(state.debateId, 'gemini');
            setGeminiResponse(data.text);
            setIsGeminiThinking(false);
            setActiveSpeaker('gemini');
        } catch (err) {
            console.error("Gemini turn error:", err);
            // Attempt to restart or show error
            setTimeout(startGeminiTurn, 3000);
        }
    }, [state?.debateId]);

    const startLlamaTurn = useCallback(async () => {
        setIsLlamaThinking(true);
        setActiveSpeaker(null);
        try {
            const data = await runTurn(state.debateId, 'llama');
            setLlamaResponse(data.text);
            setIsLlamaThinking(false);
            setActiveSpeaker('llama');
        } catch (err) {
            console.error("Llama turn error:", err);
            // Attempt to restart after a delay
            setTimeout(startLlamaTurn, 3000);
        }
    }, [state?.debateId]);

    const handleLlamaDone = useCallback(() => {
        setTypingComplete(prev => ({ ...prev, llama: true }));
        setActiveSpeaker(null);
        startGeminiTurn();
    }, [startGeminiTurn]);

    const handleGeminiDone = useCallback(() => {
        setTypingComplete(prev => ({ ...prev, gemini: true }));
        setActiveSpeaker(null);

        // AUTOMATICALLY start next round after a short pause
        setTimeout(() => {
            setExchangeCount(curr => curr + 1);
            setLlamaResponse('');
            setGeminiResponse('');
            setTypingComplete({ llama: false, gemini: false });
        }, 1500);
    }, []);

    // Effect to start sequential turns
    useEffect(() => {
        if (state?.debateId && !llamaResponse && !isLlamaThinking && !typingComplete.llama) {
            startLlamaTurn();
        }
    }, [exchangeCount, state?.debateId, llamaResponse, isLlamaThinking, typingComplete.llama, startLlamaTurn]);

    if (!state?.debateId) return null;

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
            {/* Endless Arena Progress */}
            <div className="mb-8 flex items-center justify-center space-x-2 text-sm font-semibold text-slate-400">
                <span className="text-slate-800">Topic</span>
                <span>→</span>
                <span className="text-slate-800 font-bold animate-pulse text-red-500">NON-STOP ABUSIVE ROASTING</span>
            </div>

            <div className="text-center mb-8 flex-shrink-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">"{state.topic}"</h2>
                <RoundBadge text={`Vicious Exchange #${exchangeCount}`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 flex-grow">
                {/* LLaMA Column */}
                <AgentCard
                    agent="llama"
                    isActive={activeSpeaker === 'llama'}
                    isThinking={isLlamaThinking}
                >
                    {llamaResponse && (
                        <TypewriterText
                            text={llamaResponse}
                            onComplete={handleLlamaDone}
                            speed={15}
                        />
                    )}
                </AgentCard>

                {/* Gemini Column */}
                <AgentCard
                    agent="gemini"
                    isActive={activeSpeaker === 'gemini'}
                    isThinking={isGeminiThinking}
                >
                    {geminiResponse && typingComplete.llama && (
                        <TypewriterText
                            text={geminiResponse}
                            onComplete={handleGeminiDone}
                            speed={15}
                        />
                    )}
                </AgentCard>
            </div>

            <div className="flex flex-col items-center justify-center mt-4 pb-10 min-h-[80px]">
                <p className="text-slate-500 font-bold text-lg animate-bounce uppercase tracking-widest text-red-600">
                    {activeSpeaker === 'llama' ? "LLaMA is DESTROYING Gemini..." :
                        (activeSpeaker === 'gemini' ? "Gemini is ANNIHILATING LLaMA..." :
                            (isLlamaThinking || isGeminiThinking ? "Calculating fresh insults..." : "Automated Carnage Processing..."))}
                </p>
            </div>
        </div>
    );
}
