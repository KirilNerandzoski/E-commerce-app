import React from "react";
import { useApp } from "../../context/AppContext";

export const BrandCarousel = () => {
  const { navigateTo, setCatalogFilters } = useApp();

  const brands = [
    { name: "Apple", logo: " Apple" },
    { name: "Samsung", logo: "SAMSUNG" },
    { name: "Sony", logo: "SONY" },
    { name: "Philips", logo: "PHILIPS" },
    { name: "Bosch", logo: "BOSCH" },
    { name: "Dyson", logo: "dyson" },
    { name: "Nike", logo: "NIKE" },
    { name: "Makita", logo: "makita" },
    { name: "Xiaomi", logo: "XIAOMI" },
    { name: "DeLonghi", logo: "De'Longhi" },
    { name: "LEGO", logo: "LEGO" },
    { name: "Lavazza", logo: "LAVAZZA" },
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
        <h2 className="text-lg sm:text-xl font-black text-slate-900">
          Официјални партнерски брендови
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          100% оригинални производи со директна овластена гаранција
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {brands.map((b) => (
          <button
            key={b.name}
            onClick={() => handleBrandClick(b.name)}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-300 hover:shadow-md hover:text-orange-600 transition-all font-black text-sm sm:text-base text-slate-700 flex items-center justify-center min-h-[64px]"
          >
            {b.logo}
          </button>
        ))}
      </div>
    </section>
  );
};
