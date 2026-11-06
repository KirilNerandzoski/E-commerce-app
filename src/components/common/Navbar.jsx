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
  Lock,
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
    logoutUser,
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
    <header className="sticky top-0 z-40 bg-[#0B1120]/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#050811] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-850">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold truncate">
              <Zap className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
              БЕСПЛАТНА достава за нарачки над 1.500 ден.
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Гарантирано враќање во рок од 14 дена
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-slate-400">
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
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
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

            <div className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]">
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
            className="lg:hidden p-2 text-slate-300 hover:bg-slate-800 rounded-xl"
            aria-label="Отвори мени"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25 text-white font-black text-xl">
              🛍️
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                pazar<span className="text-orange-500">max</span>
              </span>
              <span className="text-xs font-black bg-orange-500/20 text-orange-400 border border-orange-500/40 px-1.5 py-0.5 rounded ml-1 tracking-wider">
                .mk
              </span>
            </div>
          </div>

          {/* MegaMenu Trigger Button (Desktop) */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                isMegaMenuOpen
                  ? "bg-orange-500 text-white border-orange-400"
                  : "bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700"
              }`}
            >
              <Menu className="w-4 h-4 text-orange-400" />
              <span>Сите категории</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MegaMenu Dropdown */}
            {isMegaMenuOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-[780px] bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50 flex animate-in fade-in zoom-in-95 duration-150 text-slate-200"
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                {/* Left Categories List */}
                <div className="w-64 bg-[#0B1120] p-2 border-r border-slate-800 overflow-y-auto max-h-[460px]">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveMegaCategory(cat)}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        activeMegaCategory.id === cat.id
                          ? "bg-slate-800 text-orange-400 font-bold"
                          : "text-slate-400 hover:bg-slate-850 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">›</span>
                    </button>
                  ))}
                </div>

                {/* Right Subcategories & Banner */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {activeMegaCategory.name}
                        </h4>
                        <span className="text-xs text-slate-400">
                          Прегледајте над {activeMegaCategory.itemCount} достапни производи
                        </span>
                      </div>
                      <button
                        onClick={() => handleCategorySelect(activeMegaCategory.id)}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300"
                      >
                        Види сѐ &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {activeMegaCategory.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategorySelect(activeMegaCategory.id, sub.id)}
                          className="text-left p-2.5 rounded-xl hover:bg-slate-800 group transition-colors"
                        >
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
                            {sub.name}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {sub.count} производи
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo inside megamenu */}
                  <div
                    onClick={() => handleCategorySelect(activeMegaCategory.id)}
                    className="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <div className="text-xs uppercase font-extrabold tracking-wider text-slate-900">
                        Супер попусти до 30%
                      </div>
                      <div className="text-sm font-black">
                        Најбарани артикли од категоријата {activeMegaCategory.name}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-slate-950 text-amber-400 text-xs font-black rounded-lg shrink-0">
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
                className="w-full bg-[#111A30] hover:bg-[#152038] focus:bg-[#17233E] text-white placeholder-slate-400 text-xs sm:text-sm pl-11 pr-24 py-2.5 sm:py-3 rounded-2xl border border-slate-700/80 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 hover:bg-slate-700 text-slate-400 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-colors hidden sm:block cursor-pointer"
                >
                  Барај
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-[100] animate-in fade-in duration-150 text-slate-200">
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
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-orange-500/20 hover:text-orange-400 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Search className="w-3 h-3 text-slate-400" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Search query active
                  <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-800">
                    {/* Matching categories */}
                    {matchingCategories.length > 0 && (
                      <div className="p-3 bg-[#0B1120]">
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
                              className="text-xs font-semibold text-orange-400 hover:text-orange-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg cursor-pointer"
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
                            className="p-2 rounded-xl hover:bg-slate-800 flex items-center gap-3 cursor-pointer transition-colors"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-contain bg-white p-1 shrink-0 border border-slate-700"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-orange-400 uppercase">
                                {product.brand}
                              </span>
                              <h5 className="text-xs font-semibold text-white truncate">
                                {product.title}
                              </h5>
                              <div className="text-xs font-bold text-slate-200 mt-0.5">
                                {formatPrice(product.price, currency)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Нема пронајдено производи за "<strong>{searchQuery}</strong>".
                      </div>
                    )}

                    {/* View all search results button */}
                    {searchResults.length > 0 && (
                      <div className="p-2.5 bg-[#0B1120] text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-xs font-bold text-orange-400 hover:text-orange-300 cursor-pointer"
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
              className="relative p-2.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors hidden sm:flex items-center cursor-pointer"
              title="Спореди производи"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo("wishlist")}
              className="relative p-2.5 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors hidden sm:flex items-center cursor-pointer"
              title="Омилени"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div ref={userDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUserDropdownOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center overflow-hidden font-bold text-xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-[11px] text-slate-400 font-medium leading-none">
                      Здраво,
                    </span>
                    <span className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">
                      {user.name ? user.name.split(" ")[0] : "Корисник"}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden xl:block transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-700 py-2 z-[100] animate-in fade-in duration-150 text-slate-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user.name || "Корисник"}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email || ""}</p>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("profile", "orders");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-orange-400 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Package className="w-4 h-4 text-orange-500" />
                          <span>Мои нарачки</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                          {user.orders?.length || 0}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("profile", "info");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-orange-400 flex items-center gap-2.5 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Податоци за профил & Статистика</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("wishlist");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-orange-400 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>Листа на омилени</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-900/30 text-red-400">
                          {wishlist.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("profile", "preferences");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-orange-400 flex items-center gap-2.5 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Поставки & Известувања</span>
                      </button>

                      <div className="pt-1 mt-1 border-t border-slate-800 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-orange-400 hover:bg-slate-800 flex items-center gap-2.5 transition-colors"
                        >
                          <Lock className="w-4 h-4 text-orange-500" />
                          <span>Најава со друга сметка / SuperAdmin</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            logoutUser();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/20 flex items-center gap-2.5 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-slate-400" />
                          <span>Одјави се</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer group border border-slate-800 hover:border-slate-700"
                title="Најави се или регистрирај се"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-orange-500/20 text-slate-300 group-hover:text-orange-400 flex items-center justify-center transition-colors">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className="text-[11px] text-slate-400 font-medium leading-none">
                    Добредојдовте,
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-orange-400 leading-tight transition-colors">
                    Најави се
                  </span>
                </div>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-slate-950 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-950" />
                {cartTotalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-slate-950 text-amber-400 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs border border-amber-400/30">
                    {cartTotalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider leading-none">Кошничка</span>
                <span className="text-xs font-black leading-tight text-slate-950">
                  {formatPrice(cartSubtotal, currency)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Secondary Category Bar (Desktop) */}
      <div className="hidden lg:block bg-[#070C18] border-t border-slate-850 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="px-3 py-1.5 rounded-lg hover:bg-slate-800 hover:text-orange-400 transition-all whitespace-nowrap cursor-pointer"
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
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-950/50 text-red-400 border border-red-800/40 hover:bg-red-900/50 font-bold transition-colors cursor-pointer"
            >
              <Percent className="w-3.5 h-3.5" /> Супер Попусти %
            </button>
            <button
              onClick={() => {
                setCatalogFilters((prev) => ({ ...prev, directOnly: true, category: "all" }));
                navigateTo("catalog");
              }}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-950/40 text-amber-400 border border-amber-800/40 hover:bg-amber-900/40 font-black tracking-wide transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> PazarMax Direkt 24h
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#0B1120] text-slate-200 border-r border-slate-800 shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛍️</span>
                  <span className="text-xl font-black text-white">pazar<span className="text-orange-500">max</span>.mk</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency on mobile */}
              <div className="mt-4 flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Валута:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrency("MKD")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      currency === "MKD" ? "bg-orange-500 text-white" : "text-slate-400"
                    }`}
                  >
                    ден. MKD
                  </button>
                  <button
                    onClick={() => setCurrency("EUR")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      currency === "EUR" ? "bg-orange-500 text-white" : "text-slate-400"
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
                className="w-full mt-3 py-2.5 px-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-orange-500/30"
              >
                <Lock className="w-4 h-4" /> {user ? `Најавен: ${user.name || user.email}` : "Најава / Регистрација"}
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
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-orange-400 flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-slate-500">›</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Support Info */}
            <div className="pt-6 border-t border-slate-800 text-xs text-slate-400">
              <p className="font-semibold text-slate-200">Корисничка поддршка</p>
              <p className="mt-1">📞 02 3100 500 (Пон - Саб 08-20h)</p>
              <p>✉️ podrska@pazarmax.mk</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
