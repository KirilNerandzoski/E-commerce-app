import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StarRating } from "../product/StarRating";
import { PriceDisplay } from "../product/PriceDisplay";
import {
  X,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Check,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export const QuickViewModal = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    navigateTo,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    navigateTo("product", product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl bg-white p-4 flex items-center justify-center border border-slate-200/80 overflow-hidden">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  {product.brand}
                </span>
                {product.isDirectDelivery && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    <Zap className="w-3 h-3 fill-amber-600 text-amber-600" /> Direkt 24h
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 leading-snug">
                {product.title}
              </h2>

              <div className="mt-2.5 flex items-center gap-3">
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                <span className="text-slate-300">|</span>
                <span className="text-xs text-emerald-600 font-medium">
                  {product.inStock ? "На залиха (достапно веднаш)" : "Нема на залиха"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  size="lg"
                />
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-3">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Изберете {product.variants.type === "color" ? "Боја" : "Варијанта"}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariant(opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          selectedVariant === opt || (!selectedVariant && opt === product.variants.options[0])
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Bottom */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 active:scale-98 text-white shadow-orange-500/25"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Додадено во кошничка!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Додади во кошничка
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    inWishlist
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200"
                  }`}
                  title="Омилени"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500" : ""}`} />
                </button>
              </div>

              {/* View Full Product Link */}
              <button
                onClick={handleViewFullDetails}
                className="w-full text-center text-xs font-bold text-orange-600 hover:text-orange-700 py-1"
              >
                Отвори детална страница на производот &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
