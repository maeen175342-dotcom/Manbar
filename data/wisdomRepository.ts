
import { Wisdom } from "../types";

export const WISDOM_REPOSITORY: Wisdom[] = [
  // الفلسفة والأخلاق
  {
    text: "أَعزُّ مَكانٍ في الدُنى سَرجُ سابِحٍ، وَخَيرُ جَليسٍ في الزَمانِ كِتابُ",
    author: "المتنبي",
    source: "ديوان المتنبي",
    category: "الأدب والفلسفة",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "هذه الحكمة تعلي من شأن الفروسية والقوة البدنية وكذلك من شأن العلم والمعرفة المتمثلة في الكتاب كأفضل رفيق في الحياة.",
    moodColor: "#0f172a" // Deep Slate
  },
  {
    text: "الخوفُ من التعبِ تعبٌ، والإقدامُ على التعبِ راحةٌ",
    author: "ابن حزم الأندلسي",
    source: "مداواة النفوس",
    category: "علم النفس والأخلاق",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "القلق المسبق من الجهد يرهق الروح أكثر من العمل نفسه، بينما البدء في الإنجاز يمنح النفس طمأنينة وراحة.",
    moodColor: "#1e1b4b" // Deep Indigo
  },
  {
    text: "من لم يتغذَّ بأصلِهِ، لم ينمُ فرعُهُ",
    author: "قول مأثور",
    source: "الأدب العربي القديم",
    category: "الحكمة الاجتماعية",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "النجاح الحقيقي والنمو المستقبلي مرتبطان ارتباطاً وثيقاً بالتمسك بالجذور والقيم الأصيلة للإنسان.",
    moodColor: "#064e3b" // Deep Emerald
  },
  {
    text: "الوقتُ كالسيفِ إن لم تقطعْهُ قطعَك",
    author: "الشافعي",
    source: "ديوان الإمام الشافعي",
    category: "الزهد والحكمة",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "الوقت مورد لا يمكن استرجاعه، فإما أن يستغله الإنسان فيما ينفعه أو يضيع منه ويتحول إلى حسرة.",
    moodColor: "#450a0a" // Deep Maroon
  },
  
  // التصوف والروحانيات
  {
    text: "ما وَسِعَني سَمائي وَلا أَرْضي، وَوِسِعَني قَلْبُ عَبْدِيَ المُؤْمِنِ",
    author: "حديث قدسي",
    source: "إحياء علوم الدين",
    category: "التصوف",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "تأكيد على السعة الروحية لقلب الإنسان وقدرته على استيعاب الإيمان والمحبة بما يتجاوز أبعاد الكون المادي.",
    moodColor: "#312e81" // Indigo
  },
  {
    text: "القلبُ الذي يسكنه الحبُّ لا يشيخُ أبداً",
    author: "جلال الدين الرومي",
    source: "المثنوي",
    category: "الروحانيات",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "المحبة الصادقة تمنح الروح طاقة وشباباً دائماً يتجاوزان حدود الزمن وشيخوخة الجسد.",
    moodColor: "#581c87" // Purple
  },

  // السياسة والاجتماع
  {
    text: "العدلُ أساسُ الملكِ",
    author: "ابن خلدون",
    source: "المقدمة",
    category: "علم الاجتماع والسياسة",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "استقرار الأنظمة وبقاء الدول يعتمد بشكل جوهري على تحقيق العدالة والمساواة بين أفراد المجتمع.",
    moodColor: "#422006" // Bronze
  },
  {
    text: "الظلمُ مؤذنٌ بخرابِ العمرانِ",
    author: "ابن خلدون",
    source: "المقدمة",
    category: "الفلسفة التاريخية",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "غياب العدالة وتفشي الظلم يؤديان حتماً إلى تفكك الروابط الاجتماعية وانهيار الحضارات.",
    moodColor: "#7f1d1d" // Dark Red
  },

  // الفلسفة الحديثة
  {
    text: "الحريةُ ليست كلمةً تُقال، بل هي فعلٌ يُمارَس",
    author: "نجيب محفوظ",
    source: "الثلاثية",
    category: "الأدب الحديث",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "الحرية الحقيقية تتجسد في القرارات والأفعال والمسؤولية الشخصية، وليست مجرد شعارات لفظية.",
    moodColor: "#14532d" // Forest Green
  },
  {
    text: "أولُ العلمِ الصمتُ، والثاني الاستماعُ، والثالثُ الحفظُ، والرابعُ العملُ به، والخامسُ نشرُه",
    author: "الأصمعي",
    source: "عيون الأخبار",
    category: "طلب العلم",
    // Added explanation to satisfy the Wisdom interface requirements
    explanation: "منهجية طلب العلم تبدأ بالتواضع والإنصات، وتكتمل بالتطبيق العملي ونقل المعرفة للآخرين.",
    moodColor: "#1e3a8a" // Royal Blue
  }
];

export const getWisdomByCategory = (category: string) => {
  return WISDOM_REPOSITORY.filter(w => w.category === category);
};
