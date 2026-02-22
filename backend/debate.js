import { generateLlamaResponse } from "./agents/llama.js";
import { generateGeminiResponse } from "./agents/gemini.js";
import { generateJudgeResponse } from "./agents/judge.js";

// Store debates in memory
const activeDebates = new Map();

export function createDebate(topic, archetype = 'classic') {
    const debateId = Math.random().toString(36).substring(2, 9);

    const debateState = {
        id: debateId,
        topic,
        archetype,
        round: 0,
        transcript: [],
        health: { llama: 100, gemini: 100 },
        llamaHistory: [
            { role: "user", content: `The debate topic is: ${topic}. Archetype: ${archetype}. You will speak first.` }
        ],
        geminiHistory: [
            { role: "user", content: `The debate topic is: ${topic}. Archetype: ${archetype}. You will speak second.` }
        ]
    };

    activeDebates.set(debateId, debateState);
    return debateState;
}

export async function runLlamaTurn(debateId) {
    const debate = activeDebates.get(debateId);
    if (!debate) throw new Error("Debate not found");

    const llamaResponse = await generateLlamaResponse(debate.llamaHistory, debate.archetype);

    const entry = { agent: "llama", text: llamaResponse };
    debate.transcript.push(entry);
    debate.llamaHistory.push({ role: "assistant", content: llamaResponse });
    debate.geminiHistory.push({ role: "user", name: "LLaMA", content: llamaResponse });

    return entry;
}

export async function runGeminiTurn(debateId) {
    const debate = activeDebates.get(debateId);
    if (!debate) throw new Error("Debate not found");

    const geminiResponse = await generateGeminiResponse(debate.geminiHistory, debate.archetype);

    const entry = { agent: "gemini", text: geminiResponse };
    debate.transcript.push(entry);
    debate.geminiHistory.push({ role: "assistant", content: geminiResponse });
    debate.llamaHistory.push({ role: "user", name: "Gemini", content: geminiResponse });

    return entry;
}

export async function runJudgeTurn(debateId) {
    const debate = activeDebates.get(debateId);
    if (!debate) throw new Error("Debate not found");

    const judgeResult = await generateJudgeResponse(debate.transcript);

    // Apply damage to the "other" agent? No, the judge evaluates the last turn.
    // If Llama just spoke, Gemini takes damage? Or the judge just picks a loser.
    // Actually, let's say the damage is dealt to whoever the judge is roasting.
    // For simplicity, let's assume the judge evaluates both and deals damage to one or both.
    // Let's refine the Judge to tell us who took damage.

    // For now, let's just use the score to drop health proportionally.
    // Let's alternate damage or just randomise for chaos.
    const target = Math.random() > 0.5 ? 'llama' : 'gemini';
    debate.health[target] = Math.max(0, debate.health[target] - (judgeResult.damage * 2));

    const entry = {
        agent: "judge",
        text: judgeResult.comment,
        damage: judgeResult.damage,
        target,
        health: { ...debate.health }
    };

    debate.transcript.push(entry);
    return entry;
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
