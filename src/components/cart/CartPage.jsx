import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "../../utils/formatters";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Sparkles,
  Tag,
  Check,
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-[#FAF6F0]">
        <div className="max-w-md mx-auto bg-[#1D1A17] rounded-3xl border border-[#2A2520] p-8 sm:p-12 shadow-xl">
          <div className="w-20 h-20 rounded-3xl bg-[#25211D] text-[#E26D46] border border-[#2A2520] flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#FAF6F0]">Вашата кошничка е празна</h2>
          <p className="text-xs sm:text-sm text-[#A8A095] mt-2">
            Сè уште немате додадено ниеден производ. Погледнете ги нашите актуелни попусти и најпродавани артикли!
          </p>
          <button
            onClick={() => navigateTo("catalog")}
            className="mt-6 w-full py-3.5 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-98 text-[#141210] font-black text-sm rounded-xl shadow-lg shadow-[#E26D46]/25 transition-all cursor-pointer"
          >
            Започни со пазарење
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-[#FAF6F0]">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2A2520] mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#FAF6F0]">
            Кошничка за пазарење ({cartTotalItemsCount})
          </h1>
          <p className="text-xs text-[#A8A095] mt-0.5">
            Проверете ги производите и внесете купон пред наплата
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-[#E26D46] hover:text-[#D49A55] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" /> Испразни кошничка
        </button>
      </div>

      {/* Free Shipping Meter */}
      <div className="bg-[#1D1A17] border border-[#2A2520] rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#FAF6F0] mb-2">
          <span className="flex items-center gap-2 text-[#D49A55]">
            <Truck className="w-5 h-5 text-[#D49A55]" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                Честитки! Квалификувани сте за БЕСПЛАТНА експрес достава!
              </span>
            ) : (
              <span>
                Уште <strong className="text-[#FAF6F0]">{formatPrice(remainingForFreeShipping, currency)}</strong> за бесплатна достава
              </span>
            )}
          </span>
          <span className="text-[#D49A55] font-black">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full bg-[#25211D] h-2.5 rounded-full overflow-hidden border border-[#2A2520]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#E26D46] to-[#D49A55]"
            }`}
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Grid Layout: Items Table (8 cols) and Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#1D1A17] rounded-3xl border border-[#2A2520] shadow-xl divide-y divide-[#2A2520] overflow-hidden">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Title */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    onClick={() => navigateTo("product", item.product.id)}
                    className="w-20 h-20 rounded-2xl bg-[#FAF7F2] border border-[#E6DFD5] p-2 shrink-0 flex items-center justify-center cursor-pointer hover:border-[#E26D46] transition-colors"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-[#D49A55] uppercase">
                      {item.product.brand}
                    </span>
                    <h3
                      onClick={() => navigateTo("product", item.product.id)}
                      className="text-xs sm:text-sm font-bold text-[#FAF6F0] hover:text-[#E26D46] transition-colors cursor-pointer line-clamp-2"
                    >
                      {item.product.title}
                    </h3>

                    {item.variant && (
                      <span className="inline-block text-[11px] text-[#A8A095] bg-[#25211D] border border-[#2A2520] px-2 py-0.5 rounded-md mt-1">
                        Варијанта: {item.variant}
                      </span>
                    )}

                    <div className="text-xs font-black text-[#F5BA58] mt-2 sm:hidden">
                      {formatPrice(item.product.price, currency)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2A2520]">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#2A2520] rounded-xl bg-[#25211D] p-1">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-[#1D1A17] flex items-center justify-center text-[#A8A095] hover:text-[#FAF6F0] font-bold cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#FAF6F0]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-[#1D1A17] flex items-center justify-center text-[#A8A095] hover:text-[#FAF6F0] font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total Line Price */}
                  <div className="text-right min-w-[90px] hidden sm:block">
                    <span className="text-sm font-black text-[#F5BA58] block">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-[#8C8377] block">
                        ({formatPrice(item.product.price, currency)} /пар.)
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-[#8C8377] hover:text-[#E26D46] hover:bg-[#25211D] rounded-xl transition-colors cursor-pointer"
                    title="Отстрани"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-[#1D1A17] rounded-3xl border border-[#2A2520] p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-[#FAF6F0]">Преглед на нарачката</h2>

          {/* Promo Coupon Form */}
          <div className="space-y-2">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#E26D46]/15 border border-[#E26D46]/30">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#E26D46]" />
                  <div>
                    <span className="text-xs font-black text-[#E26D46] block uppercase font-mono">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[10px] text-[#A8A095]">
                      {appliedCoupon.type === "percent"
                        ? `${appliedCoupon.value}% попуст`
                        : `${appliedCoupon.value} ден. ваучер`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-[#E26D46] hover:underline cursor-pointer"
                >
                  Отстрани
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Внесете купон код..."
                  className="flex-1 bg-[#25211D] border border-[#2A2520] rounded-xl px-3 py-2 text-xs text-[#FAF6F0] placeholder-[#8C8377] outline-none focus:border-[#E26D46] font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#25211D] hover:bg-[#2A2520] border border-[#2A2520] text-[#FAF6F0] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Примени
                </button>
              </form>
            )}
          </div>

          {/* Calculations Breakdown */}
          <div className="space-y-2.5 text-xs pt-3 border-t border-[#2A2520]">
            <div className="flex justify-between text-[#A8A095]">
              <span>Вредност на производи:</span>
              <span className="font-bold text-[#FAF6F0]">
                {formatPrice(cartSubtotal, currency)}
              </span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Попуст со купон:</span>
                <span>-{formatPrice(cartDiscount, currency)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#A8A095]">
              <span>Испорака:</span>
              <span className="font-bold text-[#FAF6F0]">
                {standardShippingCost === 0 ? (
                  <span className="text-emerald-400 font-bold">БЕСПЛАТНА</span>
                ) : (
                  formatPrice(standardShippingCost, currency)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#2A2520] flex justify-between items-baseline text-base sm:text-lg font-black text-[#FAF6F0]">
              <span>Вкупно:</span>
              <span className="text-[#F5BA58] text-xl font-black">{formatPrice(cartTotal, currency)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={() => navigateTo("checkout")}
            className="w-full py-3.5 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-98 text-[#141210] font-black text-sm rounded-xl shadow-lg shadow-[#E26D46]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Кон наплата ({formatPrice(cartTotal, currency)})
          </button>
        </div>
      </div>
    </div>
  );
};
