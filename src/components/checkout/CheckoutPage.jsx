import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice } from "../../utils/formatters";
import { OrderSuccessModal } from "./OrderSuccessModal";
import { PaymentGatewayModal } from "./PaymentGatewayModal";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Package,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  Calendar,
  ExternalLink,
} from "lucide-react";

export const CheckoutPage = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    user,
    placeOrder,
    navigateTo,
    currency,
  } = useApp();

  // Form States
  const [formData, setFormData] = useState({
    fullName: user?.name || "Александар Петровски",
    phone: user?.phone || "+389 70 234 567",
    email: user?.email || "aleksandar.petrovski@demo.mk",
    street: user?.defaultAddress?.street || "бул. Партизански Одреди бр. 42/3-12",
    city: user?.defaultAddress?.city || "Скопје",
    postalCode: user?.defaultAddress?.postalCode || "1000",
    note: "",
  });

  // Delivery Method: 'standard' (150 or free), 'direct' (250), 'paketomat' (100)
  const [deliveryMethod, setDeliveryMethod] = useState("direct");

  // Payment Method & Modal States
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Delivery cost calculation
  const deliveryCosts = {
    standard: cartSubtotal >= 1500 ? 0 : 150,
    direct: 250,
    paketomat: 100,
  };

  const currentShippingFee = deliveryCosts[deliveryMethod];
  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + currentShippingFee);

  const deliveryMethodNames = {
    standard: "Стандардна курирска достава (2-3 работни дена)",
    direct: "⚡ PazarMax Direkt 24h Експресна достава",
    paketomat: "📦 PazarMax Paketomat 24/7 подигнување",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. When user clicks "Избери начин на плаќање" or submits the checkout form:
  // Open the dedicated Payment Gateway Window!
  const handleProceedToPayment = (e) => {
    if (e) e.preventDefault();
    setIsPaymentModalOpen(true);
  };

  // 2. When payment is authorized and confirmed in the Payment Gateway Modal:
  const handleFinalConfirmPayment = async (paymentDetails) => {
    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        deliveryMethodName: deliveryMethodNames[deliveryMethod],
        paymentMethodName:
          paymentDetails?.paymentMethodName || "Кредитна / дебитна картичка (онлајн)",
        shippingFee: currentShippingFee,
      });
      setIsPaymentModalOpen(false);
      setCreatedOrder(order);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // 1. If order was just placed, display the success modal!
  if (createdOrder) {
    return (
      <OrderSuccessModal
        order={createdOrder}
        onClose={() => {
          setCreatedOrder(null);
          navigateTo("home");
        }}
      />
    );
  }

  // 2. If cart is empty and NOT currently submitting
  if (cart.length === 0 && !isSubmitting) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Немате производи во кошничката</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">Додајте производи во кошничката за да продолжите со наплата</p>
        <button
          onClick={() => navigateTo("catalog")}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          Врати се кон каталог
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Title & Back to Cart */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-600" />
            Брза и сигурна наплата
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Пополнете ги податоците за испорака и изберете начин на плаќање
          </p>
        </div>

        <button
          onClick={() => navigateTo("cart")}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Назад кон кошничка
        </button>
      </div>

      <form onSubmit={handleProceedToPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Steps 1, 2, 3 (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Shipping Address & Contact */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Податоци за достава & Контакт
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Име и презиме *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Телефонски број (за СМС известување) *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Е-пошта за потврда на нарачката *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Улица и куќен број / Влез / Стан *
                  </label>
                  <input
                    type="text"
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Град / Населено место *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Поштенски број *</label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Забелешка за курирот (опционално):
                  </label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="пр. Ѕвонете на интерфон бр. 12 или јавете се пред пристигнување"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Method */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Избор на начин на испорака
                </h3>
              </div>

              <div className="space-y-3">
                {/* 1. PazarMax Direkt 24h */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === "direct"
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === "direct"}
                      onChange={() => setDeliveryMethod("direct")}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          ⚡ PazarMax Direkt (Експрес 24h достава)
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded">
                          ПРЕПОРАЧАНО
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Директно од централниот склад. Испорака утре до вашата врата.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">
                    {formatPrice(250, currency)}
                  </span>
                </label>

                {/* 2. Standard Courier */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === "standard"
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === "standard"}
                      onChange={() => setDeliveryMethod("standard")}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                        Стандардна курирска достава (2-3 работни дена)
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Бесплатна за сите нарачки со вредност над 1.500 ден.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">
                    {cartSubtotal >= 1500 ? (
                      <span className="text-emerald-600 font-extrabold">БЕСПЛАТНА</span>
                    ) : (
                      formatPrice(150, currency)
                    )}
                  </span>
                </label>

                {/* 3. Paketomat 24/7 */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === "paketomat"
                      ? "border-orange-500 bg-orange-50/50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === "paketomat"}
                      onChange={() => setDeliveryMethod("paketomat")}
                      className="accent-orange-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 block">
                        📦 PazarMax Paketomat 24/7 (Подигнување од автоматизиран пакет-бокс)
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Подигнете ја пратката со СМС пин-код без чекање курир.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">
                    {formatPrice(100, currency)}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
                Резиме на нарачката ({cart.length} артикли)
              </h3>

              {/* Items mini list */}
              <div className="max-h-48 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="pt-2 first:pt-0 flex items-center gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.product.title}</p>
                      <p className="text-[11px] text-slate-400">Кол: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Вкупно производи:</span>
                  <span className="font-bold text-slate-800">
                    {formatPrice(cartSubtotal, currency)}
                  </span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Купон попуст:</span>
                    <span>-{formatPrice(cartDiscount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Трошок за испорака:</span>
                  <span className="font-bold text-slate-800">
                    {currentShippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">БЕСПЛАТНА</span>
                    ) : (
                      formatPrice(currentShippingFee, currency)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-lg font-black text-slate-900">
                  <span>Вкупно за наплата:</span>
                  <span className="text-orange-600">{formatPrice(finalTotal, currency)}</span>
                </div>
              </div>

              {/* Payment Info Badge */}
              <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-200/60 flex items-center gap-3 text-xs text-orange-950">
                <CreditCard className="w-5 h-5 text-orange-600 shrink-0" />
                <div className="leading-snug">
                  <span className="font-bold block text-slate-900">Избор на плаќање на следниот чекор</span>
                  <span className="text-[11px] text-slate-500">
                    Картичка (Visa/Mastercard), Готовина или на Рати без камата.
                  </span>
                </div>
              </div>

              {/* Terms check */}
              <label className="flex items-start gap-2 text-[11px] text-slate-500 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-400 mt-0.5"
                />
                <span>
                  Се согласувам со општите правила и услови за користење и политиката за заштита на лични податоци на PazarMax.mk
                </span>
              </label>

              {/* Proceed to Payment Window CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Обработка на нарачка...</span>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-orange-200" />
                    <span>Продолжи кон избор на плаќање</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 font-medium">
                🔒 Со клик се отвора прозорецот за сигурна наплата и избор на тип на плаќање
              </p>

              <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-semibold text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Гаранција за сигурност и безбедна достава
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Dedicated Payment Selection & Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={finalTotal}
        currency={currency}
        initialMethod={paymentMethod}
        shippingAddress={{
          street: formData.street,
          city: formData.city,
        }}
        onConfirmOrder={handleFinalConfirmPayment}
      />
    </div>
  );
};
