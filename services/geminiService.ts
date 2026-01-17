
import { Wisdom, Contemplation } from "../types";
import { getRandomWisdom } from "./firestoreService";

/**
 * يستحضر حكمة من قاعدة بيانات Firestore بناءً على بحث المستخدم.
 * لا يتم استخدام أي ذكاء اصطناعي هنا، بل يتم البحث في المحتوى البشري الموثق.
 */
export const summonWisdom = async (userInput: string): Promise<Wisdom> => {
  // محاكاة وقت "تفكير" لتعزيز التجربة البصرية
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const wisdom = await getRandomWisdom(userInput);
  
  if (!wisdom) {
    throw new Error("عذراً، لم نجد في خزانة الحكم ما يطابق بحثك حالياً. حاول بكلمات أخرى.");
  }
  
  return wisdom;
};

/**
 * يقدم تبصراً للحكمة المختار.
 * يعتمد كلياً على حقل 'explanation' المخزن مسبقاً في Firestore بواسطة المسؤول.
 */
export const contemplateWisdom = async (wisdom: Wisdom): Promise<Contemplation> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // يتم تقسيم الشرح المخزن أو تقديمه بشكل منظم
  return {
    surfaceMeaning: wisdom.explanation,
    deepMeaning: `هذه الحكمة من ${wisdom.author} تعكس عمق التجربة الإنسانية في سياق ${wisdom.category || 'الحياة'}.`,
    practicalApplication: "تمثل هذه الحكمة في يومك، واجعلها نبراساً لقراراتك القادمة."
  };
};
