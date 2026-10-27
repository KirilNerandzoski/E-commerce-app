import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import { formatPrice, getInstallmentPrice } from "../../utils/formatters";
import { StarRating } from "../product/StarRating";
import { ProductCard } from "../product/ProductCard";
import {
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
    if (!newReviewAuthor.trim() || !newReviewText.trim()) {
      addToast("Ве молиме пополнете го вашето име и коментар", "warning");
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${today.getFullYear()}`;

    addReviewToProduct(product.id, {
      id: "rev-" + Date.now(),
      user: newReviewAuthor.trim(),
      rating: Number(newReviewRating),
      date: dateStr,
      comment: newReviewText.trim(),
    });

    setNewReviewAuthor("");
    setNewReviewText("");
    setShowReviewModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigateTo("home")} className="hover:text-orange-600 transition-colors">
          Почетна
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button onClick={() => navigateTo("catalog")} className="hover:text-orange-600 transition-colors">
          Каталог
        </button>
        {categoryObj && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={() => navigateTo("catalog", categoryObj.id)}
              className="hover:text-orange-600 transition-colors"
            >
              {categoryObj.name}
            </button>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-bold text-slate-800 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* 2. Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Photo with Badges & Action Overlays */}
          <div className="relative aspect-square w-full rounded-3xl bg-white border border-slate-200/80 p-6 flex items-center justify-center shadow-xs overflow-hidden group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges on Top Left */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.discount > 0 && (
                <span className="bg-red-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-md">
                  -{product.discount}% ПОПУСТ
                </span>
              )}
              {product.isDirectDelivery && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-white" /> PazarMax Direkt 24h
                </span>
              )}
            </div>

            {/* Floating Actions on Top Right */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  inWishlist
                    ? "bg-red-50 text-red-500"
                    : "bg-white text-slate-400 hover:text-red-500 hover:bg-slate-50"
                }`}
                title="Омилени"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500" : ""}`} />
              </button>

              <button
                onClick={() => toggleCompare(product.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  inCompare
                    ? "bg-amber-100 text-amber-600"
                    : "bg-white text-slate-400 hover:text-amber-600 hover:bg-slate-50"
                }`}
                title="Спореди"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white text-slate-400 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center shadow-md transition-colors"
                title="Сподели"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl border-2 p-1 bg-white shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? "border-orange-500 ring-2 ring-orange-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            {/* Brand & Stock */}
            <div className="flex items-center justify-between gap-2 pb-2">
              <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                {product.brand}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                {product.inStock ? "На залиха (брза испорака)" : "Нема на залиха"}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating & SKU */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size="lg" />
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setActiveTab("reviews")}
                className="text-slate-600 hover:text-orange-600 font-semibold"
              >
                {product.reviews?.length || 0} оценки од купувачи
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">Шифра: {product.id.toUpperCase()}</span>
            </div>

            {/* Price Box */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-orange-600">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through font-semibold">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                </div>

                {product.discount > 0 && (
                  <div className="text-xs font-bold text-emerald-600 mt-1">
                    Заштедувате: {formatPrice(product.originalPrice - product.price, currency)} ({product.discount}%)
                  </div>
                )}
              </div>

              {product.price >= 3000 && (
                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-5">
                  <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                    Купи на 24 рати без камата:
                  </span>
                  <span className="text-base font-black text-slate-800">
                    {getInstallmentPrice(product.price, 24, currency)} / месечно
                  </span>
                </div>
              )}
            </div>

            {/* Variants Selector */}
            {product.variants && (
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
                {/* Primary Variant (Color / Spec) */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    {product.variants.type === "color" ? "Боја" : "Конфигурација"}:{" "}
                    <span className="font-extrabold text-orange-600">{selectedVariant}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariant(opt)}
                        className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all ${
                          selectedVariant === opt
                            ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-200"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secondary Variant (Storage / Size) */}
                {product.variants.secondary && (
                  <div>
                    <div className="text-xs font-bold text-slate-800 mb-2">
                      {product.variants.secondary.type === "storage"
                        ? "Меморија"
                        : product.variants.secondary.type === "size"
                        ? "Големина"
                        : "Опција"}
                      : <span className="font-extrabold text-orange-600">{selectedSecondary}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.secondary.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedSecondary(opt)}
                          className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all ${
                            selectedSecondary === opt
                              ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-200"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
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
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-slate-200 rounded-2xl bg-slate-50 p-1.5 shrink-0">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-xl bg-white shadow-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                    className="w-9 h-9 rounded-xl bg-white shadow-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : product.inStock
                      ? "bg-orange-500 hover:bg-orange-600 active:scale-98 text-white shadow-orange-500/30"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" /> Успешно додадено!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Во кошничка
                    </>
                  )}
                </button>

                {/* Buy Now Direct */}
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base bg-slate-900 hover:bg-slate-800 active:scale-98 text-white shadow-md transition-all shrink-0"
                >
                  Купи веднаш
                </button>
              </div>
            </div>

            {/* Assurance Perks List */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50">
                <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                <span>
                  <strong>Брза достава:</strong> 24-48 часа до врата
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  <strong>Гаранција:</strong> 24 месеци овластен сервис
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50">
                <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>14 Дена:</strong> Бесплатно право на враќање
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50">
                <Package className="w-4 h-4 text-purple-500 shrink-0" />
                <span>
                  <strong>Paketomat 0-24:</strong> Подигни кога сакаш
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Frequently Bought Together Bundle */}
      <div className="mt-12 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Супер Комплет</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Често купувани заедно со попуст
        </h3>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Bundle Items */}
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            {/* Main Product */}
            <div className="w-28 sm:w-36 bg-white rounded-2xl border border-slate-200 p-3 text-center">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-20 object-contain mix-blend-multiply mb-1"
              />
              <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{product.title}</p>
              <p className="text-xs font-black text-orange-600 mt-0.5">
                {formatPrice(product.price, currency)}
              </p>
            </div>

            <span className="text-2xl font-black text-slate-400">+</span>

            {/* Companion Product */}
            <div className="w-28 sm:w-36 bg-white rounded-2xl border border-slate-200 p-3 text-center">
              <img
                src={companionProduct.images[0]}
                alt={companionProduct.title}
                className="w-full h-20 object-contain mix-blend-multiply mb-1"
              />
              <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{companionProduct.title}</p>
              <p className="text-xs font-black text-orange-600 mt-0.5">
                {formatPrice(companionProduct.price, currency)}
              </p>
            </div>
          </div>

          {/* Bundle Summary & CTA */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-orange-200 shadow-sm">
            <div>
              <span className="text-xs text-slate-500 block">Вкупна цена на пакетот:</span>
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(product.price + companionProduct.price, currency)}
              </span>
            </div>

            <button
              onClick={handleAddBundle}
              className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Додади ги двата во кошничка
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tabbed Details: Description, Specifications, Reviews */}
      <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === "description"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Опис & Карактеристики
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === "specs"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Технички спецификации
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === "reviews"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Оценки & Рецензии ({product.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === "shipping"
                ? "border-orange-500 text-orange-600 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
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
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>

              {product.features && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Главни предности на производот:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
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
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Технички детали:
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm">
                      <span className="font-bold text-slate-600">{key}</span>
                      <span className="sm:col-span-2 text-slate-800">{val}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-slate-500">Спецификациите наскоро ќе бидат ажурирани.</div>
                )}
              </div>
            </div>
          )}

          {/* 3. Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-8">
              {/* Header with average and "Write review" button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400 font-bold">од 5.0</span>
                  </div>
                  <StarRating rating={product.rating} reviewCount={product.reviews?.length || 0} size="lg" />
                  <p className="text-xs text-slate-500 mt-1">100% потврдени купувачи</p>
                </div>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Напиши рецензија
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center text-xs">
                            {rev.user.slice(0, 1)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{rev.user}</span>
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              ✓ Потврден купувач
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <StarRating rating={rev.rating} showNumber={false} />
                          <span className="text-[10px] text-slate-400 block mt-0.5">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 mt-2">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Сè уште нема коментари за овој производ.</p>
                )}
              </div>
            </div>
          )}

          {/* 4. Shipping info */}
          {activeTab === "shipping" && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Начин на достава:</strong> Сите нарачки направени до 16:00 часот се обработуваат истиот ден и се предаваат на курирската служба.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>PazarMax Direkt:</strong> Испорака за 24 часа директно од нашиот централен логистички центар.
                </li>
                <li>
                  <strong>PazarMax Paketomat:</strong> Подигнување во било кое време (00-24ч) без чекање со уникатен СМС код за отклучување.
                </li>
                <li>
                  <strong>Бесплатна достава:</strong> За секоја нарачка со вкупна вредност поголема од 1.500 ден.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal Form */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Оцени го производот
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Вашето искуство им помага на илјадници купувачи да направат правилен избор.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Вашата оцена:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Вашето име и презиме:
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="пр. Игор Смилевски"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Вашиот коментар и впечатоци:
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Опишете го квалитетот, брзината на достава и функционалноста..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Откажи
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Слични производи од истата категорија
            </h2>
            <button
              onClick={() => navigateTo("catalog", product.category)}
              className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700"
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
    </div>
  );
};
