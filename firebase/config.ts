import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1LTcqgRAkYsug8lUeGvIdXGYxamGz-gw",
  authDomain: "manbar-a7fa9.firebaseapp.com",
  projectId: "manbar-a7fa9",
  storageBucket: "manbar-a7fa9.firebasestorage.app",
  messagingSenderId: "674042952852",
  appId: "1:674042952852:web:2e99725555b2ff57cb4881",
  measurementId: "G-R505Y60GVP"
};

// تهيئة التطبيق مع التحقق من عدم وجود نسخة مفعلة مسبقاً
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };