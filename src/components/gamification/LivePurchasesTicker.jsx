import React, { useState, useEffect } from "react";
import { PRODUCTS } from "../../data/products";
import { useApp } from "../../context/AppContext";
import { ShoppingBag, X, CheckCircle2 } from "lucide-react";

const CITIES = [
  "Скопје (Аеродром)",
  "Битола",
  "Охрид",
  "Куманово",
  "Тетово",
  "Прилеп",
  "Струмица",
  "Штип",
  "Скопје (Центар)",
  "Велес",
];

const NAMES = [
  "Марко К.",
  "Елена С.",
  "Стефан П.",
  "Ана М.",
  "Игор Т.",
  "Марија Д.",
  "Никола Ј.",
  "Кристина Б.",
  "Александар В.",
  "Сара Г.",
];

export const LivePurchasesTicker = () => {
  const { navigateTo } = useApp();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const generateRandomPurchase = () => {
      const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const randomMinutes = Math.floor(Math.random() * 8) + 1;

      return {
        product: randomProduct,
        city: randomCity,
        name: randomName,
        timeAgo: randomMinutes === 1 ? "пред 1 мин." : `пред ${randomMinutes} мин.`,
      };
    };

    // First display after 4 seconds
    const initialTimer = setTimeout(() => {
      setCurrentNotification(generateRandomPurchase());
      setIsVisible(true);
    }, 4000);

    // Then toggle every 18 seconds
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentNotification(generateRandomPurchase());
        setIsVisible(true);
      }, 1000);
    }, 18000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !currentNotification) return null;

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 max-w-xs sm:max-w-sm transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div
        onClick={() => navigateTo("product", currentNotification.product.id)}
        className="bg-[#0D1527]/95 border border-slate-700/80 hover:border-orange-500/50 rounded-2xl p-3 shadow-2xl shadow-black/80 backdrop-blur-md flex items-center gap-3 cursor-pointer group"
      >
        {/* Product Thumbnail in White pod */}
        <div className="w-12 h-12 rounded-xl bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center border border-slate-700/40">
          <img
            src={currentNotification.product.images[0]}
            alt={currentNotification.product.title}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Штотуку купено од {currentNotification.city}</span>
          </div>
          <div className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
            {currentNotification.product.title}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
            <span>{currentNotification.name}</span>
            <span>•</span>
            <span>{currentNotification.timeAgo}</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsDismissed(true);
          }}
          className="p-1 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Затвори известувања"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
