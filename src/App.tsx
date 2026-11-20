import { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './data/products';
import {
  CartItem,
  CategoryFilter,
  OrderRecord,
  Product,
  ProductReview,
  ProductVariant,
  SortOption,
} from './types/store';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { AtelierStory } from './components/AtelierStory';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { WishlistModal } from './components/WishlistModal';
import { Footer } from './components/Footer';

const CART_STORAGE_KEY = 'athar_cart_v1';
const ORDERS_STORAGE_KEY = 'athar_orders_v1';
const WISHLIST_STORAGE_KEY = 'athar_wishlist_v1';
const REVIEWS_STORAGE_KEY = 'athar_reviews_v1';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('product');
      if (slug) {
        return PRODUCTS.find((p) => p.slug === slug) || null;
      }
    } catch {
      // Ignore URL parsing errors
    }
    return null;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [startAtCheckout, setStartAtCheckout] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerOrderNumber, setTrackerOrderNumber] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userReviewsByProduct, setUserReviewsByProduct] = useState<
    Record<string, ProductReview[]>
  >(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(
        REVIEWS_STORAGE_KEY,
        JSON.stringify(userReviewsByProduct)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [userReviewsByProduct]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((product) => {
      const matchesCat =
        activeCategory === 'all' || product.category === activeCategory;
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.artisan.toLowerCase().includes(q) ||
        product.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const wishlistProducts = useMemo(
    () => PRODUCTS.filter((product) => wishlistIds.includes(product.id)),
    [wishlistIds]
  );

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [productId, ...prev]
    );
  };

  const handleAddReview = (productId: string, review: ProductReview) => {
    setUserReviewsByProduct((prev) => ({
      ...prev,
      [productId]: [review, ...(prev[productId] || [])],
    }));
  };

  const handleAddToCart = (
    product: Product,
    variant: ProductVariant,
    quantity: number,
    giftNote?: string,
    openCheckout = false
  ) => {
    const cartKey = `${product.id}__${variant.id}__${giftNote || ''}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartKey === cartKey);
      if (existing) {
        return prev.map((i) =>
          i.cartKey === cartKey
            ? {
                ...i,
                quantity: Math.min(product.stockCount, i.quantity + quantity),
              }
            : i
        );
      }
      return [...prev, { cartKey, product, variant, quantity, giftNote }];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1600);

    if (openCheckout) {
      setStartAtCheckout(true);
      setIsCartOpen(true);
    }
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, product.variants[0], 1, undefined, false);
  };

  const handleUpdateQuantity = (cartKey: string, nextQty: number) => {
    if (nextQty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.cartKey === cartKey
          ? { ...i, quantity: Math.min(i.product.stockCount, nextQty) }
          : i
      )
    );
  };

  const handleRemoveItem = (cartKey: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartKey !== cartKey));
  };

  const handleOrderComplete = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setConfirmedOrder(order);
  };

  const handleOpenCart = () => {
    setStartAtCheckout(false);
    setIsCartOpen(true);
  };

  const handleOpenTracker = (orderNumber?: string) => {
    setTrackerOrderNumber(orderNumber || null);
    setIsTrackerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F7F8] text-[#111315]">
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={handleOpenCart}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracker={() => handleOpenTracker()}
      />

      <main className="flex-1">
        <HeroSection onOpenOrderTracker={() => handleOpenTracker()} />

        <ProductCatalog
          products={filteredProducts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onSelectProduct={setSelectedProduct}
          onQuickAdd={handleQuickAdd}
          recentlyAddedId={recentlyAddedId}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onOpenWishlist={() => setIsWishlistOpen(true)}
          userReviewsByProduct={userReviewsByProduct}
        />

        <AtelierStory />
      </main>

      <Footer
        onOpenCart={handleOpenCart}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracker={() => handleOpenTracker()}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={
          selectedProduct ? wishlistIds.includes(selectedProduct.id) : false
        }
        onToggleWishlist={handleToggleWishlist}
        userReviews={
          selectedProduct ? userReviewsByProduct[selectedProduct.id] || [] : []
        }
        onAddReview={handleAddReview}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={setSelectedProduct}
        onQuickAdd={handleQuickAdd}
      />

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          setStartAtCheckout(false);
        }}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onOrderComplete={handleOrderComplete}
        onOpenTracker={(ordNum) => handleOpenTracker(ordNum)}
        startAtCheckout={startAtCheckout}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={(ordNum) => handleOpenTracker(ordNum)}
      />

      <OrderTrackingModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        initialOrderNumber={trackerOrderNumber}
      />
    </div>
  );
}
