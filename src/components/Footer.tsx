interface FooterProps {
  onOpenOrderTracker: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export function Footer({
  onOpenOrderTracker,
  onOpenCart,
  onOpenWishlist,
}: FooterProps) {
  return (
    <footer className="bg-[#111315] text-slate-300 border-t border-slate-900/15">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/10">
          <div>
            <span className="font-display text-2xl font-bold text-white block mb-2">
              أَثَر
            </span>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              دار للحرف اليدوية المعاصرة. بنوصل شغل الحرفيين المبدعين لكل حد بيحب التفاصيل
              والحاجات المعمولة بإيد وروح.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <a href="#collection" className="hover:text-white transition-colors">
              المجموعة
            </a>
            <a href="#atelier" className="hover:text-white transition-colors">
              حكاية الصنعة
            </a>
            <button
              type="button"
              onClick={onOpenWishlist}
              className="hover:text-white transition-colors cursor-pointer"
            >
              المفضلة
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              className="hover:text-white transition-colors cursor-pointer"
            >
              شنطة المشتريات
            </button>
            <button
              type="button"
              onClick={onOpenOrderTracker}
              className="hover:text-white transition-colors cursor-pointer"
            >
              تابع طلبك
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>© ٢٠٢٦ دار أثر للحرف اليدوية. كل الحقوق محفوظة.</p>
          <p>
            طرق الدفع المتاحة: Visa · Mastercard · Meeza · InstaPay · المحافظ الإلكترونية · كاش
            عند الاستلام
          </p>
        </div>
      </div>
    </footer>
  );
}
