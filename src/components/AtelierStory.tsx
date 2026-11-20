import { ATELIER_IMAGE, CRAFT_PRINCIPLES } from '../data/products';
import { ResilientImage } from './ResilientImage';

export function AtelierStory() {
  return (
    <section id="atelier" className="py-16 lg:py-24 bg-white border-y border-slate-900/10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Atmospheric Atelier Image */}
          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] lg:min-h-[460px] rounded-xl overflow-hidden bg-[#ECEFF2] border border-slate-900/8">
              <ResilientImage
                src={ATELIER_IMAGE}
                alt="إيد الحرفي وهي بتشكل فخار على الدولاب في ورشة أثر"
                fallbackTitle="ورشة أثر للحرف اليدوية"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Editorial Craft Philosophy */}
          <div id="atelier-principles" className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium text-[#475569] mb-3">
                من الورشة لبيتك على طول
              </p>
              <h2
                className="font-display text-3xl lg:text-4xl font-bold text-[#111315] leading-snug mb-5"
                style={{ textWrap: 'balance' }}
              >
                الجمال الحقيقي في أثر الإيد مش المكنة.
              </h2>
              <p className="text-base leading-[1.75] text-[#475569] mb-8">
                إحنا مبنطلعش كميات تجارية شبه بعضها. بنشتغل مع خزافين، نساجين، ونجارين فنانين
                عشان نعمل قطع تعيش معاك يوم بيوم وتدي روح هادية ومختلفة للمكان.
              </p>
            </div>

            <div className="divide-y divide-slate-900/10 border-t border-slate-900/10">
              {CRAFT_PRINCIPLES.map((item) => (
                <div key={item.index} className="py-5 first:pt-5 last:pb-0">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="text-sm font-semibold text-[#1E3A8A] tabular-nums">
                      {item.index}
                    </span>
                    <h3 className="text-base font-semibold text-[#111315]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#475569] pr-8">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
