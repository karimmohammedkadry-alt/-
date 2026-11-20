import { useState, useEffect } from 'react';
import {
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Lock,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { GOVERNORATES } from '../data/products';
import {
  CartItem,
  OrderRecord,
  PaymentMethodId,
  ShippingDetails,
} from '../types/store';
import {
  detectCardNetwork,
  formatCardNumber,
  formatExpiry,
  formatPrice,
  generateOrderNumber,
} from '../utils/formatters';
import { ResilientImage } from './ResilientImage';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmed';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartKey: string, nextQty: number) => void;
  onRemoveItem: (cartKey: string) => void;
  onClearCart: () => void;
  onOrderComplete: (order: OrderRecord) => void;
  onOpenTracker: (orderNumber: string) => void;
  startAtCheckout?: boolean;
}

const FREE_SHIPPING_THRESHOLD = 1500;
const STANDARD_SHIPPING_FEE = 75;

export function CartCheckoutDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderComplete,
  onOpenTracker,
  startAtCheckout = false,
}: CartCheckoutDrawerProps) {
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: '',
    phone: '',
    governorate: 'القاهرة',
    address: '',
    notes: '',
  });
  const [postalCode, setPostalCode] = useState('');
  const [shippingError, setShippingError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [instaPayHandle, setInstaPayHandle] = useState('');
  const [copiedIpa, setCopiedIpa] = useState(false);

  const [walletProvider, setWalletProvider] = useState('Vodafone Cash');
  const [walletPhone, setWalletPhone] = useState('');
  const [walletPin, setWalletPin] = useState('');

  const [codConfirmed, setCodConfirmed] = useState(true);

  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (completedOrder && items.length > 0) {
        setCompletedOrder(null);
      }
      if (startAtCheckout && items.length > 0) {
        setStep('shipping');
      } else if (!completedOrder) {
        setStep('cart');
      }
      setShippingError(null);
      setPaymentError(null);
    }
  }, [isOpen, startAtCheckout]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product.price + item.variant.priceDelta) * item.quantity,
    0
  );
  const discount = appliedPromo === 'ATHAR10' ? Math.round(subtotal * 0.1) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingFee =
    items.length === 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const total = discountedSubtotal + shippingFee;

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - discountedSubtotal
  );

  const cardNetwork = detectCardNetwork(cardNumber);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'ATHAR10') {
      setAppliedPromo('ATHAR10');
      setPromoFeedback('تمام! خصم ١٠٪ اتفعل على طلبك.');
    } else if (!code) {
      setAppliedPromo(null);
      setPromoFeedback(null);
    } else {
      setPromoFeedback('الكود مش شغال. جرب كود ATHAR10.');
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shipping.fullName.trim().length < 3) {
      setShippingError('اكتب اسمك الكامل عشان المندوب يعرف يسلمك الطلب.');
      return;
    }
    const cleanPhone = shipping.phone.replace(/\s+/g, '');
    if (!/^(\+?20|0)?1[0125]\d{8}$/.test(cleanPhone) && cleanPhone.length < 9) {
      setShippingError('اكتب رقم موبايل صح عشان نكلمك وقت التوصيل.');
      return;
    }
    if (shipping.address.trim().length < 8) {
      setShippingError('اكتب العنوان بالتفصيل (اسم الشارع، العمارة، الدور).');
      return;
    }
    setShippingError(null);
    setStep('payment');
  };

  const fillDemoCard = () => {
    setCardNumber('4532 8910 2234 4242');
    setCardHolder(shipping.fullName.trim() || 'KARIM MOHAMED');
    setCardExpiry('09/29');
    setCardCvv('424');
    setPaymentError(null);
  };

  const handleCopyIpa = () => {
    navigator.clipboard?.writeText('athar.craft@instapay');
    setCopiedIpa(true);
    setTimeout(() => setCopiedIpa(false), 2000);
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    let paymentSummary = '';

    if (paymentMethod === 'card') {
      const rawDigits = cardNumber.replace(/\D/g, '');
      if (rawDigits.length < 16) {
        setPaymentError('اكتب رقم البطاقة البنكية كامل (١٦ رقم).');
        return;
      }
      if (cardHolder.trim().length < 3) {
        setPaymentError('اكتب الاسم اللي على البطاقة البنكية.');
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        setPaymentError('اكتب تاريخ الانتهاء صح بصيغة MM/YY.');
        return;
      }
      if (cardCvv.replace(/\D/g, '').length < 3) {
        setPaymentError('اكتب كود الأمان CVV الموجود في ضهر الكارت.');
        return;
      }
      paymentSummary = `بطاقة ${cardNetwork} آخرها ${rawDigits.slice(-4)}`;
    } else if (paymentMethod === 'instapay') {
      if (instaPayHandle.trim().length < 4) {
        setPaymentError('اكتب عنوان إنستا باي أو رقم الموبايل اللي حولت منه.');
        return;
      }
      paymentSummary = `تحويل فوري InstaPay (${instaPayHandle.trim()})`;
    } else if (paymentMethod === 'wallet') {
      if (walletPhone.replace(/\D/g, '').length < 10) {
        setPaymentError('اكتب رقم موبايل المحفظة الإلكترونية صح.');
        return;
      }
      if (walletPin.replace(/\D/g, '').length < 4) {
        setPaymentError('اكتب كود التأكيد المكون من ٤ أرقام.');
        return;
      }
      paymentSummary = `محفظة ${walletProvider} (${walletPhone.trim()})`;
    } else {
      if (!codConfirmed) {
        setPaymentError('علم على تأكيد الدفع كاش عند الاستلام عشان نكمل الطلب.');
        return;
      }
      paymentSummary = 'دفع كاش عند الاستلام';
    }

    setIsProcessing(true);
    setTimeout(() => {
      const addressWithPostal = postalCode.trim()
        ? `${shipping.address.trim()} (الرمز البريدي: ${postalCode.trim()})`
        : shipping.address.trim();

      const newOrder: OrderRecord = {
        orderNumber: generateOrderNumber(),
        createdAt: new Date().toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: items.map((item) => ({
          name: item.product.name,
          variantLabel: item.variant.label,
          quantity: item.quantity,
          unitPrice: item.product.price + item.variant.priceDelta,
          giftNote: item.giftNote,
        })),
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod,
        paymentSummary,
        shipping: { ...shipping, address: addressWithPostal },
        statusStep: 1,
      };

      onOrderComplete(newOrder);
      onClearCart();
      setIsProcessing(false);
      setStep('cart');
      onClose();
    }, 1200);
  };

  const stepLabels: { id: CheckoutStep; label: string }[] = [
    { id: 'cart', label: 'الشنطة' },
    { id: 'shipping', label: 'بيانات التوصيل' },
    { id: 'payment', label: 'طريقة الدفع' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#111315]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="شنطة المشتريات والدفع"
      onClick={() => !isProcessing && onClose()}
    >
      <div
        className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col border-r border-slate-900/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-900/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {(step === 'shipping' || step === 'payment') && !isProcessing && (
              <button
                type="button"
                onClick={() => setStep(step === 'payment' ? 'shipping' : 'cart')}
                aria-label="ارجع للخطوة اللي قبلها"
                className="p-1.5 text-[#475569] hover:text-[#111315] rounded-lg hover:bg-[#ECEFF2] cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-2xl font-bold text-[#111315]">
              {step === 'cart' && 'شنطة المشتريات'}
              {step === 'shipping' && 'بيانات التوصيل'}
              {step === 'payment' && 'اختار طريقة الدفع'}
              {step === 'confirmed' && 'طلبك اتأكد!'}
            </h2>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            aria-label="اقفل الشنطة"
            className="p-2 text-[#475569] hover:text-[#111315] rounded-lg hover:bg-[#ECEFF2] transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Step Indicator */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-3 bg-[#F6F7F8] border-b border-slate-900/8 flex items-center justify-between text-xs">
            {stepLabels.map((s, idx) => {
              const stepOrder = ['cart', 'shipping', 'payment'];
              const currentIdx = stepOrder.indexOf(step);
              const isActive = s.id === step;
              const isPast = idx < currentIdx;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold tabular-nums ${
                      isActive
                        ? 'bg-[#1E3A8A] text-white'
                        : isPast
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-[#DFE4EA] text-[#475569]'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={
                      isActive
                        ? 'font-semibold text-[#111315]'
                        : 'text-[#64748B]'
                    }
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: CART */}
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <p className="font-display text-2xl font-bold text-[#111315] mb-2">
                    الشنطة لسه فاضية
                  </p>
                  <p className="text-sm text-[#475569] max-w-xs mb-6">
                    تفرج على المجموعة واختار قطعة معمولة بالإيد تعجبك.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-[#111315] hover:bg-[#1E3A8A] rounded-lg transition-colors cursor-pointer"
                  >
                    شوف المنتجات
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Free Shipping Meter */}
                  <div className="p-3.5 rounded-xl bg-[#F6F7F8] border border-slate-900/6 text-xs text-[#475569]">
                    {remainingForFreeShipping === 0 ? (
                      <span className="font-medium text-[#0F766E]">
                        حلو أوي — طلبك كده عليه شحن مجاني متأمن بالكامل.
                      </span>
                    ) : (
                      <span>
                        فاضلك{' '}
                        <strong className="text-[#111315] tabular-nums">
                          {formatPrice(remainingForFreeShipping)} ج.م
                        </strong>{' '}
                        بس وتاخد توصيل مجاني لحد باب البيت.
                      </span>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-900/8">
                    {items.map((item) => {
                      const unitPrice = item.product.price + item.variant.priceDelta;
                      return (
                        <div key={item.cartKey} className="py-4 first:pt-0 flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#ECEFF2] shrink-0 border border-slate-900/8">
                            <ResilientImage
                              src={item.product.image}
                              alt={item.product.name}
                              fallbackTitle={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold text-[#111315] truncate">
                                  {item.product.name}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(item.cartKey)}
                                  aria-label={`شيل ${item.product.name}`}
                                  className="text-[#64748B] hover:text-[#991B1B] p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-[#64748B] mt-0.5">
                                {item.variant.label}
                              </p>
                              {item.giftNote && (
                                <p className="text-[11px] text-[#1E3A8A] mt-1">
                                  كارت هدية: «{item.giftNote}»
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="inline-flex items-center border border-slate-900/12 rounded-md bg-[#F6F7F8]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(item.cartKey, item.quantity - 1)
                                  }
                                  aria-label="قلل الكمية"
                                  className="p-1.5 text-[#475569] hover:text-[#111315] cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-7 text-center text-xs font-semibold tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(item.cartKey, item.quantity + 1)
                                  }
                                  aria-label="زود الكمية"
                                  className="p-1.5 text-[#475569] hover:text-[#111315] cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="text-sm font-bold text-[#111315] tabular-nums">
                                {formatPrice(unitPrice * item.quantity)} ج.م
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo Code */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <label className="block text-xs font-medium text-[#475569] mb-1.5">
                      عندك كود خصم؟ (جرب: ATHAR10)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="ATHAR10"
                        dir="ltr"
                        className="flex-1 px-3 py-2 text-xs bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-right focus:outline-none focus:border-[#1E3A8A]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-[#111315] bg-[#ECEFF2] hover:bg-[#DFE4EA] rounded-lg transition-colors cursor-pointer"
                      >
                        تفعيل
                      </button>
                    </div>
                    {promoFeedback && (
                      <p
                        className={`text-xs mt-1.5 ${
                          appliedPromo ? 'text-[#0F766E]' : 'text-[#991B1B]'
                        }`}
                      >
                        {promoFeedback}
                      </p>
                    )}
                  </form>
                </div>
              )}
            </>
          )}

          {/* STEP 2: SHIPPING DETAILS */}
          {step === 'shipping' && (
            <form id="shipping-form" onSubmit={handleShippingSubmit} className="space-y-4">
              {shippingError && (
                <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                  {shippingError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                  الاسم بالكامل
                </label>
                <input
                  type="text"
                  required
                  value={shipping.fullName}
                  onChange={(e) =>
                    setShipping({ ...shipping, fullName: e.target.value })
                  }
                  placeholder="مثلاً: كريم محمد علي"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                    رقم الموبايل
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    placeholder="01012345678"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-right tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                    المحافظة / المنطقة
                  </label>
                  <select
                    value={shipping.governorate}
                    onChange={(e) =>
                      setShipping({ ...shipping, governorate: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                  >
                    {GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                  العنوان بالتفصيل
                </label>
                <textarea
                  rows={2}
                  required
                  value={shipping.address}
                  onChange={(e) =>
                    setShipping({ ...shipping, address: e.target.value })
                  }
                  placeholder="اسم الشارع، رقم العمارة، الدور والشقة، أو علامة قريبة..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                    الرمز البريدي (اختياري)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="11511"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-right tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                    ملاحظات للمندوب (اختياري)
                  </label>
                  <input
                    type="text"
                    value={shipping.notes || ''}
                    onChange={(e) =>
                      setShipping({ ...shipping, notes: e.target.value })
                    }
                    placeholder="مثلاً: كلمني قبل ما توصل بنص ساعة"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: ELECTRONIC + CASH ON DELIVERY PAYMENT */}
          {step === 'payment' && (
            <form id="payment-form" onSubmit={handleCompletePayment} className="space-y-5">
              {/* Payment Method Selector */}
              <div>
                <span className="block text-xs font-semibold text-[#111315] mb-2.5">
                  تحب تدفع إزاي؟
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('card');
                      setPaymentError(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]'
                        : 'border-slate-900/12 bg-white text-[#475569] hover:border-slate-900/25'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="whitespace-nowrap">بطاقة بنكية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('instapay');
                      setPaymentError(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'instapay'
                        ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]'
                        : 'border-slate-900/12 bg-white text-[#475569] hover:border-slate-900/25'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="whitespace-nowrap">InstaPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('wallet');
                      setPaymentError(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'wallet'
                        ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]'
                        : 'border-slate-900/12 bg-white text-[#475569] hover:border-slate-900/25'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="whitespace-nowrap">محفظة موبايل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cod');
                      setPaymentError(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#1E3A8A] bg-[#1E3A8A]/5 text-[#1E3A8A]'
                        : 'border-slate-900/12 bg-white text-[#475569] hover:border-slate-900/25'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="whitespace-nowrap">كاش عند الاستلام</span>
                  </button>
                </div>
              </div>

              {paymentError && (
                <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                  {paymentError}
                </div>
              )}

              {/* Option 1: Bank Card with Live Preview */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {/* Live Architectural Card Preview */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-[#111315] to-[#1E3A8A] text-white space-y-5 shadow-md">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>دفع أونلاين آمن</span>
                      </span>
                      <span className="font-semibold tracking-wider text-white">
                        {cardNetwork}
                      </span>
                    </div>

                    <div
                      dir="ltr"
                      className="text-lg sm:text-xl font-medium tracking-[0.18em] tabular-nums"
                    >
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-400">
                          الاسم على البطاقة
                        </span>
                        <span className="font-medium uppercase tracking-wide">
                          {cardHolder || 'CARDHOLDER NAME'}
                        </span>
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] text-slate-400">
                          الصلاحية
                        </span>
                        <span className="font-medium tabular-nums">
                          {cardExpiry || 'MM/YY'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">
                      شغال مع فيزا، ماستركارد، وميزة
                    </span>
                    <button
                      type="button"
                      onClick={fillDemoCard}
                      className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                      املى بيانات كارت للتجربة
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                      رقم الكارت
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      placeholder="4532 8910 2234 4242"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-left tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                      الاسم المكتوب على الكارت
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="زي ما هو مكتوب على البطاقة"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                        تاريخ الانتهاء
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={cardExpiry}
                        onChange={(e) =>
                          setCardExpiry(formatExpiry(e.target.value))
                        }
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-center tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                        كود الأمان (CVV)
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        dir="ltr"
                        value={cardCvv}
                        onChange={(e) =>
                          setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                        }
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-center tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Option 2: InstaPay */}
              {paymentMethod === 'instapay' && (
                <div className="space-y-4 p-4 rounded-xl bg-[#F6F7F8] border border-slate-900/8">
                  <div>
                    <p className="text-xs text-[#475569] mb-2">
                      حول مبلغ ({formatPrice(total)} ج.م) على طول لعنوان إنستا باي الخاص بدار
                      أثر:
                    </p>
                    <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-lg border border-slate-900/10">
                      <span
                        dir="ltr"
                        className="text-sm font-semibold text-[#111315]"
                      >
                        athar.craft@instapay
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyIpa}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1E3A8A] bg-[#1E3A8A]/8 rounded-md cursor-pointer"
                      >
                        {copiedIpa ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>اتنسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>انسخ العنوان</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                      عنوان InstaPay بتاعك أو رقم الموبايل اللي حولت منه
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={instaPayHandle}
                      onChange={(e) => setInstaPayHandle(e.target.value)}
                      placeholder="username@instapay"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-900/12 rounded-lg text-right focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>
              )}

              {/* Option 3: Mobile E-Wallet */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4 p-4 rounded-xl bg-[#F6F7F8] border border-slate-900/8">
                  <div>
                    <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                      نوع المحفظة
                    </label>
                    <select
                      value={walletProvider}
                      onChange={(e) => setWalletProvider(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-900/12 rounded-lg focus:outline-none focus:border-[#1E3A8A]"
                    >
                      <option value="Vodafone Cash">فودافون كاش (Vodafone Cash)</option>
                      <option value="Orange Cash">أورنج كاش (Orange Cash)</option>
                      <option value="Etisalat Cash">اتصالات كاش (e& money)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                      رقم موبايل المحفظة
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-900/12 rounded-lg text-right tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111315] mb-1.5">
                      الرقم السري للمحفظة / كود التأكيد (٤ أرقام)
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      dir="ltr"
                      value={walletPin}
                      onChange={(e) =>
                        setWalletPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      placeholder="••••"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-900/12 rounded-lg text-center tabular-nums focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>
              )}

              {/* Option 4: Cash on Delivery (الدفع النقدي عند الاستلام) */}
              {paymentMethod === 'cod' && (
                <div className="space-y-4 p-4 rounded-xl bg-[#F6F7F8] border border-slate-900/8">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-900/8">
                    <span className="text-xs text-[#475569]">
                      المبلغ المطلوب كاش وقت الاستلام
                    </span>
                    <span className="text-base font-bold text-[#1E3A8A] tabular-nums">
                      {formatPrice(total)} ج.م
                    </span>
                  </div>

                  <div className="text-xs text-[#475569] space-y-1.5 leading-relaxed">
                    <p>
                      <strong className="text-[#111315]">المستلم: </strong>
                      {shipping.fullName} — <span dir="ltr">{shipping.phone}</span>
                    </p>
                    <p>
                      <strong className="text-[#111315]">العنوان: </strong>
                      {shipping.governorate}، {shipping.address}
                      {postalCode.trim() ? ` (${postalCode.trim()})` : ''}
                    </p>
                    <p className="text-[#0F766E]">
                      الشحن مجاني للطلبات فوق ١,٥٠٠ ج.م، وتقدر تعاين الشغل من بره التغليف وقت
                      الاستلام.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-2.5 text-xs font-medium text-[#111315] pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codConfirmed}
                      onChange={(e) => setCodConfirmed(e.target.checked)}
                      className="w-4 h-4 accent-[#1E3A8A] rounded cursor-pointer"
                    />
                    <span>أيوة، عايز أدفع المبلغ كاش للمندوب لما الطلب يوصل</span>
                  </label>
                </div>
              )}
            </form>
          )}

          {/* STEP 4: ORDER CONFIRMED RECEIPT */}
          {step === 'confirmed' && completedOrder && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <CheckCircle2
                  className="w-12 h-12 text-[#0F766E] mx-auto"
                  strokeWidth={1.5}
                />
                <h3 className="font-display text-2xl font-bold text-[#111315]">
                  تسلم إيدك! طلبك اتسجل بنجاح
                </h3>
                <p className="text-sm text-[#475569]">
                  مبسوطين باختيارك من دار أثر. دلوقتي بنجهزلك القطع وبنغلفها بأمان عشان توصلك
                  سليمة.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F6F7F8] border border-slate-900/8 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900/8">
                  <span className="text-[#64748B]">رقم الطلب</span>
                  <span className="text-sm font-bold text-[#111315] tabular-nums">
                    #{completedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">طريقة الدفع</span>
                  <span className="font-medium text-[#111315]">
                    {completedOrder.paymentSummary}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">التوصيل على</span>
                  <span className="font-medium text-[#111315]">
                    {completedOrder.shipping.governorate}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-900/8 text-sm font-bold text-[#111315]">
                  <span>
                    {completedOrder.paymentMethod === 'cod'
                      ? 'المبلغ المطلوب عند الاستلام'
                      : 'المبلغ المدفوع'}
                  </span>
                  <span className="tabular-nums text-[#1E3A8A]">
                    {formatPrice(completedOrder.total)} ج.م
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#111315]">
                  القطع اللي طلبتها
                </span>
                {completedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs text-[#475569]"
                  >
                    <span>
                      {item.name} ({item.variantLabel}) × {item.quantity}
                    </span>
                    <span className="tabular-nums font-medium text-[#111315]">
                      {formatPrice(item.unitPrice * item.quantity)} ج.م
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTracker(completedOrder.orderNumber);
                  }}
                  className="px-4 py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg transition-colors cursor-pointer"
                >
                  تابع حالة الطلب
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 text-sm font-semibold text-[#111315] bg-[#ECEFF2] hover:bg-[#DFE4EA] rounded-lg transition-colors cursor-pointer"
                >
                  ارجع للمعرض
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Sticky Footer Totals & Primary CTA */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="p-6 border-t border-slate-900/10 bg-white space-y-4">
            <div className="space-y-1.5 text-xs text-[#475569]">
              <div className="flex justify-between">
                <span>سعر القطع</span>
                <span className="tabular-nums font-medium text-[#111315]">
                  {formatPrice(subtotal)} ج.م
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#0F766E]">
                  <span>خصم الكود (ATHAR10)</span>
                  <span className="tabular-nums font-medium">
                    -{formatPrice(discount)} ج.م
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>الشحن المتأمن</span>
                <span className="tabular-nums font-medium text-[#111315]">
                  {shippingFee === 0 ? 'مجاني' : `${formatPrice(shippingFee)} ج.م`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-900/8 text-base font-bold text-[#111315]">
                <span>الإجمالي</span>
                <span className="tabular-nums">{formatPrice(total)} ج.م</span>
              </div>
            </div>

            {step === 'cart' && (
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="w-full py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg transition-colors cursor-pointer"
              >
                كمل لبيانات التوصيل
              </button>
            )}

            {step === 'shipping' && (
              <button
                type="submit"
                form="shipping-form"
                className="w-full py-3 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg transition-colors cursor-pointer"
              >
                كمل لاختيار طريقة الدفع
              </button>
            )}

            {step === 'payment' && (
              <button
                type="submit"
                form="payment-form"
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#111315] hover:bg-[#1E3A8A] rounded-lg transition-colors disabled:opacity-70 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {paymentMethod === 'cod'
                        ? 'بنسجل طلبك دلوقتي...'
                        : 'بنأكد عملية الدفع...'}
                    </span>
                  </>
                ) : (
                  <>
                    {paymentMethod === 'cod' ? (
                      <Banknote className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>
                      {paymentMethod === 'cod'
                        ? `أكد الطلب — الدفع كاش (${formatPrice(total)} ج.م)`
                        : `أكد وادفع ${formatPrice(total)} ج.م`}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
