import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../product/ProductCard";
import { ArrowRight, Trophy } from "lucide-react";

export const BestSellersTabs = () => {
  const { products, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "Сите најпродавани" },
    { id: "electronics", label: "Телефони & Аудио" },
    { id: "appliances", label: "Бела техника" },
    { id: "computers", label: "Компјутери & Гејминг" },
    { id: "fashion", label: "Мода & Обувки" },
    { id: "tools-auto", label: "Алати & Авто" },
  ];

  const filteredProducts = products
    .filter((p) => {
      if (!p.isBestSeller) return false;
      if (activeTab === "all") return true;
      return p.category === activeTab;
    })
    .slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider">
            <Trophy className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Најпопуларен избор од купувачите</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Најпродавани производи
          </h2>
        </div>

        <button
          onClick={() => navigateTo("catalog")}
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          Види ги сите производи <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 mb-6 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
