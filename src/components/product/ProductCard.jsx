import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StarRating } from "./StarRating";
import { PriceDisplay } from "./PriceDisplay";
import {
  Heart,
  Eye,
  SlidersHorizontal,
  ShoppingCart,
  Check,
  Zap,
  Truck,
} from "lucide-react";

export const ProductCard = ({ product, layout = "grid" }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    navigateTo,
    setQuickViewProduct,
  } = useApp();

  const [isAdded, setIsAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleCardClick = () => {
    navigateTo("product", product.id);
  };

  if (layout === "list") {
    return (
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-2xl border border-slate-200/80 p-4 transition-all duration-200 hover:shadow-md hover:border-orange-200 flex flex-col sm:flex-row gap-4 sm:gap-6 cursor-pointer relative"
      >
        {/* Left Image */}
        <div className="relative w-full sm:w-56 h-48 sm:h-52 shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.discount > 0 && (
              <span className="bg-red-500 text-white font-bold text-xs px-2 py-0.5 rounded-md shadow-sm">
                -{product.discount}%
              </span>
            )}
            {product.isDirectDelivery && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                <Zap className="w-3 h-3 fill-white" /> Direkt
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    inWishlist
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200"
                  }`}
                  title="Омилени"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(product.id);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    inCompare
                      ? "bg-amber-50 border-amber-300 text-amber-600"
                      : "bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300"
                  }`}
                  title="Спореди"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-slate-800 text-base sm:text-lg mt-1 group-hover:text-orange-600 transition-colors line-clamp-2">
              {product.title}
            </h3>

            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              {product.freeShipping && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <Truck className="w-3 h-3" /> Бесплатна достава
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-2 line-clamp-2 hidden sm:block">
              {product.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-end justify-between gap-3">
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              size="lg"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct(product);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors hidden sm:inline-flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> Брз преглед
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`px-4 py-2 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : product.inStock
                    ? "bg-orange-500 hover:bg-orange-600 active:scale-95 text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Додадено
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Во кошничка
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Layout
  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 hover:border-orange-300 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Image Container with Badges & Floating Actions */}
        <div className="relative w-full aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4 mb-3">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges on Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {product.discount > 0 && (
              <span className="bg-red-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-sm">
                -{product.discount}%
              </span>
            )}
            {product.isDirectDelivery && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-white" /> Direkt
              </span>
            )}
            {product.isDealOfTheDay && (
              <span className="bg-purple-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-md shadow-sm">
                Супер Зделка
              </span>
            )}
          </div>

          {/* Floating Actions on Top Right */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                inWishlist
                  ? "bg-red-50 text-red-500"
                  : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 hover:bg-white"
              }`}
              title="Омилени"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500" : ""}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCompare(product.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                inCompare
                  ? "bg-amber-100 text-amber-600"
                  : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-amber-600 hover:bg-white"
              }`}
              title="Спореди"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-400 hover:text-slate-800 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              title="Брз преглед"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Распродадено
              </span>
            </div>
          )}
        </div>

        {/* Brand & Title */}
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {product.brand}
        </div>
        <h3 className="font-medium text-slate-800 text-sm leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center justify-between">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          {product.freeShipping && (
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <Truck className="w-2.5 h-2.5" /> Бесплатна
            </span>
          )}
        </div>
      </div>

      {/* Price & Add to Cart button */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-2">
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          discount={product.discount}
          size="sm"
        />

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 ${
            isAdded
              ? "bg-emerald-600 text-white"
              : product.inStock
              ? "bg-orange-500 hover:bg-orange-600 active:scale-98 text-white hover:shadow-orange-500/25"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Во кошничка!
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Во кошничка
            </>
          )}
        </button>
      </div>
    </div>
  );
};
