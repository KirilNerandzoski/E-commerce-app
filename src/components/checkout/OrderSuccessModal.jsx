import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice } from "../../utils/formatters";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Package,
  Clock,
  Truck,
  ArrowRight,
  Printer,
  Sparkles,
} from "lucide-react";

export const OrderSuccessModal = ({ order, onClose }) => {
  const { navigateTo, currency } = useApp();

  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f97316", "#f59e0b", "#10b981", "#3b82f6"],
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Нарачката е успешно примена
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Ви благодариме за купувањето!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Број на нарачка: <strong className="text-white underline">{order.id}</strong> • Следење: {order.trackingNumber}
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tracking Status Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" />
              Статус на достава: {order.deliveryMethod}
            </h4>
            <div className="space-y-3">
              {order.timeline?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 ${
                      step.done ? "bg-emerald-500 font-bold" : "bg-slate-300"
                    }`}
                  >
                    {step.done ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={step.done ? "font-bold text-slate-800" : "text-slate-500"}>
                      {step.step}
                    </span>
                    <span className="text-[11px] text-slate-400">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Нарачани производи ({order.items.length}):
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100"
                    />
                    <div>
                      <span className="font-bold text-slate-800 line-clamp-1">{item.title}</span>
                      <span className="text-slate-400 text-[11px]">Количина: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Метод на плаќање:</span>
              <span className="font-bold text-slate-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Адреса за испорака:</span>
              <span className="font-bold text-slate-800">{order.address}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Достава:</span>
              <span className="font-bold text-slate-800">
                {order.shipping === 0 ? "Бесплатна" : formatPrice(order.shipping, currency)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
              <span>Вкупен износ:</span>
              <span className="text-orange-600">{formatPrice(order.total, currency)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                navigateTo("profile", "orders");
              }}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" /> Види во Мои Нарачки
            </button>
            <button
              onClick={() => {
                onClose();
                navigateTo("catalog");
              }}
              className="py-3 px-5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Продолжи со пазарење
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
