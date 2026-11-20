import { Search, Plus, Check, Heart, Star } from 'lucide-react';
import { CATEGORY_TABS } from '../data/products';
import { CategoryFilter, Product, ProductReview, SortOption } from '../types/store';
import { formatPrice } from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  recentlyAddedId: string | null;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onOpenWishlist: () => void;
  userReviewsByProduct: Record<string, ProductReview[]>;
}

export function ProductCatalog({
  products,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onSelectProduct,
  onQuickAdd,
  recentlyAddedId,
  wishlistIds,
  onToggleWishlist,
  onOpenWishlist,
  userReviewsByProduct,
}: ProductCatalogProps) {
  return (
    <section id="collection" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Title + Search & Filter Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-900/10">
          <div>
            <p className="text-xs font-medium text-[#475569] mb-2">
              قطع متاحة للطلب دلوقتي
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#111315]">
              مجموعة الشغل اليدوي
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.75}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="دور باسم القطعة أو الخامة..."
                aria-label="دور في المنتجات"
                className="w-full sm:w-64 pr-10 pl-4 py-2 text-sm bg-white border border-slate-900/12 rounded-lg text-[#111315] placeholder:text-[#64748B] focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="ترتيب المنتجات"
              className="px-3.5 py-2 text-sm bg-white border border-slate-900/12 rounded-lg text-[#111315] focus:outline-none focus:border-[#1E3A8A] cursor-pointer"
            >
              <option value="featured">ترتيب المعرض المختار</option>
              <option value="price-asc">السعر: من الأرخص للأغلى</option>
              <option value="price-desc">السعر: من الأغلى للأرخص</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 sm:py-6">
          <div className="overflow-x-auto pb-1 sm:pb-0">
            <div
              role="tablist"
              aria-label="أقسام الشغل اليدوي"
              className="inline-flex items-center gap-1 p-1 bg-[#ECEFF2] rounded-lg shrink-0"
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => onCategoryChange(tab.id)}
                    className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#111315] shadow-xs'
                        : 'text-[#475569] hover:text-[#111315]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={onOpenWishlist}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  wishlistIds.length > 0
                    ? 'fill-[#1E3A8A] text-[#1E3A8A]'
                    : 'text-[#64748B]'
                }`}
                strokeWidth={1.75}
              />
              <span>المفضلة</span>
              <span className="tabular-nums">({wishlistIds.length})</span>
            </button>
            <span className="text-xs text-[#64748B] tabular-nums whitespace-nowrap shrink-0">
              {products.length} {products.length === 1 ? 'قطعة' : 'قطع'} متاحة
            </span>
          </div>
        </div>

        {/* Uniform Gallery Product Grid */}
        {products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-slate-900/8">
            <p className="text-base font-medium text-[#111315] mb-2">
              مفيش قطع مطابقة للبحث ده دلوقتي
            </p>
            <p className="text-sm text-[#475569] mb-6">
              جرب قسم تاني أو امسح كلمة البحث عشان تشوف كل الشغل.
            </p>
            <button
              type="button"
              onClick={() => {
                onCategoryChange('all');
                onSearchChange('');
              }}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#111315] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
            >
              عرض كل القطع
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const isJustAdded = recentlyAddedId === product.id;
              const isWishlisted = wishlistIds.includes(product.id);
              const allReviews = [
                ...(userReviewsByProduct[product.id] || []),
                ...product.reviews,
              ];
              const avgRating =
                allReviews.length > 0
                  ? (
                      allReviews.reduce((acc, r) => acc + r.rating, 0) /
                      allReviews.length
                    ).toFixed(1)
                  : null;

              return (
                <article
                  key={product.id}
                  className="group flex flex-col bg-white rounded-xl border border-slate-900/8 overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {/* 4:3 Image Frame with Wishlist Toggle */}
                  <div className="relative aspect-[4/3] w-full bg-[#ECEFF2] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full cursor-pointer text-right block focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#1E3A8A]"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-pressed={isWishlisted}
                      aria-label={
                        isWishlisted
                          ? `شيل ${product.name} من المفضلة`
                          : `احفظ ${product.name} في المفضلة`
                      }
                      className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150 cursor-pointer border ${
                        isWishlisted
                          ? 'bg-white text-[#B91C1C] border-slate-900/10 shadow-xs'
                          : 'bg-white/90 text-[#475569] hover:text-[#111315] border-slate-900/10'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isWishlisted ? 'fill-[#B91C1C]' : ''}`}
                        strokeWidth={1.75}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
                      <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
                        <span>{product.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.editionLabel}</span>
                        {avgRating && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-[#111315] font-medium tabular-nums">
                              <Star
                                className="w-3 h-3 fill-[#B45309] text-[#B45309]"
                                strokeWidth={1.5}
                              />
                              <span>{avgRating}</span>
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-right cursor-pointer block w-full"
                      >
                        <h3 className="text-lg font-semibold text-[#111315] group-hover:text-[#1E3A8A] transition-colors mb-1.5">
                          {product.name}
                        </h3>
                      </button>

                      <p className="text-sm text-[#475569] leading-relaxed line-clamp-2">
                        {product.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-900/8 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-base font-bold text-[#111315] tabular-nums">
                          {formatPrice(product.price)} ج.م
                        </span>
                        <span className="block text-[11px] text-[#64748B]">
                          شغل {product.artisan}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="px-3 py-2 text-xs font-medium text-[#111315] hover:text-[#1E3A8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          التفاصيل
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickAdd(product)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                            isJustAdded
                              ? 'bg-[#0F766E] text-white'
                              : 'bg-[#111315] text-white hover:bg-[#1E3A8A]'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" strokeWidth={2} />
                              <span>اتضافت</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                              <span>حط في الشنطة</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
