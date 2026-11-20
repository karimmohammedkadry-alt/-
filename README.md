# أَثَر — دار الحِرَف اليدوية المعاصرة

متجر إلكتروني لعرض المنتجات اليدوية المعاصرة، مبني باستخدام React وTypeScript وVite.

## التشغيل محليًا

يتطلب Node.js 20.19+ أو 22.12+.

```bash
npm install
npm run dev
```

## فحص المشروع وبناء نسخة النشر

```bash
npm run lint
npm run build
npm run preview
```

ملفات النشر النهائية تُنشأ داخل مجلد `dist`.

## النشر على Vercel

1. ارفع محتويات هذا المشروع إلى مستودع GitHub جديد.
2. من Vercel اختر **Add New → Project** ثم اربط مستودع GitHub.
3. اترك إعدادات البناء كما هي أو استخدم:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. اضغط **Deploy**.

ملف `vercel.json` يضبط إعدادات البناء وإعادة توجيه المسارات إلى `index.html` لتجنب أخطاء تحديث الصفحات.

## ملاحظات مهمة

- لا ترفع ملفات `.env` أو مفاتيح API إلى GitHub. أضف أي أسرار لازمة من **Vercel → Project → Settings → Environment Variables**.
- ملف `.env.example` مجرد نموذج ولا يحتوي على مفتاح حقيقي.
- السلة والمفضلة والطلبات والتقييمات في النسخة الحالية تُحفظ في `localStorage` على متصفح الزائر؛ لا يوجد في المشروع الحالي خادم خلفي أو قاعدة بيانات مشتركة لمعالجة الطلبات.
- لم يتم تضمين `node_modules` أو ملفات البناء في المستودع؛ Vercel يثبت الاعتماديات ويبني المشروع تلقائيًا.
