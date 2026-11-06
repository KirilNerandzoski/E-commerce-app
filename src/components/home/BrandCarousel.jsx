import React from "react";
import { useApp } from "../../context/AppContext";
import { BrandLogo, BRAND_CONFIG } from "../common/BrandLogos";

export const BrandCarousel = () => {
  const { navigateTo, setCatalogFilters } = useApp();

  const brandKeys = [
    "Apple",
    "Samsung",
    "Sony",
    "Philips",
    "Bosch",
    "Dyson",
    "Nike",
    "Makita",
    "Xiaomi",
    "DeLonghi",
    "LEGO",
    "Lavazza",
  ];

  const handleBrandClick = (brandName) => {
    setCatalogFilters((prev) => ({
      ...prev,
      category: "all",
      selectedBrands: [brandName],
    }));
    navigateTo("catalog");
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-black text-[#FAF6F0]">
          Официјални партнерски брендови
        </h2>
        <p className="text-xs text-[#A8A095] mt-1">
          100% оригинални производи со директна овластена гаранција
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {brandKeys.map((key) => {
          const config = BRAND_CONFIG[key] || { name: key };
          return (
            <button
              key={key}
              onClick={() => handleBrandClick(key)}
              className="group p-4 rounded-2xl bg-[#1D1A17] border border-[#2A2520] hover:border-[#E26D46] hover:bg-[#25211D] hover:shadow-xl transition-all flex flex-col items-center justify-center min-h-[96px] cursor-pointer"
              title={`Прегледај производи од ${config.name}`}
            >
              <BrandLogo brand={key} size="lg" showName={false} />
              <span className="text-xs font-black text-[#FAF6F0] group-hover:text-[#E26D46] transition-colors mt-2 tracking-wide">
                {config.name}
              </span>
              <span className="text-[10px] text-[#8C8377] font-semibold mt-0.5">
                {config.category || "Овластен бренд"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
