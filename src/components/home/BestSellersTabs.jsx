import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../product/ProductCard";
import { ArrowRight, Trophy } from "lucide-react";

export const BestSellersTabs = () => {
  const { products, navigateTo, theme } = useApp();
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
          <div className="flex items-center gap-2 text-xs font-black text-[#D49A55] uppercase tracking-wider">
            <Trophy className="w-4 h-4 fill-[#D49A55] text-[#D49A55]" />
            <span>Најпопуларен избор од купувачите</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black mt-1 ${
            theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"
          }`}>
            Најпродавани производи
          </h2>
        </div>

        <button
          onClick={() => navigateTo("catalog")}
          className={`text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer ${
            theme === "light" ? "text-[#C84E25] hover:text-[#B45309]" : "text-[#E26D46] hover:text-[#D49A55]"
          }`}
        >
          Види ги сите производи <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-2 overflow-x-auto pb-2 border-b mb-6 no-scrollbar ${
        theme === "light" ? "border-[#E5DDD2]" : "border-[#2A2520]"
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#E26D46] to-[#D49A55] text-[#141210] font-black shadow-lg shadow-[#E26D46]/20"
                : theme === "light"
                ? "bg-white text-[#70675C] hover:bg-[#F3EFEA] hover:text-[#1A1614] border border-[#E0D7CC]"
                : "bg-[#1D1A17] text-[#A8A095] hover:bg-[#25211D] hover:text-[#FAF6F0] border border-[#2A2520]"
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
