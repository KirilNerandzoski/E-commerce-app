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
  Sun,
  Moon,
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
    theme,
    toggleTheme,
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
    <header className={`sticky top-0 z-40 ${theme === "light" ? "bg-[#FBF9F5]/95 border-b border-[#E5DDD2]" : "bg-[#141210]/95 border-b border-[#2A2520]"} backdrop-blur-xl shadow-md transition-colors`}>
      {/* 1. Top Announcement Bar */}
      <div className={`${theme === "light" ? "bg-[#EDE7DE] text-[#5C544B] border-b border-[#E0D7CC]" : "bg-[#0D0B0A] text-[#A8A095] border-b border-[#1F1C18]"} text-xs py-1.5 px-4 sm:px-8 transition-colors`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="flex items-center gap-1.5 text-[#D49A55] font-semibold truncate">
              <Zap className="w-3.5 h-3.5 fill-[#D49A55] shrink-0" />
              БЕСПЛАТНА достава за нарачки над 1.500 ден.
            </span>
            <span className="hidden md:inline text-[#8C8377]/40">|</span>
            <span className="hidden md:inline">
              Гарантирано враќање во рок од 14 дена
            </span>
            <span className="hidden lg:inline text-[#8C8377]/40">|</span>
            <span className="hidden lg:inline">
              📦 AuraBox 0-24ч преземање
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {supabaseService.isConfigured && (
              <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                theme === "light"
                  ? "bg-emerald-100/80 text-emerald-800 border-emerald-300"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Supabase Поврзан
              </span>
            )}
            {/* Currency Switcher */}
            <div className={`flex items-center rounded-lg p-0.5 border transition-colors ${
              theme === "light"
                ? "bg-[#E5DFD5] border-[#D6CCC0]"
                : "bg-[#1D1A17] border-[#2A2520]"
            }`}>
              <button
                type="button"
                onClick={() => setCurrency("MKD")}
                className={`px-2 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                  currency === "MKD"
                    ? "bg-[#E26D46] !text-white shadow-xs"
                    : theme === "light"
                    ? "text-[#5C544B] hover:text-[#1A1614]"
                    : "text-[#A8A095] hover:text-white"
                }`}
              >
                ден. MKD
              </button>
              <button
                type="button"
                onClick={() => setCurrency("EUR")}
                className={`px-2 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                  currency === "EUR"
                    ? "bg-[#E26D46] !text-white shadow-xs"
                    : theme === "light"
                    ? "text-[#5C544B] hover:text-[#1A1614]"
                    : "text-[#A8A095] hover:text-white"
                }`}
              >
                € EUR
              </button>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                theme === "light"
                  ? "bg-[#E5DFD5] hover:bg-[#DDD6CB] border-[#D6CCC0] text-[#3D352E]"
                  : "bg-[#1D1A17] hover:bg-[#25211D] border-[#2A2520] text-[#FAF6F0]"
              }`}
              title={theme === "light" ? "Префрли на темен режим" : "Префрли на светол режим"}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#B45309]" />
                  <span className="hidden md:inline text-[11px] text-[#3D352E] font-bold">Темен</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#F5BA58]" />
                  <span className="hidden md:inline text-[11px] text-[#A8A095] font-bold">Светол</span>
                </>
              )}
            </button>

            <div className={`hidden sm:flex items-center gap-1 transition-colors cursor-pointer text-[11px] ${
              theme === "light"
                ? "text-[#5C544B] hover:text-[#1A1614]"
                : "text-[#A8A095] hover:text-[#F5EFEB]"
            }`}>
              <Phone className="w-3 h-3 text-[#D49A55]" />
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
            className="lg:hidden p-2 text-[#A8A095] hover:bg-[#25211D] rounded-xl"
            aria-label="Отвори мени"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div
            onClick={() => navigateTo("home")}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#C8522C] via-[#E26D46] to-[#D49A55] flex items-center justify-center shadow-lg shadow-[#E26D46]/25 text-[#141210] font-black">
              <span className="text-base font-black tracking-tight text-[#141210]">AU</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#FAF6F0] uppercase">
                AUR<span className="text-[#E26D46]">A</span>
              </span>
              <span className="text-[10px] font-black bg-[#E26D46]/20 text-[#D49A55] border border-[#D49A55]/40 px-1.5 py-0.5 rounded-md ml-1.5 tracking-widest uppercase">
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
                  ? "bg-[#E26D46] text-white border-[#E26D46]"
                  : "bg-[#1D1A17] hover:bg-[#25211D] text-[#E8E2D8] border-[#2A2520]"
              }`}
            >
              <Menu className="w-4 h-4 text-orange-400" />
              <span>Сите категории</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* MegaMenu Dropdown */}
            {isMegaMenuOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-[780px] bg-[#1D1A17] rounded-2xl shadow-2xl border border-[#2A2520] overflow-hidden z-50 flex animate-in fade-in zoom-in-95 duration-150 text-[#F5EFEB]"
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                {/* Left Categories List */}
                <div className="w-64 bg-[#141210] p-2 border-r border-[#2A2520] overflow-y-auto max-h-[460px]">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveMegaCategory(cat)}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        activeMegaCategory.id === cat.id
                          ? "bg-[#25211D] text-[#E26D46] font-bold"
                          : "text-[#A8A095] hover:bg-[#1D1A17] hover:text-[#FAF6F0]"
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-[#6E665B] font-normal">›</span>
                    </button>
                  ))}
                </div>

                {/* Right Subcategories & Banner */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-base font-bold text-[#FAF6F0]">
                          {activeMegaCategory.name}
                        </h4>
                        <span className="text-xs text-[#A8A095]">
                          Прегледајте над {activeMegaCategory.itemCount} достапни производи
                        </span>
                      </div>
                      <button
                        onClick={() => handleCategorySelect(activeMegaCategory.id)}
                        className="text-xs font-bold text-[#E26D46] hover:text-[#D49A55] cursor-pointer"
                      >
                        Види сѐ &rarr;
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {activeMegaCategory.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleCategorySelect(activeMegaCategory.id, sub.id)}
                          className="text-left p-2.5 rounded-xl hover:bg-[#25211D] group transition-colors cursor-pointer"
                        >
                          <div className="text-xs font-semibold text-[#E8E2D8] group-hover:text-[#E26D46] transition-colors">
                            {sub.name}
                          </div>
                          <span className="text-[11px] text-[#8C8377]">
                            {sub.count} производи
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo inside megamenu */}
                  <div
                    onClick={() => handleCategorySelect(activeMegaCategory.id)}
                    className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#C8522C] to-[#D49A55] text-[#141210] flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div>
                      <div className="text-xs uppercase font-extrabold tracking-wider text-[#141210]/80">
                        Супер попусти до 30%
                      </div>
                      <div className="text-sm font-black text-[#141210]">
                        Најбарани артикли од категоријата {activeMegaCategory.name}
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#141210] text-[#D49A55] text-xs font-black rounded-lg shrink-0">
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
                className={`w-full text-xs sm:text-sm pl-11 pr-24 py-2.5 sm:py-3 rounded-2xl border focus:ring-4 transition-all outline-none ${
                  theme === "light"
                    ? "bg-white text-[#1A1614] placeholder-[#8C8377] border-[#D6CCC0] focus:border-[#E26D46] focus:ring-[#E26D46]/15 shadow-xs"
                    : "bg-[#1D1A17] hover:bg-[#25211D] focus:bg-[#25211D] text-[#FAF6F0] placeholder-[#8C8377] border-[#2A2520] focus:border-[#E26D46] focus:ring-[#E26D46]/20"
                }`}
              />
              <Search className="w-4 h-4 text-[#8C8377] absolute left-4 top-1/2 -translate-y-1/2" />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className={`p-1 rounded-full transition-colors ${
                      theme === "light"
                        ? "hover:bg-[#EAE3D8] text-[#8C8377] hover:text-[#1A1614]"
                        : "hover:bg-[#25211D] text-[#8C8377] hover:text-[#FAF6F0]"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-95 text-[#141210] font-black text-xs rounded-xl shadow-xs transition-all hidden sm:block cursor-pointer"
                >
                  Барај
                </button>
              </div>
            </form>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-[100] animate-in fade-in duration-150 ${
                theme === "light"
                  ? "bg-white text-[#1A1614] border-[#D6CCC0] shadow-[0_20px_40px_-15px_rgba(26,22,20,0.15)]"
                  : "bg-[#1D1A17] text-[#FAF6F0] border-[#2A2520]"
              }`}>
                {searchQuery.trim() === "" ? (
                  // Empty query suggestions
                  <div className="p-4">
                    <div className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
                      theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
                    }`}>
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
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                            theme === "light"
                              ? "bg-[#F4EFEA] text-[#1A1614] hover:bg-[#E26D46]/10 hover:text-[#C84E25] border-[#E0D7CC]"
                              : "bg-[#25211D] text-[#FAF6F0] hover:bg-[#E26D46]/20 hover:text-[#E26D46] border-[#2A2520]"
                          }`}
                        >
                          <Search className="w-3 h-3 text-[#8C8377]" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Search query active
                  <div className={`max-h-[420px] overflow-y-auto divide-y ${
                    theme === "light" ? "divide-[#EAE3D8]" : "divide-[#2A2520]"
                  }`}>
                    {/* Matching categories */}
                    {matchingCategories.length > 0 && (
                      <div className={`p-3 ${theme === "light" ? "bg-[#FAF7F2]" : "bg-[#141210]"}`}>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                          theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
                        }`}>
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
                              className={`text-xs font-semibold px-3 py-1 rounded-lg cursor-pointer border ${
                                theme === "light"
                                  ? "text-[#C84E25] bg-[#EEE8DF] hover:bg-[#E5DDD2] border-[#E0D7CC]"
                                  : "text-[#E26D46] hover:text-[#D49A55] bg-[#25211D] border-[#2A2520]"
                              }`}
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
                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${
                          theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
                        }`}>
                          Производи ({searchResults.length})
                        </div>
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductSelect(product.id)}
                            className={`p-2 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${
                              theme === "light" ? "hover:bg-[#F5EFEB]" : "hover:bg-[#25211D]"
                            }`}
                          >
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-contain bg-[#FAF7F2] p-1 shrink-0 border border-[#E6DFD5]"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-[#D49A55] uppercase">
                                {product.brand}
                              </span>
                              <h5 className={`text-xs font-semibold truncate ${
                                theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"
                              }`}>
                                {product.title}
                              </h5>
                              <div className="text-xs font-bold text-[#E26D46] mt-0.5">
                                {formatPrice(product.price, currency)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-6 text-center text-xs ${
                        theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
                      }`}>
                        Нема пронајдено производи за "<strong>{searchQuery}</strong>".
                      </div>
                    )}

                    {/* View all search results button */}
                    {searchResults.length > 0 && (
                      <div className={`p-2.5 text-center ${
                        theme === "light" ? "bg-[#FAF7F2] border-t border-[#EAE3D8]" : "bg-[#141210] border-t border-[#2A2520]"
                      }`}>
                        <button
                          onClick={handleSearchSubmit}
                          className={`text-xs font-bold cursor-pointer ${
                            theme === "light" ? "text-[#C84E25] hover:text-[#B45309]" : "text-[#E26D46] hover:text-[#D49A55]"
                          }`}
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
              className={`relative p-2.5 rounded-xl transition-colors hidden sm:flex items-center cursor-pointer ${
                theme === "light"
                  ? "text-[#5C544B] hover:text-[#C84E25] hover:bg-[#EDE7DE]"
                  : "text-[#A8A095] hover:text-[#D49A55] hover:bg-[#25211D]"
              }`}
              title="Спореди производи"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D49A55] text-[#141210] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo("wishlist")}
              className={`relative p-2.5 rounded-xl transition-colors hidden sm:flex items-center cursor-pointer ${
                theme === "light"
                  ? "text-[#5C544B] hover:text-[#C84E25] hover:bg-[#EDE7DE]"
                  : "text-[#A8A095] hover:text-[#E26D46] hover:bg-[#25211D]"
              }`}
              title="Омилени"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E26D46] text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
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
                  className={`flex items-center gap-2 p-2 rounded-xl transition-colors text-left cursor-pointer select-none ${
                    theme === "light" ? "hover:bg-[#EDE7DE]" : "hover:bg-[#25211D]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#E26D46]/20 text-[#E26D46] border border-[#E26D46]/40 flex items-center justify-center overflow-hidden font-bold text-xs">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "AP"}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className={`text-[11px] font-medium leading-none ${
                      theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
                    }`}>
                      Здраво,
                    </span>
                    <span className={`text-xs font-bold leading-tight truncate max-w-[100px] ${
                      theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"
                    }`}>
                      {user.name ? user.name.split(" ")[0] : "Корисник"}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 hidden xl:block transition-transform duration-200 ${
                    theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
                  } ${isUserDropdownOpen ? "rotate-180 text-[#E26D46]" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl border py-2 z-[100] animate-in fade-in duration-150 ${
                      theme === "light"
                        ? "bg-white text-[#1A1614] border-[#D6CCC0] shadow-[0_20px_40px_-15px_rgba(26,22,20,0.15)]"
                        : "bg-[#1D1A17] text-[#FAF6F0] border-[#2A2520]"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={`px-4 py-2.5 border-b ${
                      theme === "light" ? "border-[#EAE3D8]" : "border-[#2A2520]"
                    }`}>
                      <p className={`text-xs font-bold ${theme === "light" ? "text-[#1A1614]" : "text-[#FAF6F0]"}`}>
                        {user.name || "Корисник"}
                      </p>
                      <p className={`text-[11px] truncate ${theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"}`}>
                        {user.email || ""}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("profile", "orders");
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                          theme === "light"
                            ? "text-[#1A1614] hover:bg-[#F5EFEB] hover:text-[#C84E25]"
                            : "text-[#FAF6F0] hover:bg-[#25211D] hover:text-[#E26D46]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Package className="w-4 h-4 text-[#E26D46]" />
                          <span>Мои нарачки</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          theme === "light" ? "bg-[#EDE7DE] text-[#5C544B]" : "bg-[#25211D] text-[#A8A095]"
                        }`}>
                          {user.orders?.length || 0}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("profile", "info");
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                          theme === "light"
                            ? "text-[#1A1614] hover:bg-[#F5EFEB] hover:text-[#C84E25]"
                            : "text-[#FAF6F0] hover:bg-[#25211D] hover:text-[#E26D46]"
                        }`}
                      >
                        <User className="w-4 h-4 text-[#8C8377]" />
                        <span>Податоци за профил & Статистика</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("wishlist");
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                          theme === "light"
                            ? "text-[#1A1614] hover:bg-[#F5EFEB] hover:text-[#C84E25]"
                            : "text-[#FAF6F0] hover:bg-[#25211D] hover:text-[#E26D46]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Heart className="w-4 h-4 text-[#E26D46]" />
                          <span>Листа на омилени</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E26D46]/20 text-[#E26D46]">
                          {wishlist.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigateTo("profile", "preferences");
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                          theme === "light"
                            ? "text-[#1A1614] hover:bg-[#F5EFEB] hover:text-[#C84E25]"
                            : "text-[#FAF6F0] hover:bg-[#25211D] hover:text-[#E26D46]"
                        }`}
                      >
                        <Settings className="w-4 h-4 text-[#8C8377]" />
                        <span>Поставки & Известувања</span>
                      </button>

                      <div className={`pt-1 mt-1 border-t space-y-0.5 ${
                        theme === "light" ? "border-[#EAE3D8]" : "border-[#2A2520]"
                      }`}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold text-[#E26D46] flex items-center gap-2.5 transition-colors ${
                            theme === "light" ? "hover:bg-[#F5EFEB]" : "hover:bg-[#25211D]"
                          }`}
                        >
                          <Lock className="w-4 h-4 text-[#E26D46]" />
                          <span>Најава со друга сметка / SuperAdmin</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            logoutUser();
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold hover:text-red-400 flex items-center gap-2.5 transition-colors ${
                            theme === "light" ? "text-[#70675C] hover:bg-red-50" : "text-[#A8A095] hover:bg-red-950/20"
                          }`}
                        >
                          <LogOut className="w-4 h-4 text-[#8C8377]" />
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
                className={`flex items-center gap-2 p-2 rounded-xl transition-colors text-left cursor-pointer group border shadow-xs ${
                  theme === "light"
                    ? "hover:bg-[#EDE7DE] border-[#D6CCC0] hover:border-[#C4B9AA]"
                    : "hover:bg-[#25211D] border-[#2A2520] hover:border-[#38322B]"
                }`}
                title="Најави се или регистрирај се"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  theme === "light"
                    ? "bg-[#E5DFD5] group-hover:bg-[#E26D46]/15 text-[#5C544B] group-hover:text-[#C84E25]"
                    : "bg-[#25211D] group-hover:bg-[#E26D46]/20 text-[#A8A095] group-hover:text-[#E26D46]"
                }`}>
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className={`text-[11px] font-medium leading-none ${
                    theme === "light" ? "text-[#70675C]" : "text-[#A8A095]"
                  }`}>
                    Добредојдовте,
                  </span>
                  <span className={`text-xs font-bold leading-tight transition-colors ${
                    theme === "light"
                      ? "text-[#1A1614] group-hover:text-[#C84E25]"
                      : "text-[#FAF6F0] group-hover:text-[#E26D46]"
                  }`}>
                    Најави се
                  </span>
                </div>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-[#E26D46] to-[#D49A55] hover:brightness-110 active:scale-95 text-[#141210] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black shadow-lg shadow-[#E26D46]/20 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-[#141210]" />
                {cartTotalItemsCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#141210] text-[#D49A55] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs border border-[#D49A55]/40">
                    {cartTotalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] font-bold text-[#141210]/80 uppercase tracking-wider leading-none">Кошничка</span>
                <span className="text-xs font-black leading-tight text-[#141210]">
                  {formatPrice(cartSubtotal, currency)}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Secondary Category Bar (Desktop) */}
      <div className={`hidden lg:block ${theme === "light" ? "bg-[#F4EFEA] border-t border-[#E5DDD2] text-[#5C544B]" : "bg-[#100E0D] border-t border-[#231F1B] text-[#A8A095]"} px-4 sm:px-6 transition-colors`}>
        <div className="max-w-7xl mx-auto py-1.5 flex items-center justify-center">
          <div className="grid grid-cols-9 gap-1.5 w-full max-w-6xl items-center justify-center">
            {[
              { id: "electronics", name: "Електроника & Телефони", shortName: "Електроника" },
              { id: "computers", name: "Компјутери & Гејминг", shortName: "Компјутери" },
              { id: "appliances", name: "Бела техника & Апарати", shortName: "Бела техника" },
              { id: "furniture", name: "Мебел & Домување", shortName: "Домување" },
              { id: "fashion", name: "Облека & Мода", shortName: "Мода" },
              { id: "beauty", name: "Убавина & Лична нега", shortName: "Убавина" },
              { id: "sports", name: "Спорт & Опрема", shortName: "Спорт" },
              { id: "groceries", name: "Маркет & Кафе", shortName: "Маркет" },
              {
                id: "deals",
                name: "Супер Попусти %",
                shortName: "% Попусти",
                isSpecial: true,
                onClick: () => {
                  setCatalogFilters((prev) => ({ ...prev, discountOnly: true, category: "all" }));
                  navigateTo("catalog");
                },
              },
            ].map((item) => {
              if (item.isSpecial) {
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl bg-[#E26D46]/15 text-[#E26D46] border border-[#E26D46]/30 hover:bg-[#E26D46]/25 font-black text-xs transition-all cursor-pointer text-center truncate"
                    title={item.name}
                  >
                    <Percent className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xl:inline truncate">{item.name}</span>
                    <span className="xl:hidden truncate">{item.shortName}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleCategorySelect(item.id)}
                  className={`w-full flex items-center justify-center py-1.5 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center truncate ${
                    theme === "light"
                      ? "text-[#5C544B] hover:bg-[#EAE3D8] hover:text-[#C84E25]"
                      : "text-[#A8A095] hover:bg-[#25211D] hover:text-[#FAF6F0]"
                  }`}
                  title={item.name}
                >
                  <span className="hidden xl:inline truncate">{item.name}</span>
                  <span className="xl:hidden truncate">{item.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#171412] text-[#FAF6F0] border-r border-[#2A2520] shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#2A2520]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C8522C] to-[#D49A55] flex items-center justify-center font-black text-xs text-[#141210]">
                    AU
                  </div>
                  <span className="text-xl font-black text-[#FAF6F0] tracking-tight uppercase">AUR<span className="text-[#E26D46]">A</span>.mk</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-[#25211D] text-[#A8A095] hover:text-[#FAF6F0]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Currency on mobile */}
              <div className="mt-4 flex items-center justify-between p-2 rounded-xl bg-[#1D1A17] border border-[#2A2520]">
                <span className="text-xs font-semibold text-[#A8A095]">Валута:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrency("MKD")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      currency === "MKD" ? "bg-[#E26D46] text-[#141210]" : "text-[#A8A095] hover:text-[#FAF6F0]"
                    }`}
                  >
                    ден. MKD
                  </button>
                  <button
                    onClick={() => setCurrency("EUR")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      currency === "EUR" ? "bg-[#E26D46] text-[#141210]" : "text-[#A8A095] hover:text-[#FAF6F0]"
                    }`}
                  >
                    € EUR
                  </button>
                </div>
              </div>

              {/* Theme on mobile */}
              <div className={`mt-2 flex items-center justify-between p-2 rounded-xl border transition-colors ${
                theme === "light"
                  ? "bg-[#E5DFD5] border-[#D6CCC0]"
                  : "bg-[#1D1A17] border-[#2A2520]"
              }`}>
                <span className={`text-xs font-semibold ${theme === "light" ? "text-[#5C544B]" : "text-[#A8A095]"}`}>Тема:</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    theme === "light"
                      ? "bg-[#FAF8F5] border-[#D6CCC0] text-[#3D352E]"
                      : "bg-[#25211D] border-[#2A2520] text-[#FAF6F0]"
                  }`}
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>Темен режим</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#F5BA58]" />
                      <span>Светол режим</span>
                    </>
                  )}
                </button>
              </div>

              {/* Supabase Auth trigger on mobile */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full mt-3 py-2.5 px-3 bg-[#E26D46]/10 hover:bg-[#E26D46]/20 text-[#E26D46] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-[#E26D46]/30"
              >
                <Lock className="w-4 h-4" /> {user ? `Најавен: ${user.name || user.email}` : "Најава / Регистрација"}
              </button>

              {/* All Categories list */}
              <div className="mt-6">
                <div className="text-[11px] font-bold text-[#A8A095] uppercase tracking-wider mb-2">
                  Категории
                </div>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-[#25211D] text-xs font-bold text-[#FAF6F0] hover:text-[#E26D46] flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[#8C8377]">›</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Support Info */}
            <div className="pt-6 border-t border-[#2A2520] text-xs text-[#A8A095]">
              <p className="font-semibold text-[#FAF6F0]">Корисничка поддршка</p>
              <p className="mt-1">📞 02 3100 500 (Пон - Саб 08-20h)</p>
              <p>✉️ podrska@aura.mk</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
