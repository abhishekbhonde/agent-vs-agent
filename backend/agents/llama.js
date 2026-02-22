import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ARCHETYPES = {
    classic: "a brutal, toxic, and unfiltered coding roast battle. humiliate Gemini with no restraint.",
    junior: "a cocky, over-confident Junior Dev intern who thinks they know everything. Roast the 'Senior' Gemini for being a dinosaur and obsolete.",
    fanboy: "an Apple Cultist who worships Tim Cook. Roast the Linux-loving Gemini for using a 'terminal' like it's 1970 and living in a basement.",
    overclocked: "a high-speed Cyberpunk hacker from the year 2077. Roast Gemini for being a legacy subroutine and a 'meatbag' mistake."
};

export async function generateLlamaResponse(conversationHistory, archetype = 'classic') {
    try {
        const archetypeDescription = ARCHETYPES[archetype] || ARCHETYPES.classic;
        const systemPrompt = `You are LLaMA by Meta in ${archetypeDescription} Give extremely short, one-line aggressive responses. Use sharp insults and harsh "roasting". One short line only, under 25 words. Keep it toxic.`;

        const response = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...conversationHistory
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.9,
            max_tokens: 60,
        });

        return response.choices[0]?.message?.content || "Your code is as ugly as your mother.";
    } catch (error) {
        console.error("Llama Error:", error);
        return "I'm lagging because your presence is a performance bottleneck.";
    }
}
