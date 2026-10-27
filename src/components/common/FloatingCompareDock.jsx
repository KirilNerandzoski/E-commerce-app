import React from "react";
import { useApp } from "../../context/AppContext";
import { SlidersHorizontal, ArrowRight, X } from "lucide-react";

export const FloatingCompareDock = () => {
  const { compareList, setIsCompareModalOpen, clearCompare } = useApp();

  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
          {compareList.length}
        </div>
        <div className="text-xs">
          <span className="font-bold block">Споредба на производи</span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">
            Избрани се {compareList.length} од максимум 4 артикли
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <span>Спореди сега</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={clearCompare}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          title="Исчисти споредба"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
