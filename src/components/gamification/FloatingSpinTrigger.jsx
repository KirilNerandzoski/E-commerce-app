import React from "react";
import { useApp } from "../../context/AppContext";
import { Sparkles, Gift } from "lucide-react";

export const FloatingSpinTrigger = ({ onOpen }) => {
  const { lastPlacedOrder, isOrderChatBubbleOpen } = useApp();

  // Hide spin button when order chat is expanded to keep screen clean
  if (isOrderChatBubbleOpen) return null;

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 z-40 animate-bounce duration-1000 transition-all ${
        lastPlacedOrder ? "right-20 sm:right-24" : "right-4 sm:right-6"
      }`}
    >
      <button
        onClick={onOpen}
        type="button"
        className="group flex items-center gap-2.5 bg-gradient-to-r from-[#E26D46] via-[#D49A55] to-[#E26D46] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-[#141210] font-black px-4 py-3 rounded-full shadow-2xl shadow-[#E26D46]/40 hover:scale-105 active:scale-95 border-2 border-[#D49A55] cursor-pointer"
        title="Заврти го тркалото за попуст"
      >
        <div className="w-6 h-6 rounded-full bg-[#141210] text-[#D49A55] flex items-center justify-center">
          <Gift className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="text-left leading-none pr-1">
          <div className="text-[10px] uppercase tracking-wider text-[#141210]/80 font-extrabold flex items-center gap-1">
            <span>Среќно Тркало</span>
            <Sparkles className="w-2.5 h-2.5" />
          </div>
          <div className="text-xs font-black text-[#141210] mt-0.5">
            Освој попуст!
          </div>
        </div>
      </button>
    </div>
  );
};
