import { Bot, Sparkles } from "lucide-react";

export default function AgentCard({ agent, isActive, isThinking, children }) {
    const isLlama = agent === "llama";
    const name = isLlama ? "LLaMA 3 (Groq)" : "Gemini (Google)";

    const borderColor = isLlama ? "border-l-llama" : "border-l-gemini";
    // The active highlight is a subtle border-t
    const activeHighlight = isActive ? (isLlama ? "border-t-llama border-t-2" : "border-t-gemini border-t-2") : "border-t-transparent border-t-2";

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 border-l-4 ${borderColor} ${activeHighlight} flex flex-col overflow-hidden transition-all duration-300 w-full`}>
            <div className="flex items-center space-x-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
                <div className={`p-2 rounded-lg ${isLlama ? 'bg-amber-100 text-llama' : 'bg-blue-100 text-gemini'}`}>
                    {isLlama ? <Bot size={20} /> : <Sparkles size={20} />}
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{name}</h3>
                    <p className="text-xs text-slate-500">{isLlama ? "via Meta / Groq API" : "via Google AI API"}</p>
                </div>
            </div>
            <div className="p-6 min-h-[180px] flex-1">
                {isThinking ? (
                    <div className="flex items-center space-x-1 text-slate-400 h-full">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
