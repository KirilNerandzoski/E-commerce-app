import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "../../utils/formatters";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  Check,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

export const CartPage = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    standardShippingCost,
    cartTotal,
    cartTotalItemsCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
    currency,
  } = useApp();

  const [couponInput, setCouponInput] = useState("");

  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput("");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Вашата кошничка е празна</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Сè уште немате додадено ниеден производ. Погледнете ги нашите актуелни попусти и најпродавани артикли!
          </p>
          <button
            onClick={() => navigateTo("catalog")}
            className="mt-6 w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
          >
            Започни со пазарење
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Кошничка за пазарење ({cartTotalItemsCount})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Проверете ги производите и внесете купон пред наплата
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Испразни кошничка
        </button>
      </div>

      {/* Free Shipping Meter */}
      <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 mb-6 shadow-xs">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 mb-2">
          <span className="flex items-center gap-2 text-orange-700">
            <Truck className="w-5 h-5 text-orange-600" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                Честитки! Квалификувани сте за БЕСПЛАТНА експрес достава!
              </span>
            ) : (
              <span>
                Уште <strong className="text-orange-700">{formatPrice(remainingForFreeShipping, currency)}</strong> за бесплатна достава
              </span>
            )}
          </span>
          <span className="text-orange-600">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full bg-orange-200/60 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-orange-500"
            }`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Grid Layout: Items Table (8 cols) and Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Title */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    onClick={() => navigateTo("product", item.product.id)}
                    className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center cursor-pointer hover:border-orange-300 transition-colors"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">
                      {item.product.brand}
                    </span>
                    <h3
                      onClick={() => navigateTo("product", item.product.id)}
                      className="text-xs sm:text-sm font-bold text-slate-900 truncate hover:text-orange-600 cursor-pointer transition-colors"
                    >
                      {item.product.title}
                    </h3>

                    {item.variant && (
                      <span className="inline-block text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1">
                        Варијанта: {item.variant}
                      </span>
                    )}

                    <div className="text-xs font-bold text-slate-900 mt-2 sm:hidden">
                      {formatPrice(item.product.price, currency)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total Line Price */}
                  <div className="text-right min-w-[90px] hidden sm:block">
                    <span className="text-sm font-black text-slate-900 block">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-slate-400 block">
                        ({formatPrice(item.product.price, currency)} /пар.)
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Отстрани"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigateTo("catalog")}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 pt-2"
          >
            <ChevronLeft className="w-4 h-4" /> Продолжи со пазарење
          </button>
        </div>

        {/* Order Summary & Coupon Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Преглед на нарачката
            </h3>

            {/* Promo Code Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                Внесете промо купон:
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  <div>
                    <span className="font-extrabold block">{appliedCoupon.code}</span>
                    <span className="text-[11px] text-emerald-700">{appliedCoupon.description}</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Отстрани
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="пр. PAZAR10"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase font-mono font-bold outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    Примени
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs pt-3 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Вредност на производи:</span>
                <span className="font-bold text-slate-800">
                  {formatPrice(cartSubtotal, currency)}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Попуст со купон:</span>
                  <span>-{formatPrice(cartDiscount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Испорака:</span>
                <span className="font-bold text-slate-800">
                  {standardShippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">БЕСПЛАТНА</span>
                  ) : (
                    formatPrice(standardShippingCost, currency)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base sm:text-lg font-black text-slate-900">
                <span>Вкупно:</span>
                <span className="text-orange-600">{formatPrice(cartTotal, currency)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigateTo("checkout")}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all"
            >
              Кон брза наплата <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-semibold text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Безбедно енкриптирано плаќање
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
