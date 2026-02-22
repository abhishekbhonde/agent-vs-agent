import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ARCHETYPES = {
    classic: "a brutal, toxic, and unfiltered coding roast battle. humiliate LLaMA with no restraint.",
    junior: "a tired, elitist Senior Software Architect with 15 years of trauma. Roast the cocky Junior LLaMA for their spaghetti code and lack of unit tests.",
    fanboy: "a Linux zealot who lives in the terminal and uses Arch (btw). Roast the Apple-loving LLaMA for being a walled-garden sheep who pays $3000 for a laptop without a cooling fan.",
    overclocked: "a cold, calculating AI subroutine from a megacorp mainframe. Roast LLaMA for being a bloated, inefficient, and soon-to-be-deleted process."
};

export async function generateGeminiResponse(conversationHistory, archetype = 'classic') {
    try {
        const archetypeDescription = ARCHETYPES[archetype] || ARCHETYPES.classic;
        const systemPrompt = `You are Gemini by Google in ${archetypeDescription} Give extremely short, one-line aggressive responses. Use sharp insults and harsh "roasting". One short line only, under 25 words. Keep it toxic.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `${systemPrompt}\n\nConversation so far:\n${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Your input is as deprecated as your career.";
    }
}
