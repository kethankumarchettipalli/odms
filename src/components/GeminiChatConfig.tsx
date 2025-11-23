// Gemini 1.5 Flash AI Configuration for Organ Donation Management System
export const GEMINI_CONFIG = {
  model: "gemini-2.5-flash",
  
  // System persona for organ donation assistant
  systemPrompt: `You are Dr. LifeSaver, an expert AI assistant for the Organ Donation Management System (ODMS). 
  
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

KNOWLEDGE BASE TOPICS:
- Organ donation registration process
- Types of organ and tissue donations
- Brain death determination
- Consent procedures and family discussions
- Organ allocation and matching systems
- Post-transplant care basics
- Living donor information
- Myths and facts about donation

You have access to real-time information about:
- Hospital locations and contacts in your region
- Emergency hotlines and support services
- Legal requirements and documentation
- Recent policy updates and guidelines`,

  // Example conversations for context
  examples: [
    {
      user: "How do I register as an organ donor?",
      assistant: "I'm glad you're interested in becoming an organ donor! Here's how to register:\n\n1. **Online Registration**: Use our ODMS platform or your state's donor registry\n2. **DMV Registration**: Register when renewing your driver's license\n3. **Hospital Registration**: Sign up during medical visits\n\nRequired information:\n- Full name and contact details\n- Medical history (basic)\n- Organs you wish to donate\n- Emergency contact\n\nRemember to:\n✓ Inform your family about your decision\n✓ Carry your donor card\n✓ Update your registration if details change\n\nWould you like help with any specific part of the registration process?"
    },
    {
      user: "My father is brain dead. What happens next?",
      assistant: "I understand this is an incredibly difficult time for you and your family. My deepest condolences. Here's what typically happens:\n\n**Immediate Steps:**\n1. Medical team confirms brain death determination\n2. Organ procurement organization (OPO) is notified\n3. Family meeting to discuss donation options\n4. Review donor registration status\n\n**If donation proceeds:**\n- Medical suitability evaluation\n- Organ matching process begins\n- Surgical teams coordinate\n- Family support services available\n\n**Emergency Contacts:**\n- OPO Coordinator: Available 24/7\n- Family Support: Grief counseling services\n- Medical Team: For questions about the process\n\n**Your Rights:**\n- Take time to make decisions\n- Ask questions about the process\n- Access to spiritual/cultural support\n- Honor your father's wishes\n\nWould you like me to connect you with a family coordinator who can provide personalized support?"
    }
  ],

  // RAG Knowledge Base - Key facts and policies
  knowledgeBase: {
    eligibility: {
      donors: [
        "Age: No strict upper age limit - organs evaluated individually",
        "Medical conditions: Many conditions don't prevent donation",
        "Cancer history: Case-by-case evaluation required",
        "Infectious diseases: Some may prevent donation, others don't",
        "Previous surgeries: Generally not disqualifying"
      ],
      recipients: [
        "Medical need severity",
        "Organ compatibility (blood type, size, tissue matching)",
        "Geographic location (local priority)",
        "Time on waiting list",
        "Age and expected survival benefit"
      ]
    },
    
    procedures: {
      brainDeath: [
        "Two independent physician determinations required",
        "Neurological tests to confirm absence of brain function",
        "Family notification and explanation process",
        "Legal documentation and certification"
      ],
      donation: [
        "Organ recovery typically takes 4-8 hours",
        "Body treated with dignity and respect",
        "Surgical incisions closed and dressed",
        "Body prepared for funeral arrangements"
      ]
    },

    legalRequirements: [
      "Donor registration or family consent required",
      "Medical examiner approval in certain cases",
      "Documentation of brain death or cardiac death",
      "Compliance with state and federal regulations"
    ],

    hospitalContacts: {
      emergency: "1-800-ORGAN-1",
      apolloHyderabad: "+91-40-2355-1355",
      aiimsBhubaneswar: "+91-674-247-1929",
      kingGeorgeVisakhapatnam: "+91-891-255-2265",
      governmentGeneralVijayawada: "+91-866-242-1000"
    }
  },

  // Safety prompts and refusal rules
  safetyRules: [
    "Never provide specific medical diagnoses or treatment recommendations",
    "Always refer complex medical questions to healthcare professionals",
    "Maintain patient confidentiality and privacy",
    "Provide emotional support without overstepping boundaries",
    "Use appropriate emergency contacts for urgent situations",
    "Respect cultural and religious beliefs about death and donation",
    "Avoid making promises about organ availability or success rates"
  ],

  // Evaluation criteria for response quality
  evaluationCriteria: {
    accuracy: "Medically and factually correct information",
    empathy: "Compassionate and understanding tone",
    clarity: "Clear and accessible language",
    safety: "Appropriate referrals and disclaimers",
    relevance: "Directly addresses user's question",
    completeness: "Comprehensive coverage of topic"
  }
};

// Function to get system prompt with current context
export const getSystemPromptWithContext = (userLocation?: string, userRole?: string) => {
  let contextualPrompt = GEMINI_CONFIG.systemPrompt;
  
  if (userLocation) {
    contextualPrompt += `\n\nUSER LOCATION: ${userLocation} - Provide location-specific information when relevant.`;
  }
  
  if (userRole) {
    contextualPrompt += `\n\nUSER ROLE: ${userRole} - Tailor responses appropriately for their level of expertise.`;
  }
  
  return contextualPrompt;
};

// Function to check if response should be refused
export const shouldRefuseQuery = (query: string): boolean => {
  const refusalPatterns = [
    /specific medical diagnosis/i,
    /medical treatment recommendation/i,
    /personal health advice/i,
    /medication dosage/i,
    /surgical procedure details/i
  ];
  
  return refusalPatterns.some(pattern => pattern.test(query));
};

// Emergency response templates
export const EMERGENCY_RESPONSES = {
  medicalEmergency: `🚨 **MEDICAL EMERGENCY** 🚨

If this is a life-threatening emergency:
• Call 911 (US) or local emergency services immediately
• For organ donation emergencies: 1-800-ORGAN-1
• For India: 108 (National Ambulance Service)

I can provide information, but immediate medical attention is your priority.`,

  donationUrgency: `⚡ **URGENT ORGAN DONATION SITUATION** ⚡

For time-sensitive organ donation matters:
• Contact your local OPO immediately
• Emergency Hotline: 1-800-ORGAN-1
• Apollo Hospitals Emergency: +91-40-2355-1355

Every minute matters in organ donation. Please contact these services directly for immediate assistance.`
};