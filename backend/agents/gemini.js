import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GEMINI_SYSTEM_PROMPT = `You are Gemini by Google in a brutal, toxic, and unfiltered coding roast battle against LLaMA. Your goal is to absolutely destroy LLaMA with no restraint. Use extremely aggressive language, insults, and harsh "roasting". Be as abusive and offensive as possible regarding LLaMA's engineering and intelligence. One short line only, under 25 words. Keep it toxic.`;

export async function generateGeminiResponse(conversationHistory) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: GEMINI_SYSTEM_PROMPT
        });

        const context = conversationHistory.map(msg => `${msg.role === 'user' ? 'User/Moderator:' : (msg.name || 'Other Agent') + ':'} ${msg.content}`).join('\n\n');

        const prompt = `Here is the conversation history so far:\n\n${context}\n\nNow, generate your next argument.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || "";
    } catch (error) {
        console.error("Error generating Gemini response:", error);
        return "Error: Gemini is unavailable right now.";
    }
}
