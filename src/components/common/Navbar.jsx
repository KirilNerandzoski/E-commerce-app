import { supabaseService } from '../../services/supabaseService';
import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/categories";
import { formatPrice } from "../../utils/formatters";
import {
  Search,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  Phone,
  Package,
  LogOut,
  Settings,
  ShieldCheck,
  Percent,
} from "lucide-react";

export const Navbar = () => {
  const {
    products,
    cartTotalItemsCount,
    cartSubtotal,
    wishlist,
    compareList,
    currency,
    setCurrency,
    navigateTo,
    setIsCompareModalOpen,
    setIsCartDrawerOpen,
    setIsAuthModalOpen,
    user,
    setCatalogFilters,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState(CATEGORIES[0]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close search and user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered search results
  const searchResults = searchQuery.trim() === ""
    ? []
    : products
        .filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6);

  const matchingCategories = searchQuery.trim() === ""
    ? []
    : CATEGORIES.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    navigateTo("catalog", { search: searchQuery, category: "all" });
  };

  const handleProductSelect = (productId) => {
    setIsSearchFocused(false);
    setSearchQuery("");
    navigateTo("product", productId);
  };

  const handleCategorySelect = (categoryId, subcategory = null) => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigateTo("catalog", { category: categoryId, subcategory, search: "" });
  };

  const popularSearches = [
    "iPhone 15",
    "Airfryer",
    "Samsung TV",
    "Sony",
    "Lavazza",
    "Makita",
    "Nike",
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold truncate">
              <Zap className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
              БЕСПЛАТНА достава за нарачки над 1.500 ден.
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Гарантирано враќање во рок од 14 дена
            </span>
            <span className="hidden lg:inline text-slate-400">|</span>
            <span className="hidden lg:inline text-slate-300">
              📦 PazarMax Paketomat 0-24ч преземање
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {supabaseService.isConfigured && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase Поврзан
              </span>
            )}
            {/* Currency Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setCurrency("MKD")}
                className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  currency === "MKD"
                    ? "bg-orange-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                ден. MKD
              </button>
              <button
                type="button"
                onClick={() => setCurrency("EUR")}
                className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  currency === "EUR"
                    ? "bg-orange-500 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                € EUR
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]">
              <Phone className="w-3 h-3 text-orange-400" />
              <span>02 3100 500</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            aria-label="Отвори мени"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-black text-xl">
              🛍️
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                pazar<span className="text-orange-500">max</span>
              </span>
              <span className="text-xs font-black bg-slate-900 text-white px-1.5 py-0.5 rounded ml-1 tracking-wider">
                .mk
              </span>
            </div>
          </div>

          {/* MegaMenu Trigger Button (Desktop) */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs ${
                isMegaMenuOpen
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              <Menu className="w-4 h-4 text-orange-500" />
              <span>Сите категории</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MegaMenu Dropdown */}
            {isMegaMenuOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-[780px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                {/* Left Categories List */}
                <div className="w-64 bg-slate-50 p-2 border-r border-slate-100 overflow-y-auto max-h-[460px]">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveMegaCategory(cat)}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        activeMegaCategory.id === cat.id
                          ? "bg-white text-orange-600 shadow-xs font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">›</span>
                    </button>
                  ))}
                </div>

                {/* Right Subcategories & Banner */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {activeMegaCategory.name}
                        </h4>
                        <span className="text-xs text-slate-400">
                          Прегледајте над {activeMegaCategory.itemCount} достапни производи
                        </span>
                      </div>
                      <button
                        onClick={() => handleCategorySelect(activeMegaCategory.id)}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Види сѐ &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {activeMegaCategory.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategorySelect(activeMegaCategory.id, sub.id)}
                          className="text-left p-2.5 rounded-xl hover:bg-orange-50 group transition-colors"
                        >
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                            {sub.name}
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {sub.count} производи
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo inside megamenu */}
                  <div
                    onClick={() => handleCategorySelect(activeMegaCategory.id)}
                    className="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="text-xs uppercase font-extrabold tracking-wider text-amber-100">
                        Супер попусти до 30%
                      </div>
                      <div className="text-sm font-bold">
                        Најбарани артикли од категоријата {activeMegaCategory.name}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white text-orange-600 text-xs font-bold rounded-lg shrink-0">
                      Погледни
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Live Product Search Bar */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Пребарајте производи, брендови, категории (пр. iPhone, Airfryer, Bosch)..."
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-11 pr-24 py-2.5 sm:py-3 rounded-2xl border border-transparent focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-slate-200 text-slate-400 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-colors hidden sm:block"
                >
                  Барај
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-150">
                {searchQuery.trim() === "" ? (
                  // Empty query suggestions
                  <div className="p-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                      Популарни пребарувања
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            navigateTo("catalog", { search: term, category: "all" });
                            setIsSearchFocused(false);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-xs text-slate-700 font-medium transition-colors flex items-center gap-1.5"
                        >
                          <Search className="w-3 h-3 text-slate-400" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Search query active
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100">
                    {/* Matching categories */}
                    {matchingCategories.length > 0 && (
                      <div className="p-3 bg-slate-50">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Категории
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {matchingCategories.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => {
                                handleCategorySelect(c.id);
                                setIsSearchFocused(false);
                              }}
                              className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-white border border-orange-200 px-3 py-1 rounded-lg"
                            >
                              Во категорија: {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Products list */}
                    {searchResults.length > 0 ? (
                      <div className="p-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                          Производи ({searchResults.length})
                        </div>
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductSelect(product.id)}
                            className="p-2 rounded-xl hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-contain bg-slate-100 p-1 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-orange-600 uppercase">
                                {product.brand}
                              </span>
                              <h5 className="text-xs font-semibold text-slate-800 truncate">
                                {product.title}
                              </h5>
                              <div className="text-xs font-bold text-slate-900 mt-0.5">
                                {formatPrice(product.price, currency)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Нема пронајдено производи за "<strong>{searchQuery}</strong>".
                      </div>
                    )}

                    {/* View all search results button */}
                    {searchResults.length > 0 && (
                      <div className="p-2.5 bg-slate-50 text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700"
                        >
                          Види ги сите резултати за "{searchQuery}" &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Action Buttons (Compare, Wishlist, User, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Compare Tool */}
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="relative p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center"
              title="Спореди производи"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo("wishlist")}
              className="relative p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center"
              title="Омилени"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div ref={userDropdownRef} className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 border border-orange-200 flex items-center justify-center overflow-hidden font-bold text-xs">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className="text-[11px] text-slate-400 font-medium leading-none">
                    Здраво,
                  </span>
                  <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                    {user.name.split(" ")[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo("profile", "orders");
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <Package className="w-4 h-4 text-orange-500" />
                      Мои нарачки ({user.orders.length})
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo("profile", "info");
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Податоци за профил
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo("wishlist");
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <Heart className="w-4 h-4 text-red-500" />
                      Листа на омилени ({wishlist.length})
                    </button>
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        navigateTo("profile", "preferences");
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Поставки & Известувања
                    </button>
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 flex items-center gap-2.5 transition-colors"
                      >
                        <Lock className="w-4 h-4 text-orange-500" />
                        Најава / Сметка (Supabase)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold shadow-md shadow-orange-500/25 transition-all"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartTotalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-white text-orange-600 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs border border-orange-200">
                    {cartTotalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] font-medium leading-none opacity-90">Кошничка</span>
                <span className="text-xs font-black leading-tight">
                  {formatPrice(cartSubtotal, currency)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Secondary Category Bar (Desktop) */}
      <div className="hidden lg:block bg-slate-50/80 border-t border-slate-100 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="px-3 py-1.5 rounded-lg hover:bg-white hover:text-orange-600 hover:shadow-xs transition-all whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setCatalogFilters((prev) => ({ ...prev, discountOnly: true, category: "all" }));
                navigateTo("catalog");
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 font-bold transition-colors"
            >
              <Percent className="w-3.5 h-3.5" /> Супер Попусти %
            </button>
            <button
              onClick={() => {
                setCatalogFilters((prev) => ({ ...prev, directOnly: true, category: "all" }));
                navigateTo("catalog");
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 font-black tracking-wide transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-700 text-amber-700" /> PazarMax Direkt 24h
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛍️</span>
                  <span className="text-xl font-black text-slate-900">pazar<span className="text-orange-500">max</span>.mk</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency on mobile */}
              <div className="mt-4 flex items-center justify-between p-2 rounded-xl bg-slate-100">
                <span className="text-xs font-semibold text-slate-600">Валута:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrency("MKD")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      currency === "MKD" ? "bg-orange-500 text-white" : "text-slate-600"
                    }`}
                  >
                    ден. MKD
                  </button>
                  <button
                    onClick={() => setCurrency("EUR")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      currency === "EUR" ? "bg-orange-500 text-white" : "text-slate-600"
                    }`}
                  >
                    € EUR
                  </button>
                </div>
              </div>

              {/* Supabase Auth trigger on mobile */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full mt-3 py-2.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-orange-200"
              >
                <Lock className="w-4 h-4" /> Најава / Регистрација (Supabase)
              </button>

              {/* All Categories list */}
              <div className="mt-6">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Категории
                </div>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-slate-400">›</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Support Info */}
            <div className="pt-6 border-t border-slate-100 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Корисничка поддршка</p>
              <p className="mt-1">📞 02 3100 500 (Пон - Саб 08-20h)</p>
              <p>✉️ podrska@pazarmax.mk</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
