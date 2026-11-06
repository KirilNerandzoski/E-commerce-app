import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StarRating } from "../product/StarRating";
import { PriceDisplay } from "../product/PriceDisplay";
import {
  X,
  ShoppingCart,
  Heart,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-[#1D1A17] border border-[#2A2520] rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 text-[#FAF6F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#25211D] hover:bg-[#2A2520] text-[#A8A095] hover:text-[#FAF6F0] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Side */}
          <div className="p-6 bg-[#171412] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#2A2520]">
            <div className="relative aspect-square w-full rounded-2xl bg-[#FAF7F2] p-4 flex items-center justify-center border border-[#E6DFD5] overflow-hidden group select-none">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-contain"
              />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-[#E26D46] text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                  -{product.discount}%
                </span>
              )}

              {/* Prev / Next Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#141210]/85 hover:bg-[#141210] text-[#FAF6F0] flex items-center justify-center shadow-md transition-all border border-[#2A2520] cursor-pointer"
                    aria-label="Претходна"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#141210]/85 hover:bg-[#141210] text-[#FAF6F0] flex items-center justify-center shadow-md transition-all border border-[#2A2520] cursor-pointer"
                    aria-label="Следна"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-[#FAF7F2] shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#E26D46] ring-2 ring-[#E26D46]/30"
                        : "border-[#E6DFD5] hover:border-[#D49A55]"
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Brand & Filters/Compare Logo bar placed directly above Product Title */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#D49A55] uppercase tracking-wider">
                    {product.brand}
                  </span>
                  {product.isDirectDelivery && (
                    <span className="inline-flex items-center gap-1 bg-[#D49A55]/20 text-[#D49A55] border border-[#D49A55]/30 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      <Zap className="w-3 h-3 fill-[#D49A55]" /> Direkt 24h
                    </span>
                  )}
                </div>

                {/* Filters / Compare logo button positioned directly above product name */}
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                    isInCompare(product.id)
                      ? "bg-[#D49A55] text-[#141210] border-[#D49A55]"
                      : "bg-[#25211D] border-[#2A2520] text-[#A8A095] hover:text-[#D49A55] hover:border-[#D49A55]/50"
                  }`}
                  title="Спореди производ"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D49A55]" />
                  <span>{isInCompare(product.id) ? "Во споредба" : "Спореди"}</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#FAF6F0] mt-2 leading-snug">
                {product.title}
              </h2>

              <div className="mt-2.5 flex items-center gap-3">
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                <span className="text-[#38322B]">|</span>
                <span className="text-xs text-emerald-400 font-medium">
                  {product.inStock ? "На залиха (достапно веднаш)" : "Нема на залиха"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-[#2A2520]">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  size="lg"
                />
              </div>

              <p className="text-xs text-[#A8A095] mt-3 line-clamp-3">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-[#FAF6F0] mb-2">
                    Изберете {product.variants.type === "color" ? "Боја" : "Варијанта"}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariant(opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                          selectedVariant === opt || (!selectedVariant && opt === product.variants.options[0])
                            ? "border-[#E26D46] bg-[#E26D46]/20 text-[#E26D46]"
                            : "border-[#2A2520] bg-[#25211D] text-[#FAF6F0] hover:border-[#38322B]"
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
            <div className="mt-6 pt-4 border-t border-[#2A2520] space-y-4">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#2A2520] rounded-xl bg-[#25211D] p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-[#1D1A17] text-[#A8A095] hover:text-[#FAF6F0] flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#FAF6F0]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="w-8 h-8 rounded-lg bg-[#1D1A17] text-[#A8A095] hover:text-[#FAF6F0] flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-98 text-[#141210] font-black shadow-[#E26D46]/25"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Додадено во кошничка!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 text-[#141210]" /> Додади во кошничка
                    </>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    inWishlist
                      ? "bg-[#E26D46]/20 border-[#E26D46] text-[#E26D46]"
                      : "border-[#2A2520] bg-[#25211D] text-[#A8A095] hover:text-[#E26D46]"
                  }`}
                  title="Омилени"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-[#E26D46]" : ""}`} />
                </button>
              </div>

              {/* View Full Product Link */}
              <button
                onClick={handleViewFullDetails}
                className="w-full text-center text-xs font-bold text-[#E26D46] hover:text-[#D49A55] py-1 cursor-pointer"
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
