import React from "react";
import { useApp } from "../../context/AppContext";
import { BrandLogo, BRAND_CONFIG } from "../common/BrandLogos";

export const BrandCarousel = () => {
  const { navigateTo, setCatalogFilters, theme } = useApp();

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
        <h2 className={`text-lg sm:text-xl font-black ${
          theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"
        }`}>
          Официјални партнерски брендови
        </h2>
        <p className={`text-xs mt-1 ${
          theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
        }`}>
          100% оригинални производи со директна овластена гаранција
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {brandKeys.map((key) => {
          const config = BRAND_CONFIG[key] || { name: key };
          return (
            <button
              key={key}
              onClick={() => handleBrandClick(key)}
              className={`group p-5 rounded-2xl border transition-all flex flex-col items-center justify-between min-h-[125px] sm:min-h-[140px] cursor-pointer shadow-xs ${
                theme === "light"
                  ? "bg-white border-[#E5DDD2] hover:border-[#E26D46] hover:bg-[#FDFBF7] hover:shadow-lg"
                  : "bg-[#1D1A17] border-[#2A2520] hover:border-[#E26D46] hover:bg-[#25211D] hover:shadow-2xl"
              }`}
              title={`Прегледај производи од ${config.name}`}
            >
              <div className="flex-1 flex items-center justify-center w-full px-2 py-1">
                <BrandLogo brand={key} size="xl" showName={false} />
              </div>
              <span className={`text-[11px] font-semibold tracking-wide transition-colors mt-1 ${
                theme === "light"
                  ? "text-[#70675C] group-hover:text-[#C84E25]"
                  : "text-[#8C8377] group-hover:text-[#E26D46]"
              }`}>
                {config.category || "Овластен бренд"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
