import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice } from "../../utils/formatters";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Truck,
  ArrowRight,
  Home,
  X,
} from "lucide-react";

export const OrderSuccessModal = ({ order, onClose }) => {
  const { navigateTo, currency } = useApp();

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E26D46", "#D49A55", "#FAF6F0", "#3B7A57"],
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 text-[#FAF6F0]">
      <div
        className="bg-[#1D1A17] border border-[#2A2520] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-[#2A5C43] to-[#1E4331] p-6 sm:p-8 text-white text-center relative overflow-hidden border-b border-[#2A2520]">
          <button
            onClick={() => {
              onClose();
              navigateTo("home");
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95 cursor-pointer"
            title="Затвори и врати се на почетна"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Нарачката е успешно примена
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1 text-white">
            Ви благодариме за купувањето!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Број на нарачка: <strong className="text-white underline">{order.id}</strong> • Следење: {order.trackingNumber}
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tracking Status Card */}
          <div className="p-4 rounded-2xl bg-[#25211D] border border-[#2A2520]">
            <h4 className="text-xs font-bold text-[#D49A55] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#E26D46]" />
              Статус на достава: {order.deliveryMethod}
            </h4>
            <div className="space-y-3">
              {order.timeline?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[#141210] shrink-0 font-black ${
                      step.done ? "bg-emerald-400" : "bg-[#38322B] text-[#A8A095]"
                    }`}
                  >
                    {step.done ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={step.done ? "font-bold text-[#FAF6F0]" : "text-[#A8A095]"}>
                      {step.step}
                    </span>
                    <span className="text-[11px] text-[#8C8377]">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items */}
          <div>
            <h4 className="text-xs font-bold text-[#FAF6F0] uppercase tracking-wider mb-2.5">
              Нарачани производи ({order.items.length}):
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-[#2A2520]">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-contain rounded-lg bg-[#FAF7F2] p-1 border border-[#E6DFD5]"
                    />
                    <div>
                      <span className="font-bold text-[#FAF6F0] line-clamp-1">{item.title}</span>
                      <span className="text-[#8C8377] text-[11px]">Количина: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-[#F5BA58] shrink-0">
                    {formatPrice(item.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="pt-4 border-t border-[#2A2520] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#A8A095]">
              <span>Метод на плаќање:</span>
              <span className="font-bold text-[#FAF6F0]">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-[#A8A095]">
              <span>Адреса за испорака:</span>
              <span className="font-bold text-[#FAF6F0]">{order.address}</span>
            </div>
            <div className="flex justify-between text-[#A8A095]">
              <span>Достава:</span>
              <span className="font-bold text-[#FAF6F0]">
                {order.shipping === 0 ? "Бесплатна" : formatPrice(order.shipping, currency)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#2A2520] flex justify-between text-base font-black text-[#FAF6F0]">
              <span>Вкупен износ:</span>
              <span className="text-[#F5BA58] text-lg font-black">{formatPrice(order.total, currency)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                navigateTo("profile", "orders");
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-[#2A2520] hover:bg-[#25211D] text-[#FAF6F0] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              Следи ја пратката во профил
            </button>

            <button
              onClick={() => {
                onClose();
                navigateTo("home");
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-95 text-[#141210] font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#E26D46]/25 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" /> Врати се на почетна
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
