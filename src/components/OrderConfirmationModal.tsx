import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  X,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { OrderRecord } from '../types/store';
import { formatPrice } from '../utils/formatters';

interface OrderConfirmationModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export function OrderConfirmationModal({
  order,
  onClose,
  onTrackOrder,
}: OrderConfirmationModalProps) {
  const [copiedOrderNum, setCopiedOrderNum] = useState(false);

  useEffect(() => {
    setCopiedOrderNum(false);
  }, [order]);

  useEffect(() => {
    if (!order) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [order, onClose]);

  if (!order) return null;

  const handleCopyOrderNumber = async () => {
    const code = `#${order.orderNumber}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const temp = document.createElement('input');
        temp.value = code;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      setCopiedOrderNum(true);
      setTimeout(() => setCopiedOrderNum(false), 2200);
    } catch {
      setCopiedOrderNum(true);
      setTimeout(() => setCopiedOrderNum(false), 2200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#111315]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-thankyou-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-slate-900/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-3.5 bg-white/95 backdrop-blur-xs border-b border-slate-900/8">
          <span className="text-xs font-medium text-[#0F766E]">
            {order.paymentMethod === 'cod'
              ? 'تم تسجيل طلبك بنجاح'
              : 'تم تأكيد الدفع الإلكتروني بنجاح'}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="اقفل رسالة التأكيد"
            className="p-2 text-[#475569] hover:text-[#111315] rounded-lg hover:bg-[#ECEFF2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Celebratory Thank You Header */}
          <div className="text-center space-y-2.5">
            <div className="w-14 h-14 rounded-full bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#0F766E]" strokeWidth={1.75} />
            </div>
            <h2
              id="order-thankyou-title"
              className="font-display text-2xl sm:text-3xl font-bold text-[#111315]"
            >
              شكراً لثقتك في دار أثر يا {order.shipping.fullName.split(' ')[0]}!
            </h2>
            <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
              طلبك اتأكد خلاص، والحرفيين وفريق التغليف عندنا بيجهزوه دلوقتي بأعلى أمان عشان
              يوصلك لحد باب البيت.
            </p>
          </div>

          {/* Highlighted Order Tracking Number Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#111315] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-xs text-slate-300 mb-1">
                رقم تتبع الطلب الخاص بيك
              </span>
              <div className="flex items-baseline gap-3">
                <span
                  dir="ltr"
                  className="text-xl sm:text-2xl font-bold tracking-wider tabular-nums"
                >
                  #{order.orderNumber}
                </span>
                <span className="text-xs text-slate-400">{order.createdAt}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-white text-[#111315] hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedOrderNum ? (
                <>
                  <Check className="w-4 h-4 text-[#0F766E]" strokeWidth={2} />
                  <span>اتنسخ الرقم</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" strokeWidth={1.75} />
                  <span>انسخ رقم التتبع</span>
                </>
              )}
            </button>
          </div>

          {/* Delivery & Payment Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F6F7F8] border border-slate-900/8 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#111315] font-semibold">
                <MapPin className="w-4 h-4 text-[#1E3A8A] shrink-0" strokeWidth={1.75} />
                <span>عنوان التوصيل</span>
              </div>
              <p className="text-[#111315] font-medium">{order.shipping.fullName}</p>
              <p className="text-[#475569] leading-relaxed">
                {order.shipping.governorate} — {order.shipping.address}
              </p>
              <p className="text-[#475569] tabular-nums" dir="ltr">
                {order.shipping.phone}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F7F8] border border-slate-900/8 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#111315] font-semibold">
                {order.paymentMethod === 'cod' ? (
                  <Banknote className="w-4 h-4 text-[#1E3A8A] shrink-0" strokeWidth={1.75} />
                ) : (
                  <CreditCard className="w-4 h-4 text-[#1E3A8A] shrink-0" strokeWidth={1.75} />
                )}
                <span>الدفع والتوصيل المتوقع</span>
              </div>
              <p className="text-[#111315] font-medium">{order.paymentSummary}</p>
              <div className="flex items-center gap-1.5 text-[#0F766E] font-medium pt-1">
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>يوصل خلال ٢ إلى ٤ أيام عمل</span>
              </div>
            </div>
          </div>

          {/* Itemized Order Summary */}
          <div className="rounded-xl border border-slate-900/10 overflow-hidden">
            <div className="px-4 py-3 bg-[#F6F7F8] border-b border-slate-900/8 text-xs font-semibold text-[#111315]">
              ملخص القطع اللي طلبتها
            </div>

            <div className="divide-y divide-slate-900/8 px-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3.5 flex items-start justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#111315]">
                      {item.name}{' '}
                      <span className="text-[#64748B] font-normal tabular-nums">
                        × {item.quantity}
                      </span>
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">{item.variantLabel}</p>
                    {item.giftNote && (
                      <p className="text-xs text-[#1E3A8A] mt-1">
                        كارت إهداء: «{item.giftNote}»
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-[#111315] tabular-nums whitespace-nowrap shrink-0">
                    {formatPrice(item.unitPrice * item.quantity)} ج.م
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#F6F7F8] border-t border-slate-900/8 space-y-1.5 text-xs text-[#475569]">
              <div className="flex justify-between">
                <span>سعر القطع</span>
                <span className="tabular-nums font-medium text-[#111315]">
                  {formatPrice(order.subtotal)} ج.م
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#0F766E]">
                  <span>الخصم المطبق</span>
                  <span className="tabular-nums font-medium">
                    -{formatPrice(order.discount)} ج.م
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>الشحن الفني المؤمن</span>
                <span className="tabular-nums font-medium text-[#111315]">
                  {order.shippingFee === 0
                    ? 'مجاني'
                    : `${formatPrice(order.shippingFee)} ج.م`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-900/8 text-sm sm:text-base font-bold text-[#111315]">
                <span>
                  {order.paymentMethod === 'cod'
                    ? 'الإجمالي المطلوب عند الاستلام'
                    : 'الإجمالي المدفوع'}
                </span>
                <span className="tabular-nums text-[#1E3A8A]">
                  {formatPrice(order.total)} ج.م
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                const orderNum = order.orderNumber;
                onClose();
                onTrackOrder(orderNum);
              }}
              className="w-full py-3 px-5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg transition-colors cursor-pointer"
            >
              تابع حالة طلبك دلوقتي
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-5 text-sm font-semibold text-[#111315] bg-[#ECEFF2] hover:bg-[#DFE4EA] rounded-lg transition-colors cursor-pointer"
            >
              كمل تفرج في المعرض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
