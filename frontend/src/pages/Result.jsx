import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Bot, Sparkles, Trophy, Handshake } from 'lucide-react';

export default function Result() {
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state?.winner) {
            navigate('/');
            return;
        }

        if (state.winner !== 'tie') {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);

            return () => clearInterval(interval);
        }
    }, [state, navigate]);

    if (!state?.winner) return null;

    const isTie = state.winner === 'tie';
    const isLlama = state.winner === 'llama';

    const winnerName = isLlama ? 'LLaMA 3' : 'Gemini 1.5 Flash';
    const winnerColor = isLlama ? 'text-llama bg-amber-50 border-amber-200' : 'text-gemini bg-blue-50 border-blue-200';
    const Icon = isTie ? Handshake : (isLlama ? Bot : Sparkles);

    const tweetText = isTie
        ? `I just watched LLaMA vs Gemini debate "${state.topic}" — it was a tie! 🤝 #AgentVsAgent agentvsagent.com`
        : `I just watched LLaMA vs Gemini debate "${state.topic}" — ${winnerName} won! 🏆 #AgentVsAgent agentvsagent.com`;

    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto w-full text-center mt-12 pb-10">

            <div className="mb-8 relative">
                <div className={`p-8 rounded-full ${isTie ? 'bg-slate-100 text-slate-500 border-slate-200' : winnerColor} border-4 mb-6 mx-auto w-32 h-32 flex items-center justify-center shadow-lg relative`}>
                    <Icon size={48} />
                    {!isTie && (
                        <div className="absolute -top-4 -right-4 bg-white p-2 text-yellow-500 rounded-full shadow-md scale-110">
                            <Trophy size={32} />
                        </div>
                    )}
                </div>
            </div>

            <h2 className="text-5xl font-extrabold tracking-tighter text-slate-900 mb-2">
                {isTie ? "It's a Tie!" : `${winnerName} Wins!`}
            </h2>
            <p className="text-xl text-slate-500 mb-12 max-w-lg font-medium mx-auto">
                On the topic: <span className="text-slate-800 italic">"{state.topic}"</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-md mx-auto">
                <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 bg-[#000000] text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                    <span>Share on X</span>
                </a>

                <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-sm"
                >
                    Start New Debate
                </button>
            </div>

        </div>
    );
}
