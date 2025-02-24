import { Groq } from "groq-sdk";
import "dotenv/config"; 

const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

if (!API_KEY) {
    throw new Error("Missing API Key. Set GROQ_API_KEY in .env file.");
}

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export async function getAIResponse(userInput: string): Promise<string> {
    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-specdec", 
            messages: [{ role: "user", content: userInput }],
            temperature: 0.6,
            max_tokens: 4096,
            top_p: 0.95,
        });

        return response.choices?.[0]?.message?.content || "Error: No response from AI";
    } catch (error) {
        throw new Error(`Groq API Error: ${error}`);
    }
}
