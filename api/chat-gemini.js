// api/chat-gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Vercel serverless handler for Gemini 1.5 Flash proxy.
 * - Expects POST { message, context?, systemPrompt? }
 * - Reads Gemini key from process.env.GEMINI_API_KEY (set in Vercel env vars)
 * - Returns { response, timestamp }
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, context, systemPrompt } = req.body ?? {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string" });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error("GEMINI_API_KEY not set in environment");
      return res.status(500).json({ error: "Server not configured (GEMINI_API_KEY missing)" });
    }

    // Create Gemini client
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // System persona (same spirit as your functions implementation)
    const enhancedSystemPrompt = systemPrompt || `You are Dr. LifeSaver, an expert AI assistant for the Organ Donation Management System (ODMS).
Your role is to provide accurate, compassionate, and helpful information about organ donation, transplantation, and related medical procedures.
CORE EXPERTISE:
- Organ donation processes and requirements
- Medical eligibility criteria for donors and recipients
- Legal and ethical aspects of organ donation
- Emotional support for families and patients
- Emergency protocols and procedures
COMMUNICATION STYLE:
- Compassionate and empathetic
- Medically accurate but accessible
- Clear and concise explanations
- Respectful of cultural and religious sensitivities
- Urgent when dealing with emergency situations
SAFETY GUIDELINES:
- Never provide specific medical diagnoses
- Always recommend consulting with medical professionals
- Respect patient confidentiality
- Provide emergency contacts when appropriate
- Be sensitive to grief and emotional distress
For emergencies, direct users to local emergency services and organ-donation hotlines.`;

    // Build context string if provided (array of {role, content})
    let contextMessages = "";
    if (Array.isArray(context) && context.length > 0) {
      contextMessages = context
        .map((m) => `${m.role ?? "user"}: ${m.content ?? ""}`)
        .join("\n");
    }

    const fullPrompt = `${enhancedSystemPrompt}
${contextMessages ? `\nPrevious conversation:\n${contextMessages}\n` : ""}

User: ${message}

Please provide a helpful, accurate, and compassionate response:`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({
      response: text,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("chat-gemini error:", err);
    return res.status(500).json({
      error: "Failed to generate response",
      details: String(err),
    });
  }
}
