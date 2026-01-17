
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { LegacyEntry, Wisdom } from "../types";

const LEGACY_COLLECTION = "legacy_entries";
const WISDOM_COLLECTION = "wisdoms";

export const addLegacyEntry = async (content: string, authorName: string) => {
  try {
    const docRef = await addDoc(collection(db, LEGACY_COLLECTION), {
      content,
      authorName,
      status: 'pending',
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding legacy entry: ", e);
    throw e;
  }
};

export const getAllLegacyEntries = async (): Promise<LegacyEntry[]> => {
  const q = query(collection(db, LEGACY_COLLECTION), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: (doc.data().timestamp as Timestamp).toMillis()
  } as LegacyEntry));
};

export const addWisdom = async (wisdom: Omit<Wisdom, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Date.now();
  const docRef = await addDoc(collection(db, WISDOM_COLLECTION), {
    ...wisdom,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const getAllWisdoms = async (): Promise<Wisdom[]> => {
  const q = query(collection(db, WISDOM_COLLECTION), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Wisdom));
};

export const updateWisdom = async (id: string, data: Partial<Wisdom>) => {
  const docRef = doc(db, WISDOM_COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Date.now()
  });
};

export const deleteWisdom = async (id: string) => {
  const docRef = doc(db, WISDOM_COLLECTION, id);
  await deleteDoc(docRef);
};

export const getRandomWisdom = async (searchQuery?: string): Promise<Wisdom | null> => {
  const querySnapshot = await getDocs(collection(db, WISDOM_COLLECTION));
  let wisdoms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wisdom));
  
  if (searchQuery && searchQuery.trim() !== "") {
    const term = searchQuery.toLowerCase();
    wisdoms = wisdoms.filter(w => 
      w.text.toLowerCase().includes(term) || 
      w.category?.toLowerCase().includes(term) ||
      w.author.toLowerCase().includes(term)
    );
  }

  if (wisdoms.length === 0) return null;
  return wisdoms[Math.floor(Math.random() * wisdoms.length)];
};

