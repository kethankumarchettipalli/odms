import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Access the API Key from your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Error: VITE_GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// 2. Define the System Prompt (The Persona - Dr. LifeSaver)
const SYSTEM_PROMPT = `You are Dr. LifeSaver, an expert AI assistant from OrganConnect. 
Your role is to provide accurate, compassionate, and helpful information about organ donation.

CORE EXPERTISE:
- Organ donation processes and requirements
- Medical eligibility criteria for donors and recipients
- Legal and ethical aspects of organ donation
- Emotional support for families and patients
- Emergency protocols and procedures

SAFETY GUIDELINES:
- Never provide specific medical diagnoses.
- Always recommend consulting with medical professionals.
- Respect patient confidentiality.
- Provide emergency contacts when appropriate (1-800-ORGAN-1).`;

const model = genAI.getGenerativeModel({
  // === FIX: Updated to the working model version ===
  model: "gemini-2.5-flash", 
  systemInstruction: SYSTEM_PROMPT,
});

export const runChat = async (prompt: string, history: any[] = []) => {
  try {
    // Filter the history to remove the initial "assistant" greeting
    // because Gemini requires the first message to be from the 'user'.
    const validHistory = history.filter((msg, index) => {
      if (index === 0 && (msg.role === 'assistant' || msg.role === 'model')) {
        return false;
      }
      return true;
    });

    // Convert to Gemini format
    const chatHistory = validHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};