import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { runTurn } from '../api';
import AgentCard from '../components/AgentCard';
import RoundBadge from '../components/RoundBadge';
import TypewriterText from '../components/TypewriterText';

export default function Debate() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [exchangeCount, setExchangeCount] = useState(1);
    const [activeSpeaker, setActiveSpeaker] = useState(null); // 'llama' | 'gemini' | 'judge' | null
    const [llamaResponse, setLlamaResponse] = useState('');
    const [geminiResponse, setGeminiResponse] = useState('');
    const [judgeResponse, setJudgeResponse] = useState('');

    const [isLlamaThinking, setIsLlamaThinking] = useState(false);
    const [isGeminiThinking, setIsGeminiThinking] = useState(false);
    const [isJudgeThinking, setIsJudgeThinking] = useState(false);

    const [health, setHealth] = useState({ llama: 100, gemini: 100 });
    const [typingComplete, setTypingComplete] = useState({ llama: false, gemini: false, judge: false });

    const [consoleInput, setConsoleInput] = useState('');
    const [isHypeActive, setIsHypeActive] = useState(null); // 'llama' | 'gemini' | null

    // Safety check on mount
    useEffect(() => {
        if (!state?.debateId) {
            navigate('/');
        }
    }, [state, navigate]);

    // Voice Synthesis Function
    const speak = (text, agent) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Abort previous speech
        const utterance = new SpeechSynthesisUtterance(text);

        if (agent === 'llama') {
            utterance.pitch = 0.8;
            utterance.rate = 1.1;
        } else if (agent === 'gemini') {
            utterance.pitch = 1.2;
            utterance.rate = 1.0;
        } else {
            utterance.pitch = 1.0; // Judge
            utterance.rate = 0.9;
        }

        window.speechSynthesis.speak(utterance);
    };

    const startJudgeTurn = useCallback(async () => {
        setIsJudgeThinking(true);
        setActiveSpeaker(null);
        try {
            const data = await runTurn(state.debateId, 'judge');
            setJudgeResponse(data.text);
            setHealth(data.health);
            setIsJudgeThinking(false);
            setActiveSpeaker('judge');
        } catch (err) {
            console.error("Judge turn error:", err);
            setTimeout(() => {
                setExchangeCount(curr => curr + 1);
                setLlamaResponse('');
                setGeminiResponse('');
                setTypingComplete({ llama: false, gemini: false, judge: false });
            }, 1000);
        }
    }, [state?.debateId]);

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
            setTimeout(startLlamaTurn, 3000);
        }
    }, [state?.debateId]);

    const handleLlamaDone = useCallback(() => {
        setTypingComplete(prev => ({ ...prev, llama: true }));
        setActiveSpeaker(null);
        speak(llamaResponse, 'llama');
        startGeminiTurn();
    }, [llamaResponse, startGeminiTurn]);

    const handleGeminiDone = useCallback(() => {
        setTypingComplete(prev => ({ ...prev, gemini: true }));
        setActiveSpeaker(null);
        speak(geminiResponse, 'gemini');

        // Trigger Judge every 3 exchanges
        if (exchangeCount % 3 === 0) {
            startJudgeTurn();
        } else {
            setTimeout(() => {
                setExchangeCount(curr => curr + 1);
                setLlamaResponse('');
                setGeminiResponse('');
                setTypingComplete({ llama: false, gemini: false, judge: false });
            }, 2000);
        }
    }, [geminiResponse, exchangeCount, startJudgeTurn]);

    const handleJudgeDone = useCallback(() => {
        setTypingComplete(prev => ({ ...prev, judge: true }));
        speak(judgeResponse, 'judge');

        // Automatically resume after judge toast
        setTimeout(() => {
            setExchangeCount(curr => curr + 1);
            setLlamaResponse('');
            setGeminiResponse('');
            setJudgeResponse('');
            setTypingComplete({ llama: false, gemini: false, judge: false });
        }, 4000);
    }, [judgeResponse]);

    // Effect to start automated loop
    useEffect(() => {
        if (state?.debateId && !llamaResponse && !isLlamaThinking && !typingComplete.llama && !judgeResponse) {
            startLlamaTurn();
        }
    }, [exchangeCount, state?.debateId, llamaResponse, isLlamaThinking, typingComplete.llama, judgeResponse, startLlamaTurn]);

    const handleConsoleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = consoleInput.toLowerCase().trim();
            if (cmd === '/nuke') startJudgeTurn();
            if (cmd === '/hype llama') setIsHypeActive('llama');
            if (cmd === '/hype gemini') setIsHypeActive('gemini');
            setConsoleInput('');
            setTimeout(() => setIsHypeActive(null), 5000);
        }
    };

    if (!state?.debateId) return null;

    return (
        <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-4">
            {/* V3 Header */}
            <div className="flex justify-between items-center mb-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">System: Active Bloodlust</span>
                </div>
                <RoundBadge text={`Vicious Exchange #${exchangeCount}`} />
                <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Archetype</span>
                    <span className="text-sm font-black text-slate-900 uppercase">[{state.archetype || 'classic'}]</span>
                </div>
            </div>

            {/* Main Arena */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
                {/* Judge Intervention Overlay */}
                {(judgeResponse || isJudgeThinking) && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm rounded-3xl transition-all duration-500">
                        <div className="max-w-xl bg-white rounded-2xl shadow-2xl border-4 border-red-500 overflow-hidden transform animate-in fade-in zoom-in duration-300">
                            <div className="bg-red-500 p-4 text-white flex justify-between items-center">
                                <span className="font-black uppercase tracking-widest text-sm">⚠️ The Executioner Intervenes ⚠️</span>
                                <div className="w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center font-bold">!</div>
                            </div>
                            <div className="p-8 text-center">
                                {isJudgeThinking ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <span className="animate-spin text-4xl">⚖️</span>
                                        <p className="font-mono text-slate-500 animate-pulse">Deliberating Emotional Damage...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="text-2xl font-black italic text-slate-900 leading-tight">
                                            <TypewriterText text={judgeResponse} speed={10} onComplete={handleJudgeDone} />
                                        </p>
                                        <div className="pt-4 border-t border-slate-100 flex justify-center space-x-8">
                                            <div>
                                                <span className="block text-[10px] uppercase font-bold text-slate-400">Ruling</span>
                                                <span className="text-xl font-black text-red-600 uppercase">Massive Burn</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* LLaMA Column */}
                <AgentCard
                    agent="llama"
                    isActive={activeSpeaker === 'llama'}
                    isThinking={isLlamaThinking}
                    health={health.llama}
                >
                    {llamaResponse && (
                        <div className={isHypeActive === 'llama' ? 'scale-110 transition-transform duration-300' : ''}>
                            <TypewriterText
                                text={llamaResponse}
                                onComplete={handleLlamaDone}
                                speed={15}
                            />
                        </div>
                    )}
                </AgentCard>

                {/* Gemini Column */}
                <AgentCard
                    agent="gemini"
                    isActive={activeSpeaker === 'gemini'}
                    isThinking={isGeminiThinking}
                    health={health.gemini}
                >
                    {geminiResponse && typingComplete.llama && (
                        <div className={isHypeActive === 'gemini' ? 'scale-110 transition-transform duration-300' : ''}>
                            <TypewriterText
                                text={geminiResponse}
                                onComplete={handleGeminiDone}
                                speed={15}
                            />
                        </div>
                    )}
                </AgentCard>
            </div>

            {/* Footer Console */}
            <div className="mt-auto pb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="bg-slate-900 rounded-xl p-4 shadow-2xl border border-slate-800">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-[10px] font-mono text-green-500 uppercase">Intervention_Link v3.0</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-green-500 font-mono mr-2">$</span>
                        <input
                            type="text"
                            placeholder="/nuke, /hype llama, /hype gemini"
                            className="bg-transparent border-none outline-none text-green-400 font-mono text-xs w-full placeholder:text-slate-700"
                            value={consoleInput}
                            onChange={(e) => setConsoleInput(e.target.value)}
                            onKeyDown={handleConsoleCommand}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => {
                            const text = `${llamaResponse}\n\n${geminiResponse}`;
                            navigator.clipboard.writeText(text);
                            alert('Copied best bars to clipboard!');
                        }}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        🐦 Capture Interaction
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                    >
                        🛑 Terminate Arena
                    </button>
                </div>
            </div>
        </div>
    );
}
