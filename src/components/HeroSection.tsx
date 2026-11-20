import { ArrowLeft } from 'lucide-react';
import { HERO_IMAGE } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onOpenOrderTracker: () => void;
}

export function HeroSection({ onOpenOrderTracker }: HeroSectionProps) {
  return (
    <section id="top" className="border-b border-slate-900/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium text-[#475569] tracking-wide mb-4 sm:mb-5">
                دار أثر للحِرف اليدوية · إصدار خريف ٢٠٢٦
              </p>
              <h1
                className="font-display text-[clamp(1.9rem,4vw,3.65rem)] font-bold leading-[1.22] text-[#111315] mb-5 sm:mb-6"
                style={{ textWrap: 'balance' }}
              >
                قطع معمولة بالإيد عشان تسيب أثر حلو في بيتك.
              </h1>
              <p className="text-sm sm:text-base leading-[1.75] text-[#475569] max-w-md mb-6 sm:mb-8">
                في «أثر» بنجمعلك شغل الخزف الحجري، النسيج الطبيعي، والخشب المنحوت في إصدارات
                محدودة ومرقمة جاية من إيد الحرفيين على بيتك على طول، وبأسهل طرق دفع أونلاين أو كاش
                عند الاستلام.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <a
                href="#collection"
                className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
              >
                <span>شوف المجموعة</span>
                <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              </a>
              <a
                href="#atelier"
                className="text-sm font-medium text-[#111315] hover:text-[#1E3A8A] underline underline-offset-8 decoration-slate-900/25 hover:decoration-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
              >
                اعرف حكاية الصنعة
              </a>
              <button
                type="button"
                onClick={onOpenOrderTracker}
                className="md:hidden text-sm font-medium text-[#475569] hover:text-[#111315] underline underline-offset-8 decoration-slate-900/20 whitespace-nowrap shrink-0 cursor-pointer"
              >
                تابع طلبك
              </button>
            </div>
          </div>

          {/* Dominant Visual Focal Anchor */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[240px] sm:min-h-[340px] lg:min-h-[460px] rounded-xl overflow-hidden bg-[#ECEFF2] border border-slate-900/8">
              <ResilientImage
                src={HERO_IMAGE}
                alt="مجموعة أثر من أواني الخزف الحجري المطلية بالكوبالت وطبق خشب الزيتون المنحوت"
                fallbackTitle="مجموعة أثر المعاصرة"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Specification Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-900/8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <div>
            <p className="text-sm font-semibold text-[#111315] mb-1">إصدارات محدودة ومرقمة</p>
            <p className="text-xs leading-relaxed text-[#475569]">
              توقيع الحرفي ورقم القطعة موجود على كل منتج
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111315] mb-1">خامات طبيعية ١٠٠٪</p>
            <p className="text-xs leading-relaxed text-[#475569]">
              طين حجري، كتان مصري، وخشب طبيعي معالج
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111315] mb-1">دفع أونلاين أو كاش</p>
            <p className="text-xs leading-relaxed text-[#475569]">
              فيزا، إنستا باي، محافظ إلكترونية، أو كاش عند الاستلام
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111315] mb-1">تغليف أمان ضد الكسر</p>
            <p className="text-xs leading-relaxed text-[#475569]">
              توصيل مجاني لأي طلب فوق ١,٥٠٠ ج.م
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
