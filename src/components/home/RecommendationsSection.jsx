import React from "react";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../product/ProductCard";
import { Sparkles, ArrowRight } from "lucide-react";

export const RecommendationsSection = () => {
  const { products, navigateTo } = useApp();

  // Recommendations: products with high ratings and trending status
  const recommended = products.filter((p) => p.isTrending || p.rating >= 4.8).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-orange-400 text-orange-400" />
            <span>Персонализиран избор</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Препорачано за тебе
          </h2>
        </div>

        <button
          onClick={() => navigateTo("catalog")}
          className="text-xs sm:text-sm font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          Види повеќе <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {recommended.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
