import React from "react";
import { useApp } from "../../context/AppContext";
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";

export const MobileBottomNav = () => {
  const {
    currentView,
    navigateTo,
    cartTotalItemsCount,
    wishlist,
    setIsCartDrawerOpen,
    theme,
  } = useApp();

  // Hide on product detail view so the sticky Purchase Bar is unobstructed
  if (currentView === "product") return null;

  return (
    <nav
      aria-label="Мобилна навигација"
      className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t py-1.5 px-2 flex items-center justify-around shadow-2xl lg:hidden transition-colors pb-[max(0.6rem,env(safe-area-inset-bottom))] ${
        theme === "light"
          ? "bg-white/95 border-[#E5DDD2] text-[#5C544B]"
          : "bg-[#141210]/95 border-[#2A2520] text-[#A8A095]"
      }`}
    >
      {/* Home */}
      <button
        onClick={() => navigateTo("home")}
        className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          currentView === "home"
            ? theme === "light" ? "text-[#C84E25] font-bold" : "text-[#E26D46] font-bold"
            : theme === "light" ? "text-[#5C544B] hover:text-[#1A1614]" : "text-[#A8A095] hover:text-[#FAF6F0]"
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Почетна</span>
      </button>

      {/* Catalog / Categories */}
      <button
        onClick={() => navigateTo("catalog")}
        className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          currentView === "catalog"
            ? theme === "light" ? "text-[#C84E25] font-bold" : "text-[#E26D46] font-bold"
            : theme === "light" ? "text-[#5C544B] hover:text-[#1A1614]" : "text-[#A8A095] hover:text-[#FAF6F0]"
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>Каталог</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => navigateTo("wishlist")}
        className={`relative flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          currentView === "wishlist"
            ? theme === "light" ? "text-[#C84E25] font-bold" : "text-[#E26D46] font-bold"
            : theme === "light" ? "text-[#5C544B] hover:text-[#1A1614]" : "text-[#A8A095] hover:text-[#FAF6F0]"
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#E26D46] text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span>Омилени</span>
      </button>

      {/* Cart */}
      <button
        onClick={() => setIsCartDrawerOpen(true)}
        className={`relative flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          currentView === "cart"
            ? theme === "light" ? "text-[#C84E25] font-bold" : "text-[#E26D46] font-bold"
            : theme === "light" ? "text-[#5C544B] hover:text-[#1A1614]" : "text-[#A8A095] hover:text-[#FAF6F0]"
        }`}
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartTotalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#E26D46] to-[#D49A55] text-[#141210] font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartTotalItemsCount}
            </span>
          )}
        </div>
        <span>Кошничка</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => navigateTo("profile")}
        className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors cursor-pointer ${
          currentView === "profile"
            ? theme === "light" ? "text-[#C84E25] font-bold" : "text-[#E26D46] font-bold"
            : theme === "light" ? "text-[#5C544B] hover:text-[#1A1614]" : "text-[#A8A095] hover:text-[#FAF6F0]"
        }`}
      >
        <User className="w-5 h-5" />
        <span>Профил</span>
      </button>
    </nav>
  );
};
