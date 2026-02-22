import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startDebate } from '../api';
import { Bot, Sparkles } from "lucide-react";

const PRESET_TOPICS = [
    "REST vs GraphQL",
    "Microservices vs Monolith",
    "SQL vs NoSQL",
    "React state management",
    "TypeScript adoption",
    "Docker vs Serverless"
];

export default function Home() {
    const [topic, setTopic] = useState(PRESET_TOPICS[0]);
    const [customTopic, setCustomTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleStart = async () => {
        const finalTopic = customTopic.trim() || topic;
        setIsLoading(true);
        try {
            const { debateId, topic: actualTopic } = await startDebate(finalTopic);
            navigate('/debate', { state: { debateId, topic: actualTopic } });
        } catch (error) {
            console.error(error);
            alert("Failed to start debate. Check backend connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto mt-12 w-full text-center">
            <h2 className="text-5xl font-bold tracking-tighter text-slate-900 mb-4 rounded px-2">
                Watch AIs debate.<br />You decide the winner.
            </h2>
            <p className="text-lg text-slate-500 mb-12 max-w-md">
                Choose a controversial tech topic and watch two cutting-edge models battle it out in a 3-round live debate.
            </p>

            <div className="w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">
                    Select or Type a Topic
                </label>

                <select
                    className="w-full p-3 mb-4 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium text-slate-700"
                    value={topic}
                    onChange={(e) => {
                        setTopic(e.target.value);
                        setCustomTopic('');
                    }}
                >
                    {PRESET_TOPICS.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm tracking-widest uppercase font-medium">
                        <span className="px-2 bg-white text-slate-400 text-[10px]">or input your own</span>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="E.g., CSS vs Tailwind..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full p-3 mb-8 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
                />

                <button
                    onClick={handleStart}
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-sm"
                >
                    {isLoading ? "Preparing Arena..." : "Start Debate →"}
                </button>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm font-medium text-slate-500">
                <div className="flex items-center space-x-2 bg-amber-50 text-llama px-3 py-1.5 rounded-full border border-amber-100">
                    <Bot size={16} /> <span>LLaMA 3 (Groq)</span>
                </div>
                <span className="text-slate-300 font-light">vs</span>
                <div className="flex items-center space-x-2 bg-blue-50 text-gemini px-3 py-1.5 rounded-full border border-blue-100">
                    <Sparkles size={16} /> <span>Gemini (Google)</span>
                </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 font-medium tracking-wide uppercase">Powered by Free APIs</p>
        </div>
    );
}
