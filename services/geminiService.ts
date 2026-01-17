import { GoogleGenAI, Type } from "@google/genai";
import { Wisdom, Contemplation } from "../types";
import { WISDOM_REPOSITORY } from "../data/wisdomRepository";

// Lazy initialization of AI to prevent early crashes in production environments like Vercel
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
    console.error("Critical: API Key is missing. Please ensure GEMINI_API_KEY is set in your environment variables.");
    throw new Error("مفتاح الخدمة غير متوفر. يرجى التحقق من إعدادات البيئة.");
  }
  
  aiInstance = new GoogleGenAI({ apiKey });
  return aiInstance;
};

const WISDOM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The authentic Arabic quote/wisdom text." },
    author: { type: Type.STRING, description: "Name of the author or 'قائل مجهول'." },
    source: { type: Type.STRING, description: "The book, poem, or historical context of the quote." },
    moodColor: { type: Type.STRING, description: "A hex color code that reflects the mood of this wisdom." },
    category: { type: Type.STRING, description: "The thematic field (e.g., Philosophy, Literature, Sufism)." }
  },
  required: ["text", "author", "source", "moodColor", "category"],
};

const CONTEMPLATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    surfaceMeaning: { type: Type.STRING, description: "A simple, clear explanation of the wisdom in plain Arabic." },
    deepMeaning: { type: Type.STRING, description: "A brief, powerful insight into why this wisdom matters." },
    practicalApplication: { type: Type.STRING, description: "One simple way to act on this wisdom today." }
  },
  required: ["surfaceMeaning", "deepMeaning", "practicalApplication"],
};

const findLocalWisdom = (input: string): Wisdom | null => {
  const normalizedInput = input.toLowerCase();
  const matches = WISDOM_REPOSITORY.filter(w => 
    normalizedInput.includes(w.category?.toLowerCase() || '') ||
    w.text.includes(normalizedInput) ||
    w.author.includes(normalizedInput)
  );
  
  if (matches.length > 0) {
    return matches[Math.floor(Math.random() * matches.length)];
  }
  return null;
};

export const summonWisdom = async (userInput: string): Promise<Wisdom> => {
  const localMatch = findLocalWisdom(userInput);
  if (localMatch) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return localMatch;
  }

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Act as the 'Grand Arabic Oracle'. Use your internal knowledge of Arabic literature. 
      The user is feeling: "${userInput}".
      Retrieve one AUTHENTIC and DOCUMENTED Arabic wisdom.
      Return strictly JSON.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: WISDOM_SCHEMA,
    },
  });

  try {
    const textOutput = response.text || '{}';
    return JSON.parse(textOutput) as Wisdom;
  } catch (error) {
    return WISDOM_REPOSITORY[Math.floor(Math.random() * WISDOM_REPOSITORY.length)];
  }
};

export const contemplateWisdom = async (wisdom: Wisdom): Promise<Contemplation> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      Examine: "${wisdom.text}" by ${wisdom.author}. 
      Provide a SIMPLIFIED and EASY to understand explanation in Arabic. 
      Avoid complex philosophical terms. Speak directly to the heart and mind.
      Return JSON: surfaceMeaning (شرح مبسط), deepMeaning (الجوهر), practicalApplication (نصيحة عملية).
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: CONTEMPLATION_SCHEMA,
    },
  });

  try {
    return JSON.parse(response.text || '{}') as Contemplation;
  } catch (error) {
    throw new Error("تعذر تبسيط هذه الحكمة الآن.");
  }
};