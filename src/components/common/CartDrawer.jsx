import React from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "../../utils/formatters";
import {
  X,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Truck,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";

export const CartDrawer = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    standardShippingCost,
    cartTotal,
    cartTotalItemsCount,
    updateCartQuantity,
    removeFromCart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    navigateTo,
    currency,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigateTo("checkout");
  };

  const handleGoToCartPage = () => {
    setIsCartDrawerOpen(false);
    navigateTo("cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#171412] text-[#FAF6F0] border-l border-[#2A2520] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#2A2520] flex items-center justify-between bg-[#141210]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#E26D46]/15 text-[#E26D46] flex items-center justify-center border border-[#E26D46]/30">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-[#FAF6F0] text-base">
                  Твоја кошничка ({cartTotalItemsCount})
                </h2>
                <span className="text-xs text-[#A8A095]">Сигурно и брзо купување</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-[#25211D] hover:bg-[#2A2520] text-[#A8A095] hover:text-[#FAF6F0] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-[#1D1A17] border-b border-[#2A2520]">
            <div className="flex items-center justify-between text-xs font-semibold text-[#FAF6F0] mb-1.5">
              <span className="flex items-center gap-1.5 text-[#D49A55]">
                <Truck className="w-4 h-4" />
                {remainingForFreeShipping === 0 ? (
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Имате БЕСПЛАТНА достава!
                  </span>
                ) : (
                  <span>
                    Уште <strong className="text-[#FAF6F0]">{formatPrice(remainingForFreeShipping, currency)}</strong> до бесплатна достава
                  </span>
                )}
              </span>
              <span className="text-[#D49A55] font-bold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-[#25211D] h-2 rounded-full overflow-hidden border border-[#2A2520]">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-[#E26D46] to-[#D49A55]"
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#2A2520]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#25211D] text-[#8C8377] flex items-center justify-center mb-3 border border-[#2A2520]">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#FAF6F0] text-base">Кошничката е празна</h3>
                <p className="text-xs text-[#A8A095] mt-1 max-w-xs">
                  Разгледајте ги нашите топ попусти и додадете производи во кошничката.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo("catalog");
                  }}
                  className="mt-4 px-5 py-2.5 bg-gradient-to-r from-[#E26D46] to-[#D49A55] text-[#141210] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Започни со пазарење
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-3 flex gap-3 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#FAF6F0] truncate">
                      {item.product.title}
                    </h4>

                    {item.variant && (
                      <span className="inline-block text-[11px] text-[#A8A095] bg-[#25211D] px-1.5 py-0.5 rounded mt-0.5 border border-[#2A2520]">
                        {item.variant}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs font-bold text-[#E26D46]">
                        {formatPrice(item.product.price, currency)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#2A2520] rounded-lg bg-[#25211D]">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#A8A095] hover:text-[#FAF6F0] hover:bg-[#2A2520] rounded-l-lg transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#FAF6F0]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#A8A095] hover:text-[#FAF6F0] hover:bg-[#2A2520] rounded-r-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#8C8377] hover:text-[#E26D46] transition-colors p-1 cursor-pointer"
                        title="Отстрани"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & CTAs */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#2A2520] bg-[#141210] space-y-3 text-[#FAF6F0]">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#A8A095]">
                  <span>Вкупно производи:</span>
                  <span className="font-semibold text-[#FAF6F0]">{formatPrice(cartSubtotal, currency)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Попуст со купон:</span>
                    <span className="font-semibold">-{formatPrice(cartDiscount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#A8A095]">
                  <span>Достава:</span>
                  <span className="font-semibold text-[#FAF6F0]">
                    {standardShippingCost === 0 ? (
                      <span className="text-emerald-400 font-bold">БЕСПЛАТНА</span>
                    ) : (
                      formatPrice(standardShippingCost, currency)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#2A2520] flex justify-between text-sm sm:text-base font-extrabold text-[#FAF6F0]">
                  <span>Вкупно за плаќање:</span>
                  <span className="text-[#E26D46]">{formatPrice(cartTotal, currency)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-98 text-[#141210] shadow-lg shadow-[#E26D46]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Кон брза наплата <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleGoToCartPage}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#FAF6F0] bg-[#25211D] border border-[#2A2520] hover:bg-[#2A2520] transition-colors cursor-pointer"
                >
                  Отвори детална кошничка
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
