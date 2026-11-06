import React from "react";
import { Sparkles, Gift } from "lucide-react";

export const FloatingSpinTrigger = ({ onOpen }) => {
  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 animate-bounce duration-1000">
      <button
        onClick={onOpen}
        type="button"
        className="group flex items-center gap-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-slate-950 font-black px-4 py-3 rounded-full shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 border-2 border-amber-300 cursor-pointer"
        title="Заврти го тркалото за попуст"
      >
        <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center">
          <Gift className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="text-left leading-none pr-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-900 font-extrabold flex items-center gap-1">
            <span>Среќно Тркало</span>
            <Sparkles className="w-2.5 h-2.5" />
          </div>
          <div className="text-xs font-black text-slate-950 mt-0.5">
            Освој попуст!
          </div>
        </div>
      </button>
    </div>
  );
};
