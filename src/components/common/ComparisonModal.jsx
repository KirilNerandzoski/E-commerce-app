import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatPrice } from "../../utils/formatters";
import { StarRating } from "../product/StarRating";
import { X, Trash2, ShoppingCart, Check, SlidersHorizontal } from "lucide-react";

export const ComparisonModal = () => {
  const {
    compareList,
    products,
    toggleCompare,
    clearCompare,
    isCompareModalOpen,
    setIsCompareModalOpen,
    addToCart,
    currency,
    navigateTo,
  } = useApp();

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [addedIds, setAddedIds] = useState([]);

  if (!isCompareModalOpen) return null;

  const compareProducts = products.filter((p) => compareList.includes(p.id));

  // Extract all unique spec keys across compared items
  const allSpecKeys = Array.from(
    new Set(
      compareProducts.flatMap((p) => (p.specifications ? Object.keys(p.specifications) : []))
    )
  );

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Споредба на производи ({compareProducts.length}/4)
              </h2>
              <p className="text-xs text-slate-500">
                Споредете технички карактеристики, цени и оцени
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Исчисти сѐ
              </button>
            )}
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {compareProducts.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Немате додадено производи за споредба</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Кликнете на иконата за споредба на производите од каталогот за да ги споредите карактеристиките.
            </p>
            <button
              onClick={() => {
                setIsCompareModalOpen(false);
                navigateTo("catalog");
              }}
              className="mt-4 px-5 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md hover:bg-orange-600 transition-colors"
            >
              Прегледај производи
            </button>
          </div>
        ) : (
          <div className="overflow-auto flex-1 p-4 sm:p-6">
            <div className="min-w-[650px]">
              {/* Product Cards Row */}
              <div className="grid grid-cols-5 gap-4 pb-6 border-b border-slate-200 items-end">
                <div className="col-span-1">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Производи
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={highlightDiff}
                      onChange={(e) => setHighlightDiff(e.target.checked)}
                      className="rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                    />
                    Означи разлики
                  </label>
                </div>

                {compareProducts.map((p) => {
                  const isAdded = addedIds.includes(p.id);
                  return (
                    <div key={p.id} className="col-span-1 relative flex flex-col justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:border-orange-200 transition-all shadow-xs">
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-colors z-10"
                        title="Отстрани"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="w-full h-32 bg-slate-50 rounded-xl p-2 flex items-center justify-center mb-2">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>

                      <div className="text-[10px] font-bold text-slate-400 uppercase">{p.brand}</div>
                      <div
                        onClick={() => {
                          setIsCompareModalOpen(false);
                          navigateTo("product", p.id);
                        }}
                        className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-orange-600 cursor-pointer min-h-[2rem]"
                      >
                        {p.title}
                      </div>

                      <div className="mt-2 text-sm font-extrabold text-orange-600">
                        {formatPrice(p.price, currency)}
                      </div>

                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`mt-2 w-full py-1.5 px-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${
                          isAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                      >
                        {isAdded ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                        {isAdded ? "Во кошничка" : "Купи"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* General Specs Comparison Table */}
              <div className="divide-y divide-slate-100 text-xs">
                {/* Rating */}
                <div className="grid grid-cols-5 py-3 gap-4 items-center bg-slate-50/50">
                  <div className="col-span-1 font-bold text-slate-600 pl-2">Оцена од купувачи</div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="col-span-1">
                      <StarRating rating={p.rating} reviewCount={p.reviewCount} />
                    </div>
                  ))}
                </div>

                {/* Stock Status */}
                <div className="grid grid-cols-5 py-3 gap-4 items-center">
                  <div className="col-span-1 font-bold text-slate-600 pl-2">Достапност</div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="col-span-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${p.inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {p.inStock ? "На залиха" : "Нема залиха"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* PazarMax Direkt Badge */}
                <div className="grid grid-cols-5 py-3 gap-4 items-center bg-slate-50/50">
                  <div className="col-span-1 font-bold text-slate-600 pl-2">Брза испорака</div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="col-span-1">
                      {p.isDirectDelivery ? (
                        <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px]">
                          ⚡ PazarMax Direkt (24h)
                        </span>
                      ) : (
                        <span className="text-slate-400">Стандардна (48-72h)</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Technical Specifications */}
                {allSpecKeys.map((specKey) => {
                  const values = compareProducts.map((p) => p.specifications?.[specKey] || "-");
                  const allSame = values.every((v) => v === values[0]);
                  const rowClass = highlightDiff && !allSame ? "bg-amber-50/60 font-semibold text-amber-900" : "";

                  return (
                    <div key={specKey} className={`grid grid-cols-5 py-3 gap-4 items-center ${rowClass}`}>
                      <div className="col-span-1 font-bold text-slate-600 pl-2">{specKey}</div>
                      {compareProducts.map((p) => (
                        <div key={p.id} className="col-span-1 text-slate-700">
                          {p.specifications?.[specKey] || "-"}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
