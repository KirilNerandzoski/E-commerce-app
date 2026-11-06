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
          <h2 className="text-xl sm:text-2xl font-black text-[#FAF6F0]">
            Истражи по категории
          </h2>
          <p className="text-xs sm:text-sm text-[#A8A095] mt-0.5">
            Над 10.000 достапни производи за секоја потреба
          </p>
        </div>

        <button
          onClick={() => navigateTo("catalog")}
          className="text-xs sm:text-sm font-bold text-[#E26D46] hover:text-[#D49A55] flex items-center gap-1 transition-colors cursor-pointer"
        >
          Сите производи <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigateTo("catalog", cat.id)}
            className="group bg-[#1D1A17] rounded-2xl border border-[#2A2520] p-3 sm:p-4 text-center cursor-pointer hover:shadow-2xl hover:border-[#E26D46]/50 hover:-translate-y-1 transition-all flex flex-col items-center justify-between"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FAF7F2] p-1.5 overflow-hidden mb-3 group-hover:scale-105 transition-transform flex items-center justify-center border border-[#E6DFD5]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover rounded-xl"
                loading="lazy"
              />
            </div>

            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#FAF6F0] group-hover:text-[#E26D46] transition-colors line-clamp-2 leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-[#A8A095] mt-1 block">
                {cat.itemCount}+ производи
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
