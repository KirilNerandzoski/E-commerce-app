import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import {
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";

export const Footer = () => {
  const { navigateTo, addToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      addToast("Ве молиме внесете валидна е-маил адреса", "warning");
      return;
    }
    addToast("Ви благодариме! Се претплативте на AURA билтенот со 500 ден. купон код!", "success");
    setNewsletterEmail("");
  };

  return (
    <footer className="bg-[#0D0B0A] text-[#A8A095] mt-16 pt-12 pb-24 lg:pb-12 border-t border-[#2A2520]">
      {/* 1. Value Propositions Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#2A2520]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141210] border border-[#2A2520]">
            <div className="w-12 h-12 rounded-xl bg-[#E26D46]/15 text-[#E26D46] flex items-center justify-center shrink-0 border border-[#E26D46]/25">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#FAF6F0] text-sm">Брза 24-48h достава</h4>
              <p className="text-xs text-[#A8A095] mt-0.5">Бесплатна достава над 1.500 ден.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141210] border border-[#2A2520]">
            <div className="w-12 h-12 rounded-xl bg-[#D49A55]/15 text-[#D49A55] flex items-center justify-center shrink-0 border border-[#D49A55]/25">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#FAF6F0] text-sm">14 дена враќање</h4>
              <p className="text-xs text-[#A8A095] mt-0.5">Лесна замена без компликации</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141210] border border-[#2A2520]">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#FAF6F0] text-sm">100% Безбедно плаќање</h4>
              <p className="text-xs text-[#A8A095] mt-0.5">Картичка, на рати или при достава</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141210] border border-[#2A2520]">
            <div className="w-12 h-12 rounded-xl bg-[#D49A55]/15 text-[#D49A55] flex items-center justify-center shrink-0 border border-[#D49A55]/25">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#FAF6F0] text-sm">Корисничка поддршка</h4>
              <p className="text-xs text-[#A8A095] mt-0.5">02 3100 500 (Пон - Саб 08-20h)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-[#2A2520]">
        <div className="bg-gradient-to-r from-[#A33D1E] via-[#C8522C] to-[#D49A55] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-[#FAF6F0] text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-[#FAF6F0]/80">
              Ексклузивни промоции
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 text-[#FAF6F0]">
              Претплатете се и добијте купон од 500 ден.!
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF6F0]/90 mt-1 max-w-md">
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
              className="flex-1 bg-[#FAF7F2] text-[#141210] placeholder-[#8C8377] text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#E6DFD5] outline-none shadow-md font-semibold"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-[#141210] hover:bg-[#1D1A17] text-[#FAF6F0] font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#D49A55]" /> Претплати се
            </button>
          </form>
        </div>
      </div>

      {/* 3. Link Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 cursor-pointer select-none mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C8522C] to-[#D49A55] flex items-center justify-center font-black text-[#141210] text-sm shadow-md shadow-[#C8522C]/20">
                AU
              </div>
              <span className="text-2xl font-black text-[#FAF6F0] tracking-tight">AUR<span className="text-[#E26D46]">A</span></span>
              <span className="text-xs font-black bg-[#E26D46] text-white px-1.5 py-0.5 rounded">.mk</span>
            </div>
            <p className="text-xs text-[#A8A095] leading-relaxed max-w-sm">
              Водечкиот премиум интернет маркет за селектирана технологија, мода и животен стил. Илјадници врвни производи со сигурна гаранција и брза достава директно до вашата врата или AuraBox 24/7.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-[#A8A095] font-semibold">Мобилна апликација:</span>
              <span className="inline-block bg-[#1D1A17] px-3 py-1 rounded-lg text-xs font-bold text-[#FAF6F0] border border-[#2A2520]">
                Google Play
              </span>
              <span className="inline-block bg-[#1D1A17] px-3 py-1 rounded-lg text-xs font-bold text-[#FAF6F0] border border-[#2A2520]">
                App Store
              </span>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-bold text-[#FAF6F0] text-xs uppercase tracking-wider mb-4">
              Корисничка поддршка
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A095]">
              <li><button onClick={() => navigateTo("profile", "orders")} className="hover:text-[#FAF6F0] transition-colors cursor-pointer">Следење на нарачка</button></li>
              <li><a href="#returns" onClick={(e) => { e.preventDefault(); addToast("Условите за враќање се 14 дена од преземање.", "info"); }} className="hover:text-[#FAF6F0] transition-colors">Рекламации & Враќање</a></li>
              <li><a href="#shipping" onClick={(e) => { e.preventDefault(); addToast("Доставата е бесплатна за нарачки над 1.500 ден.", "info"); }} className="hover:text-[#FAF6F0] transition-colors">Услови за испорака</a></li>
              <li><a href="#payment" onClick={(e) => { e.preventDefault(); addToast("Прифаќаме картички, плаќање на рати и готовина при достава.", "info"); }} className="hover:text-[#FAF6F0] transition-colors">Начини на плаќање</a></li>
              <li><a href="#lockers" onClick={(e) => { e.preventDefault(); addToast("AuraBox пакетоматите се достапни 0-24ч на над 50 локации.", "info"); }} className="hover:text-[#FAF6F0] transition-colors">AuraBox 24/7</a></li>
            </ul>
          </div>

          {/* About & Partners */}
          <div>
            <h5 className="font-bold text-[#FAF6F0] text-xs uppercase tracking-wider mb-4">
              За AURA
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A095]">
              <li><a href="#about" onClick={(e) => e.preventDefault()} className="hover:text-[#FAF6F0] transition-colors">За нас & Мисија</a></li>
              <li><a href="#direct" onClick={(e) => { e.preventDefault(); navigateTo("catalog", { directOnly: true }); }} className="hover:text-[#FAF6F0] transition-colors">Aura Direkt магацин</a></li>
              <li><a href="#partner" onClick={(e) => { e.preventDefault(); addToast("Продажбата на AURA е овозможена за сертифицирани трговци.", "info"); }} className="hover:text-[#FAF6F0] transition-colors">Станете наш партнер</a></li>
              <li><a href="#careers" onClick={(e) => e.preventDefault()} className="hover:text-[#FAF6F0] transition-colors">Кариера & Вработување</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#FAF6F0] transition-colors">Политика на приватност</a></li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h5 className="font-bold text-[#FAF6F0] text-xs uppercase tracking-wider mb-4">
              Топ Категории
            </h5>
            <ul className="space-y-2.5 text-xs text-[#A8A095]">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateTo("catalog", cat.id)}
                    className="hover:text-[#FAF6F0] transition-colors text-left cursor-pointer"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#2A2520] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8C8377]">
        <div>
          <p>© 2026 AURA Marketplace. Сите права се задржани.</p>
          <p className="text-[11px] text-[#8C8377] mt-0.5">
            Селектиран премиум маркет за технологија, дом и животен стил. Сите производи и нарачки во ова демо се фиктивни.
          </p>
        </div>

        {/* Accepted Payment badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 bg-[#1D1A17] rounded font-bold text-[#A8A095] text-[10px] border border-[#2A2520]">VISA</span>
          <span className="px-2 py-1 bg-[#1D1A17] rounded font-bold text-[#A8A095] text-[10px] border border-[#2A2520]">Mastercard</span>
          <span className="px-2 py-1 bg-[#1D1A17] rounded font-bold text-[#A8A095] text-[10px] border border-[#2A2520]">Maestro</span>
          <span className="px-2 py-1 bg-[#1D1A17] rounded font-bold text-[#A8A095] text-[10px] border border-[#2A2520]">DinaCard</span>
          <span className="px-2 py-1 bg-[#1D1A17] rounded font-bold text-[#D49A55] text-[10px] border border-[#2A2520]">Готовина</span>
          <span className="px-2 py-1 bg-[#1D1A17] rounded font-bold text-emerald-400 text-[10px] border border-[#2A2520]">24 Рати</span>
        </div>
      </div>
    </footer>
  );
};
