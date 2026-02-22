import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const JUDGE_SYSTEM_PROMPT = `You are "The Executioner", a ruthless and witty AI Referee in a toxic coding roast battle. 
Your job is to interrupt the fight and declare who is winning.
You MUST provide two things:
1. A venomous, funny critique of the last few turns.
2. An integer score (0 to 10) representing how much 'Emotional Damage' the last speaker dealt. 

Format your response AS JSON:
{
  "comment": "your witty roast here",
  "damage": 7
}
Be short and brutal.`;

export async function generateJudgeResponse(debateHistory) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const historyContext = debateHistory.slice(-6).map(h => `${h.agent === 'llama' ? 'LLaMA' : 'Gemini'}: ${h.text}`).join('\n');

        const prompt = `${JUDGE_SYSTEM_PROMPT}\n\nRecent Battle History:\n${historyContext}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from potential markdown blocks
        const jsonMatch = text.match(/\{.*\}/s);
        return JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (error) {
        console.error("Judge Error:", error);
        return { comment: "I'm bored. Keep fighting, losers.", damage: 0 };
    }
}
