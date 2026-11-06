import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import { ProductCard } from "../product/ProductCard";
import { FilterSidebar } from "./FilterSidebar";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";

export const ProductCatalog = () => {
  const {
    products,
    catalogFilters,
    setCatalogFilters,
    navigateTo,
  } = useApp();

  const [layoutMode, setLayoutMode] = useState("grid"); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 8;

  // Find active category
  const activeCategory = CATEGORIES.find((c) => c.id === catalogFilters.category);
  const activeSubcategory = activeCategory?.subcategories?.find(
    (s) => s.id === catalogFilters.subcategory
  );

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category
        if (catalogFilters.category !== "all" && product.category !== catalogFilters.category) {
          return false;
        }

        // Subcategory
        if (catalogFilters.subcategory && product.subcategory !== catalogFilters.subcategory) {
          return false;
        }

        // Live Search Query
        if (catalogFilters.search) {
          const q = catalogFilters.search.toLowerCase();
          const matchTitle = product.title.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchDesc) return false;
        }

        // Price
        if (product.price < catalogFilters.minPrice || product.price > catalogFilters.maxPrice) {
          return false;
        }

        // Selected Brands
        if (
          catalogFilters.selectedBrands.length > 0 &&
          !catalogFilters.selectedBrands.includes(product.brand)
        ) {
          return false;
        }

        // Minimum Rating
        if (catalogFilters.minRating > 0 && product.rating < catalogFilters.minRating) {
          return false;
        }

        // In Stock
        if (catalogFilters.inStockOnly && !product.inStock) {
          return false;
        }

        // Discounts Only
        if (catalogFilters.discountOnly && (!product.discount || product.discount <= 0)) {
          return false;
        }

        // PazarMax Direkt Only
        if (catalogFilters.directOnly && !product.isDirectDelivery) {
          return false;
        }

        // Free Shipping Only
        if (catalogFilters.freeShippingOnly && !product.freeShipping) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (catalogFilters.sortBy === "price-asc") return a.price - b.price;
        if (catalogFilters.sortBy === "price-desc") return b.price - a.price;
        if (catalogFilters.sortBy === "rating") return b.rating - a.rating;
        if (catalogFilters.sortBy === "discount") return (b.discount || 0) - (a.discount || 0);
        if (catalogFilters.sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        // Default: popularity / best seller
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, catalogFilters]);

  // Paginated products
  const paginatedProducts = filteredProducts.slice(0, currentPage * itemsPerPage);

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
    setCurrentPage(1);
  };

  const removeBrandFilter = (brand) => {
    setCatalogFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.filter((b) => b !== brand),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#A8A095] mb-4 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigateTo("home")} className="hover:text-[#E26D46] transition-colors cursor-pointer">
          Почетна
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#8C8377] shrink-0" />
        <button
          onClick={() => setCatalogFilters((prev) => ({ ...prev, category: "all", subcategory: null }))}
          className={`hover:text-[#E26D46] transition-colors cursor-pointer ${
            catalogFilters.category === "all" ? "font-bold text-[#FAF6F0]" : ""
          }`}
        >
          Каталог
        </button>
        {activeCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C8377] shrink-0" />
            <span
              className={!activeSubcategory ? "font-bold text-[#FAF6F0]" : "hover:text-[#E26D46] cursor-pointer"}
              onClick={() => setCatalogFilters((prev) => ({ ...prev, subcategory: null }))}
            >
              {activeCategory.name}
            </span>
          </>
        )}
        {activeSubcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C8377] shrink-0" />
            <span className="font-bold text-[#FAF6F0]">{activeSubcategory.name}</span>
          </>
        )}
      </nav>

      {/* 2. Category Title Banner */}
      <div className="bg-[#1D1A17] rounded-3xl border border-[#2A2520] p-6 sm:p-8 mb-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-[#FAF6F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#FAF6F0] tracking-tight">
            {activeCategory ? activeCategory.name : "Сите производи во понуда"}
          </h1>
          <p className="text-xs sm:text-sm text-[#A8A095] mt-1 max-w-xl">
            {activeCategory
              ? `Прегледајте ги најдобрите понуди, попусти и гарантиран квалитет во категоријата ${activeCategory.name}.`
              : "Најголем избор на електроника, апарати за домаќинство, мода, спорт и сѐ за вашиот дом."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#25211D] text-xs font-bold text-[#FAF6F0] border border-[#2A2520]">
            Вкупно: <span className="text-[#E26D46] font-extrabold">{filteredProducts.length}</span> производи
          </div>
        </div>
      </div>

      {/* 3. Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar (1 col) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar />
        </div>

        {/* Mobile Filters Drawer Modal */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#171412] text-[#FAF6F0] border-l border-[#2A2520] shadow-2xl p-4 overflow-y-auto z-10 flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <FilterSidebar
                isMobileDrawer={true}
                onCloseMobile={() => setIsMobileFiltersOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Catalog Main Content (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Control Bar: Active filters, Grid/List switch, Sort dropdown */}
          <div className="bg-[#1D1A17] rounded-2xl border border-[#2A2520] p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#FAF6F0]">
            {/* Left: Mobile Filter Button & Active Filter Summary */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden px-3.5 py-2 bg-[#25211D] hover:bg-[#2A2520] text-[#FAF6F0] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#2A2520]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E26D46]" />
                Филтри
              </button>

              <span className="text-xs text-[#A8A095] font-medium">
                Прикажани <strong className="text-[#FAF6F0]">{paginatedProducts.length}</strong> од{" "}
                <strong className="text-[#FAF6F0]">{filteredProducts.length}</strong>
              </span>
            </div>

            {/* Right: Layout Switch & Sort */}
            <div className="flex items-center gap-3">
              {/* Layout Switcher */}
              <div className="flex items-center bg-[#25211D] p-0.5 rounded-xl border border-[#2A2520]">
                <button
                  onClick={() => setLayoutMode("grid")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === "grid"
                      ? "bg-[#141210] text-[#E26D46] shadow-xs"
                      : "text-[#A8A095] hover:text-[#FAF6F0]"
                  }`}
                  title="Grid поглед"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode("list")}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    layoutMode === "list"
                      ? "bg-[#141210] text-[#E26D46] shadow-xs"
                      : "text-[#A8A095] hover:text-[#FAF6F0]"
                  }`}
                  title="Листа поглед"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#A8A095] hidden sm:inline">Сортирај:</span>
                <select
                  value={catalogFilters.sortBy}
                  onChange={(e) =>
                    setCatalogFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  className="bg-[#25211D] border border-[#2A2520] text-[#FAF6F0] font-bold text-xs py-2 px-3 rounded-xl outline-none focus:border-[#E26D46] cursor-pointer"
                >
                  <option value="popularity" className="bg-[#1D1A17] text-[#FAF6F0]">Најпопуларни</option>
                  <option value="price-asc" className="bg-[#1D1A17] text-[#FAF6F0]">Цена: Ниска кон висока</option>
                  <option value="price-desc" className="bg-[#1D1A17] text-[#FAF6F0]">Цена: Висока кон ниска</option>
                  <option value="rating" className="bg-[#1D1A17] text-[#FAF6F0]">Највисока оцена</option>
                  <option value="discount" className="bg-[#1D1A17] text-[#FAF6F0]">Најголем попуст %</option>
                  <option value="newest" className="bg-[#1D1A17] text-[#FAF6F0]">Најнови производи</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(catalogFilters.category !== "all" ||
            catalogFilters.subcategory ||
            catalogFilters.selectedBrands.length > 0 ||
            catalogFilters.discountOnly ||
            catalogFilters.directOnly ||
            catalogFilters.freeShippingOnly ||
            catalogFilters.inStockOnly ||
            catalogFilters.search ||
            catalogFilters.minRating > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 bg-[#1D1A17] p-2.5 rounded-2xl border border-[#2A2520]">
              <span className="text-[11px] font-bold text-[#A8A095] uppercase tracking-wider mr-1">
                Активни:
              </span>

              {catalogFilters.category !== "all" && activeCategory && (
                <span className="inline-flex items-center gap-1 bg-[#25211D] border border-[#2A2520] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#FAF6F0]">
                  {activeCategory.name}
                  <button
                    onClick={() =>
                      setCatalogFilters((prev) => ({ ...prev, category: "all", subcategory: null }))
                    }
                  >
                    <X className="w-3 h-3 text-[#A8A095] hover:text-[#FAF6F0]" />
                  </button>
                </span>
              )}

              {catalogFilters.subcategory && activeSubcategory && (
                <span className="inline-flex items-center gap-1 bg-[#25211D] border border-[#2A2520] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#FAF6F0]">
                  {activeSubcategory.name}
                  <button
                    onClick={() => setCatalogFilters((prev) => ({ ...prev, subcategory: null }))}
                  >
                    <X className="w-3 h-3 text-[#A8A095] hover:text-[#FAF6F0]" />
                  </button>
                </span>
              )}

              {catalogFilters.selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1 bg-[#25211D] border border-[#2A2520] px-2.5 py-1 rounded-lg text-xs font-semibold text-[#FAF6F0]">
                  Бренд: {brand}
                  <button onClick={() => removeBrandFilter(brand)}>
                    <X className="w-3 h-3 text-[#A8A095] hover:text-[#FAF6F0]" />
                  </button>
                </span>
              ))}

              {catalogFilters.discountOnly && (
                <span className="inline-flex items-center gap-1 bg-[#E26D46]/20 border border-[#E26D46]/40 px-2.5 py-1 rounded-lg text-xs font-bold text-[#E26D46]">
                  Со попуст
                  <button
                    onClick={() => setCatalogFilters((prev) => ({ ...prev, discountOnly: false }))}
                  >
                    <X className="w-3 h-3 text-[#E26D46]" />
                  </button>
                </span>
              )}

              {catalogFilters.directOnly && (
                <span className="inline-flex items-center gap-1 bg-[#D49A55]/20 border border-[#D49A55]/40 px-2.5 py-1 rounded-lg text-xs font-bold text-[#D49A55]">
                  PazarMax Direkt
                  <button
                    onClick={() => setCatalogFilters((prev) => ({ ...prev, directOnly: false }))}
                  >
                    <X className="w-3 h-3 text-[#D49A55]" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#E26D46] hover:text-[#D49A55] ml-auto px-2 py-1 cursor-pointer"
              >
                Исчисти сѐ
              </button>
            </div>
          )}

          {/* Product Cards Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="bg-[#1D1A17] rounded-3xl border border-[#2A2520] p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#25211D] text-[#E26D46] border border-[#2A2520] flex items-center justify-center mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#FAF6F0]">
                Не се пронајдени производи
              </h3>
              <p className="text-xs sm:text-sm text-[#A8A095] mt-1 max-w-sm">
                Обидете се да ги промените филтрите, да го зголемите опсегот на цената или да го ресетирате пребарувањето.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 text-[#141210] font-black text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Ресетирај ги сите филтри
              </button>
            </div>
          ) : (
            <>
              <div
                className={
                  layoutMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout={layoutMode} />
                ))}
              </div>

              {/* Load More Button & Pagination */}
              {paginatedProducts.length < filteredProducts.length && (
                <div className="pt-8 pb-4 text-center">
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-8 py-3 bg-[#1D1A17] border border-[#2A2520] hover:border-[#E26D46] text-[#FAF6F0] hover:text-[#E26D46] font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    Вчитај уште производи ({filteredProducts.length - paginatedProducts.length} останати)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
