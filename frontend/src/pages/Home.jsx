import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startDebate } from '../api';

const ARCHETYPES = [
    { id: 'classic', name: 'Classic Roast', desc: 'The original unfiltered bloodbath.', emoji: '🔥' },
    { id: 'junior', name: 'Junior vs Senior', desc: 'Overconfident Intern vs. Burnt-out Architect.', emoji: '👶👴' },
    { id: 'fanboy', name: 'Apple vs Linux', desc: 'The Walled Garden vs. The Basement Basement.', emoji: '🍎🐧' },
    { id: 'overclocked', name: 'Cyberpunk 2077', desc: 'Hacked subroutines in a neon wasteland.', emoji: '🌆⌨️' }
];

export default function Home() {
    const [topic, setTopic] = useState('');
    const [archetype, setArchetype] = useState('classic');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleStart = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsLoading(true);
        try {
            const data = await startDebate(topic, archetype);
            navigate('/debate', { state: { debateId: data.debateId, topic, archetype } });
        } catch (error) {
            console.error('Failed to start debate:', error);
            alert('Error starting debate. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Agent <span className="text-amber-500">vs</span> Agent
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                    The ultimate automated roasting arena.
                </p>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <form onSubmit={handleStart} className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                            1. Choose a Topic
                        </label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Is JavaScript still relevant in 2025?"
                            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-slate-900 focus:outline-none text-lg transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                            2. Select Arena Vibe
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ARCHETYPES.map((a) => (
                                <div
                                    key={a.id}
                                    onClick={() => setArchetype(a.id)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start space-x-4 ${archetype === a.id
                                            ? 'border-slate-900 bg-slate-50 shadow-inner'
                                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50'
                                        }`}
                                >
                                    <span className="text-2xl">{a.emoji}</span>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{a.name}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !topic.trim()}
                        className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold text-xl hover:bg-slate-800 transition-all shadow-lg transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Entering Arena...' : 'START BLOOD Arena →'}
                    </button>
                </form>
            </div>
        </div>
    );
}
