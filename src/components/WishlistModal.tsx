import { useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types/store';
import { formatPrice } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function WishlistModal({
  isOpen,
  onClose,
  products,
  onRemoveFromWishlist,
  onSelectProduct,
  onQuickAdd,
}: WishlistModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl border border-slate-900/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900/8">
          <div className="flex items-baseline gap-3">
            <h2 id="wishlist-title" className="font-display text-2xl font-bold text-[#111315]">
              قائمة المفضلة
            </h2>
            <span className="text-xs text-[#64748B] tabular-nums">
              {products.length} {products.length === 1 ? 'قطعة محفوظة' : 'قطع محفوظة'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="اقفل المفضلة"
            className="p-2 text-[#475569] hover:text-[#111315] rounded-lg hover:bg-[#ECEFF2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {products.length === 0 ? (
            <div className="py-12 text-center bg-[#F6F7F8] rounded-xl border border-slate-900/6">
              <Heart className="w-9 h-9 text-[#64748B] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-base font-medium text-[#111315] mb-1">
                لسه مفيش حاجة في المفضلة
              </p>
              <p className="text-sm text-[#475569] max-w-sm mx-auto mb-6">
                دوس على علامة القلب على أي قطعة تعجبك عشان تلاقيها هنا بسهولة وقت ما تحب تشتريها.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#111315] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
              >
                تفرج على المجموعة
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-900/8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                      className="w-20 h-20 rounded-lg overflow-hidden bg-[#ECEFF2] border border-slate-900/8 shrink-0 cursor-pointer"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <div className="min-w-0">
                      <span className="text-xs text-[#64748B] block mb-0.5">
                        {product.categoryLabel} · {product.artisan}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(product);
                        }}
                        className="text-right cursor-pointer"
                      >
                        <h3 className="text-base font-semibold text-[#111315] hover:text-[#1E3A8A] transition-colors truncate">
                          {product.name}
                        </h3>
                      </button>
                      <span className="text-sm font-bold text-[#111315] tabular-nums">
                        {formatPrice(product.price)} ج.م
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onQuickAdd(product);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#111315] hover:bg-[#1E3A8A] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.75} />
                      <span>حط في الشنطة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveFromWishlist(product.id)}
                      aria-label={`شيل ${product.name} من المفضلة`}
                      className="p-2 text-[#64748B] hover:text-[#991B1B] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
