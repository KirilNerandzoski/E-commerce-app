import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Copy, Check, Tag, Zap } from "lucide-react";

export const PromoBanners = () => {
  const { addToast } = useApp();
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Купонот "${code}" е копиран! Искористете го при наплата.`, "success");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Banner 1: PAZAR10 - Warm Terracotta Luxe */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#C8522C] via-[#E26D46] to-[#A33D1E] p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-black/20 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                <Tag className="w-3 h-3" /> Ексклузивен ваучер
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight text-[#FAF6F0]">
              10% Попуст на целата нарачка!
            </h3>
            <p className="text-xs sm:text-sm text-[#F5EFEB]/90 mt-2 max-w-sm">
              Важи за сите категории и производи без минимален лимит на потрошувачка.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 bg-[#141210]/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 font-mono font-black text-sm text-[#D49A55] tracking-wider">
              <span>PAZAR10</span>
            </div>

            <button
              onClick={() => handleCopy("PAZAR10")}
              className="px-4 py-2 rounded-xl bg-[#FAF6F0] text-[#141210] font-black text-xs hover:bg-white active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCode === "PAZAR10" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" /> Копирано!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Копирај код
                </>
              )}
            </button>
          </div>
        </div>

        {/* Banner 2: FREESHIP - Smoked Espresso & Raw Honey */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1D1A17] via-[#25211D] to-[#141210] p-6 sm:p-8 text-[#FAF6F0] shadow-xl flex flex-col justify-between border border-[#2A2520]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#D49A55]/20 text-[#D49A55] text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#D49A55]/30">
                <Zap className="w-3 h-3" /> Бесплатна достава
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight text-[#FAF6F0]">
              БЕСПЛАТНА експрес достава до врата
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A095] mt-2 max-w-sm">
              Искористете го кодот и заштедете ги трошоците за курир на било која нарачка.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2A2520] flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2 bg-[#141210] backdrop-blur-md px-4 py-2 rounded-xl border border-[#38322B] font-mono font-black text-sm text-[#D49A55] tracking-wider">
              <span>FREESHIP</span>
            </div>

            <button
              onClick={() => handleCopy("FREESHIP")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 text-[#141210] font-black text-xs active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCode === "FREESHIP" ? (
                <>
                  <Check className="w-4 h-4 text-[#141210]" /> Копирано!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Копирај код
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
