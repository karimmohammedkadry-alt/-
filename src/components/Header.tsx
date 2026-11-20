import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderTracker: () => void;
}

export function Header({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenOrderTracker,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#F6F7F8]/95 backdrop-blur-sm border-b border-slate-900/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-bold tracking-tight text-[#111315] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E3A8A]"
        >
          أَثَر
        </a>

        {/* Zone 2: Clean single-line navigation links (desktop) */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]"
        >
          <a
            href="#collection"
            className="hover:text-[#111315] hover:underline underline-offset-8 decoration-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
          >
            المجموعة
          </a>
          <a
            href="#atelier"
            className="hover:text-[#111315] hover:underline underline-offset-8 decoration-[#1E3A8A] transition-colors whitespace-nowrap shrink-0"
          >
            حكاية الصنعة
          </a>
          <button
            type="button"
            onClick={onOpenWishlist}
            className="hover:text-[#111315] hover:underline underline-offset-8 decoration-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            المفضلة{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
          </button>
          <button
            type="button"
            onClick={onOpenOrderTracker}
            className="hover:text-[#111315] hover:underline underline-offset-8 decoration-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            تابع طلبك
          </button>
        </nav>

        {/* Zone 3: Primary action + mobile menu trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#111315] hover:bg-[#1E3A8A] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A8A]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span>الشنطة</span>
            <span className="hidden sm:inline">والمشتريات</span>
            <span className="tabular-nums text-xs text-slate-300 border-r border-white/20 pr-2">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'اقفل القائمة' : 'افتح القائمة'}
            className="md:hidden p-2 text-[#111315] hover:bg-[#ECEFF2] rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer (only when toggled) */}
      {mobileMenuOpen && (
        <nav
          aria-label="قائمة الموبايل"
          className="md:hidden border-t border-slate-900/8 bg-white px-4 py-3 flex flex-col divide-y divide-slate-900/6 text-sm font-medium text-[#111315]"
        >
          <a
            href="#collection"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-[#1E3A8A]"
          >
            المجموعة
          </a>
          <a
            href="#atelier"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-[#1E3A8A]"
          >
            حكاية الصنعة
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenWishlist();
            }}
            className="py-3 text-right hover:text-[#1E3A8A] cursor-pointer"
          >
            المفضلة{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenOrderTracker();
            }}
            className="py-3 text-right hover:text-[#1E3A8A] cursor-pointer"
          >
            تابع طلبك
          </button>
        </nav>
      )}
    </header>
  );
}
