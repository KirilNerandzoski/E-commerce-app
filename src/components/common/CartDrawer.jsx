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
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B1120] text-slate-200 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#070C18]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base">
                  Твоја кошничка ({cartTotalItemsCount})
                </h2>
                <span className="text-xs text-slate-400">Сигурно и брзо купување</span>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-orange-50/70 border-b border-orange-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 text-orange-700">
                <Truck className="w-4 h-4" />
                {remainingForFreeShipping === 0 ? (
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Имате БЕСПЛАТНА достава!
                  </span>
                ) : (
                  <span>
                    Уште <strong className="text-orange-700">{formatPrice(remainingForFreeShipping, currency)}</strong> до бесплатна достава
                  </span>
                )}
              </span>
              <span className="text-orange-600 font-bold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-orange-200/60 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  freeShippingProgress >= 100 ? "bg-emerald-500" : "bg-orange-500"
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-700 text-base">Кошничката е празна</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Разгледајте ги нашите топ попусти и додадете производи во кошничката.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo("catalog");
                  }}
                  className="mt-4 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Започни со пазарење
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-3 flex gap-3 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">
                      {item.product.title}
                    </h4>

                    {item.variant && (
                      <span className="inline-block text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                        {item.variant}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs font-bold text-slate-900">
                        {formatPrice(item.product.price, currency)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-700">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
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
            <div className="p-4 sm:p-5 border-t border-slate-850 bg-[#070C18] space-y-3 text-slate-300">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Вкупно производи:</span>
                  <span className="font-semibold text-white">{formatPrice(cartSubtotal, currency)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Попуст со купон:</span>
                    <span className="font-semibold">-{formatPrice(cartDiscount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Достава:</span>
                  <span className="font-semibold text-white">
                    {standardShippingCost === 0 ? (
                      <span className="text-emerald-400 font-bold">БЕСПЛАТНА</span>
                    ) : (
                      formatPrice(standardShippingCost, currency)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm sm:text-base font-extrabold text-white">
                  <span>Вкупно за плаќање:</span>
                  <span className="text-orange-400">{formatPrice(cartTotal, currency)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 text-slate-950 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Кон брза наплата <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleGoToCartPage}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-300 bg-slate-850 border border-slate-750 hover:bg-slate-800 transition-colors cursor-pointer"
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
