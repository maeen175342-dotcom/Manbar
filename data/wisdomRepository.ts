
import { Wisdom } from "../types";

export const WISDOM_REPOSITORY: Wisdom[] = [
  // الفلسفة والأخلاق
  {
    text: "أَعزُّ مَكانٍ في الدُنى سَرجُ سابِحٍ، وَخَيرُ جَليسٍ في الزَمانِ كِتابُ",
    author: "المتنبي",
    source: "ديوان المتنبي",
    category: "الأدب والفلسفة",
    moodColor: "#0f172a" // Deep Slate
  },
  {
    text: "الخوفُ من التعبِ تعبٌ، والإقدامُ على التعبِ راحةٌ",
    author: "ابن حزم الأندلسي",
    source: "مداواة النفوس",
    category: "علم النفس والأخلاق",
    moodColor: "#1e1b4b" // Deep Indigo
  },
  {
    text: "من لم يتغذَّ بأصلِهِ، لم ينمُ فرعُهُ",
    author: "قول مأثور",
    source: "الأدب العربي القديم",
    category: "الحكمة الاجتماعية",
    moodColor: "#064e3b" // Deep Emerald
  },
  {
    text: "الوقتُ كالسيفِ إن لم تقطعْهُ قطعَك",
    author: "الشافعي",
    source: "ديوان الإمام الشافعي",
    category: "الزهد والحكمة",
    moodColor: "#450a0a" // Deep Maroon
  },
  
  // التصوف والروحانيات
  {
    text: "ما وَسِعَني سَمائي وَلا أَرْضي، وَوِسِعَني قَلْبُ عَبْدِيَ المُؤْمِنِ",
    author: "حديث قدسي",
    source: "إحياء علوم الدين",
    category: "التصوف",
    moodColor: "#312e81" // Indigo
  },
  {
    text: "القلبُ الذي يسكنه الحبُّ لا يشيخُ أبداً",
    author: "جلال الدين الرومي",
    source: "المثنوي",
    category: "الروحانيات",
    moodColor: "#581c87" // Purple
  },

  // السياسة والاجتماع
  {
    text: "العدلُ أساسُ الملكِ",
    author: "ابن خلدون",
    source: "المقدمة",
    category: "علم الاجتماع والسياسة",
    moodColor: "#422006" // Bronze
  },
  {
    text: "الظلمُ مؤذنٌ بخرابِ العمرانِ",
    author: "ابن خلدون",
    source: "المقدمة",
    category: "الفلسفة التاريخية",
    moodColor: "#7f1d1d" // Dark Red
  },

  // الفلسفة الحديثة
  {
    text: "الحريةُ ليست كلمةً تُقال، بل هي فعلٌ يُمارَس",
    author: "نجيب محفوظ",
    source: "الثلاثية",
    category: "الأدب الحديث",
    moodColor: "#14532d" // Forest Green
  },
  {
    text: "أولُ العلمِ الصمتُ، والثاني الاستماعُ، والثالثُ الحفظُ، والرابعُ العملُ به، والخامسُ نشرُه",
    author: "الأصمعي",
    source: "عيون الأخبار",
    category: "طلب العلم",
    moodColor: "#1e3a8a" // Royal Blue
  }
];

export const getWisdomByCategory = (category: string) => {
  return WISDOM_REPOSITORY.filter(w => w.category === category);
};
