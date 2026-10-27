import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ChevronLeft, ChevronRight, Zap, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export const HeroBannerSlider = () => {
  const { navigateTo } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "slide-1",
      tag: "ГОЛЕМА ТЕХНО АКЦИЈА",
      tagColor: "bg-orange-500 text-white",
      title: "Најнови паметни телефони и лаптопи",
      subtitle: "До 25% попуст на Apple, Samsung, Lenovo и водечките брендови со PazarMax Direkt брза достава.",
      ctaText: "Истражи Технологија",
      targetCategory: "electronics",
      bgGradient: "from-slate-950 via-slate-900 to-indigo-950",
      accentGlow: "from-orange-500/30 to-amber-500/10",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-2",
      tag: "ДОМ & БЕЛА ТЕХНИКА",
      tagColor: "bg-emerald-600 text-white",
      title: "Модернизирајте го вашиот дом",
      subtitle: "Airfryer апарати, инвертер клими и робот правосмукалки со 5 години гаранција и купување на 24 рати.",
      ctaText: "Види Бела Техника",
      targetCategory: "appliances",
      bgGradient: "from-slate-950 via-zinc-900 to-emerald-950",
      accentGlow: "from-emerald-500/30 to-teal-500/10",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "slide-3",
      tag: "СУПЕР МОДА & СПОРТ",
      tagColor: "bg-rose-600 text-white",
      title: "Нова есенска колекција и фитнес",
      subtitle: "Оригинални Nike патики, Tommy Hilfiger јакни и Xiaomi тротинети по промотивни цени.",
      ctaText: "Купи Модни Парчиња",
      targetCategory: "fashion",
      bgGradient: "from-slate-950 via-stone-900 to-rose-950",
      accentGlow: "from-rose-500/30 to-orange-500/10",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    },
  ];

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Main Hero Slider (Takes 8 or 9 cols on large screens) */}
        <div className="lg:col-span-8 xl:col-span-9 relative rounded-3xl overflow-hidden shadow-xl min-h-[360px] sm:min-h-[420px] flex items-center bg-slate-950">
          {/* Animated Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${activeSlide.bgGradient} transition-all duration-700`}
          />
          <div
            className={`absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br ${activeSlide.accentGlow} rounded-full blur-3xl pointer-events-none`}
          />

          {/* Slide Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 w-full flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-left">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3 shadow-xs ${activeSlide.tagColor}`}
              >
                {activeSlide.tag}
              </span>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                {activeSlide.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-md">
                {activeSlide.subtitle}
              </p>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => navigateTo("catalog", activeSlide.targetCategory)}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all"
                >
                  {activeSlide.ctaText} <ArrowRight className="w-4 h-4" />
                </button>
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium pl-2">
                  <Truck className="w-4 h-4 text-emerald-400" /> Брза 24h испорака
                </div>
              </div>
            </div>

            {/* Slide Product Hero Image */}
            <div className="w-48 sm:w-64 lg:w-72 aspect-square relative shrink-0 hidden md:flex items-center justify-center">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xs p-3">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  className="w-full h-full object-cover rounded-xl transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Slider Arrow Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? "w-7 bg-orange-500" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Side Mini Promo Cards (Balkan marketplace signature) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-4">
          {/* Card 1: PazarMax Direkt */}
          <div
            onClick={() => navigateTo("catalog", { directOnly: true })}
            className="flex-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg cursor-pointer hover:shadow-orange-500/25 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-slate-900 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-300" /> Direkt Hub
                </span>
                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-md">24ч достава</span>
              </div>
              <h3 className="text-lg font-black mt-3 leading-snug group-hover:translate-x-1 transition-transform">
                Купи денес, добиј утре на твојата адреса!
              </h3>
              <p className="text-xs text-amber-100 mt-1">
                Илјадници производи директно од нашиот централен магацин.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold pt-2 border-t border-white/20">
              <span>Истражи Direkt понуда</span>
              <span className="text-sm">→</span>
            </div>
          </div>

          {/* Card 2: Paketomat 24/7 */}
          <div
            onClick={() => navigateTo("catalog", "household")}
            className="flex-1 bg-slate-900 rounded-3xl p-5 text-white flex flex-col justify-between shadow-lg cursor-pointer hover:bg-slate-800 transition-all border border-slate-800 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  0-24ч Paketomat
                </span>
                <span className="text-xs text-slate-400">50+ локации</span>
              </div>
              <h3 className="text-lg font-black mt-3 leading-snug text-white group-hover:text-orange-400 transition-colors">
                Подигни пратка кога тебе ти одговара!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Без чекање курир. На безбедни пакетомати во целата земја.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-800 text-orange-400">
              <span>Погледни производи</span>
              <span className="text-sm">→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
