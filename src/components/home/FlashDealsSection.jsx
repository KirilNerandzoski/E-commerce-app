import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../product/ProductCard";
import { Flame, Clock, ArrowRight } from "lucide-react";

export const FlashDealsSection = () => {
  const { products, navigateTo, setCatalogFilters } = useApp();

  // Deal of the Day live countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter deal products
  const dealProducts = products.filter((p) => p.isDealOfTheDay || p.discount >= 20).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      {/* Header with Title and Countdown */}
      <div className="bg-gradient-to-r from-[#A33D1E] via-[#C8522C] to-[#E26D46] rounded-3xl p-5 sm:p-7 shadow-xl text-[#FAF6F0] mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#141210]/30 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/10">
            <Flame className="w-7 h-7 text-[#D49A55] fill-[#D49A55] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-black/30 px-2.5 py-0.5 rounded-full text-[#FAF6F0]">
                Ограничена понуда
              </span>
              <span className="text-xs text-[#F5EFEB]/90 font-bold">• Додека траат залихите</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 text-[#FAF6F0]">
              Супер Зделки на Денот
            </h2>
          </div>
        </div>

        {/* Real-time Countdown Box */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5EFEB]/80 mr-2">
            <Clock className="w-4 h-4 text-[#D49A55]" />
            <span>Завршува за:</span>
          </div>

          <div className="flex items-center gap-1.5 font-black">
            <div className="bg-[#1D1A17] border border-[#2A2520] text-[#FAF6F0] rounded-xl px-2.5 py-1.5 min-w-[42px] text-center shadow-md">
              <span className="text-base sm:text-lg">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="block text-[9px] font-bold text-[#A8A095] uppercase leading-none">Час</span>
            </div>
            <span className="text-white text-lg font-bold">:</span>
            <div className="bg-[#1D1A17] border border-[#2A2520] text-[#FAF6F0] rounded-xl px-2.5 py-1.5 min-w-[42px] text-center shadow-md">
              <span className="text-base sm:text-lg">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="block text-[9px] font-bold text-[#A8A095] uppercase leading-none">Мин</span>
            </div>
            <span className="text-white text-lg font-bold">:</span>
            <div className="bg-[#1D1A17] border border-[#2A2520] text-[#D49A55] rounded-xl px-2.5 py-1.5 min-w-[42px] text-center shadow-md">
              <span className="text-base sm:text-lg font-black">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="block text-[9px] font-bold text-[#A8A095] uppercase leading-none">Сек</span>
            </div>
          </div>

          <button
            onClick={() => {
              setCatalogFilters((prev) => ({ ...prev, discountOnly: true, category: "all" }));
              navigateTo("catalog");
            }}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#FAF6F0] bg-black/20 hover:bg-black/40 px-3.5 py-2.5 rounded-xl ml-2 transition-colors cursor-pointer border border-white/10"
          >
            Види ги сите <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
