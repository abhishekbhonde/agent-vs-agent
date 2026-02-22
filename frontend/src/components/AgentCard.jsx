import { useRef, useEffect } from 'react';

export default function AgentCard({ agent, isActive, isThinking, health = 100, children }) {
    const isLlama = agent === 'llama';
    const prevHealth = useRef(health);
    const colorClass = isLlama ? 'text-amber-600' : 'text-blue-600';
    const accentBg = isLlama ? 'bg-amber-50' : 'bg-blue-50';
    const accentBorder = isLlama ? 'border-amber-200' : 'border-blue-200';
    const barColor = isLlama ? 'bg-amber-500' : 'bg-blue-500';

    // Shake effect when health drops
    const cardRef = useRef(null);
    useEffect(() => {
        if (health < prevHealth.current) {
            cardRef.current?.classList.add('animate-shake');
            setTimeout(() => cardRef.current?.classList.remove('animate-shake'), 500);
        }
        prevHealth.current = health;
    }, [health]);

    return (
        <div
            ref={cardRef}
            className={`relative flex flex-col h-full bg-white rounded-2xl border-2 transition-all duration-500 shadow-sm overflow-hidden ${isActive
                    ? `ring-4 ${isLlama ? 'ring-amber-400/20 border-amber-400 scale-[1.02]' : 'ring-blue-400/20 border-blue-400 scale-[1.02]'} z-10`
                    : 'border-slate-100 opacity-90'
                }`}
        >
            {/* Header with Avatar & Name */}
            <div className={`p-6 flex items-center justify-between border-b ${accentBorder} ${accentBg}`}>
                <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${isLlama ? 'bg-amber-100 border-amber-300' : 'bg-blue-100 border-blue-300'
                        } border-2`}>
                        {isLlama ? '🦙' : '♊'}
                    </div>
                    <div>
                        <h3 className={`text-xl font-black uppercase tracking-tight ${colorClass}`}>
                            {isLlama ? 'LLaMA 3.3' : 'Gemini 2.5'}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${isLlama ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                            }`}>
                            Meta Engine
                        </span>
                    </div>
                </div>

                {/* Progress Spinner */}
                {isThinking && (
                    <div className="flex space-x-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${barColor}`} style={{ animationDelay: '0ms' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${barColor}`} style={{ animationDelay: '150ms' }}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${barColor}`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}
            </div>

            {/* Health Bar Section */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                <div className="flex justify-between items-center mb-1.5 ">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Digital Integrity</span>
                    <span className={`text-xs font-black ${health < 30 ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}>
                        {health}%
                    </span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300/20 shadow-inner">
                    <div
                        className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)] ${health < 30 ? 'bg-red-500' : barColor
                            }`}
                        style={{ width: `${health}%` }}
                    ></div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-grow flex flex-col font-medium leading-relaxed bg-white">
                {children}
                {!children && !isThinking && (
                    <p className="text-slate-300 italic text-sm">Waiting to speak...</p>
                )}
            </div>

            {/* Bottom Visual Flavour */}
            <div className={`h-1.5 w-full ${barColor} opacity-20`}></div>
        </div>
    );
}
