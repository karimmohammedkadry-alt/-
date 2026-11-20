import { useState, useEffect } from 'react';
import {
  X,
  Minus,
  Plus,
  CreditCard,
  ShoppingBag,
  Heart,
  Star,
  Share2,
  Check,
} from 'lucide-react';
import { Product, ProductReview, ProductVariant } from '../types/store';
import { formatPrice } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    variant: ProductVariant,
    quantity: number,
    giftNote?: string,
    openCheckout?: boolean
  ) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  userReviews: ProductReview[];
  onAddReview: (productId: string, review: ProductReview) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  userReviews,
  onAddReview,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerLocation, setReviewerLocation] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
      setIncludeGiftNote(false);
      setGiftNote('');
      setLinkCopied(false);
      setShowReviewForm(false);
      setNewRating(5);
      setReviewerName('');
      setReviewerLocation('');
      setReviewComment('');
      setReviewError(null);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product || !selectedVariant) return null;

  const activePrice = product.price + selectedVariant.priceDelta;
  const allReviews = [...userReviews, ...product.reviews];
  const averageRating =
    allReviews.length > 0
      ? (
          allReviews.reduce((acc, item) => acc + item.rating, 0) /
          allReviews.length
        ).toFixed(1)
      : '5.0';

  const handleAction = (openCheckoutImmediately: boolean) => {
    onAddToCart(
      product,
      selectedVariant,
      quantity,
      includeGiftNote && giftNote.trim() ? giftNote.trim() : undefined,
      openCheckoutImmediately
    );
    onClose();
  };

  const handleShareProduct = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.slug}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2200);
    } catch {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2200);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewerName.trim().length < 2) {
      setReviewError('اكتب اسمك الأول عشان يظهر مع التقييم.');
      return;
    }
    if (reviewComment.trim().length < 8) {
      setReviewError('اكتب رأيك في القطعة (٨ حروف على الأقل).');
      return;
    }

    const review: ProductReview = {
      id: `user-rev-${Date.now()}`,
      reviewerName: reviewerName.trim(),
      reviewerLocation: reviewerLocation.trim() || 'عميل أثر',
      rating: newRating,
      date: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      comment: reviewComment.trim(),
    };

    onAddReview(product.id, review);
    setShowReviewForm(false);
    setReviewerName('');
    setReviewerLocation('');
    setReviewComment('');
    setNewRating(5);
    setReviewError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-[#111315]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-slate-900/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close, Share & Wishlist Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-4 sm:px-6 py-3.5 sm:py-4 bg-white/95 backdrop-blur-xs border-b border-slate-900/8">
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#64748B] truncate">
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{product.editionLabel}</span>
          </div>
          <span className="sm:hidden text-xs text-[#64748B] truncate">
            {product.categoryLabel}
          </span>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShareProduct}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                linkCopied
                  ? 'border-[#0F766E]/30 bg-[#F0FDFA] text-[#0F766E]'
                  : 'border-slate-900/12 bg-white text-[#475569] hover:text-[#111315]'
              }`}
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>تم نسخ الرابط</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>مشاركة المنتج</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-pressed={isWishlisted}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                isWishlisted
                  ? 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                  : 'border-slate-900/12 bg-white text-[#475569] hover:text-[#111315]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#B91C1C]' : ''}`}
                strokeWidth={1.75}
              />
              <span className="hidden xs:inline sm:inline">
                {isWishlisted ? 'في المفضلة' : 'للمفضلة'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="اقفل التفاصيل"
              className="p-2 text-[#475569] hover:text-[#111315] rounded-lg hover:bg-[#ECEFF2] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10">
          {/* Primary Product Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Image Column */}
            <div className="md:col-span-6">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#ECEFF2] border border-slate-900/8">
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  fallbackTitle={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Craft Dossier Specs */}
              <div className="mt-6 grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F6F7F8] border border-slate-900/6 text-xs">
                <div>
                  <span className="block text-[#64748B] mb-0.5">شغل الفنان</span>
                  <span className="font-medium text-[#111315]">{product.artisan}</span>
                </div>
                <div>
                  <span className="block text-[#64748B] mb-0.5">اتعمل فين</span>
                  <span className="font-medium text-[#111315]">{product.origin}</span>
                </div>
                <div>
                  <span className="block text-[#64748B] mb-0.5">المقاس والسعة</span>
                  <span className="font-medium text-[#111315]">{product.dimensions}</span>
                </div>
                <div>
                  <span className="block text-[#64748B] mb-0.5">وقت التنفيذ</span>
                  <span className="font-medium text-[#111315]">{product.craftTime}</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module */}
            <div className="md:col-span-6 flex flex-col justify-between gap-6">
              <div>
                <h2
                  id="pdp-title"
                  className="font-display text-2xl lg:text-3xl font-bold text-[#111315] mb-2"
                >
                  {product.name}
                </h2>

                <div className="flex flex-wrap items-baseline gap-3 mb-4">
                  <span className="text-2xl font-bold text-[#111315] tabular-nums">
                    {formatPrice(activePrice)} ج.م
                  </span>
                  <span className="text-xs text-[#0F766E] font-medium">
                    موجود منه ({product.stockCount} قطع بس من الإصدار ده)
                  </span>
                </div>

                <p className="text-sm leading-[1.75] text-[#475569] mb-4">
                  {product.story}
                </p>

                <p className="text-xs text-[#475569] pb-5 border-b border-slate-900/8">
                  <strong className="font-semibold text-[#111315]">الخامة: </strong>
                  {product.material}
                </p>

                {/* Variant Selector */}
                <div className="pt-5">
                  <span className="block text-xs font-semibold text-[#111315] mb-2.5">
                    اختار الشكل أو المقاس
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#111315] font-medium'
                              : 'border-slate-900/12 bg-white text-[#475569] hover:border-slate-900/25'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {variant.swatchHex && (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                                style={{ backgroundColor: variant.swatchHex }}
                              />
                            )}
                            <span>{variant.label}</span>
                          </span>
                          <span className="text-xs tabular-nums text-[#475569]">
                            {variant.priceDelta > 0
                              ? `+${formatPrice(variant.priceDelta)} ج.م`
                              : 'السعر الأساسي'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Handwritten Gift Note */}
                <div className="pt-4">
                  <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#111315] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeGiftNote}
                      onChange={(e) => setIncludeGiftNote(e.target.checked)}
                      className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer"
                    />
                    <span>أضف كارت هدية مكتوب بالإيد (ببلاش)</span>
                  </label>

                  {includeGiftNote && (
                    <textarea
                      rows={2}
                      maxLength={140}
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="اكتب كلمتين حلوين وهنكتبهم على ورق قطني مع الهدية..."
                      className="mt-2.5 w-full px-3.5 py-2.5 text-xs bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-[#111315] placeholder:text-[#64748B] focus:outline-none focus:border-[#1E3A8A]"
                    />
                  )}
                </div>
              </div>

              {/* Quantity & Primary Purchase CTAs */}
              <div className="pt-4 border-t border-slate-900/8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111315]">الكمية</span>
                  <div className="inline-flex items-center border border-slate-900/12 rounded-lg bg-[#F6F7F8]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="قلل الكمية"
                      className="p-2 text-[#475569] hover:text-[#111315] cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums text-[#111315]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stockCount, q + 1))
                      }
                      aria-label="زود الكمية"
                      className="p-2 text-[#475569] hover:text-[#111315] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAction(false)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#111315] bg-[#ECEFF2] hover:bg-[#DFE4EA] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
                    <span>حط في الشنطة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" strokeWidth={1.75} />
                    <span>اشتري واطلب دلوقتي</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-slate-900/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#111315] mb-1">
                  تقييمات العملاء
                </h3>
                <div className="flex items-center gap-2.5 text-sm">
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`التقييم العام ${averageRating} من ٥`}
                  >
                    {[1, 2, 3, 4, 5].map((starNum) => (
                      <Star
                        key={starNum}
                        className={`w-4 h-4 ${
                          starNum <= Math.round(Number(averageRating))
                            ? 'fill-[#B45309] text-[#B45309]'
                            : 'text-[#CBD5E1]'
                        }`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#111315] tabular-nums">
                    {averageRating}
                  </span>
                  <span className="text-xs text-[#64748B] tabular-nums">
                    · من {allReviews.length} {allReviews.length === 1 ? 'رأي' : 'آراء'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm((prev) => !prev)}
                className="px-4 py-2 text-xs font-semibold text-[#111315] bg-[#ECEFF2] hover:bg-[#DFE4EA] rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                {showReviewForm ? 'بلاش دلوقتي' : 'قولنا رأيك في القطعة'}
              </button>
            </div>

            {/* Interactive Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-8 p-5 rounded-xl bg-[#F6F7F8] border border-slate-900/8 space-y-4"
              >
                {reviewError && (
                  <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                    {reviewError}
                  </div>
                )}

                <div>
                  <span className="block text-xs font-semibold text-[#111315] mb-2">
                    تقييمك لجودة الشغل
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starNum) => (
                      <button
                        key={starNum}
                        type="button"
                        onClick={() => setNewRating(starNum)}
                        aria-label={`${starNum} من ٥ نجوم`}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            starNum <= newRating
                              ? 'fill-[#B45309] text-[#B45309]'
                              : 'text-[#94A3B8]'
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#111315] mb-1">
                      اسمك
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="مثلاً: عمر عادل"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#111315] mb-1">
                      المنطقة / المحافظة (اختياري)
                    </label>
                    <input
                      type="text"
                      value={reviewerLocation}
                      onChange={(e) => setReviewerLocation(e.target.value)}
                      placeholder="مثلاً: المعادي، القاهرة"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111315] mb-1">
                    إيه رأيك في القطعة؟
                  </label>
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="احكيلنا عن الخامة والتغليف وشكلها في بيتك..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg transition-colors cursor-pointer"
                >
                  انشر التقييم
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="divide-y divide-slate-900/8">
              {allReviews.map((review) => (
                <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#111315] text-sm">
                        {review.reviewerName}
                      </span>
                      <span aria-hidden="true" className="text-[#94A3B8]">
                        ·
                      </span>
                      <span className="text-[#64748B]">{review.reviewerLocation}</span>
                      <span aria-hidden="true" className="text-[#94A3B8]">
                        ·
                      </span>
                      <span className="text-[#64748B]">{review.date}</span>
                    </div>

                    <div
                      className="flex items-center gap-0.5"
                      aria-label={`${review.rating} من ٥ نجوم`}
                    >
                      {[1, 2, 3, 4, 5].map((starNum) => (
                        <Star
                          key={starNum}
                          className={`w-3.5 h-3.5 ${
                            starNum <= review.rating
                              ? 'fill-[#B45309] text-[#B45309]'
                              : 'text-[#CBD5E1]'
                          }`}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#475569]">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
