import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import {
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export const Footer = () => {
  const { navigateTo, addToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      addToast("Ве молиме внесете валидна е-маил адреса", "warning");
      return;
    }
    setIsSubscribed(true);
    addToast("Ви благодариме! Се претплативте на PazarMax билтенот со 500 ден. купон код!", "success");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      {/* 1. Value Propositions Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Брза 24-48h достава</h4>
              <p className="text-xs text-slate-400 mt-0.5">Бесплатна достава над 1.500 ден.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">14 дена враќање</h4>
              <p className="text-xs text-slate-400 mt-0.5">Лесна замена без компликации</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Безбедно плаќање</h4>
              <p className="text-xs text-slate-400 mt-0.5">Картичка, на рати или при достава</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-800/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Корисничка поддршка</h4>
              <p className="text-xs text-slate-400 mt-0.5">02 3100 500 (Пон - Саб 08-20h)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-800">
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-white text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-amber-200">
              Ексклузивни промоции
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              Претплатете се и добијте купон од 500 ден.!
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-md">
              Бидете први што ќе дознаат за најголемите попусти, викенд шопинг акции и нови производи.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="w-full md:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Внесете ја вашата е-маил адреса..."
              className="flex-1 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm px-4 py-3 rounded-xl border-none outline-none shadow-md"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" /> Претплати се
            </button>
          </form>
        </div>
      </div>

      {/* 3. Link Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 cursor-pointer select-none mb-3">
              <span className="text-3xl">🛍️</span>
              <span className="text-2xl font-black text-white tracking-tight">pazar<span className="text-orange-500">max</span></span>
              <span className="text-xs font-black bg-orange-500 text-white px-1.5 py-0.5 rounded">.mk</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Водечкиот регионален интернет пазар за сѐ што ви треба во домот и секојдневието. Илјадници производи со гаранција за квалитет и најбрза достава директно до вашата врата или PazarMax Paketomat.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Мобилна апликација:</span>
              <span className="inline-block bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-white border border-slate-700">
                Google Play
              </span>
              <span className="inline-block bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-white border border-slate-700">
                App Store
              </span>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Корисничка поддршка
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><button onClick={() => navigateTo("profile", "orders")} className="hover:text-white transition-colors">Следење на нарачка</button></li>
              <li><a href="#returns" onClick={(e) => { e.preventDefault(); addToast("Условите за враќање се 14 дена од преземање.", "info"); }} className="hover:text-white transition-colors">Рекламации & Враќање</a></li>
              <li><a href="#shipping" onClick={(e) => { e.preventDefault(); addToast("Доставата е бесплатна за нарачки над 1.500 ден.", "info"); }} className="hover:text-white transition-colors">Услови за испорака</a></li>
              <li><a href="#payment" onClick={(e) => { e.preventDefault(); addToast("Прифаќаме картички, плаќање на рати и готовина при достава.", "info"); }} className="hover:text-white transition-colors">Начини на плаќање</a></li>
              <li><a href="#lockers" onClick={(e) => { e.preventDefault(); addToast("PazarMax Paketomati се достапни 0-24ч на над 50 локации.", "info"); }} className="hover:text-white transition-colors">PazarMax Paketomat 24/7</a></li>
            </ul>
          </div>

          {/* About & Partners */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              За PazarMax
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#about" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">За нас & Мисија</a></li>
              <li><a href="#direct" onClick={(e) => { e.preventDefault(); navigateTo("catalog", { directOnly: true }); }} className="hover:text-white transition-colors">PazarMax Direkt магацин</a></li>
              <li><a href="#partner" onClick={(e) => { e.preventDefault(); addToast("Продажбата на PazarMax е овозможена за сертифицирани трговци.", "info"); }} className="hover:text-white transition-colors">Станете наш партнер</a></li>
              <li><a href="#careers" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Кариера & Вработување</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">Политика на приватност</a></li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Топ Категории
            </h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo("catalog", cat.id)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Bottom Disclaimer & Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <p>© 2026 PazarMax E-Commerce Marketplace Demo. Сите права се задржани.</p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Демо портфолио проект со модерен регионален е-трговски дизајн. Сите производи и нарачки се фиктивни.
          </p>
        </div>

        {/* Accepted Payment badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 bg-slate-800 rounded font-bold text-slate-300 text-[10px]">VISA</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-bold text-slate-300 text-[10px]">Mastercard</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-bold text-slate-300 text-[10px]">Maestro</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-bold text-slate-300 text-[10px]">DinaCard</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-bold text-amber-400 text-[10px]">Готовина</span>
          <span className="px-2 py-1 bg-slate-800 rounded font-bold text-emerald-400 text-[10px]">24 Рати</span>
        </div>
      </div>
    </footer>
  );
};