export const seedWisdoms = async () => {
  const seedData: Omit<Wisdom, 'id' | 'createdAt' | 'updatedAt'>[] = [
    { text: "الوقت كالسيف إن لم تقطعه قطعك", author: "الشافعي", source: "ديوان الشافعي", category: "الوقت", moodColor: "#1e1b4b", explanation: "الوقت يمضي سريعاً ولا يعود، فإما أن تستغله في العمل النافع أو يضيع منك ويضرك." },
    { text: "العلم في الصغر كالنقش على الحجر", author: "قول مأثور", source: "الأمثال العربية", category: "العلم", moodColor: "#064e3b", explanation: "التعلم في سن مبكرة يرسخ في العقل ويصعب نسيانه تماماً كالنقش الثابت على الحجر." },
    { text: "من جد وجد ومن زرع حصد", author: "أمثال", source: "التراث الشعبي", category: "العمل", moodColor: "#422006", explanation: "النجاح هو ثمرة الجهد والاجتهاد، فلكل مجتهد نصيب من عمله." },
    { text: "العدل أساس الملك", author: "ابن خلدون", source: "المقدمة", category: "السياسة", moodColor: "#450a0a", explanation: "استقرار الدول وبقاؤها يعتمد بالدرجة الأولى على إقامة العدل بين الناس." },
    { text: "خير الكلام ما قل ودل", author: "أمثال", source: "بلاغة العرب", category: "البلاغة", moodColor: "#0f172a", explanation: "أفضل الحديث هو الذي يوصل المعنى بوضوح وبأقل عدد من الكلمات." },
    { text: "لسانك حصانك إن صنته صانك", author: "أمثال", source: "أدب العرب", category: "الأخلاق", moodColor: "#1e3a8a", explanation: "كلامك يعبر عن قيمتك، فإذا حفظت لسانك من السوء حفظت كرامتك." },
    { text: "القناعة كنز لا يفنى", author: "علي بن أبي طالب", source: "نهج البلاغة", category: "الزهد", moodColor: "#14532d", explanation: "الرضا بما قسمه الله يمنح الإنسان غنى نفسياً وسعادة دائمة." },
    { text: "صديقك من صدقك لا من صدقك", author: "حكمة", source: "الأدب", category: "الصداقة", moodColor: "#312e81", explanation: "الصديق الحقيقي هو من يصدقك القول ويصوب أخطاءك لا من يوافقك دائماً." },
    { text: "في التأني السلامة وفي العجلة الندامة", author: "أمثال", source: "الحذر", category: "الحياة", moodColor: "#164e63", explanation: "التمهل والتفكير يقي الإنسان من الأخطاء التي قد يندم عليها بسبب التسرع." },
    { text: "من حفر حفرة لأخيه وقع فيها", author: "أمثال", source: "الأخلاق", category: "الأخلاق", moodColor: "#4c1d95", explanation: "سوء التدبير للآخرين غالباً ما يرتد بالضرر على صاحبه في النهاية." },
    { text: "الصبر مفتاح الفرج", author: "أمثال", source: "الصبر", category: "الصبر", moodColor: "#1e1b4b", explanation: "تحمل الشدائد بهدوء هو السبيل للخروج من المحن والأزمات." },
    { text: "من راقب الناس مات هماً", author: "أمثال", source: "الأدب", category: "الراحة", moodColor: "#1e293b", explanation: "الانشغال بشؤون الآخرين وخصوصياتهم يورث القلق والتعب النفسي." },
    { text: "لا تؤجل عمل اليوم إلى الغد", author: "أمثال", source: "العمل", category: "الإنتاجية", moodColor: "#1e1b4b", explanation: "المبادرة بإنجاز المهام في وقتها تضمن النجاح وتمنع تراكم العمل." },
    { text: "العفو عند المقدرة", author: "أمثال", source: "مكارم الأخلاق", category: "الأخلاق", moodColor: "#115e59", explanation: "أرقى درجات التسامح هي التي تكون في حال القوة والقدرة على الرد." },
    { text: "من هان عليه ماله صان نفسه", author: "أمثال", source: "الأدب", category: "الكرامة", moodColor: "#3730a3", explanation: "إنفاق المال في موضعه الصحيح يحفظ للإنسان كرامته وقدره بين الناس." },
    { text: "كل إناء بما فيه ينضح", author: "أمثال", source: "الجوهر", category: "الإنسان", moodColor: "#312e81", explanation: "تصرفات الإنسان وكلامه تعكس بالضرورة ما يكمن في داخله من قيم." },
    { text: "ما ضاع حق وراءه مطالب", author: "أمثال", source: "الحقوق", category: "الحقوق", moodColor: "#7f1d1d", explanation: "الإصرار على نيل الحقوق هو الضمان الوحيد لاستعادتها مهما طال الزمن." },
    { text: "يد الله مع الجماعة", author: "حديث", source: "السنة", category: "التعاون", moodColor: "#14532d", explanation: "القوة والبركة تكمن في الاتحاد والعمل الجماعي المنظم." },
    { text: "من عرف لغة قوم أمن مكرهم", author: "أمثال", source: "المعرفة", category: "المعرفة", moodColor: "#064e3b", explanation: "تعلم ثقافات ولغات الآخرين وسيلة فعالة لفهمهم وحماية النفس." },
    { text: "الكلمة الطيبة صدقة", author: "حديث", source: "السنة", category: "الأخلاق", moodColor: "#166534", explanation: "القول الحسن له أثر طيب في النفوس ويعادل في أجره العطاء المادي." },
    { text: "بقدر الكد تكتسب المعالي", author: "الشافعي", source: "الديوان", category: "الطموح", moodColor: "#3f6212", explanation: "الوصول للمكانة الرفيعة يتطلب جهداً وسهراً يوازي عظمة الهدف." },
    { text: "من شاور الناس شاركهم في عقولهم", author: "علي بن أبي طالب", source: "نهج البلاغة", category: "الحكمة", moodColor: "#1e3a8a", explanation: "الاستفادة من آراء الآخرين وخبراتهم تزيد من صواب القرار ونضجه." },
    { text: "أد الأمانة إلى من ائتمنك", author: "حديث", source: "السنة", category: "الأمانة", moodColor: "#1e3a8a", explanation: "الالتزام برد الودائع والأمانات واجب أساسي في بناء الثقة بين الناس." },
    { text: "الجار قبل الدار", author: "أمثال", source: "الاجتماع", category: "الاجتماع", moodColor: "#5b21b6", explanation: "جودة البيئة الاجتماعية والجيران أهم بكثير من فخامة المسكن نفسه." },
    { text: "من غشنا فليس منا", author: "حديث", source: "السنة", category: "الأمانة", moodColor: "#9a3412", explanation: "الصدق والشفافية في التعامل هما أساس الانتماء للقيم الإنسانية." },
    { text: "يسروا ولا تعسروا", author: "حديث", source: "السنة", category: "التعامل", moodColor: "#0369a1", explanation: "التسهيل على الناس في شؤونهم هو المنهج السليم والمريح للجميع." },
    { text: "خير الناس أنفعهم للناس", author: "حديث", source: "السنة", category: "العطاء", moodColor: "#1e3a8a", explanation: "قيمة الإنسان الحقيقية تقاس بمدى نفعه وفائدته لمن حوله." },
    { text: "لا يلدغ المؤمن من جحر مرتين", author: "حديث", source: "السنة", category: "الذكاء", moodColor: "#0f172a", explanation: "التعلم من التجارب والأخطاء السابقة هو دليل على النضج والحكمة." },
    { text: "ما قل وكفى خير مما كثر وألهى", author: "حديث", source: "السنة", category: "القناعة", moodColor: "#1e1b4b", explanation: "القليل النافع والمستقر أفضل من الكثير الذي يشغل البال دون جدوى." },
    { text: "الناس معادن", author: "حديث", source: "السنة", category: "الإنسان", moodColor: "#422006", explanation: "جوهر الناس يظهر عند الشدائد كما تظهر جودة المعادن في النار." },
    { text: "من سلك طريقاً يلتمس فيه علماً سهل الله له به طريقاً إلى الجنة", author: "حديث", source: "السنة", category: "العلم", moodColor: "#065f46", explanation: "السعي في طلب المعرفة هو عبادة وسبيل للرفعة في الدنيا والآخرة." },
    { text: "اتق شر من أحسنت إليه", author: "أمثال", source: "التجارب", category: "التعامل", moodColor: "#450a0a", explanation: "تحذير من جحود البعض، وضرورة الحذر حتى في حالات العطاء." },
    { text: "الساكت عن الحق شيطان أخرس", author: "حكمة", source: "الحق", category: "الحق", moodColor: "#991b1b", explanation: "عدم قول الحقيقة عند الحاجة هو تواطؤ مع الباطل ومشاركة في الظلم." },
    { text: "من حسن إسلام المرء تركه ما لا يعنيه", author: "حديث", source: "السنة", category: "الأخلاق", moodColor: "#064e3b", explanation: "الرقي الإنساني يبدأ بالتوقف عن التدخل فيما لا يخص الإنسان." },
    { text: "المؤمن مرآة أخيه", author: "حديث", source: "السنة", category: "النصح", moodColor: "#1e3a8a", explanation: "الأصدقاء الصادقون يعكسون عيوب بعضهم البعض بمحبة وبغرض الإصلاح." },
    { text: "ليس كل ما يتمنى المرء يدركه", author: "المتنبي", source: "الديوان", category: "الحياة", moodColor: "#1e293b", explanation: "الحياة مليئة بالتقلبات، وعلى الإنسان قبول أن الأقدار قد تخالف الأماني." },
    { text: "مصارع الرجال تحت بروق الطمع", author: "علي بن أبي طالب", source: "نهج البلاغة", category: "الأخلاق", moodColor: "#7f1d1d", explanation: "الطمع الزائد هو المهلكة التي تورد الإنسان موارد الردى والضياع." },
    { text: "من كثر ضحكه قلت هيبته", author: "عمر بن الخطاب", source: "الأدب", category: "الرزانة", moodColor: "#0f172a", explanation: "الوقار والاتزان مطلوبان للحفاظ على تقدير الناس واحترامهم." },
    { text: "رب أخ لك لم تلده أمك", author: "حكمة", source: "الصداقة", category: "الصداقة", moodColor: "#1e3a8a", explanation: "الروابط الروحية والفكرية قد تفوق في قوتها روابط الدم والقرابة." },
    { text: "الظلم مؤذن بخراب العمران", author: "ابن خلدون", source: "المقدمة", category: "الاجتماع", moodColor: "#991b1b", explanation: "غياب العدالة يؤدي بالضرورة لتفكك المجتمعات وانهيار الحضارات." },
    { text: "من تعلم لغة قوم أمن مكرهم", author: "أمثال", source: "المعرفة", category: "المعرفة", moodColor: "#064e3b", explanation: "فهم الآخرين ولغاتهم هو أفضل وسيلة للتعاون وتجنب الصراعات." },
    { text: "الكلمة إذا خرجت من القلب وقعت في القلب", author: "حكمة", source: "البلاغة", category: "الصدق", moodColor: "#1e3a8a", explanation: "الصدق في التعبير هو مفتاح الوصول لعقول وقلوب الآخرين." },
    { text: "من قنع شبع", author: "حكمة", source: "الزهد", category: "القناعة", moodColor: "#14532d", explanation: "الاكتفاء بما تملك هو سر الراحة والامتلاء النفسي." },
    { text: "أول العلم الصمت", author: "حكمة", source: "العلم", category: "العلم", moodColor: "#1e1b4b", explanation: "الاستماع الجيد والتواضع هما الخطوة الأولى في طريق المعرفة." },
    { text: "من أطاع هواه أعطى عدوه مناه", author: "أمثال", source: "الأخلاق", category: "الأخلاق", moodColor: "#450a0a", explanation: "الانقياد للرغبات دون تفكير يجعل الإنسان ضعيفاً أمام خصومه." },
    { text: "الجاهل عدو نفسه", author: "أمثال", source: "العلم", category: "العلم", moodColor: "#7f1d1d", explanation: "غياب الوعي يسبب للإنسان أضراراً تفوق ما قد يفعله به أعداؤه." },
    { text: "تاج المروءة التواضع", author: "حكمة", source: "الأخلاق", category: "الأخلاق", moodColor: "#1e3a8a", explanation: "قمة الأخلاق والرجولة تكمن في البعد عن الكبر والتعالي." },
    { text: "من استعجل الشيء قبل أوانه عوقب بحرمانه", author: "قاعدة فقهية", source: "الأدب", category: "الصبر", moodColor: "#4c1d95", explanation: "الصبر على النتائج ضروري، فالتسرع قد يؤدي لفقدان الهدف تماماً." },
    { text: "العز في القناعة والذل في الطمع", author: "حكمة", source: "الأخلاق", category: "الكرامة", moodColor: "#312e81", explanation: "الكرامة مرتبطة بالاستغناء، بينما الطمع يورث الإنسان المهانة." },
    { text: "خير الإخوان من لا يحوجك إلى صانع", author: "حكمة", source: "الصداقة", category: "الصداقة", moodColor: "#1e3a8a", explanation: "الصديق المخلص هو الذي يقف بجانبك بتلقائية دون حاجة للتكلف." }
  ];

  for (const item of seedData) {
    await addWisdom(item);
  }
};
