import { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Package, Truck } from 'lucide-react';
import { OrderRecord } from '../types/store';
import { formatPrice } from '../utils/formatters';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
  initialOrderNumber?: string | null;
}

export function OrderTrackingModal({
  isOpen,
  onClose,
  orders,
  initialOrderNumber,
}: OrderTrackingModalProps) {
  const [query, setQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialOrderNumber) {
      setQuery(initialOrderNumber);
      const match = orders.find(
        (o) => o.orderNumber.toUpperCase() === initialOrderNumber.toUpperCase()
      );
      setSelectedOrder(match || null);
      setNotFound(!match);
    } else if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
      setQuery(orders[0].orderNumber);
      setNotFound(false);
    }
  }, [isOpen, initialOrderNumber, orders]);

  if (!isOpen) return null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim().replace(/^#/, '').toUpperCase();
    const match = orders.find((o) => o.orderNumber.toUpperCase() === cleaned);
    if (match) {
      setSelectedOrder(match);
      setNotFound(false);
    } else {
      setSelectedOrder(null);
      setNotFound(true);
    }
  };

  const getOrderSteps = (order: OrderRecord) => [
    order.paymentMethod === 'cod'
      ? 'الطلب اتسجل (الدفع كاش عند الاستلام)'
      : 'الدفع الإلكتروني اتأكد بنجاح',
    'بنجهز القطع وبنغلفها تغليف أمان',
    'الطلب خرج مع شركة الشحن وفي الطريق ليك',
    'وصل واتسلم بالسلامة',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl border border-slate-900/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900/8">
          <h2 id="tracker-title" className="font-display text-2xl font-bold text-[#111315]">
            تابع حالة طلبك
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="اقفل نافذة التتبع"
            className="p-2 text-[#475569] hover:text-[#111315] rounded-lg hover:bg-[#ECEFF2] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="اكتب رقم الطلب زي ATH-4821"
                dir="ltr"
                className="w-full pr-10 pl-4 py-2.5 text-sm bg-[#F6F7F8] border border-slate-900/12 rounded-lg text-[#111315] text-right focus:outline-none focus:border-[#1E3A8A]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#111315] hover:bg-[#1E3A8A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              دور
            </button>
          </form>

          {orders.length > 0 && (
            <div>
              <span className="block text-xs text-[#64748B] mb-2">
                طلباتك اللي عملتها من الجهاز ده
              </span>
              <div className="flex flex-wrap gap-2">
                {orders.map((ord) => (
                  <button
                    key={ord.orderNumber}
                    type="button"
                    onClick={() => {
                      setQuery(ord.orderNumber);
                      setSelectedOrder(ord);
                      setNotFound(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border tabular-nums transition-colors cursor-pointer ${
                      selectedOrder?.orderNumber === ord.orderNumber
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-[#F6F7F8] text-[#111315] border-slate-900/10 hover:border-slate-900/25'
                    }`}
                  >
                    #{ord.orderNumber}
                  </button>
                ))}
              </div>
            </div>
          )}

          {notFound && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B]">
              ملقيناش طلب بالرقم ده. اتأكد إنك كاتب الرقم اللي طلعلك في إيصال الطلب صح.
            </div>
          )}

          {!selectedOrder && !notFound && orders.length === 0 && (
            <div className="py-10 text-center bg-[#F6F7F8] rounded-xl border border-slate-900/6">
              <Package className="w-8 h-8 text-[#64748B] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-[#111315] mb-1">
                لسه معملتش أي طلب
              </p>
              <p className="text-xs text-[#475569]">
                أول ما تخلص أي طلب وتأكده هيظهرلك رقمه وكل خطوات الشحن بتاعته هنا على طول.
              </p>
            </div>
          )}

          {selectedOrder && (
            <div className="p-5 rounded-xl bg-[#F6F7F8] border border-slate-900/8 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-900/8 pb-4">
                <div>
                  <span className="text-xs text-[#64748B] block">رقم الطلب</span>
                  <span className="text-base font-bold text-[#111315] tabular-nums">
                    #{selectedOrder.orderNumber}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-xs text-[#64748B] block">
                    {selectedOrder.paymentMethod === 'cod'
                      ? 'المطلوب عند الاستلام'
                      : 'الإجمالي المدفوع'}
                  </span>
                  <span className="text-base font-bold text-[#1E3A8A] tabular-nums">
                    {formatPrice(selectedOrder.total)} ج.م
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {getOrderSteps(selectedOrder).map((label, idx) => {
                  const isDone = idx <= selectedOrder.statusStep;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                      ) : (
                        <Truck className="w-4 h-4 text-[#94A3B8] shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          isDone ? 'font-medium text-[#111315]' : 'text-[#64748B]'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-900/8 text-xs text-[#475569] space-y-1">
                <p>
                  <strong className="text-[#111315]">طريقة الدفع: </strong>
                  {selectedOrder.paymentSummary}
                </p>
                <p>
                  <strong className="text-[#111315]">عنوان التوصيل: </strong>
                  {selectedOrder.shipping.governorate} — {selectedOrder.shipping.address}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
