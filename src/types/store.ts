export type CategoryFilter =
  | 'all'
  | 'ceramics'
  | 'textiles'
  | 'woodwork'
  | 'metal_glass';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
  swatchHex?: string;
}

export interface ProductReview {
  id: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Exclude<CategoryFilter, 'all'>;
  categoryLabel: string;
  editionLabel: string;
  price: number;
  artisan: string;
  origin: string;
  dimensions: string;
  craftTime: string;
  material: string;
  shortDescription: string;
  story: string;
  image: string;
  inStock: boolean;
  stockCount: number;
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export interface CartItem {
  cartKey: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  giftNote?: string;
}

export type PaymentMethodId = 'card' | 'instapay' | 'wallet' | 'cod';

export interface ShippingDetails {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  notes?: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  items: {
    name: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
    giftNote?: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethodId;
  paymentSummary: string;
  shipping: ShippingDetails;
  statusStep: 0 | 1 | 2 | 3;
}
