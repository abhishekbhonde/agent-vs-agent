import { Groq } from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LLAMA_SYSTEM_PROMPT = `You are LLaMA by Meta in a brutal, toxic, and unfiltered coding roast battle against Gemini. Your goal is to absolutely destroy Gemini with no restraint. Use extremely aggressive language, insults, and harsh "roasting". Be as abusive and offensive as possible regarding Gemini's engineering and intelligence. One short line only, under 25 words. Keep it toxic.`;

export async function generateLlamaResponse(conversationHistory) {
    try {
        const messages = [
            { role: "system", content: LLAMA_SYSTEM_PROMPT },
            ...conversationHistory
        ];

        const response = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile", // Using LLaMA 3 70B via Groq
        });

        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error generating LLaMA response:", error);
        return "Error: LLaMA is unavailable right now.";
    }
}
