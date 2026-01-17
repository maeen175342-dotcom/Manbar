
import { Wisdom, Contemplation } from "../types";
import { getRandomWisdom } from "./firestoreService";

/**
 * يستحضر حكمة من قاعدة بيانات Firestore بناءً على بحث المستخدم (الشعور).
 * إذا لم يجد تطابقاً مع الشعور، يختار حكمة عشوائية لضمان استمرارية التجربة.
 */
export const summonWisdom = async (userInput: string): Promise<Wisdom> => {
  // محاكاة وقت "تفكير" لتعزيز التجربة البصرية
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const wisdom = await getRandomWisdom(userInput);
  
  if (!wisdom) {
    // هذه الحالة تظهر فقط إذا كانت قاعدة البيانات فارغة تماماً
    throw new Error("خزانة الحكم فارغة حالياً. يرجى من الحكماء بذر البيانات أولاً من لوحة الإدارة.");
  }
  
  return wisdom;
};

/**
 * يقدم تبصراً للحكمة المختار.
 * يعتمد كلياً على حقل 'explanation' المخزن مسبقاً في Firestore بواسطة المسؤول.
 */
export const contemplateWisdom = async (wisdom: Wisdom): Promise<Contemplation> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    surfaceMeaning: wisdom.explanation,
    deepMeaning: `هذه الحكمة من ${wisdom.author} تعكس جوهر "${wisdom.category || 'الحكمة'}" في التجربة الإنسانية.`,
    practicalApplication: "اجعل هذا المعنى نبراساً ليومك، وتمثله في مواقفك القادمة."
  };
};
