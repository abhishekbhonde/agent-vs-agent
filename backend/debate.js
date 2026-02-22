import { generateLlamaResponse } from "./agents/llama.js";
import { generateGeminiResponse } from "./agents/gemini.js";

// Store debates in memory
const activeDebates = new Map();

export function createDebate(topic) {
    const debateId = Math.random().toString(36).substring(2, 9);

    const debateState = {
        id: debateId,
        topic,
        round: 0,
        transcript: [],
        llamaHistory: [
            { role: "user", content: `The debate topic is: ${topic}. You will speak first.` }
        ],
        geminiHistory: [
            { role: "user", content: `The debate topic is: ${topic}. You will speak second.` }
        ]
    };

    activeDebates.set(debateId, debateState);
    return debateState;
}

export async function runLlamaTurn(debateId) {
    const debate = activeDebates.get(debateId);
    if (!debate) throw new Error("Debate not found");

    const llamaResponse = await generateLlamaResponse(debate.llamaHistory);

    debate.transcript.push({ agent: "llama", text: llamaResponse });
    debate.llamaHistory.push({ role: "assistant", content: llamaResponse });
    debate.geminiHistory.push({ role: "user", name: "LLaMA", content: llamaResponse });

    return { agent: "llama", text: llamaResponse };
}

export async function runGeminiTurn(debateId) {
    const debate = activeDebates.get(debateId);
    if (!debate) throw new Error("Debate not found");

    const geminiResponse = await generateGeminiResponse(debate.geminiHistory);

    debate.transcript.push({ agent: "gemini", text: geminiResponse });
    debate.geminiHistory.push({ role: "assistant", content: geminiResponse });
    debate.llamaHistory.push({ role: "user", name: "Gemini", content: geminiResponse });

    return { agent: "gemini", text: geminiResponse };
}

export function voteWinner(debateId, winner) {
    const debate = activeDebates.get(debateId);
    if (!debate) throw new Error("Debate not found");
    debate.winner = winner;
    return winner;
}

export function getDebate(debateId) {
    return activeDebates.get(debateId);
}
