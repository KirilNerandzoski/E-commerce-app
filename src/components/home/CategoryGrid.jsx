import React from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import { ArrowRight } from "lucide-react";

export const CategoryGrid = () => {
  const { navigateTo } = useApp();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Истражи по категории
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Над 10.000 достапни производи за секоја потреба
          </p>
        </div>

        <button
          onClick={() => navigateTo("catalog")}
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
        >
          Сите производи <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigateTo("catalog", cat.id)}
            className="group bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 text-center cursor-pointer hover:shadow-lg hover:border-orange-300 hover:-translate-y-1 transition-all flex flex-col items-center justify-between"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 p-2 overflow-hidden mb-3 group-hover:bg-orange-50/60 transition-colors flex items-center justify-center">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {cat.itemCount}+ производи
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
