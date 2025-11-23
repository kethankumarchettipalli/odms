import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Firebase Admin
initializeApp();

export const chatGemini = onRequest(
  {
    cors: true,
    secrets: ["GEMINI_API_KEY"]
  },
  async (req, res) => {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { message, context, systemPrompt } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI("AIzaSyA3zujP-68XdLQN8nDHFMK34lWjb-7z7d4");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Enhanced system prompt for organ donation context
      const enhancedSystemPrompt = systemPrompt || `You are Dr. LifeSaver, an expert AI assistant for the Organ Donation Management System (ODMS).

Your role is to provide accurate, compassionate, and helpful information about organ donation, transplantation, and related medical procedures.

CORE EXPERTISE:
- Organ donation processes and requirements  
- Medical eligibility criteria for donors and recipients
- Legal and ethical aspects of organ donation
- Emotional support for families and patients
- Emergency protocols and procedures
- Hospital coordination and logistics

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

For emergencies, direct users to:
- Medical Emergency: 911 or local emergency services
- Organ Donation Emergency: 1-800-ORGAN-1
- India Emergency: 108 (National Ambulance Service)`;

      // Include conversation context for better responses
      const contextMessages = context && context.length > 0 
        ? context.map(msg => `${msg.role}: ${msg.content}`).join('\n')
        : '';
      
      const fullPrompt = `${enhancedSystemPrompt}

${contextMessages ? `Previous conversation:\n${contextMessages}\n` : ''}

User: ${message}

Please provide a helpful, accurate, and compassionate response:`;

      // Generate response with enhanced configuration
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return res.status(200).json({
        response: text,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return res.status(500).json({
        error: "Failed to generate response",
        message: error.message
      });
    }
  }
);