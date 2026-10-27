import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import { formatPrice } from "../../utils/formatters";
import {
  SlidersHorizontal,
  RotateCcw,
  Check,
  Star,
  Search,
  Zap,
  Truck,
} from "lucide-react";

export const FilterSidebar = ({ isMobileDrawer = false, onCloseMobile = () => {} }) => {
  const { products, catalogFilters, setCatalogFilters, currency } = useApp();
  const [brandSearch, setBrandSearch] = useState("");

  // Extract all unique brands from products
  const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const filteredBrands = brandSearch
    ? allBrands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : allBrands;

  const handleCategoryChange = (catId) => {
    setCatalogFilters((prev) => ({
      ...prev,
      category: catId,
      subcategory: null,
    }));
  };

  const handleSubcategoryChange = (subId) => {
    setCatalogFilters((prev) => ({
      ...prev,
      subcategory: prev.subcategory === subId ? null : subId,
    }));
  };

  const handleBrandToggle = (brand) => {
    setCatalogFilters((prev) => {
      const exists = prev.selectedBrands.includes(brand);
      const newBrands = exists
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand];
      return { ...prev, selectedBrands: newBrands };
    });
  };

  const handleResetFilters = () => {
    setCatalogFilters({
      category: "all",
      subcategory: null,
      search: "",
      minPrice: 0,
      maxPrice: 150000,
      selectedBrands: [],
      minRating: 0,
      inStockOnly: false,
      discountOnly: false,
      directOnly: false,
      freeShippingOnly: false,
      sortBy: "popularity",
    });
    setBrandSearch("");
    if (isMobileDrawer) onCloseMobile();
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.id === catalogFilters.category);

  return (
    <aside className="w-full bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
          <SlidersHorizontal className="w-4 h-4 text-orange-500" />
          <span>Филтрирај</span>
        </div>

        <button
          onClick={handleResetFilters}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Ресетирај
        </button>
      </div>

      {/* 1. Category Hierarchy */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2.5">
          Категорија
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
              catalogFilters.category === "all"
                ? "bg-orange-50 text-orange-600 font-bold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Сите категории</span>
            <span className="text-[11px] text-slate-400">{products.length}</span>
          </button>

          {CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => handleCategoryChange(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  catalogFilters.category === cat.id
                    ? "bg-orange-50 text-orange-600 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-[11px] text-slate-400">
                  {products.filter((p) => p.category === cat.id).length}
                </span>
              </button>

              {/* Subcategories (if current category selected) */}
              {catalogFilters.category === cat.id && cat.subcategories && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-orange-200 ml-3 mt-1">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryChange(sub.id)}
                      className={`w-full text-left py-1 px-2 rounded-lg text-[11px] transition-colors flex items-center justify-between ${
                        catalogFilters.subcategory === sub.id
                          ? "font-bold text-orange-600 bg-orange-100/50"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      {catalogFilters.subcategory === sub.id && (
                        <Check className="w-3 h-3 text-orange-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Fast Delivery & Badges */}
      <div className="pt-4 border-t border-slate-100 space-y-2.5">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
          Услуги & Поволности
        </h4>

        {/* PazarMax Direkt 24h */}
        <label className="flex items-center justify-between p-2 rounded-xl hover:bg-amber-50/60 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center text-white">
              <Zap className="w-3 h-3 fill-white" />
            </span>
            <span>PazarMax Direkt 24h</span>
          </div>
          <input
            type="checkbox"
            checked={catalogFilters.directOnly}
            onChange={(e) =>
              setCatalogFilters((prev) => ({ ...prev, directOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
          />
        </label>

        {/* Free Shipping */}
        <label className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/60 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white">
              <Truck className="w-3 h-3" />
            </span>
            <span>Бесплатна достава</span>
          </div>
          <input
            type="checkbox"
            checked={catalogFilters.freeShippingOnly}
            onChange={(e) =>
              setCatalogFilters((prev) => ({ ...prev, freeShippingOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
          />
        </label>

        {/* Only Discounts */}
        <label className="flex items-center justify-between p-2 rounded-xl hover:bg-red-50/60 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-red-500 flex items-center justify-center text-white font-black text-[10px]">
              %
            </span>
            <span>Само со попуст</span>
          </div>
          <input
            type="checkbox"
            checked={catalogFilters.discountOnly}
            onChange={(e) =>
              setCatalogFilters((prev) => ({ ...prev, discountOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
          />
        </label>

        {/* In Stock only */}
        <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700 transition-colors">
          <span>Само на залиха</span>
          <input
            type="checkbox"
            checked={catalogFilters.inStockOnly}
            onChange={(e) =>
              setCatalogFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
          />
        </label>
      </div>

      {/* 3. Price Range Slider */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
          Опсег на цена
        </h4>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
          <span>{formatPrice(catalogFilters.minPrice, currency)}</span>
          <span className="text-slate-400">-</span>
          <span>{formatPrice(catalogFilters.maxPrice, currency)}</span>
        </div>

        <input
          type="range"
          min="0"
          max="150000"
          step="1000"
          value={catalogFilters.maxPrice}
          onChange={(e) =>
            setCatalogFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-orange-500 cursor-pointer"
        />

        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs">
            <span className="text-[10px] text-slate-400 block">Мин (ден.)</span>
            <input
              type="number"
              value={catalogFilters.minPrice}
              onChange={(e) =>
                setCatalogFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))
              }
              className="w-full bg-transparent font-bold text-slate-800 outline-none"
            />
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs">
            <span className="text-[10px] text-slate-400 block">Макс (ден.)</span>
            <input
              type="number"
              value={catalogFilters.maxPrice}
              onChange={(e) =>
                setCatalogFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
              }
              className="w-full bg-transparent font-bold text-slate-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Brands Filter with Search */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
          Бренд
        </h4>

        {/* Brand search input */}
        <div className="relative mb-2">
          <input
            type="text"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            placeholder="Пребарај бренд..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 pl-7 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
        </div>

        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {filteredBrands.map((brand) => {
            const isChecked = catalogFilters.selectedBrands.includes(brand);
            const count = products.filter((p) => p.brand === brand).length;

            return (
              <label
                key={brand}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span className={isChecked ? "font-bold text-orange-600" : "text-slate-700"}>
                    {brand}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Rating Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
          Минимална оцена
        </h4>
        <div className="space-y-1">
          {[4, 4.5, 3].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                setCatalogFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === stars ? 0 : stars,
                }))
              }
              className={`w-full p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                catalogFilters.minRating === stars
                  ? "bg-amber-50 text-amber-900 font-bold"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{stars}★ и повеќе</span>
              </div>
              {catalogFilters.minRating === stars && (
                <Check className="w-3.5 h-3.5 text-amber-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile drawer apply button */}
      {isMobileDrawer && (
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onCloseMobile}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
          >
            Примени филтри
          </button>
        </div>
      )}
    </aside>
  );
};
