
import { GoogleGenAI, Type } from "@google/genai";
import { Wisdom, Contemplation } from "../types";
import { getRandomWisdom } from "./firestoreService";

// تهيئة عميل Google GenAI
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * يستحضر حكمة من قاعدة بيانات Firestore بناءً على بحث المستخدم (الشعور).
 */
export const summonWisdom = async (userInput: string): Promise<Wisdom> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  const wisdom = await getRandomWisdom(userInput);
  if (!wisdom) {
    throw new Error("خزانة الحكم فارغة حالياً. يرجى من الحكماء بذر البيانات أولاً من لوحة الإدارة.");
  }
  return wisdom;
};

/**
 * يقدم تبصراً للحكمة المختار بناءً على البيانات المخزنة.
 */
export const contemplateWisdom = async (wisdom: Wisdom): Promise<Contemplation> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    surfaceMeaning: wisdom.explanation,
    deepMeaning: `هذه الحكمة من ${wisdom.author} تعكس جوهر "${wisdom.category || 'الحكمة'}" في التجربة الإنسانية.`,
    practicalApplication: "اجعل هذا المعنى نبراساً ليومك، وتمثله في مواقفك القادمة."
  };
};

/**
 * توليد دفعة من الحكم الجديدة باستخدام الذكاء الاصطناعي (للمسؤول فقط).
 */
export const generateWisdomsBatch = async (count: number = 5): Promise<Omit<Wisdom, 'id' | 'createdAt' | 'updatedAt'>[]> => {
  if (!process.env.API_KEY || process.env.API_KEY === 'PLACEHOLDER_API_KEY') {
    throw new Error("مفتاح API غير متوفر لتوليد المحتوى.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قم بتوليد ${count} حكم عربية تراثية أو فلسفية عميقة. 
      يجب أن يكون لكل حكمة: نص، قائل، مصدر (أو كتاب)، شرح مفصل (explanation)، لون شعور مناسب (hex code)، وتصنيف شعوري (مثل: الصبر، الهمة، الحكمة).
      أجب فقط بتنسيق JSON كقائمة من الكائنات.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              author: { type: Type.STRING },
              source: { type: Type.STRING },
              explanation: { type: Type.STRING },
              moodColor: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["text", "author", "source", "explanation", "moodColor", "category"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
