import { useLocation, useNavigate } from 'react-router-dom';
import { voteWinner } from '../api';
import AgentCard from '../components/AgentCard';

export default function Vote() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state?.debateId) {
        navigate('/');
        return null;
    }

    const handleVote = async (winner) => {
        try {
            await voteWinner(state.debateId, winner);
            navigate('/result', { state: { ...state, winner } });
        } catch (err) {
            console.error(err);
            alert("Failed to submit vote.");
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
            {/* Step Progress */}
            <div className="mb-8 flex items-center justify-center space-x-2 text-sm font-semibold text-slate-400">
                <span className="text-slate-400">Topic → Round 1 → Round 2 → Round 3 →</span>
                <span className="text-slate-800">Vote</span>
            </div>

            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Who made the stronger argument?</h2>
                <p className="text-slate-500 font-medium">"{state.topic}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 flex-grow">
                <AgentCard agent="llama" isActive={false} isThinking={false}>
                    <div className="font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {state.llamaFinal}
                    </div>
                </AgentCard>

                <AgentCard agent="gemini" isActive={false} isThinking={false}>
                    <div className="font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                        {state.geminiFinal}
                    </div>
                </AgentCard>
            </div>

            <div className="flex flex-col items-center space-y-4 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                    <button
                        onClick={() => handleVote('llama')}
                        className="w-full py-4 px-6 bg-white border-2 border-amber-100 hover:border-llama hover:bg-amber-50 text-slate-800 font-bold rounded-xl shadow-sm transition-all transform hover:-translate-y-1 group text-lg"
                    >
                        Vote <span className="text-llama">LLaMA 3</span>
                    </button>

                    <button
                        onClick={() => handleVote('gemini')}
                        className="w-full py-4 px-6 bg-white border-2 border-blue-100 hover:border-gemini hover:bg-blue-50 text-slate-800 font-bold rounded-xl shadow-sm transition-all transform hover:-translate-y-1 group text-lg"
                    >
                        Vote <span className="text-gemini">Gemini</span>
                    </button>
                </div>

                <button
                    onClick={() => handleVote('tie')}
                    className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors py-2 px-4 underline underline-offset-4"
                >
                    It's a Tie
                </button>
            </div>
        </div>
    );
}
