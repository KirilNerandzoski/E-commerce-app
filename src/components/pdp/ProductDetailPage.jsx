import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import { formatPrice, getInstallmentPrice } from "../../utils/formatters";
import { StarRating } from "../product/StarRating";
import { ProductCard } from "../product/ProductCard";
import { BrandLogo } from "../common/BrandLogos";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  SlidersHorizontal,
  Share2,
  ShoppingCart,
  Zap,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Star,
  Plus,
  Minus,
  MessageSquare,
  Package,
} from "lucide-react";

export const ProductDetailPage = () => {
  const {
    currentProductId,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    navigateTo,
    currency,
    addReviewToProduct,
    addToast,
    theme,
  } = useApp();

  const product = products.find((p) => p.id === currentProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.options ? product.variants.options[0] : null
  );
  const [selectedSecondary, setSelectedSecondary] = useState(
    product.variants?.secondary?.options ? product.variants.secondary.options[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'specs' | 'reviews' | 'shipping'
  const [isAdded, setIsAdded] = useState(false);

  // Live Review Form State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const categoryObj = CATEGORIES.find((c) => c.id === product.category);

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Frequently bought together companion item
  const companionProduct = products.find((p) => p.id !== product.id && p.price < 15000) || products[6];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, selectedSecondary);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant, selectedSecondary);
    navigateTo("checkout");
  };

  const handleAddBundle = () => {
    addToCart(product, 1, selectedVariant);
    addToCart(companionProduct, 1);
    addToast("Пакетот од 2 производи е додаден во кошничката со попуст!", "success");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Линкот до производот е копиран во clipboard!", "info");
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    addReviewToProduct(product.id, {
      id: "rev-" + Date.now(),
      user: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewText.trim(),
      date: "Денес",
    });

    addToast("Вашата рецензија е успешно објавена!", "success");
    setShowReviewModal(false);
    setNewReviewAuthor("");
    setNewReviewText("");
    setNewReviewRating(5);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${
      theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"
    }`}>
      {/* 1. Breadcrumb Navigation */}
      <nav className={`flex items-center gap-1.5 text-xs mb-6 overflow-x-auto whitespace-nowrap ${
        theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
      }`}>
        <button onClick={() => navigateTo("home")} className="hover:text-[#E26D46] transition-colors cursor-pointer">
          Почетна
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#8C8377] shrink-0" />
        <button onClick={() => navigateTo("catalog")} className="hover:text-[#E26D46] transition-colors cursor-pointer">
          Каталог
        </button>
        {categoryObj && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C8377] shrink-0" />
            <button
              onClick={() => navigateTo("catalog", categoryObj.id)}
              className="hover:text-[#E26D46] transition-colors cursor-pointer"
            >
              {categoryObj.name}
            </button>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-[#8C8377] shrink-0" />
        <span className={`font-bold truncate max-w-xs ${
          theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"
        }`}>{product.title}</span>
      </nav>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Photo with Badges & Action Overlays */}
          <div className="relative aspect-square w-full rounded-3xl bg-[#FAF7F2] border border-[#E6DFD5] p-6 flex items-center justify-center shadow-md overflow-hidden group select-none">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={`${product.title} - поглед ${activeImageIndex + 1}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80";
              }}
              className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
            />

            {/* Left / Right Arrow navigation to view sides of the product */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#141210]/85 hover:bg-[#141210] text-[#FAF6F0] flex items-center justify-center shadow-xl transition-all opacity-85 hover:opacity-100 hover:scale-110 border border-[#2A2520] cursor-pointer z-20"
                  aria-label="Претходен агол"
                  title="Претходен агол"
                >
                  <ChevronLeft className="w-5 h-5 text-[#FAF6F0]" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#141210]/85 hover:bg-[#141210] text-[#FAF6F0] flex items-center justify-center shadow-xl transition-all opacity-85 hover:opacity-100 hover:scale-110 border border-[#2A2520] cursor-pointer z-20"
                  aria-label="Следен агол"
                  title="Следен агол"
                >
                  <ChevronRight className="w-5 h-5 text-[#FAF6F0]" />
                </button>
              </>
            )}

            {/* Angle Indicator Pill */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-[#141210]/85 text-[#FAF6F0] text-xs font-bold backdrop-blur-xs border border-[#2A2520]/50 flex items-center gap-1.5 shadow-md">
                <span>Агол {activeImageIndex + 1} / {product.images.length}</span>
              </div>
            )}

            {/* Badges on Top Left */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.discount > 0 && (
                <span className="bg-[#E26D46] text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-md">
                  -{product.discount}% ПОПУСТ
                </span>
              )}
              {product.isDirectDelivery && (
                <span className="bg-gradient-to-r from-[#D49A55] to-[#E26D46] text-[#141210] font-black text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-[#141210]" /> Aura Direkt 24h
                </span>
              )}
            </div>

            {/* Floating Actions on Top Right (Wishlist & Share only) */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer border ${
                  inWishlist
                    ? "bg-[#E26D46] text-white border-[#E26D46]"
                    : "bg-[#141210]/90 text-[#FAF6F0] hover:text-[#E26D46] hover:bg-[#1D1A17] border-[#2A2520]"
                }`}
                title="Омилени"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-[#141210]/90 text-[#FAF6F0] hover:text-[#E26D46] hover:bg-[#1D1A17] flex items-center justify-center shadow-md transition-colors border border-[#2A2520] cursor-pointer"
                title="Сподели"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Multi-angle Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A8A095] px-1 font-semibold">
                <span>Сите агли & страни на производот:</span>
                <span className="text-[#D49A55]">{activeImageIndex + 1} од {product.images.length}</span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl border-2 p-1.5 bg-[#FAF7F2] shrink-0 transition-all cursor-pointer shadow-xs ${
                      activeImageIndex === idx
                        ? "border-[#E26D46] ring-2 ring-[#E26D46]/40 scale-102"
                        : "border-[#E6DFD5] hover:border-[#D49A55] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Поглед ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-1 right-1 text-[9px] font-black bg-[#141210]/85 text-[#FAF6F0] px-1 rounded">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${theme === "light" ? "bg-white border-[#E5DDD2] text-[#1A1614]" : "bg-[#1D1A17] border-[#2A2520] text-[#FAF6F0]"}`}>
            {/* Brand & Filters/Compare Logo bar placed directly above Product Title */}
            <div className="flex items-center justify-between gap-2 pb-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigateTo("catalog", { brand: product.brand })}
                  className="text-xs font-black text-[#D49A55] hover:text-[#E26D46] transition-colors cursor-pointer flex items-center gap-1.5"
                  title={`Филтрирај по бренд ${product.brand}`}
                >
                  <BrandLogo brand={product.brand} size="md" showName={true} />
                </button>

                <span className="text-[#8C8377]">•</span>

                {/* Filters / Compare logo button positioned directly above product name */}
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    inCompare
                      ? "bg-[#D49A55] text-[#141210] border-[#D49A55]"
                      : theme === "light"
                      ? "bg-[#F3EFEA] text-[#1A1614] border-[#E0D7CC] hover:border-[#D49A55]"
                      : "bg-[#25211D] text-[#FAF6F0] border-[#2A2520] hover:border-[#D49A55]"
                  }`}
                  title={inCompare ? "Отстрани од споредба" : "Спореди / Филтрирај производ"}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#D49A55]" />
                  <span>{inCompare ? "Во споредба" : "Спореди"}</span>
                </button>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  product.inStock ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40" : "bg-red-950/40 text-red-400 border border-red-800/40"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-400" : "bg-red-500"}`} />
                {product.inStock ? "На залиха (брза испорака)" : "Нема на залиха"}
              </span>
            </div>

            {/* Product Title */}
            <h1 className={`text-2xl sm:text-3xl font-black leading-tight ${theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}`}>
              {product.title}
            </h1>

            {/* Rating & SKU */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="lg" />
              <span className="text-[#38322B]">|</span>
              <button
                onClick={() => setActiveTab("reviews")}
                className="text-[#A8A095] hover:text-[#E26D46] font-semibold cursor-pointer"
              >
                {product.reviews?.length || 0} оценки од купувачи
              </button>
              <span className="text-[#38322B]">|</span>
              <span className="text-[#8C8377]">Шифра: {product.id.toUpperCase()}</span>
            </div>

            {/* Price Box */}
            <div className={`mt-6 p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme === "light" ? "bg-[#F7F4EE] border-[#E5DDD2]" : "bg-[#25211D] border-[#2A2520]"}`}>
              <div>
                <div className="flex items-baseline gap-3">
                  <span className={`text-3xl sm:text-4xl font-black ${theme === "light" ? "text-[#B45309]" : "text-[#F5BA58]"}`}>
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-[#8C8377] line-through font-semibold">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                </div>

                {product.discount > 0 && (
                  <div className="text-xs font-bold text-emerald-400 mt-1">
                    Заштедувате: {formatPrice(product.originalPrice - product.price, currency)} ({product.discount}%)
                  </div>
                )}
              </div>

              {product.price >= 3000 && (
                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-[#2A2520] pt-3 sm:pt-0 sm:pl-5">
                  <span className="text-[11px] text-[#A8A095] block uppercase font-bold tracking-wider">
                    Купи на 24 рати без камата:
                  </span>
                  <span className="text-base font-black text-[#D49A55]">
                    {getInstallmentPrice(product.price, 24, currency)} / месечно
                  </span>
                </div>
              )}
            </div>

            {/* Variants Selector */}
            {product.variants && (
              <div className="mt-6 space-y-4 pt-4 border-t border-[#2A2520]">
                {/* Primary Variant */}
                <div>
                  <div className="text-xs font-bold text-[#FAF6F0] mb-2">
                    {product.variants.type === "color" ? "Боја" : "Конфигурација"}:{" "}
                    <span className="font-extrabold text-[#E26D46]">{selectedVariant}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariant(opt)}
                        className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                          selectedVariant === opt
                            ? "border-[#E26D46] bg-[#E26D46]/20 text-[#E26D46] ring-2 ring-[#E26D46]/30"
                            : "border-[#2A2520] bg-[#25211D] text-[#FAF6F0] hover:border-[#38322B]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Variant */}
                {product.variants.secondary && (
                  <div>
                    <div className="text-xs font-bold text-[#FAF6F0] mb-2">
                      {product.variants.secondary.type === "storage"
                        ? "Меморија"
                        : product.variants.secondary.type === "size"
                        ? "Големина"
                        : "Опција"}
                      : <span className="font-extrabold text-[#E26D46]">{selectedSecondary}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.secondary.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedSecondary(opt)}
                          className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                            selectedSecondary === opt
                              ? "border-[#E26D46] bg-[#E26D46]/20 text-[#E26D46] ring-2 ring-[#E26D46]/30"
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
            )}

            {/* Quantity & CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-[#2A2520] space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-[#2A2520] rounded-2xl bg-[#25211D] p-1.5 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-xl bg-[#1D1A17] font-bold text-[#A8A095] hover:text-[#FAF6F0] hover:bg-[#2A2520] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-sm text-[#FAF6F0]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="w-9 h-9 rounded-xl bg-[#1D1A17] font-bold text-[#A8A095] hover:text-[#FAF6F0] hover:bg-[#2A2520] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : product.inStock
                      ? "bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-98 text-[#141210] shadow-[#E26D46]/25"
                      : "bg-[#25211D] text-[#8C8377] cursor-not-allowed"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" /> Успешно додадено!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 text-[#141210]" /> Во кошничка
                    </>
                  )}
                </button>

                {/* Buy Now Direct */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base bg-[#FAF6F0] hover:bg-white active:scale-98 text-[#141210] shadow-md transition-all shrink-0 cursor-pointer"
                >
                  Купи веднаш
                </button>
              </div>
            </div>

            {/* Assurance Perks List */}
            <div className={`mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs ${theme === "light" ? "border-[#E5DDD2] text-[#70675C]" : "border-[#2A2520] text-[#A8A095]"}`}>
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${theme === "light" ? "bg-[#F7F4EE] border-[#E5DDD2]" : "bg-[#25211D] border-[#2A2520]"}`}>
                <Truck className="w-4 h-4 text-[#E26D46] shrink-0" />
                <span>
                  <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>Брза достава:</strong> 24-48 часа до врата
                </span>
              </div>
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${theme === "light" ? "bg-[#F7F4EE] border-[#E5DDD2]" : "bg-[#25211D] border-[#2A2520]"}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>Гаранција:</strong> 24 месеци овластен сервис
                </span>
              </div>
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${theme === "light" ? "bg-[#F7F4EE] border-[#E5DDD2]" : "bg-[#25211D] border-[#2A2520]"}`}>
                <RotateCcw className="w-4 h-4 text-[#D49A55] shrink-0" />
                <span>
                  <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>14 Дена:</strong> Бесплатно право на враќање
                </span>
              </div>
              <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${theme === "light" ? "bg-[#F7F4EE] border-[#E5DDD2]" : "bg-[#25211D] border-[#2A2520]"}`}>
                <Package className="w-4 h-4 text-[#D49A55] shrink-0" />
                <span>
                  <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>AuraBox 0-24:</strong> Подигни кога сакаш
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Frequently Bought Together Bundle */}
      <div className={`mt-12 rounded-3xl p-6 sm:p-8 border shadow-xl ${theme === "light" ? "bg-white border-[#E5DDD2] text-[#1A1614]" : "bg-[#1D1A17] border-[#2A2520] text-[#FAF6F0]"}`}>
        <div className="flex items-center gap-2 text-xs font-black text-[#D49A55] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Супер Комплет</span>
        </div>
        <h3 className={`text-xl sm:text-2xl font-black ${theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}`}>
          Често купувани заедно со попуст
        </h3>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Bundle Items */}
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            {/* Main Product */}
            <div className="w-28 sm:w-36 bg-[#FAF7F2] rounded-2xl border border-[#E6DFD5] p-3 text-center">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-20 object-contain mb-1"
              />
              <p className="text-[11px] font-bold text-[#141210] line-clamp-1">{product.title}</p>
              <p className="text-xs font-black text-[#E26D46] mt-0.5">
                {formatPrice(product.price, currency)}
              </p>
            </div>

            <span className="text-2xl font-black text-[#8C8377]">+</span>

            {/* Companion Product */}
            <div className="w-28 sm:w-36 bg-[#FAF7F2] rounded-2xl border border-[#E6DFD5] p-3 text-center">
              <img
                src={companionProduct.images[0]}
                alt={companionProduct.title}
                className="w-full h-20 object-contain mb-1"
              />
              <p className="text-[11px] font-bold text-[#141210] line-clamp-1">{companionProduct.title}</p>
              <p className="text-xs font-black text-[#E26D46] mt-0.5">
                {formatPrice(companionProduct.price, currency)}
              </p>
            </div>
          </div>

          {/* Bundle Summary & CTA */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 bg-[#25211D] p-4 rounded-2xl border border-[#2A2520] shadow-sm">
            <div>
              <span className="text-xs text-[#A8A095] block">Вкупна цена на пакетот:</span>
              <span className="text-2xl font-black text-[#FAF6F0]">
                {formatPrice(product.price + companionProduct.price, currency)}
              </span>
            </div>

            <button
              onClick={handleAddBundle}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-95 text-[#141210] font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-[#141210]" /> Додади ги двата во кошничка
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tabbed Details: Description, Specifications, Reviews */}
      <div className={`mt-12 rounded-3xl border shadow-2xl overflow-hidden ${theme === "light" ? "bg-white border-[#E5DDD2] text-[#1A1614]" : "bg-[#1D1A17] border-[#2A2520] text-[#FAF6F0]"}`}>
        {/* Tab Headers */}
        <div className={`flex border-b overflow-x-auto no-scrollbar ${theme === "light" ? "border-[#E5DDD2] bg-[#FAF8F5]" : "border-[#2A2520] bg-[#141210]"}`}>
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === "description" ? (theme === "light" ? "border-[#E26D46] text-[#C84E25] bg-white font-black" : "border-[#E26D46] text-[#E26D46] bg-[#1D1A17] font-black") : (theme === "light" ? "border-transparent text-[#70675C] hover:text-[#1A1614]" : "border-transparent text-[#A8A095] hover:text-[#FAF6F0]")
            }`}
          >
            Опис & Карактеристики
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === "specs" ? (theme === "light" ? "border-[#E26D46] text-[#C84E25] bg-white font-black" : "border-[#E26D46] text-[#E26D46] bg-[#1D1A17] font-black") : (theme === "light" ? "border-transparent text-[#70675C] hover:text-[#1A1614]" : "border-transparent text-[#A8A095] hover:text-[#FAF6F0]")
            }`}
          >
            Технички спецификации
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === "reviews" ? (theme === "light" ? "border-[#E26D46] text-[#C84E25] bg-white font-black" : "border-[#E26D46] text-[#E26D46] bg-[#1D1A17] font-black") : (theme === "light" ? "border-transparent text-[#70675C] hover:text-[#1A1614]" : "border-transparent text-[#A8A095] hover:text-[#FAF6F0]")
            }`}
          >
            Оценки & Рецензии ({product.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === "shipping" ? (theme === "light" ? "border-[#E26D46] text-[#C84E25] bg-white font-black" : "border-[#E26D46] text-[#E26D46] bg-[#1D1A17] font-black") : (theme === "light" ? "border-transparent text-[#70675C] hover:text-[#1A1614]" : "border-transparent text-[#A8A095] hover:text-[#FAF6F0]")
            }`}
          >
            Достава & Гаранција
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {/* 1. Description */}
          {activeTab === "description" && (
            <div className="space-y-6">
              <p className="text-[#FAF6F0]/90 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>

              {product.features && (
                <div>
                  <h4 className="text-sm font-bold text-[#D49A55] uppercase tracking-wider mb-3">
                    Главни предности на производот:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#A8A095]">
                        <span className="w-5 h-5 rounded-full bg-[#E26D46]/20 text-[#E26D46] flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 2. Specs */}
          {activeTab === "specs" && (
            <div>
              <h4 className="text-sm font-bold text-[#D49A55] uppercase tracking-wider mb-4">
                Технички детали:
              </h4>
              <div className="border border-[#2A2520] rounded-2xl overflow-hidden divide-y divide-[#2A2520]">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm">
                      <span className="font-bold text-[#A8A095]">{key}</span>
                      <span className="sm:col-span-2 text-[#FAF6F0]">{val}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-[#8C8377]">Спецификациите наскоро ќе бидат ажурирани.</div>
                )}
              </div>
            </div>
          )}

          {/* 3. Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Header with average and "Write review" button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#25211D] rounded-2xl border border-[#2A2520]">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[#FAF6F0]">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-[#A8A095] font-bold">од 5.0</span>
                  </div>
                  <StarRating rating={product.rating} reviewCount={product.reviews?.length || 0} size="lg" />
                  <p className="text-xs text-emerald-400 mt-1 font-semibold">100% потврдени купувачи</p>
                </div>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-95 text-[#141210] font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#141210]" /> Напиши рецензија
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 sm:p-5 rounded-2xl border border-[#2A2520] bg-[#25211D]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#1D1A17] border border-[#2A2520] font-bold text-[#E26D46] flex items-center justify-center text-xs">
                            {rev.user.slice(0, 1)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#FAF6F0] block">{rev.user}</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              ✓ Потврден купувач
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <StarRating rating={rev.rating} showNumber={false} />
                          <span className="text-[10px] text-[#8C8377] block mt-0.5">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-[#A8A095] mt-2">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8C8377]">Сè уште нема коментари за овој производ.</p>
                )}
              </div>
            </div>
          )}

          {/* 4. Shipping info */}
          {activeTab === "shipping" && (
            <div className="space-y-4 text-xs sm:text-sm text-[#A8A095] leading-relaxed">
              <p>
                <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>Начин на достава:</strong> Сите нарачки направени до 16:00 часот се обработуваат истиот ден и се предаваат на курирската служба.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>Aura Direkt:</strong> Испорака за 24 часа директно од нашиот централен логистички центар.
                </li>
                <li>
                  <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>AuraBox 24/7:</strong> Подигнување во било кое време (00-24ч) без чекање со уникатен СМС код за отклучување.
                </li>
                <li>
                  <strong className={theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}>Бесплатна достава:</strong> За секоја нарачка со вкупна вредност поголема од 1.500 ден.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal Form */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1D1A17] border border-[#2A2520] rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-[#FAF6F0]">
            <h3 className="text-lg font-bold text-[#FAF6F0] mb-1">
              Оцени го производот
            </h3>
            <p className="text-xs text-[#A8A095] mb-4">
              Вашето искуство им помага на илјадници купувачи да направат правилен избор.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#FAF6F0] mb-1">
                  Вашата оцена:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating
                            ? "fill-[#D49A55] text-[#D49A55]"
                            : "fill-[#25211D] text-[#38322B]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FAF6F0] mb-1">
                  Вашето име и презиме:
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="пр. Игор Смилевски"
                  className="w-full bg-[#25211D] border border-[#2A2520] rounded-xl px-3 py-2 text-xs text-[#FAF6F0] placeholder-[#8C8377] outline-none focus:border-[#E26D46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FAF6F0] mb-1">
                  Вашиот коментар и впечатоци:
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Опишете го квалитетот, брзината на достава и функционалноста..."
                  className="w-full bg-[#25211D] border border-[#2A2520] rounded-xl p-3 text-xs text-[#FAF6F0] placeholder-[#8C8377] outline-none focus:border-[#E26D46]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#A8A095] hover:bg-[#25211D] rounded-xl cursor-pointer"
                >
                  Откажи
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 text-[#141210] font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Објави рецензија
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl sm:text-2xl font-black ${theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}`}>
              Слични производи од истата категорија
            </h2>
            <button
              onClick={() => navigateTo("catalog", product.category)}
              className="text-xs sm:text-sm font-bold text-[#E26D46] hover:text-[#D49A55] cursor-pointer"
            >
              Види ги сите &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
      {/* Mobile Sticky Add-to-Cart Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        theme === "light" ? "bg-white/95 border-[#E5DDD2]" : "bg-[#141210]/95 border-[#2A2520]"
      }`}>
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-11 h-11 rounded-xl object-contain bg-[#FAF7F2] p-1 border border-[#E6DFD5] shrink-0"
            />
            <div className="min-w-0">
              <h4 className={`text-xs font-bold truncate leading-tight ${
                theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"
              }`}>
                {product.title}
              </h4>
              <div className="text-xs font-black text-[#E26D46] mt-0.5">
                {formatPrice(product.price, currency)}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-4 py-2.5 rounded-xl font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer ${
              isAdded
                ? "bg-emerald-600 text-white"
                : product.inStock
                ? "bg-gradient-to-r from-[#E26D46] to-[#D49A55] text-[#141210]"
                : "bg-[#25211D] text-[#8C8377] cursor-not-allowed"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Додадено!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Во кошничка
              </>
            )}
          </button>
        </div>
      </div>
    
    </div>
  );
};
