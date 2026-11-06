import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { soundFX } from "../../utils/soundEffects";
import { StarRating } from "./StarRating";
import { PriceDisplay } from "./PriceDisplay";
import { BrandLogo } from "../common/BrandLogos";
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
    soundFX.playPop();
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
        className="group bg-[#1D1A17] rounded-2xl border border-[#2A2520] p-4 transition-all duration-200 hover:shadow-2xl hover:border-[#E26D46]/50 flex flex-col sm:flex-row gap-4 sm:gap-6 cursor-pointer relative text-[#FAF6F0]"
      >
        {/* Left Image Pod */}
        <div className="relative w-full sm:w-56 h-48 sm:h-52 shrink-0 bg-[#FAF7F2] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-[#E6DFD5]">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.discount > 0 && (
              <span className="bg-[#E26D46] text-white font-bold text-xs px-2 py-0.5 rounded-md shadow-xs">
                -{product.discount}%
              </span>
            )}
            {product.isDirectDelivery && (
              <span className="bg-gradient-to-r from-[#D49A55] to-[#E26D46] text-[#141210] font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                <Zap className="w-3 h-3 fill-[#141210]" /> Direkt
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo("catalog", { brand: product.brand });
                }}
                className="text-xs font-bold text-[#D49A55] hover:text-[#E26D46] transition-colors cursor-pointer flex items-center gap-1.5"
                title={`Филтрирај по бренд ${product.brand}`}
              >
                <BrandLogo brand={product.brand} size="sm" showName={true} />
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    inWishlist
                      ? "bg-[#E26D46]/20 border-[#E26D46] text-[#E26D46]"
                      : "bg-[#25211D] border-[#2A2520] text-[#A8A095] hover:text-[#E26D46] hover:border-[#E26D46]/50"
                  }`}
                  title="Омилени"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? "fill-[#E26D46]" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(product.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    inCompare
                      ? "bg-[#D49A55] text-[#141210] border-[#D49A55]"
                      : "bg-[#25211D] border-[#2A2520] text-[#A8A095] hover:text-[#D49A55] hover:border-[#D49A55]/50"
                  }`}
                  title="Спореди производ"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D49A55]" />
                  <span>{inCompare ? "Во споредба" : "Спореди"}</span>
                </button>
              </div>
            </div>

            <h3 className="font-bold text-[#FAF6F0] text-base sm:text-lg mt-1 group-hover:text-[#E26D46] transition-colors line-clamp-2">
              {product.title}
            </h3>

            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              {product.freeShipping && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <Truck className="w-3 h-3" /> Бесплатна достава
                </span>
              )}
            </div>

            <p className="text-xs text-[#A8A095] mt-2 line-clamp-2 hidden sm:block">
              {product.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2A2520] flex flex-wrap items-end justify-between gap-3">
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
                className="px-3 py-2 text-xs font-semibold text-[#FAF6F0] bg-[#25211D] hover:bg-[#2A2520] rounded-xl transition-colors hidden sm:inline-flex items-center gap-1.5 border border-[#2A2520]"
              >
                <Eye className="w-3.5 h-3.5 text-[#A8A095]" /> Брз преглед
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`px-4 py-2 text-sm font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : product.inStock
                    ? "bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 text-[#141210] active:scale-95 shadow-[#E26D46]/20"
                    : "bg-[#25211D] text-[#8C8377] border border-[#2A2520] cursor-not-allowed"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Додадено
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-[#141210]" /> Во кошничка
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
      className="group bg-[#1D1A17] rounded-2xl border border-[#2A2520] p-3 sm:p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-[#E26D46]/10 hover:-translate-y-1 hover:border-[#E26D46]/50 flex flex-col justify-between cursor-pointer relative text-[#FAF6F0]"
    >
      <div>
        {/* Image Pod with Badges & Floating Actions */}
        <div className="relative w-full aspect-square bg-[#FAF7F2] rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4 mb-3 border border-[#E6DFD5] group/img">
          <img
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-contain transition-all duration-300 ${
              product.images.length > 1 ? "group-hover/img:opacity-0" : "group-hover:scale-108"
            }`}
            loading="lazy"
          />

          {/* Secondary side image on hover */}
          {product.images.length > 1 && (
            <img
              src={product.images[1]}
              alt={`${product.title} - страничен поглед`}
              className="absolute inset-0 w-full h-full object-contain p-3 sm:p-4 transition-all duration-300 opacity-0 group-hover/img:opacity-100 group-hover/img:scale-105 pointer-events-none"
              loading="lazy"
            />
          )}

          {/* Side Count Indicator Pill */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-[#141210]/80 text-[10px] font-bold text-[#FAF6F0] backdrop-blur-xs flex items-center gap-1 border border-[#2A2520]/40 pointer-events-none shadow-xs">
              <span>📷 {product.images.length} агли</span>
            </div>
          )}

          {/* Badges on Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {product.discount > 0 && (
              <span className="bg-[#E26D46] text-white font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-xs">
                -{product.discount}%
              </span>
            )}
            {product.isDirectDelivery && (
              <span className="bg-gradient-to-r from-[#D49A55] to-[#E26D46] text-[#141210] font-black text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-[#141210]" /> Direkt
              </span>
            )}
            {product.isDealOfTheDay && (
              <span className="bg-[#D49A55] text-[#141210] font-black text-[9px] px-1.5 py-0.5 rounded-md shadow-xs uppercase tracking-wide">
                Зделка на денот
              </span>
            )}
          </div>

          {/* Floating Actions on Top Right (Wishlist & Quick View only) */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                inWishlist
                  ? "bg-[#E26D46] text-white"
                  : "bg-[#141210]/90 backdrop-blur-sm text-[#FAF6F0] hover:text-[#E26D46] hover:bg-[#1D1A17] border border-[#2A2520]"
              }`}
              title="Омилени"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-8 h-8 rounded-full bg-[#141210]/90 backdrop-blur-sm text-[#FAF6F0] hover:text-[#E26D46] hover:bg-[#1D1A17] flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 hidden sm:flex border border-[#2A2520]"
              title="Брз преглед"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-[#141210]/85 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-[#E26D46] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Распродадено
              </span>
            </div>
          )}
        </div>

        {/* Brand Logo & Filters Button above Title */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo("catalog", { brand: product.brand });
            }}
            className="text-[11px] font-bold text-[#D49A55] hover:text-[#E26D46] transition-colors cursor-pointer text-left truncate flex items-center gap-1.5"
            title={`Филтрирај по бренд ${product.brand}`}
          >
            <BrandLogo brand={product.brand} size="sm" showName={true} />
          </button>

          {/* Filters / Compare logo button positioned directly above product name */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all border cursor-pointer shrink-0 ${
              inCompare
                ? "bg-[#D49A55] text-[#141210] border-[#D49A55]"
                : "bg-[#25211D] text-[#A8A095] hover:text-[#FAF6F0] border-[#2A2520] hover:border-[#D49A55]/50"
            }`}
            title={inCompare ? "Отстрани од споредба" : "Спореди / Филтер"}
          >
            <SlidersHorizontal className="w-3 h-3 text-[#D49A55]" />
            <span>{inCompare ? "Во споредба" : "Спореди"}</span>
          </button>
        </div>

        <h3 className="font-bold text-[#FAF6F0] text-sm leading-snug group-hover:text-[#E26D46] transition-colors line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center justify-between">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          {product.freeShipping && (
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
              <Truck className="w-2.5 h-2.5" /> Бесплатна
            </span>
          )}
        </div>
      </div>

      {/* Price & Add to Cart button */}
      <div className="mt-3 pt-2.5 border-t border-[#2A2520] flex flex-col gap-2">
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
          className={`w-full py-2 px-3 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
            isAdded
              ? "bg-emerald-600 text-white"
              : product.inStock
              ? "bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-98 text-[#141210] shadow-[#E26D46]/20"
              : "bg-[#25211D] text-[#8C8377] border border-[#2A2520] cursor-not-allowed"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Во кошничка!
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 text-[#141210]" /> Во кошничка
            </>
          )}
        </button>
      </div>
    </div>
  );
};
