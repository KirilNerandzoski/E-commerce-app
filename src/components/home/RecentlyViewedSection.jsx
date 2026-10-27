import React from "react";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../product/ProductCard";
import { History, Trash2 } from "lucide-react";

export const RecentlyViewedSection = () => {
  const { recentlyViewed, products } = useApp();

  if (!recentlyViewed || recentlyViewed.length === 0) return null;

  const recentProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  if (recentProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Неодамна прегледани производи
            </h2>
            <p className="text-xs text-slate-500">
              Производи што ги разгледавте при оваа или претходна посета
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
